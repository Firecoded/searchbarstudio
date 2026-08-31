import Link from "next/link";

export const metadata = {
  title: "Terms of Service — SearchbarStudio",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-[22px] font-medium">{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-[1.6] text-muted">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-16">
      <Link href="/" className="text-[14px] font-medium text-accent">
        ← Back to home
      </Link>

      <h1 className="mt-5 font-serif text-[34px] font-medium text-ink">
        Terms of Service
      </h1>
      <p className="mt-2 text-[14px] text-faint">Last updated August 30, 2026</p>

      <p className="mt-6 text-[15px] leading-[1.6] text-muted">
        These terms cover the design, build, and ongoing care services provided
        by SearchbarStudio (&ldquo;we,&rdquo; &ldquo;us&rdquo;) to you, the
        client. By setting up billing or using our services, you agree to them.
      </p>

      <Section title="Services">
        <p>
          We provide website design and build work, and, where agreed, an
          ongoing monthly care plan covering hosting oversight, updates, and
          support. The specific scope is what we agree with you in writing.
        </p>
      </Section>

      <Section title="Fees and payment">
        <p>
          Work is billed through Stripe. A project may include a one-time build
          fee and a recurring monthly care plan. Your first invoice may combine
          the build fee with your first month; monthly charges continue after
          that.
        </p>
        <p>
          By completing checkout you authorize us to automatically charge your
          payment method for the recurring monthly plan until you cancel.
        </p>
      </Section>

      <Section title="Renewal and cancellation">
        <p>
          The monthly care plan renews automatically each month. You can cancel
          any time from your dashboard&rsquo;s billing portal. Cancellation
          stops future charges; we don&rsquo;t provide refunds for the current
          month or for completed build work.
        </p>
      </Section>

      <Section title="Your responsibilities">
        <p>
          You&rsquo;re responsible for the content and materials you provide and
          for having the rights to use them. You agree not to use our services
          for anything unlawful.
        </p>
      </Section>

      <Section title="Warranty and liability">
        <p>
          Services are provided on a commercially reasonable, as-is basis. To
          the extent permitted by law, our total liability for any claim is
          limited to the amount you paid us in the three months before the
          claim.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms as the business grows. Material changes will
          be reflected here with a new date.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions? Email{" "}
          <a
            href="mailto:hello@searchbarstudio.com"
            className="font-medium text-accent"
          >
            hello@searchbarstudio.com
          </a>
          .
        </p>
      </Section>
    </main>
  );
}
