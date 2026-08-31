"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { clientBilling } from "@/db/schema";
import { stripe } from "@/lib/stripe";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

// Sends the client to Stripe's hosted portal to manage their own card, invoices,
// and cancellation. Scoped to the signed-in user's own Stripe customer.
export async function openBillingPortal() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?next=/dashboard");

  const billing = await db.query.clientBilling.findFirst({
    where: eq(clientBilling.userId, session.user.id),
  });
  if (!billing?.stripeCustomerId) redirect("/dashboard");

  let url: string;
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: billing.stripeCustomerId,
      return_url: `${APP_URL}/dashboard`,
    });
    url = portal.url;
  } catch {
    redirect("/dashboard?billing=portal_error");
  }
  redirect(url);
}
