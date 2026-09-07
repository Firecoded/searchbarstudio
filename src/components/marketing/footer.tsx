import { Container } from "./ui";
import { Logo } from "./logo";
import { TrackedLink } from "../tracked-link";

// Section links mirror the top nav (Log in stays out; it lives in the utility
// row below as Client login).
const navLinks = [
  { label: "What I do", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

const links = [
  { label: "jacob@searchbarstudio.com", href: "mailto:jacob@searchbarstudio.com" },
  { label: "Terms", href: "/terms" },
  { label: "Client login", href: "/login" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-espresso">
      <Container className="py-12">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-2.5">
            <a
              href="#top"
              aria-label="Back to top"
              className="inline-flex transition-opacity hover:opacity-80"
            >
              <Logo dark className="h-9" />
            </a>
            <p className="text-[14px] text-[#b6a898]">
              Great websites, made easy and affordable.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium sm:justify-end">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[#b6a898] transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[#8f8271]">
            &copy; {year} Searchbar Studio
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            {links.map((l) =>
              l.href.startsWith("mailto:") ? (
                <TrackedLink
                  key={l.label}
                  href={l.href}
                  event="email_link_clicked"
                  eventProps={{ location: "footer" }}
                  className="text-[#b6a898] transition-colors hover:text-white"
                >
                  {l.label}
                </TrackedLink>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[#b6a898] transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              ),
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
