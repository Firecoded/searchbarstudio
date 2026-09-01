"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { startInvoiceCheckout } from "@/app/actions";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

export function InvoiceCheckout({ token }: { token: string }) {
  const fetchClientSecret = useCallback(async () => {
    const secret = await startInvoiceCheckout(token);
    if (!secret) throw new Error("This invoice is no longer available.");
    return secret;
  }, [token]);

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
