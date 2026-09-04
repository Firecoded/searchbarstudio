import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { user, account, clientBilling, charge, pendingInvoice } from "@/db/schema";
import { PageHeader } from "@/components/portal/page-header";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function fmt(cents: number) {
  return money.format(cents / 100);
}

type Attention = {
  id: string;
  label: string;
  detail: string;
  href?: string;
  payHref?: string;
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (session?.user.role !== "admin") redirect("/dashboard");

  // Independent reads, run in parallel so their latencies overlap instead of
  // stacking one after another.
  const [
    activePlans,
    unpaidCharges,
    pendingPlans,
    pendingInvoices,
    clientUsers,
    credentials,
  ] = await Promise.all([
    // Active plans → active-client count + MRR.
    db
      .select({ monthlyAmount: clientBilling.monthlyAmount })
      .from(clientBilling)
      .where(inArray(clientBilling.status, ["active", "canceling"])),
    // Unpaid one-time charges.
    db
      .select({
        id: charge.id,
        amount: charge.amount,
        description: charge.description,
        userId: charge.userId,
        clientName: user.name,
      })
      .from(charge)
      .innerJoin(user, eq(user.id, charge.userId))
      .where(eq(charge.status, "pending")),
    // Plan invoices sent but not yet paid.
    db
      .select({
        userId: clientBilling.userId,
        monthlyAmount: clientBilling.monthlyAmount,
        buildAmount: clientBilling.buildAmount,
        clientName: user.name,
      })
      .from(clientBilling)
      .innerJoin(user, eq(user.id, clientBilling.userId))
      .where(eq(clientBilling.status, "pending")),
    // Invoices to people who aren't clients yet, still unpaid.
    db
      .select({
        id: pendingInvoice.id,
        token: pendingInvoice.token,
        name: pendingInvoice.name,
        monthlyAmount: pendingInvoice.monthlyAmount,
        buildAmount: pendingInvoice.buildAmount,
      })
      .from(pendingInvoice)
      .where(eq(pendingInvoice.status, "pending")),
    // Client users, to find who hasn't set a password yet.
    db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.role, "client")),
    db
      .select({ userId: account.userId })
      .from(account)
      .where(eq(account.providerId, "credential")),
  ]);
  const activeCount = activePlans.length;
  const mrr = activePlans.reduce((sum, p) => sum + (p.monthlyAmount ?? 0), 0);
  const activated = new Set(credentials.map((c) => c.userId));
  const invited = clientUsers.filter((c) => !activated.has(c.id));

  const outstanding =
    unpaidCharges.reduce((s, c) => s + c.amount, 0) +
    pendingPlans.reduce(
      (s, p) => s + (p.monthlyAmount ?? 0) + (p.buildAmount ?? 0),
      0,
    ) +
    pendingInvoices.reduce(
      (s, p) => s + (p.monthlyAmount ?? 0) + (p.buildAmount ?? 0),
      0,
    );

  const attention: Attention[] = [
    ...unpaidCharges.map((c) => ({
      id: `charge-${c.id}`,
      label: `${c.clientName} owes ${fmt(c.amount)}`,
      detail: c.description || "One-time charge",
      href: `/clients/${c.userId}`,
    })),
    ...pendingPlans.map((p) => ({
      id: `plan-${p.userId}`,
      label: `${p.clientName} · plan invoice unpaid`,
      detail: `${fmt(p.monthlyAmount ?? 0)}/mo${
        p.buildAmount ? ` + ${fmt(p.buildAmount)} upfront` : ""
      }`,
      href: `/clients/${p.userId}`,
    })),
    ...pendingInvoices.map((p) => ({
      id: `invoice-${p.id}`,
      label: `${p.name} · invoice unpaid`,
      detail: `${fmt((p.monthlyAmount ?? 0) + (p.buildAmount ?? 0))} due · not a client yet`,
      payHref: `/invoice/${p.token}`,
    })),
    ...invited.map((c) => ({
      id: `invite-${c.id}`,
      label: `${c.name} · invite not accepted`,
      detail: c.email,
      href: `/clients/${c.id}`,
    })),
  ];

  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 gap-4 sm:max-w-[640px] sm:grid-cols-3">
        <Stat label="Active clients" value={String(activeCount)} />
        <Stat label="MRR" value={fmt(mrr)} />
        <Stat label="Outstanding" value={fmt(outstanding)} />
      </div>

      <section className="mt-11">
        <h2 className="font-serif text-[20px] font-medium">Needs attention</h2>
        <p className="mt-1 text-[13px] text-muted">
          Unpaid charges and invoices, plus client invites that haven&rsquo;t
          been accepted.
        </p>
        {attention.length === 0 ? (
          <p className="mt-4 text-[15px] text-muted">
            All caught up. Nothing needs you right now.
          </p>
        ) : (
          <div className="mt-4 max-w-[720px] divide-y divide-border-soft overflow-hidden rounded-2xl border border-border bg-paper">
            {attention.map((item) => {
              const row = (
                <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium text-ink">
                      {item.label}
                    </div>
                    <div className="truncate text-[13px] text-muted">
                      {item.detail}
                    </div>
                  </div>
                  {item.href && (
                    <span className="shrink-0 text-[13px] font-medium text-accent">
                      View →
                    </span>
                  )}
                  {item.payHref && (
                    <a
                      href={item.payHref}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-[13px] font-medium text-accent underline"
                    >
                      Pay link
                    </a>
                  )}
                </div>
              );
              return item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block transition-colors hover:bg-ground"
                >
                  {row}
                </Link>
              ) : (
                <div key={item.id}>{row}</div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-paper px-5 py-4">
      <div className="font-serif text-[26px] font-medium">{value}</div>
      <div className="mt-0.5 text-[13px] font-semibold text-muted">{label}</div>
    </div>
  );
}
