"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  user,
  account,
  verification,
  clientBilling,
  pendingInvoice,
  charge,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { renderBrandedEmail } from "@/lib/branded-email";
import { inviteEmail, invoiceEmail, billingEmail } from "@/lib/email-content";
import { stripe } from "@/lib/stripe";
import { periodBounds, syncSubscriptionToDb } from "@/lib/billing";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

// Invited clients get a week to set their password before the link expires.
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type InviteState = { ok: boolean; error?: string; invited?: string };

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.role === "admin";
}

export async function inviteClient(
  _prev: InviteState,
  formData: FormData,
): Promise<InviteState> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "Not authorized." };
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = ((formData.get("email") as string)?.trim() ?? "").toLowerCase();

  if (!name) return { ok: false, error: "Please add the client's name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  let userId: string;
  if (existing) {
    const credential = await db.query.account.findFirst({
      where: and(
        eq(account.userId, existing.id),
        eq(account.providerId, "credential"),
      ),
    });
    // An existing user who already set a password can't be re-invited.
    if (credential) {
      return { ok: false, error: "That email already has an account." };
    }
    userId = existing.id;
  } else {
    userId = randomUUID();
    await db.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      role: "client",
    });
  }

  // A verification row keyed this way is what Better Auth's reset-password
  // endpoint consumes, and it creates the credential account on first use.
  const token = randomBytes(24).toString("base64url");
  await db.insert(verification).values({
    id: randomUUID(),
    identifier: `reset-password:${token}`,
    value: userId,
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });

  const url = `${APP_URL}/set-password?token=${token}`;
  try {
    const invite = inviteEmail(name, url);
    const { html, text } = await renderBrandedEmail(invite.props);
    await sendEmail({ to: email, subject: invite.subject, html, text });
  } catch {
    return {
      ok: false,
      error: "Couldn't send the invite email. Check the address and try again.",
    };
  }

  revalidatePath("/admin");
  return { ok: true, invited: email };
}

export type BillingState = { ok: boolean; error?: string; sent?: boolean };

function dollarsToCents(value: string): number | null {
  const n = Number(value.replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

// Starts a recurring care plan, optionally with an upfront charge billed on the
// first invoice. Completing the Checkout authorizes recurring billing.
export async function startPlan(
  _prev: BillingState,
  formData: FormData,
): Promise<BillingState> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "Not authorized." };
  }

  const clientId = (formData.get("clientId") as string)?.trim() ?? "";
  const planName =
    (formData.get("planName") as string)?.trim() || "Monthly care plan";
  const buildDetails = (formData.get("buildDetails") as string)?.trim() ?? "";
  const monthlyRaw = (formData.get("monthlyAmount") as string)?.trim() ?? "";
  const buildRaw = (formData.get("buildAmount") as string)?.trim() ?? "";
  const monthlyCents = monthlyRaw ? dollarsToCents(monthlyRaw) : null;
  const buildCents = buildRaw ? dollarsToCents(buildRaw) : null;

  if (monthlyCents === null) {
    return { ok: false, error: "Enter a monthly amount for the plan." };
  }
  if (monthlyCents < 50) {
    return { ok: false, error: "The monthly amount must be at least $0.50." };
  }
  if (buildRaw && buildCents === null) {
    return { ok: false, error: "The upfront charge isn't a valid number." };
  }
  if (buildCents !== null && buildCents < 50) {
    return { ok: false, error: "The upfront charge must be at least $0.50." };
  }

  const client = await db.query.user.findFirst({
    where: eq(user.id, clientId),
  });
  if (!client || client.role !== "client") {
    return { ok: false, error: "That client no longer exists." };
  }

  const existing = await db.query.clientBilling.findFirst({
    where: eq(clientBilling.userId, clientId),
  });
  if (existing?.status === "active" || existing?.status === "canceling") {
    return {
      ok: false,
      error: "This client already has a plan. Cancel it first to start a new one.",
    };
  }

  const token = randomBytes(24).toString("base64url");
  try {
    // Reuse the client's Stripe customer across attempts so we don't orphan one.
    let customerId = existing?.stripeCustomerId ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: client.name,
        metadata: { userId: clientId },
      });
      customerId = customer.id;
    }

    const payUrl = `/pay/${token}`;

    // Record the outstanding plan invoice; the branded /pay/[token] page mints
    // the embedded Checkout session when the client opens it.
    await db
      .insert(clientBilling)
      .values({
        id: existing?.id ?? randomUUID(),
        userId: clientId,
        stripeCustomerId: customerId,
        status: "pending",
        token,
        checkoutUrl: payUrl,
        planName,
        buildAmount: buildCents,
        buildDetails: buildDetails || null,
        monthlyAmount: monthlyCents,
      })
      .onConflictDoUpdate({
        target: clientBilling.userId,
        set: {
          stripeCustomerId: customerId,
          status: "pending",
          token,
          checkoutUrl: payUrl,
          planName,
          buildAmount: buildCents,
          buildDetails: buildDetails || null,
          monthlyAmount: monthlyCents,
        },
      });

    const email = billingEmail(client.name, `${APP_URL}${payUrl}`);
    const { html, text } = await renderBrandedEmail(email.props);
    await sendEmail({ to: client.email, subject: email.subject, html, text });
  } catch {
    return {
      ok: false,
      error: "Couldn't start the plan. Check the amounts and try again.",
    };
  }

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/dashboard");
  return { ok: true, sent: true };
}

export type ChargeState = { ok: boolean; error?: string; sent?: boolean };

// Sends a one-time charge to an existing client, independent of any plan. It's a
// plain payment tracked as a `charge` row that the webhook flips to paid.
export async function sendCharge(
  _prev: ChargeState,
  formData: FormData,
): Promise<ChargeState> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "Not authorized." };
  }

  const clientId = (formData.get("clientId") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const amountRaw = (formData.get("amount") as string)?.trim() ?? "";
  const amountCents = amountRaw ? dollarsToCents(amountRaw) : null;

  if (!amountCents || amountCents < 50) {
    return { ok: false, error: "Enter an amount of at least $0.50." };
  }

  const client = await db.query.user.findFirst({ where: eq(user.id, clientId) });
  if (!client || client.role !== "client") {
    return { ok: false, error: "That client no longer exists." };
  }

  const existing = await db.query.clientBilling.findFirst({
    where: eq(clientBilling.userId, clientId),
  });

  try {
    let customerId = existing?.stripeCustomerId ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: client.name,
        metadata: { userId: clientId },
      });
      customerId = customer.id;
    }

    const chargeId = randomUUID();
    const token = randomBytes(24).toString("base64url");
    const payUrl = `/pay/${token}`;

    // The branded /pay/[token] page mints the embedded Checkout when opened.
    await db.insert(charge).values({
      id: chargeId,
      userId: clientId,
      amount: amountCents,
      description: description || null,
      status: "pending",
      token,
      checkoutUrl: payUrl,
    });

    // Remember the Stripe customer so future charges and plans reuse it.
    if (!existing) {
      await db.insert(clientBilling).values({
        id: randomUUID(),
        userId: clientId,
        stripeCustomerId: customerId,
        status: "none",
      });
    } else if (!existing.stripeCustomerId) {
      await db
        .update(clientBilling)
        .set({ stripeCustomerId: customerId })
        .where(eq(clientBilling.userId, clientId));
    }

    const email = billingEmail(client.name, `${APP_URL}${payUrl}`);
    const { html, text } = await renderBrandedEmail(email.props);
    await sendEmail({ to: client.email, subject: email.subject, html, text });
  } catch {
    return { ok: false, error: "Couldn't send the charge. Try again." };
  }

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/dashboard");
  return { ok: true, sent: true };
}

export type CancelState = { ok: boolean; error?: string };

// Cancels or resumes a client's plan. "period_end" lets it run out the month
// already paid for; "immediate" ends it now and refunds the unused part of the
// current month (the one-time build fee is delivered work and isn't refunded);
// "resume" clears a scheduled cancellation.
export async function cancelPlan(
  _prev: CancelState,
  formData: FormData,
): Promise<CancelState> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "Not authorized." };
  }

  const clientId = (formData.get("clientId") as string)?.trim() ?? "";
  const mode = (formData.get("mode") as string) ?? "";

  const billing = await db.query.clientBilling.findFirst({
    where: eq(clientBilling.userId, clientId),
  });
  if (!billing?.stripeSubscriptionId) {
    return { ok: false, error: "This client has no active subscription." };
  }
  const subId = billing.stripeSubscriptionId;

  // Dev-tool states use a placeholder subscription id; there's nothing real at
  // Stripe to change, so just move the local status to match.
  if (subId === "sub_dev") {
    const devStatus =
      mode === "resume"
        ? "active"
        : mode === "period_end"
          ? "canceling"
          : mode === "immediate"
            ? "canceled"
            : null;
    if (!devStatus) return { ok: false, error: "Unknown action." };
    await db
      .update(clientBilling)
      .set({ status: devStatus })
      .where(eq(clientBilling.userId, clientId));
    revalidatePath(`/clients/${clientId}`);
    revalidatePath("/dashboard");
    return { ok: true };
  }

  try {
    if (mode === "resume") {
      const sub = await stripe.subscriptions.update(subId, {
        cancel_at_period_end: false,
      });
      await syncSubscriptionToDb(sub);
    } else if (mode === "period_end") {
      const sub = await stripe.subscriptions.update(subId, {
        cancel_at_period_end: true,
      });
      await syncSubscriptionToDb(sub);
    } else if (mode === "immediate") {
      const current = await stripe.subscriptions.retrieve(subId);
      const { start, end } = periodBounds(current);
      const now = Math.floor(Date.now() / 1000);

      let refundAmount = 0;
      if (billing.monthlyAmount && start && end && end > now && end > start) {
        refundAmount = Math.round(
          (billing.monthlyAmount * (end - now)) / (end - start),
        );
      }

      const canceled = await stripe.subscriptions.cancel(subId);

      if (refundAmount > 0 && billing.stripeCustomerId) {
        const charges = await stripe.charges.list({
          customer: billing.stripeCustomerId,
          limit: 3,
        });
        const charge = charges.data.find((c) => c.paid && !c.refunded);
        if (charge) {
          await stripe.refunds.create({
            charge: charge.id,
            amount: Math.min(refundAmount, charge.amount - charge.amount_refunded),
          });
        }
      }
      await syncSubscriptionToDb(canceled);
    } else {
      return { ok: false, error: "Unknown action." };
    }
  } catch {
    return { ok: false, error: "Couldn't update the plan with Stripe." };
  }

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

// Dev-only: force a client's billing row into any state so the UI can be
// previewed without running a real Stripe checkout. Never runs in production,
// and it writes placeholder Stripe ids, so real cancel actions won't work on it.
export async function devSetBillingState(
  _prev: { ok: boolean; error?: string },
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  if (process.env.NODE_ENV === "production") {
    return { ok: false, error: "Disabled in production." };
  }
  if (!(await requireAdmin())) {
    return { ok: false, error: "Not authorized." };
  }

  const clientId = (formData.get("clientId") as string)?.trim() ?? "";
  const state = (formData.get("state") as string) ?? "";
  const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  if (state === "clear") {
    await db.delete(clientBilling).where(eq(clientBilling.userId, clientId));
  } else {
    const byState: Record<string, Record<string, unknown>> = {
      active: {
        status: "active",
        stripeSubscriptionId: "sub_dev",
        currentPeriodEnd: in30,
        checkoutUrl: null,
      },
      canceling: {
        status: "canceling",
        stripeSubscriptionId: "sub_dev",
        currentPeriodEnd: in30,
        checkoutUrl: null,
      },
      canceled: {
        status: "canceled",
        stripeSubscriptionId: "sub_dev",
        currentPeriodEnd: new Date(),
        checkoutUrl: null,
      },
      pending: {
        status: "pending",
        checkoutUrl: "https://checkout.stripe.com/dev",
        currentPeriodEnd: null,
      },
    };
    const fields = byState[state];
    if (!fields) return { ok: false, error: "Unknown state." };

    const common = {
      stripeCustomerId: "cus_dev",
      planName: "Monthly care plan",
      buildAmount: 250000,
      monthlyAmount: 9900,
    };
    await db
      .insert(clientBilling)
      .values({ id: randomUUID(), userId: clientId, ...common, ...fields })
      .onConflictDoUpdate({
        target: clientBilling.userId,
        set: { ...common, ...fields },
      });
  }

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export type InvoiceState = { ok: boolean; error?: string; sent?: string };

// Invoices someone who isn't a client yet. Creates a Stripe customer and a
// pending-invoice record, then emails a link to a branded invoice page where
// they pay; their account is created after payment.
export async function createPendingInvoice(
  _prev: InvoiceState,
  formData: FormData,
): Promise<InvoiceState> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "Not authorized." };
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = ((formData.get("email") as string)?.trim() ?? "").toLowerCase();
  const buildDetails = (formData.get("buildDetails") as string)?.trim() ?? "";
  const monthlyRaw = (formData.get("monthlyAmount") as string)?.trim() ?? "";
  const monthlyCents = monthlyRaw ? dollarsToCents(monthlyRaw) : null;
  const buildRaw = (formData.get("buildAmount") as string)?.trim() ?? "";
  const buildCents = buildRaw ? dollarsToCents(buildRaw) : null;
  // No monthly plan means a one-time invoice; there's no plan name to store.
  const planName = monthlyCents
    ? (formData.get("planName") as string)?.trim() || "Monthly care plan"
    : null;

  if (!name) return { ok: false, error: "Please add a name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (monthlyRaw && (monthlyCents === null || monthlyCents < 50)) {
    return { ok: false, error: "The monthly amount must be at least $0.50." };
  }
  if (buildRaw && (buildCents === null || buildCents < 50)) {
    return { ok: false, error: "The one-time amount must be at least $0.50." };
  }
  if (!monthlyCents && !buildCents) {
    return {
      ok: false,
      error: "Enter a monthly amount, a one-time amount, or both.",
    };
  }

  const existingClient = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  if (existingClient) {
    return {
      ok: false,
      error: "That email already has an account. Bill them from their client page.",
    };
  }

  const token = randomBytes(24).toString("base64url");
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { pendingInvoiceToken: token },
    });
    await db.insert(pendingInvoice).values({
      id: randomUUID(),
      token,
      name,
      email,
      stripeCustomerId: customer.id,
      planName,
      buildAmount: buildCents || null,
      monthlyAmount: monthlyCents,
      buildDetails: buildDetails || null,
    });
    const invoice = invoiceEmail(name, `${APP_URL}/invoice/${token}`);
    const { html, text } = await renderBrandedEmail(invoice.props);
    await sendEmail({ to: email, subject: invoice.subject, html, text });
  } catch {
    return {
      ok: false,
      error: "Couldn't create the invoice. Check the details and try again.",
    };
  }

  revalidatePath("/admin");
  return { ok: true, sent: email };
}
