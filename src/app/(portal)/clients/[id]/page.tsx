import { redirect, notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { user, clientBilling, charge } from "@/db/schema";
import { PageHeader } from "@/components/portal/page-header";
import { BillingForm } from "@/components/admin/billing-form";
import { BillingControls } from "@/components/admin/billing-controls";
import { ChargeForm } from "@/components/admin/charge-form";
import { ImpersonateButton } from "@/components/admin/impersonate-button";
import { DevBillingPanel } from "@/components/admin/dev-billing-panel";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (session?.user.role !== "admin") redirect("/dashboard");

  const client = await db.query.user.findFirst({ where: eq(user.id, id) });
  if (!client || client.role !== "client") notFound();

  const billing = await db.query.clientBilling.findFirst({
    where: eq(clientBilling.userId, id),
  });
  const charges = await db
    .select()
    .from(charge)
    .where(eq(charge.userId, id))
    .orderBy(desc(charge.createdAt));

  const isActive = billing?.status === "active";
  const isCanceling = billing?.status === "canceling";
  const isPending = billing?.status === "pending" && billing.checkoutUrl;
  const wasCanceled = billing?.status === "canceled";

  return (
    <div className="max-w-[760px]">
      <PageHeader
        title={client.name}
        parent={{ label: "Clients", href: "/clients" }}
        action={<ImpersonateButton userId={client.id} name={client.name} />}
      />
      <p className="-mt-5 mb-8 text-[14px] text-muted">
        {client.email} · Client since {dateFmt.format(client.createdAt)}
      </p>

      <section>
        <h2 className="font-serif text-[20px] font-medium">Plan</h2>
        <div className="mt-4">
          {isActive || isCanceling ? (
            <div className="rounded-2xl border border-border bg-paper p-6">
              <div className="flex items-center gap-2">
                <span className="font-serif text-[17px] font-medium">
                  {billing?.planName ?? "Monthly plan"}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                    isCanceling
                      ? "bg-sand text-muted"
                      : "bg-accent-soft text-accent"
                  }`}
                >
                  {isCanceling ? "Canceling" : "Active"}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-[15px]">
                {billing?.monthlyAmount != null && (
                  <Line
                    label="Monthly"
                    value={`${money.format(billing.monthlyAmount / 100)}/mo`}
                  />
                )}
                {billing?.currentPeriodEnd && (
                  <Line
                    label={isCanceling ? "Ends" : "Next charge"}
                    value={dateFmt.format(billing.currentPeriodEnd)}
                  />
                )}
              </dl>
              <BillingControls clientId={client.id} canceling={isCanceling} />
            </div>
          ) : (
            <>
              {isPending && (
                <p className="mb-4 rounded-lg bg-sand px-3 py-2 text-[14px] text-ink">
                  Plan invoice sent, waiting on payment.{" "}
                  <a
                    href={billing!.checkoutUrl!}
                    className="font-medium text-accent"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open the pay link
                  </a>
                  .
                </p>
              )}
              {wasCanceled && (
                <p className="mb-4 rounded-lg bg-sand px-3 py-2 text-[14px] text-muted">
                  The previous plan was canceled.
                </p>
              )}
              <BillingForm clientId={client.id} />
            </>
          )}
        </div>
      </section>

      <section className="mt-11">
        <h2 className="font-serif text-[20px] font-medium">Charges</h2>
        {charges.length === 0 ? (
          <p className="mt-4 text-[15px] text-muted">
            No one-time charges yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-paper">
            <table className="w-full min-w-[520px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-border text-[13px] font-semibold text-muted">
                  <th className="whitespace-nowrap px-5 py-3.5">For</th>
                  <th className="whitespace-nowrap px-5 py-3.5">Amount</th>
                  <th className="whitespace-nowrap px-5 py-3.5">Date</th>
                  <th className="whitespace-nowrap px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border-soft last:border-0"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium">
                      {c.description || "One-time charge"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {money.format(c.amount / 100)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                      {dateFmt.format(c.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {c.status === "paid" ? (
                        <span className="text-muted">Paid</span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span className="font-medium text-accent">Unpaid</span>
                          {c.checkoutUrl && (
                            <a
                              href={c.checkoutUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[13px] text-accent underline"
                            >
                              pay link
                            </a>
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <ChargeForm clientId={client.id} />
        </div>
      </section>

      {process.env.NODE_ENV !== "production" && (
        <div className="mt-11">
          <DevBillingPanel clientId={client.id} />
        </div>
      )}
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border-soft pb-2 last:border-0 last:pb-0">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
