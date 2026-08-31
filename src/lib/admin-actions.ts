"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, account, verification, clientBilling } from "@/db/schema";
import type Stripe from "stripe";
import { sendEmail } from "@/lib/email";
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

function inviteEmail(name: string, url: string) {
  return `
    <div style="font-family:system-ui,sans-serif;color:#241d16;max-width:520px">
      <p>Hi ${name},</p>
      <p>You've been set up with a client account at SearchbarStudio. Set your
      password to get into your dashboard.</p>
      <p style="margin:24px 0">
        <a href="${url}" style="background:#c1592f;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;display:inline-block">
          Set your password
        </a>
      </p>
      <p style="color:#6f6357;font-size:14px">This link is good for 7 days. If it
      expires, ask me to send a new one.</p>
    </div>
  `;
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
    await sendEmail({
      to: email,
      subject: "You're invited to SearchbarStudio",
      html: inviteEmail(name, url),
    });
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

function billingEmail(name: string, url: string) {
  return `
    <div style="font-family:system-ui,sans-serif;color:#241d16;max-width:520px">
      <p>Hi ${name},</p>
      <p>Your invoice is ready. Review the details and pay securely through
      Stripe. Setting this up authorizes the monthly care plan, and you can
      cancel or update your card any time from your dashboard.</p>
      <p style="margin:24px 0">
        <a href="${url}" style="background:#c1592f;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;display:inline-block">
          Review and pay
        </a>
      </p>
      <p style="color:#6f6357;font-size:14px">You can also find this in your
      dashboard.</p>
    </div>
  `;
}

// Admin sends a client one Checkout link covering the one-time build fee (billed
// on the first invoice only) plus the recurring monthly plan. Completing it
// authorizes recurring billing and records terms consent through Stripe.
export async function setupBilling(
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
  const monthlyCents = dollarsToCents(
    (formData.get("monthlyAmount") as string) ?? "",
  );
  const buildRaw = (formData.get("buildAmount") as string)?.trim() ?? "";
  const buildCents = buildRaw ? dollarsToCents(buildRaw) : 0;

  if (!monthlyCents || monthlyCents < 50) {
    return { ok: false, error: "Enter a monthly amount of at least $0.50." };
  }
  if (buildCents === null) {
    return { ok: false, error: "The build amount isn't a valid number." };
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
  if (existing?.status === "active") {
    return { ok: false, error: "This client already has active billing." };
  }

  // Reuse the client's Stripe customer across attempts so we don't orphan one.
  let customerId = existing?.stripeCustomerId ?? null;
  try {
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: client.name,
        metadata: { userId: clientId },
      });
      customerId = customer.id;
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          unit_amount: monthlyCents,
          recurring: { interval: "month" },
          product_data: { name: planName },
        },
        quantity: 1,
      },
    ];
    if (buildCents && buildCents > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: buildCents,
          product_data: {
            name: "Website build",
            ...(buildDetails ? { description: buildDetails } : {}),
          },
        },
        quantity: 1,
      });
    }

    const baseParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      customer: customerId,
      line_items: lineItems,
      subscription_data: { metadata: { userId: clientId } },
      metadata: { userId: clientId },
      success_url: `${APP_URL}/dashboard?billing=success`,
      cancel_url: `${APP_URL}/dashboard?billing=cancelled`,
    };

    // Ask Stripe to collect terms-of-service consent. Stripe rejects this until
    // a Terms of Service URL is set in the Dashboard, so fall back without it;
    // the consent checkbox turns on automatically once that URL is configured.
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        ...baseParams,
        consent_collection: { terms_of_service: "required" },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message.toLowerCase() : "";
      if (!message.includes("terms of service")) throw e;
      session = await stripe.checkout.sessions.create(baseParams);
    }

    await db
      .insert(clientBilling)
      .values({
        id: existing?.id ?? randomUUID(),
        userId: clientId,
        stripeCustomerId: customerId,
        status: "pending",
        checkoutUrl: session.url,
        planName,
        buildAmount: buildCents || null,
        monthlyAmount: monthlyCents,
      })
      .onConflictDoUpdate({
        target: clientBilling.userId,
        set: {
          stripeCustomerId: customerId,
          status: "pending",
          checkoutUrl: session.url,
          planName,
          buildAmount: buildCents || null,
          monthlyAmount: monthlyCents,
        },
      });

    await sendEmail({
      to: client.email,
      subject: "Your SearchbarStudio invoice",
      html: billingEmail(client.name, session.url!),
    });
  } catch {
    return {
      ok: false,
      error: "Couldn't set up billing with Stripe. Check the amounts and try again.",
    };
  }

  revalidatePath(`/admin/clients/${clientId}`);
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
    revalidatePath(`/admin/clients/${clientId}`);
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

  revalidatePath(`/admin/clients/${clientId}`);
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

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
