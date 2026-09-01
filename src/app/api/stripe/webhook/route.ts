import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { syncSubscriptionToDb } from "@/lib/billing";
import {
  provisionInvoiceAccount,
  mintSetPasswordToken,
  sendPaymentReceivedEmail,
} from "@/lib/invoice";
import { db } from "@/db";
import { user, charge } from "@/db/schema";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return new Response("Webhook not configured", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // Invoice to a not-yet-client: create their account and email a set-
      // password link as a backstop for the on-page redirect.
      const invoiceToken = session.metadata?.pendingInvoiceToken;
      if (invoiceToken) {
        const result = await provisionInvoiceAccount(invoiceToken, session);
        if (result && !result.hasCredential) {
          const u = await db.query.user.findFirst({
            where: eq(user.id, result.userId),
          });
          if (u) {
            const token = await mintSetPasswordToken(result.userId);
            await sendPaymentReceivedEmail(u.name, u.email, token);
          }
        }
        break;
      }

      // A one-time charge to an existing client.
      const chargeId = session.metadata?.chargeId;
      if (chargeId) {
        await db
          .update(charge)
          .set({ status: "paid", checkoutUrl: null })
          .where(eq(charge.id, chargeId));
        break;
      }

      const userId = session.metadata?.userId;
      if (userId && typeof session.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        await syncSubscriptionToDb(sub);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscriptionToDb(event.data.object);
      break;
    }
    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
