import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { clientBilling } from "@/db/schema";

// current_period_end/start live on the subscription in older API versions and on
// the subscription item in newer ones; read whichever is present.
function periodField(
  sub: Stripe.Subscription,
  field: "current_period_end" | "current_period_start",
): number | undefined {
  const onSub = (sub as unknown as Record<string, number | undefined>)[field];
  const onItem = (
    sub.items?.data?.[0] as unknown as Record<string, number | undefined>
  )?.[field];
  return onSub ?? onItem;
}

export function periodBounds(sub: Stripe.Subscription) {
  return {
    start: periodField(sub, "current_period_start"),
    end: periodField(sub, "current_period_end"),
  };
}

// Stripe keeps a subscription "active" while it's scheduled to cancel at period
// end, so surface that as "canceling" for our UI.
export function billingStatus(sub: Stripe.Subscription): string {
  if (sub.status === "active" && sub.cancel_at_period_end) return "canceling";
  return sub.status;
}

export async function syncSubscriptionToDb(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId;
  if (!userId) return;
  const status = billingStatus(sub);
  const end = periodBounds(sub).end;
  await db
    .update(clientBilling)
    .set({
      stripeSubscriptionId: sub.id,
      status,
      currentPeriodEnd: end ? new Date(end * 1000) : null,
      checkoutUrl: status === "active" ? null : undefined,
    })
    .where(eq(clientBilling.userId, userId));
}
