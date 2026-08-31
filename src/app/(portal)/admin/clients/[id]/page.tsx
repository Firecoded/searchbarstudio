import { redirect, notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { user, clientBilling } from "@/db/schema";
import { BillingForm } from "@/components/admin/billing-form";
import { BillingControls } from "@/components/admin/billing-controls";
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

  const isActive = billing?.status === "active";
  const isCanceling = billing?.status === "canceling";
  const isPending = billing?.status === "pending" && billing.checkoutUrl;
  const wasCanceled = billing?.status === "canceled";

  return (
    <div>
      <div>
        <h1 className="font-serif text-[24px] font-medium">{client.name}</h1>
        <p className="mt-1 text-[15px] text-muted">{client.email}</p>
        <p className="mt-0.5 text-[13px] text-faint">
          Client since {dateFmt.format(client.createdAt)}
        </p>
      </div>

      <section className="mt-9">
        {isActive || isCanceling ? (
          <div className="rounded-2xl border border-border bg-paper p-6">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-[20px] font-medium">Billing</h2>
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
              <Line label="Plan" value={billing?.planName ?? "Monthly plan"} />
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
                Invoice sent, waiting on payment.{" "}
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
                The previous plan was canceled. Set up billing again below.
              </p>
            )}
            <BillingForm clientId={client.id} />
          </>
        )}

        {process.env.NODE_ENV !== "production" && (
          <DevBillingPanel clientId={client.id} />
        )}
      </section>
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
