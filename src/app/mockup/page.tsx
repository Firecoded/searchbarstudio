import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { Container } from "@/components/marketing/ui";
import { Check } from "@/components/marketing/icons";
import { MockupForm } from "@/components/marketing/mockup-form";

// Landing page for the founding offer ads. It carries prices, which the main
// site deliberately doesn't, so it stays out of search and the nav.
export const metadata: Metadata = {
  title: "Free website mockup",
  description:
    "Request a free homepage mockup from Searchbar Studio. Founding offer for 3 Phoenix metro businesses.",
  robots: { index: false, follow: false },
};

const build = [
  "1 to 3 pages, like home, services, and contact",
  "Made to look sharp on phones, tablets, and full-size desktop screens",
  "Basic SEO optimization, with page titles and local keywords for your area",
  "Contact form that goes to your email",
];

const monthly = [
  "Hosting, domain, SSL, backups, and security updates",
  "Small text and photo changes, just text me",
  "Bigger changes or new features get a flat quote up front",
];

const steps = [
  "Fill out the form. It takes about two minutes.",
  "I design a free mockup of your homepage and send it to you.",
  "Like it? $99 and I build the full site. $39/mo starts when it goes live.",
];

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-ink">
          <Check size={18} className="mt-[2px] shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MockupPage() {
  return (
    <main className="min-h-screen bg-ground">
      <Container className="flex items-center justify-between py-6">
        <Link href="/" aria-label="Searchbar Studio home">
          <Logo className="h-8" />
        </Link>
        <a
          href="tel:+14804207174"
          className="text-[14px] font-semibold text-accent underline-offset-2 hover:underline"
        >
          480-420-7174
        </a>
      </Container>

      <Container className="pb-20 pt-6 sm:pt-10">
        <div className="max-w-[720px]">
          <span className="inline-flex rounded-full border-[1.5px] border-accent px-4 py-[6px] text-[12px] font-bold uppercase tracking-[0.14em] text-accent">
            Founding offer · 3 spots
          </span>
          <h1 className="mt-5 font-serif text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-ink sm:text-[56px]">
            <span className="block">
              <span className="text-accent">$99</span> website.
            </span>
            <span className="block">
              Then <span className="text-accent">$39</span>/mo.
            </span>
          </h1>
          <p className="mt-5 text-[18px] leading-[1.55] text-muted">
            I&rsquo;m Jacob, a senior software developer in the East Valley.
            I&rsquo;m launching Searchbar Studio and need 3 local businesses to
            showcase, so the first 3 get discounted intro rates. Start with a free
            mockup of your homepage.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_560px] lg:gap-16">
          <div className="order-2 space-y-10 lg:order-1">
            <section>
              <h2 className="font-serif text-[24px] font-medium text-ink">
                How it works
              </h2>
              <ol className="mt-4 space-y-3">
                {steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-[15px] leading-[1.5] text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[13px] font-bold text-accent">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-[24px] font-medium text-ink">
                What you get for $99
              </h2>
              <List items={build} />
            </section>

            <section>
              <h2 className="font-serif text-[24px] font-medium text-ink">
                What $39/mo covers
              </h2>
              <p className="mt-1 text-[14px] font-semibold text-accent">
                Cancel anytime. No contract.
              </p>
              <List items={monthly} />
            </section>

            <section className="rounded-[18px] border border-border bg-paper p-6">
              <h2 className="font-serif text-[22px] font-medium text-ink">
                The catch
              </h2>
              <p className="mt-2 text-[15px] leading-[1.6] text-muted">
                Only 3 spots at this price. In return I ask for a short review
                I can display and permission to show your site in my portfolio.
                After 3, this promotion ends.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] font-medium text-ink">
                Recent work
              </h2>
              <ul className="mt-3 space-y-2 text-[15px]">
                <li>
                  <a
                    href="https://ashleydownie.com/sings/"
                    target="_blank"
                    rel="noopener"
                    className="font-semibold text-accent hover:underline"
                  >
                    ashleydownie.com/sings
                  </a>
                  <span className="text-muted"> · Live musician, Phoenix</span>
                </li>
                <li>
                  <a
                    href="https://www.marktaylorplays.com/"
                    target="_blank"
                    rel="noopener"
                    className="font-semibold text-accent hover:underline"
                  >
                    marktaylorplays.com
                  </a>
                  <span className="text-muted"> · Solo guitarist</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <MockupForm />
            </div>
          </div>
        </div>
      </Container>

      <footer className="bg-espresso">
        <Container className="flex flex-col items-start gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            aria-label="Searchbar Studio home"
            className="inline-flex transition-opacity hover:opacity-80"
          >
            <Logo dark className="h-9" />
          </Link>
          <div className="flex flex-col gap-2 text-[15px] sm:flex-row sm:gap-8">
            <a
              href="mailto:jacob@searchbarstudio.com"
              className="text-[#b6a898] transition-colors hover:text-white"
            >
              jacob@searchbarstudio.com
            </a>
            <a
              href="tel:+14804207174"
              className="text-[#b6a898] transition-colors hover:text-white"
            >
              480-420-7174
            </a>
          </div>
        </Container>
        <Container className="border-t border-white/10 py-5">
          <p className="text-[13px] text-[#8f8271]">
            &copy; {new Date().getFullYear()} Searchbar Studio
          </p>
        </Container>
      </footer>
    </main>
  );
}
