import "server-only";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { charge, clientBilling, user } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { syncSubscriptionToDb } from "@/lib/billing";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

type ChargeRow = typeof charge.$inferSelect;
type BillingRow = typeof clientBilling.$inferSelect;

type Payable =
  | { kind: "charge"; row: ChargeRow }
  | { kind: "plan"; row: BillingRow };

// A pay token belongs to either a one-time charge or an outstanding plan
// invoice. Charges each carry their own token; a client's plan invoice token
// lives on their single client_billing row.
async function resolvePayable(token: string): Promise<Payable | null> {
  const [c] = await db
    .select()
    .from(charge)
    .where(eq(charge.token, token))
    .limit(1);
  if (c) return { kind: "charge", row: c };

  const [b] = await db
    .select()
    .from(clientBilling)
    .where(eq(clientBilling.token, token))
    .limit(1);
  if (b) return { kind: "plan", row: b };

  return null;
}

export type PayView =
  | { status: "unavailable" }
  | { status: "done" }
  | {
      status: "pending";
      kind: "charge";
      clientName: string;
      amount: number;
      description: string | null;
    }
  | {
      status: "pending";
      kind: "plan";
      clientName: string;
      planName: string | null;
      monthlyAmount: number | null;
      buildAmount: number | null;
      buildDetails: string | null;
    };

// Resolves what a /pay/[token] page should render: the outstanding item, an
// already-settled state, or unavailable. Does not touch Stripe.
export async function getPayView(token: string): Promise<PayView | null> {
  const p = await resolvePayable(token);
  if (!p) return null;

  const client = await db.query.user.findFirst({
    where: eq(user.id, p.row.userId),
  });
  const clientName = client?.name ?? "there";

  if (p.kind === "charge") {
    if (p.row.status === "paid") return { status: "done" };
    if (p.row.status !== "pending") return { status: "unavailable" };
    return {
      status: "pending",
      kind: "charge",
      clientName,
      amount: p.row.amount,
      description: p.row.description,
    };
  }

  // Plan: already-active/canceling means the invoice was paid.
  if (p.row.status === "active" || p.row.status === "canceling") {
    return { status: "done" };
  }
  if (p.row.status !== "pending") return { status: "unavailable" };
  return {
    status: "pending",
    kind: "plan",
    clientName,
    planName: p.row.planName,
    monthlyAmount: p.row.monthlyAmount,
    buildAmount: p.row.buildAmount,
    buildDetails: p.row.buildDetails,
  };
}

function planLineItems(
  row: BillingRow,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        unit_amount: row.monthlyAmount ?? 0,
        recurring: { interval: "month" },
        product_data: { name: row.planName ?? "Monthly care plan" },
      },
      quantity: 1,
    },
  ];
  if (row.buildAmount && row.buildAmount > 0) {
    items.push({
      price_data: {
        currency: "usd",
        unit_amount: row.buildAmount,
        product_data: {
          name: "Upfront charge",
          ...(row.buildDetails ? { description: row.buildDetails } : {}),
        },
      },
      quantity: 1,
    });
  }
  return items;
}

// Creates an embedded Checkout session for a pay token and returns its client
// secret. Called when the client opens their /pay/[token] page.
export async function createPayCheckoutSecret(
  token: string,
): Promise<string | null> {
  const p = await resolvePayable(token);
  if (!p) return null;

  // The Stripe customer lives on the client's billing row; a charge borrows it.
  let customerId: string | null;
  if (p.kind === "plan") {
    customerId = p.row.stripeCustomerId;
  } else {
    const [b] = await db
      .select({ customerId: clientBilling.stripeCustomerId })
      .from(clientBilling)
      .where(eq(clientBilling.userId, p.row.userId))
      .limit(1);
    customerId = b?.customerId ?? null;
  }
  if (!customerId) return null;

  const returnUrl = `${APP_URL}/pay/${token}/complete?session_id={CHECKOUT_SESSION_ID}`;
  // Current Stripe API renamed the embedded UI mode; the SDK types still say
  // "embedded", so cast to the value the API now expects.
  const uiMode = "embedded_page" as Stripe.Checkout.SessionCreateParams["ui_mode"];

  let base: Stripe.Checkout.SessionCreateParams;
  if (p.kind === "charge") {
    if (p.row.status !== "pending") return null;
    base = {
      ui_mode: uiMode,
      mode: "payment",
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: p.row.amount,
            product_data: { name: p.row.description || "One-time charge" },
          },
          quantity: 1,
        },
      ],
      metadata: { userId: p.row.userId, chargeId: p.row.id },
      return_url: returnUrl,
    };
  } else {
    if (p.row.status !== "pending") return null;
    base = {
      ui_mode: uiMode,
      mode: "subscription",
      customer: customerId,
      line_items: planLineItems(p.row),
      subscription_data: { metadata: { userId: p.row.userId } },
      metadata: { userId: p.row.userId },
      return_url: returnUrl,
    };
  }

  // Stripe rejects terms consent until a ToS URL is set in the Dashboard, so
  // fall back without it; the checkbox turns on once that URL is configured.
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

// Settles a completed pay session immediately so the client sees the result
// without waiting on the webhook. Idempotent: safe alongside the webhook.
export async function finalizePayment(
  token: string,
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  if (session.status !== "complete") return false;
  const p = await resolvePayable(token);
  if (!p) return false;

  if (p.kind === "charge") {
    await db
      .update(charge)
      .set({ status: "paid", checkoutUrl: null })
      .where(eq(charge.id, p.row.id));
    return true;
  }

  const subId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  if (subId) {
    const sub = await stripe.subscriptions.retrieve(subId);
    await syncSubscriptionToDb(sub);
  }
  return true;
}
