import { redirect, notFound } from "next/navigation";
import { stripe } from "@/lib/stripe";
import {
  provisionInvoiceAccount,
  mintSetPasswordToken,
} from "@/lib/invoice";

export default async function InvoiceCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { token } = await params;
  const { session_id } = await searchParams;
  if (!session_id) redirect(`/invoice/${token}`);

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.status !== "complete") redirect(`/invoice/${token}`);

  const result = await provisionInvoiceAccount(token, session);
  if (!result) notFound();

  // An existing client just needs to sign in; a new one sets their password.
  if (result.hasCredential) redirect("/login");

  const pwToken = await mintSetPasswordToken(result.userId);
  redirect(`/welcome/${pwToken}`);
}
