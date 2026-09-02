import "server-only";
import type Stripe from "stripe";
import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import {
  pendingInvoice,
  user,
  account,
  clientBilling,
  charge,
  verification,
} from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { periodBounds } from "@/lib/billing";
import { sendEmail } from "@/lib/email";
import { renderBrandedEmail } from "@/lib/branded-email";
import { paymentReceivedEmail } from "@/lib/email-content";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

const SET_PASSWORD_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function lineItemsFor(pi: {
  planName: string | null;
  monthlyAmount: number | null;
  buildAmount: number | null;
  buildDetails: string | null;
}): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        unit_amount: pi.monthlyAmount ?? 0,
        recurring: { interval: "month" },
        product_data: { name: pi.planName ?? "Monthly care plan" },
      },
      quantity: 1,
    },
  ];
  if (pi.buildAmount && pi.buildAmount > 0) {
    items.push({
      price_data: {
        currency: "usd",
        unit_amount: pi.buildAmount,
        product_data: {
          name: "One-time charge",
          ...(pi.buildDetails ? { description: pi.buildDetails } : {}),
        },
      },
      quantity: 1,
    });
  }
  return items;
}

// Creates an embedded Checkout session for an outstanding invoice and returns
// its client secret. Called when the invited person opens their invoice page.
export async function createInvoiceCheckoutSecret(
  token: string,
): Promise<string | null> {
  const pi = await db.query.pendingInvoice.findFirst({
    where: eq(pendingInvoice.token, token),
  });
  if (!pi || pi.status !== "pending" || !pi.stripeCustomerId) return null;

  // Current Stripe API renamed the embedded UI mode; the SDK types still say
  // "embedded", so cast to the value the API now expects.
  const uiMode = "embedded_page" as Stripe.Checkout.SessionCreateParams["ui_mode"];
  const returnUrl = `${APP_URL}/invoice/${token}/complete?session_id={CHECKOUT_SESSION_ID}`;
  const isPlan = pi.monthlyAmount != null && pi.monthlyAmount > 0;

  // A plan invoice bills as a subscription (recurring + optional upfront); a
  // one-time invoice is a single payment that still provisions the account.
  const base: Stripe.Checkout.SessionCreateParams = isPlan
    ? {
        ui_mode: uiMode,
        mode: "subscription",
        customer: pi.stripeCustomerId,
        line_items: lineItemsFor(pi),
        subscription_data: { metadata: { pendingInvoiceToken: token } },
        metadata: { pendingInvoiceToken: token },
        return_url: returnUrl,
      }
    : {
        ui_mode: uiMode,
        mode: "payment",
        customer: pi.stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: pi.buildAmount ?? 0,
              product_data: { name: pi.buildDetails || "One-time charge" },
            },
            quantity: 1,
          },
        ],
        metadata: { pendingInvoiceToken: token },
        return_url: returnUrl,
      };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      ...base,
      consent_collection: { terms_of_service: "required" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message.toLowerCase() : "";
    if (!message.includes("terms of service")) throw e;
    session = await stripe.checkout.sessions.create(base);
  }
  return session.client_secret ?? null;
}

export type ProvisionResult = { userId: string; hasCredential: boolean };

// Turns a paid invoice into a real client: creates the account if needed, links
// the subscription, and marks the invoice paid. Idempotent, so the webhook and
// the return page can both call it without double-provisioning.
export async function provisionInvoiceAccount(
  token: string,
  session: Stripe.Checkout.Session,
): Promise<ProvisionResult | null> {
  const pi = await db.query.pendingInvoice.findFirst({
    where: eq(pendingInvoice.token, token),
  });
  if (!pi) return null;

  const existing = await db.query.user.findFirst({
    where: eq(user.email, pi.email),
  });

  let userId: string;
  let hasCredential = false;
  if (existing) {
    userId = existing.id;
    const cred = await db.query.account.findFirst({
      where: and(
        eq(account.userId, existing.id),
        eq(account.providerId, "credential"),
      ),
    });
    hasCredential = !!cred;
  } else {
    userId = randomUUID();
    await db.insert(user).values({
      id: userId,
      name: pi.name,
      email: pi.email,
      emailVerified: true,
      role: "client",
    });
  }

  const subId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (subId) {
    // Stamp the subscription with the user so later webhook events sync it.
    await stripe.subscriptions.update(subId, { metadata: { userId } });
    const sub = await stripe.subscriptions.retrieve(subId);
    const end = periodBounds(sub).end;
    const customerId =
      pi.stripeCustomerId ??
      (typeof session.customer === "string" ? session.customer : null);

    await db
      .insert(clientBilling)
      .values({
        id: randomUUID(),
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subId,
        status: sub.status,
        planName: pi.planName,
        buildAmount: pi.buildAmount,
        monthlyAmount: pi.monthlyAmount,
        currentPeriodEnd: end ? new Date(end * 1000) : null,
      })
      .onConflictDoUpdate({
        target: clientBilling.userId,
        set: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subId,
          status: sub.status,
          planName: pi.planName,
          buildAmount: pi.buildAmount,
          monthlyAmount: pi.monthlyAmount,
          currentPeriodEnd: end ? new Date(end * 1000) : null,
        },
      });
  } else {
    // One-time invoice (no plan): remember the Stripe customer for future
    // billing, and record the payment as a paid charge in their history. Keyed
    // by the invoice id so the webhook + return page stay idempotent.
    const customerId =
      pi.stripeCustomerId ??
      (typeof session.customer === "string" ? session.customer : null);
    await db
      .insert(clientBilling)
      .values({ id: randomUUID(), userId, stripeCustomerId: customerId, status: "none" })
      .onConflictDoUpdate({
        target: clientBilling.userId,
        set: { stripeCustomerId: customerId },
      });
    if (pi.buildAmount && pi.buildAmount > 0) {
      await db
        .insert(charge)
        .values({
          id: `inv_${pi.id}`,
          userId,
          amount: pi.buildAmount,
          description: pi.buildDetails,
          status: "paid",
        })
        .onConflictDoNothing();
    }
  }

  await db
    .update(pendingInvoice)
    .set({ status: "paid" })
    .where(eq(pendingInvoice.id, pi.id));

  return { userId, hasCredential };
}

// Issues a one-time set-password token (the same shape Better Auth's reset
// endpoint consumes) so a freshly provisioned client can choose a password.
export async function mintSetPasswordToken(userId: string): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await db.insert(verification).values({
    id: randomUUID(),
    identifier: `reset-password:${token}`,
    value: userId,
    expiresAt: new Date(Date.now() + SET_PASSWORD_TTL_MS),
  });
  return token;
}

export async function sendPaymentReceivedEmail(
  name: string,
  email: string,
  token: string,
) {
  const content = paymentReceivedEmail(name, `${APP_URL}/welcome/${token}`);
  const { html, text } = await renderBrandedEmail(content.props);
  await sendEmail({ to: email, subject: content.subject, html, text });
}

export type WelcomeContext = {
  name: string;
  email: string;
  hasCredential: boolean;
  planName: string | null;
  monthlyAmount: number | null;
  buildAmount: number | null;
  buildDetails: string | null;
};

// Resolves the receipt + identity for the post-payment welcome page from a
// set-password token. Does not consume the token; the form does that on submit.
export async function resolveWelcomeContext(
  token: string,
): Promise<WelcomeContext | null> {
  if (!token) return null;
  const row = await db.query.verification.findFirst({
    where: and(
      eq(verification.identifier, `reset-password:${token}`),
      gt(verification.expiresAt, new Date()),
    ),
  });
  if (!row) return null;
  const owner = await db.query.user.findFirst({ where: eq(user.id, row.value) });
  if (!owner) return null;
  const credential = await db.query.account.findFirst({
    where: and(
      eq(account.userId, owner.id),
      eq(account.providerId, "credential"),
    ),
  });
  const invoice = await db.query.pendingInvoice.findFirst({
    where: eq(pendingInvoice.email, owner.email),
  });
  return {
    name: owner.name,
    email: owner.email,
    hasCredential: !!credential,
    planName: invoice?.planName ?? null,
    monthlyAmount: invoice?.monthlyAmount ?? null,
    buildAmount: invoice?.buildAmount ?? null,
    buildDetails: invoice?.buildDetails ?? null,
  };
}
