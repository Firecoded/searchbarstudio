import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pendingInvoice } from "@/db/schema";
import { Logo } from "@/components/marketing/logo";
import { InvoiceCheckout } from "@/components/invoice/invoice-checkout";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function fmt(cents: number) {
  return money.format(cents / 100);
}

const included = [
  "Edits and updates handled for you",
  "Hosting, backups, and security looked after",
  "A dashboard to see your project and request changes",
  "Direct line to me, no account managers",
];

export const metadata = { robots: { index: false, follow: false } };

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const pi = await db.query.pendingInvoice.findFirst({
    where: eq(pendingInvoice.token, token),
  });
  if (!pi) notFound();

  if (pi.status === "paid") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ground px-6">
        <div className="w-full max-w-[440px] rounded-2xl border border-border bg-paper p-8 text-center">
          <Logo className="mx-auto h-8" />
          <h1 className="mt-6 font-serif text-[26px] font-medium">
            This invoice is paid
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            Thanks! Check your email for the link to set your password and reach
            your dashboard.
          </p>
        </div>
      </main>
    );
  }

  const build = pi.buildAmount ?? 0;
  const monthly = pi.monthlyAmount ?? 0;
  const isPlan = monthly > 0;

  return (
    <main className="min-h-screen bg-ground">
      <div className="mx-auto max-w-[1040px] px-6 py-12">
        <Logo className="h-8" />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_460px]">
          <div>
            <h1 className="font-serif text-[34px] font-medium leading-[1.15]">
              Here&rsquo;s your invoice, {pi.name.split(" ")[0]}.
            </h1>
            <p className="mt-4 text-[16px] leading-[1.6] text-muted">
              Review the details and pay securely below. Once you&rsquo;re paid,
              you&rsquo;ll create your account and land in your own dashboard.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-paper p-6">
              <h2 className="font-serif text-[18px] font-medium">Summary</h2>
              <dl className="mt-4 space-y-3 text-[15px]">
                {build > 0 && (
                  <div className="flex items-start justify-between gap-4 border-b border-border-soft pb-3">
                    <div>
                      <dt className="font-medium">
                        {pi.buildDetails || "One-time charge"}
                        {isPlan && (
                          <span className="ml-1 text-[13px] font-normal text-muted">
                            (one-time)
                          </span>
                        )}
                      </dt>
                    </div>
                    <span className="font-medium">{fmt(build)}</span>
                  </div>
                )}
                {isPlan && (
                  <div className="flex items-center justify-between border-b border-border-soft pb-3">
                    <dt className="font-medium">
                      {pi.planName ?? "Monthly care plan"}
                      <span className="ml-1 text-[13px] font-normal text-muted">
                        (first month)
                      </span>
                    </dt>
                    <span className="font-medium">{fmt(monthly)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <dt className="font-semibold">Due today</dt>
                  <span className="font-serif text-[20px] font-medium">
                    {fmt(build + monthly)}
                  </span>
                </div>
              </dl>
              {isPlan && (
                <p className="mt-3 text-[13px] text-muted">
                  This invoice covers your first month. After that, you&rsquo;ll
                  be billed {fmt(monthly)}/month automatically.
                </p>
              )}
            </div>

            {isPlan && (
              <div className="mt-6">
                <h2 className="font-serif text-[18px] font-medium">
                  What the care plan covers
                </h2>
                <ul className="mt-3 space-y-2">
                  {included.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[15px] text-muted"
                    >
                      <span className="mt-[3px] text-accent">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-paper p-4">
            <InvoiceCheckout token={token} />
          </div>
        </div>
      </div>
    </main>
  );
}
