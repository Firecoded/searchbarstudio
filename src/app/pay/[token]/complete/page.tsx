import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { finalizePayment } from "@/lib/pay";

export default async function PayCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { token } = await params;
  const { session_id } = await searchParams;
  if (!session_id) redirect(`/pay/${token}`);

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.status !== "complete") redirect(`/pay/${token}`);

  // Settle immediately; the webhook is the backstop. Both are idempotent.
  await finalizePayment(token, session);

  redirect("/dashboard?billing=success");
}
