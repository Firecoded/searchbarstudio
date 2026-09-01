import { notFound } from "next/navigation";
import { getPayView } from "@/lib/pay";
import { Logo } from "@/components/marketing/logo";
import { PayCheckout } from "@/components/pay/pay-checkout";

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

export default async function PayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const view = await getPayView(token);
  if (!view) notFound();

  if (view.status === "done" || view.status === "unavailable") {
    const done = view.status === "done";
    return (
      <main className="flex min-h-screen items-center justify-center bg-ground px-6">
        <div className="w-full max-w-[440px] rounded-2xl border border-border bg-paper p-8 text-center">
          <Logo className="mx-auto h-8" />
          <h1 className="mt-6 font-serif text-[26px] font-medium">
            {done ? "This is already paid" : "This payment isn't available"}
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {done
              ? "Thanks! There's nothing left to do here."
              : "This link may have expired or been settled already. Reach out if you think that's a mistake."}
          </p>
        </div>
      </main>
    );
  }

  const firstName = view.clientName.split(" ")[0];

  return (
    <main className="min-h-screen bg-ground">
      <div className="mx-auto max-w-[1040px] px-6 py-12">
        <Logo className="h-8" />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_460px]">
          <div>
            <h1 className="font-serif text-[34px] font-medium leading-[1.15]">
              Here&rsquo;s your invoice, {firstName}.
            </h1>
            <p className="mt-4 text-[16px] leading-[1.6] text-muted">
              Review the details and pay securely below.
            </p>

            {view.kind === "charge" ? (
              <div className="mt-8 rounded-2xl border border-border bg-paper p-6">
                <h2 className="font-serif text-[18px] font-medium">Summary</h2>
                <dl className="mt-4 space-y-3 text-[15px]">
                  <div className="flex items-center justify-between border-b border-border-soft pb-3">
                    <dt className="font-medium">
                      {view.description || "One-time charge"}
                    </dt>
                    <span className="font-medium">{fmt(view.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <dt className="font-semibold">Due today</dt>
                    <span className="font-serif text-[20px] font-medium">
                      {fmt(view.amount)}
                    </span>
                  </div>
                </dl>
              </div>
            ) : (
              <PlanSummary view={view} />
            )}

            {view.kind === "plan" && (
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
            <PayCheckout token={token} />
          </div>
        </div>
      </div>
    </main>
  );
}

function PlanSummary({
  view,
}: {
  view: {
    planName: string | null;
    monthlyAmount: number | null;
    buildAmount: number | null;
    buildDetails: string | null;
  };
}) {
  const build = view.buildAmount ?? 0;
  const monthly = view.monthlyAmount ?? 0;
  return (
    <div className="mt-8 rounded-2xl border border-border bg-paper p-6">
      <h2 className="font-serif text-[18px] font-medium">Summary</h2>
      <dl className="mt-4 space-y-3 text-[15px]">
        {build > 0 && (
          <div className="flex items-start justify-between gap-4 border-b border-border-soft pb-3">
            <dt className="font-medium">
              {view.buildDetails || "One-time charge"}
            </dt>
            <span className="font-medium">{fmt(build)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-b border-border-soft pb-3">
          <dt className="font-medium">
            {view.planName ?? "Monthly care plan"}
            <span className="ml-1 text-[13px] font-normal text-muted">
              (first month)
            </span>
          </dt>
          <span className="font-medium">{fmt(monthly)}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <dt className="font-semibold">Due today</dt>
          <span className="font-serif text-[20px] font-medium">
            {fmt(build + monthly)}
          </span>
        </div>
      </dl>
      <p className="mt-3 text-[13px] text-muted">
        Then {fmt(monthly)}/month for the care plan. Cancel anytime.
      </p>
    </div>
  );
}
