import { redirect } from "next/navigation";
import { and, eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { clientBilling, charge } from "@/db/schema";
import { openBillingPortal } from "@/lib/dashboard-actions";
import { PageHeader } from "@/components/portal/page-header";

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
  const unpaidCharges = await db
    .select()
    .from(charge)
    .where(and(eq(charge.userId, session.user.id), eq(charge.status, "pending")))
    .orderBy(desc(charge.createdAt));

  const isActive = billing?.status === "active";
  const isCanceling = billing?.status === "canceling";
  const isCanceled = billing?.status === "canceled";
  const isPending = billing?.status === "pending" && billing.checkoutUrl;
  // While an admin impersonates this client, block actions that move money or
  // open the client's Stripe portal so viewing can't become acting. Only in
  // production, so payment flows stay testable while impersonating in dev.
  const blockActions =
    !!session.session.impersonatedBy &&
    process.env.NODE_ENV === "production";

  return (
    <>
      <PageHeader title="Home" />
      {billingFlag === "portal_error" && (
        <p className="mt-6 rounded-lg bg-accent-soft px-4 py-3 text-[14px] text-accent">
          Couldn&rsquo;t open the billing portal. Please try again shortly.
        </p>
      )}

      <section className="mt-9 rounded-2xl border border-border bg-paper p-6">
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif text-[20px] font-medium">Your project</h2>
          <ComingSoon />
        </div>
        <p className="mt-2 text-[15px] leading-[1.55] text-muted">
          This is where your live project status and updates will show up.
          I&rsquo;m still building this part, for now I&rsquo;ll keep you posted
          directly.
        </p>
      </section>

      {isPending && (
        <MoneyDueCard
          label="Invoice"
          amountCents={(billing!.monthlyAmount ?? 0) + (billing!.buildAmount ?? 0)}
          forText={billing!.planName ?? "Monthly care plan"}
          note={
            billing!.monthlyAmount != null
              ? `Then ${money.format(billing!.monthlyAmount / 100)}/month`
              : undefined
          }
          href={billing!.checkoutUrl}
          blocked={blockActions}
        />
      )}

      {unpaidCharges.map((c) => (
        <MoneyDueCard
          key={c.id}
          label="Payment due"
          amountCents={c.amount}
          forText={c.description}
          href={c.checkoutUrl}
          blocked={blockActions}
        />
      ))}

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
          {blockActions ? (
            <button
              disabled
              title="Disabled while viewing as this client"
              className="mt-4 cursor-not-allowed rounded-xl border border-border px-5 py-2.5 text-[15px] font-semibold text-faint"
            >
              Manage billing
            </button>
          ) : (
            <form action={openBillingPortal} className="mt-4">
              <button
                type="submit"
                className="rounded-xl border border-border px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-ground"
              >
                Manage billing
              </button>
            </form>
          )}
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
        <p className="mt-2 text-[13px] text-faint">
          Requesting changes right here in your dashboard is coming soon.
        </p>
      </section>
    </>
  );
}

// Marks a section whose in-app feature isn't built yet.
function ComingSoon() {
  return (
    <span className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
      Coming soon
    </span>
  );
}

// An outstanding invoice or one-time charge, shown as an action card so it
// stands apart from the informational cards.
function MoneyDueCard({
  label,
  amountCents,
  forText,
  note,
  href,
  blocked,
}: {
  label: string;
  amountCents: number;
  forText?: string | null;
  note?: string;
  href?: string | null;
  blocked: boolean;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-accent/25 bg-accent-soft/60 p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
        {label}
      </div>
      <div className="mt-1.5 font-serif text-[28px] font-medium leading-none text-ink">
        {money.format(amountCents / 100)}
      </div>
      {forText && <p className="mt-2 text-[15px] text-muted">For: {forText}</p>}
      {note && <p className="mt-1 text-[13px] text-muted">{note}</p>}
      {href && (
        <>
          <p className="mt-3 text-[14px] leading-[1.5] text-muted">
            Pay securely by card through Stripe, it takes a minute.
          </p>
          {blocked ? (
            <DisabledPay label="Review and pay" />
          ) : (
            <a
              href={href}
              className="mt-4 inline-block rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
            >
              Review and pay
            </a>
          )}
        </>
      )}
    </section>
  );
}

// A greyed-out stand-in for a pay button while an admin is impersonating.
function DisabledPay({ label }: { label: string }) {
  return (
    <span
      title="Disabled while viewing as this client"
      className="mt-4 inline-block cursor-not-allowed rounded-xl bg-sand px-6 py-3 text-[15px] font-semibold text-faint"
    >
      {label}
    </span>
  );
}
