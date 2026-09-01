import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { finalizePayment, getReceipt } from "@/lib/pay";
import { Logo } from "@/components/marketing/logo";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function fmt(cents: number) {
  return money.format(cents / 100);
}

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

  const receipt = await getReceipt(token);
  if (!receipt) redirect("/dashboard");

  const isPlan = receipt.kind === "plan";
  const firstName = receipt.name.trim().split(" ")[0];
  const closer = firstName
    ? `Thanks, ${firstName}, I really appreciate it.`
    : "Thanks so much, I really appreciate it.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-ground px-6 py-12">
      <style>{confirmStyles}</style>
      <div className="w-full max-w-[460px] rounded-2xl border border-border bg-paper p-8 text-center">
        <Logo className="mx-auto h-8" />

        <div className="sb-pop mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
          <svg
            className="sb-check h-7 w-7 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1
          className="sb-rise mt-5 font-serif text-[28px] font-medium"
          style={{ animationDelay: "0.15s" }}
        >
          Payment received
        </h1>
        <p
          className="sb-rise mt-2 text-[16px] text-muted"
          style={{ animationDelay: "0.24s" }}
        >
          You paid{" "}
          <span className="font-semibold text-ink">{fmt(receipt.amountPaid)}</span>
          {receipt.forText ? <> for {receipt.forText}.</> : "."}
        </p>

        {isPlan && (
          <p
            className="sb-rise mt-2 text-[15px] text-muted"
            style={{ animationDelay: "0.32s" }}
          >
            Your plan is all set.
            {receipt.monthlyAmount != null && (
              <>
                {" "}
                That&rsquo;s {fmt(receipt.monthlyAmount)}/month from here, and you
                can manage or cancel it anytime from home.
              </>
            )}
          </p>
        )}

        <p
          className="sb-rise mt-5 text-[14px] text-faint"
          style={{ animationDelay: "0.4s" }}
        >
          {closer}
        </p>

        <Link
          href="/dashboard"
          className="sb-rise mt-6 inline-block rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          style={{ animationDelay: "0.48s" }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

// Quiet entrance: the check draws in and the content rises in sequence. Gated
// on prefers-reduced-motion so it renders static for anyone who opts out.
const confirmStyles = `
  @media (prefers-reduced-motion: no-preference) {
    @keyframes sbPop {
      from { transform: scale(0.6); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes sbDraw { to { stroke-dashoffset: 0; } }
    @keyframes sbRise {
      from { transform: translateY(8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .sb-pop { animation: sbPop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1.2) both; }
    .sb-check path {
      stroke-dasharray: 24;
      stroke-dashoffset: 24;
      animation: sbDraw 0.4s 0.25s ease-out forwards;
    }
    .sb-rise { opacity: 0; animation: sbRise 0.5s ease-out both; }
  }
`;
