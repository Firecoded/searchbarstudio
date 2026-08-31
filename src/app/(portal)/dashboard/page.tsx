import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { clientBilling } from "@/db/schema";
import { openBillingPortal } from "@/lib/dashboard-actions";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  // Admins have their own view; keep the client dashboard for clients.
  if (session.user.role === "admin") redirect("/admin");

  const { billing: billingFlag } = await searchParams;
  const billing = await db.query.clientBilling.findFirst({
    where: eq(clientBilling.userId, session.user.id),
  });

  const isActive = billing?.status === "active";
  const isCanceling = billing?.status === "canceling";
  const isCanceled = billing?.status === "canceled";
  const isPending = billing?.status === "pending" && billing.checkoutUrl;

  return (
    <>
      {billingFlag === "success" && (
        <p className="mt-6 rounded-lg bg-sand px-4 py-3 text-[14px] text-ink">
          Payment received, thank you. Your plan is being activated.
        </p>
      )}
      {billingFlag === "cancelled" && (
        <p className="mt-6 rounded-lg bg-accent-soft px-4 py-3 text-[14px] text-accent">
          Checkout cancelled. Your invoice is still available below.
        </p>
      )}
      {billingFlag === "portal_error" && (
        <p className="mt-6 rounded-lg bg-accent-soft px-4 py-3 text-[14px] text-accent">
          Couldn&rsquo;t open the billing portal. Please try again shortly.
        </p>
      )}

      <section className="mt-9 rounded-2xl border border-border bg-paper p-6">
        <h2 className="font-serif text-[20px] font-medium">Your project</h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-muted">
          This is where your project status and updates will live. I&rsquo;ll
          have it set up shortly.
        </p>
      </section>

      {isPending && (
        <section className="mt-5 rounded-2xl border border-border bg-paper p-6">
          <h2 className="font-serif text-[20px] font-medium">Invoice ready</h2>
          <p className="mt-2 text-[15px] leading-[1.55] text-muted">
            Your invoice is ready to review and pay securely through Stripe.
          </p>
          <a
            href={billing!.checkoutUrl!}
            className="mt-4 inline-block rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            Review and pay
          </a>
        </section>
      )}

      {(isActive || isCanceling) && (
        <section className="mt-5 rounded-2xl border border-border bg-paper p-6">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] font-medium">Care plan</h2>
            <span
              className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                isCanceling ? "bg-sand text-muted" : "bg-accent-soft text-accent"
              }`}
            >
              {isCanceling ? "Canceling" : "Active"}
            </span>
          </div>
          <p className="mt-2 text-[15px] text-muted">
            {billing?.monthlyAmount != null && (
              <>{money.format(billing.monthlyAmount / 100)}/month</>
            )}
            {billing?.currentPeriodEnd && (
              <>
                {" · "}
                {isCanceling ? "ends" : "next charge"}{" "}
                {dateFmt.format(billing.currentPeriodEnd)}
              </>
            )}
          </p>
          <form action={openBillingPortal} className="mt-4">
            <button
              type="submit"
              className="rounded-xl border border-border px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-ground"
            >
              Manage billing
            </button>
          </form>
        </section>
      )}

      {isCanceled && (
        <section className="mt-5 rounded-2xl border border-border bg-paper p-6">
          <h2 className="font-serif text-[20px] font-medium">Care plan</h2>
          <p className="mt-2 text-[15px] leading-[1.55] text-muted">
            You don&rsquo;t have an active plan right now. Reach out if
            you&rsquo;d like to start one back up.
          </p>
        </section>
      )}

      <section className="mt-5 rounded-2xl border border-border bg-paper p-6">
        <h2 className="font-serif text-[20px] font-medium">Need a change?</h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-muted">
          Email me at{" "}
          <a
            href="mailto:hello@searchbarstudio.com"
            className="font-medium text-accent"
          >
            hello@searchbarstudio.com
          </a>{" "}
          and I&rsquo;ll take care of it.
        </p>
      </section>
    </>
  );
}
