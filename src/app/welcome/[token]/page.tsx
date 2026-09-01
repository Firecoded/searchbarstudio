import { redirect } from "next/navigation";
import { Logo } from "@/components/marketing/logo";
import { resolveWelcomeContext } from "@/lib/invoice";
import { WelcomeSetPasswordForm } from "@/components/invoice/welcome-set-password-form";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function fmt(cents: number) {
  return money.format(cents / 100);
}

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ctx = await resolveWelcomeContext(token);

  // Already set up (e.g. finished in-app, now clicking the email): send them to
  // sign in rather than prompting for a password again.
  if (ctx?.hasCredential) redirect("/login?next=/dashboard");

  if (!ctx) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ground px-6">
        <div className="w-full max-w-[440px] rounded-2xl border border-border bg-paper p-8 text-center">
          <Logo className="mx-auto h-8" />
          <h1 className="mt-6 font-serif text-[26px] font-medium">
            This link has expired
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            Your payment went through. Ask us to send a fresh link to set your
            password.
          </p>
        </div>
      </main>
    );
  }

  const firstName = ctx.name.split(" ")[0];
  const build = ctx.buildAmount ?? 0;
  const monthly = ctx.monthlyAmount ?? 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ground px-6 py-12">
      <div className="w-full max-w-[440px] rounded-2xl border border-border bg-paper p-8">
        <Logo className="h-7" />

        <div className="mt-7 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[18px] text-accent-ink">
            ✓
          </span>
          <h1 className="font-serif text-[26px] font-medium leading-tight">
            Payment received
          </h1>
        </div>
        <p className="mt-3 text-[15px] leading-[1.55] text-muted">
          Welcome aboard, {firstName}. You&rsquo;re officially a SearchbarStudio
          client, and a receipt is on its way to your email.
        </p>

        <div className="mt-6 rounded-xl border border-border-soft bg-ground p-4">
          <dl className="space-y-2 text-[14px]">
            {build > 0 && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted">
                  {ctx.buildDetails || "One-time charge"}
                </dt>
                <dd className="font-medium">{fmt(build)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-muted">
                {ctx.planName ?? "Monthly plan"} (first month)
              </dt>
              <dd className="font-medium">{fmt(monthly)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border-soft pt-2">
              <dt className="font-semibold">Paid today</dt>
              <dd className="font-serif text-[17px] font-medium">
                {fmt(build + monthly)}
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-6 text-[15px] leading-[1.55] text-muted">
          I&rsquo;ll take it from here. Create a password to reach your
          dashboard, where you can follow your project, see updates, and message
          me anytime.
        </p>

        <WelcomeSetPasswordForm token={token} email={ctx.email} />

        <p className="mt-6 text-center text-[13px] text-muted">
          Questions?{" "}
          <a
            href="mailto:hello@searchbarstudio.com"
            className="font-medium text-accent"
          >
            hello@searchbarstudio.com
          </a>
        </p>
      </div>
    </main>
  );
}
