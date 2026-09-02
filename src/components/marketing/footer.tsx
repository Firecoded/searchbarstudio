import { Container } from "./ui";
import { Logo } from "./logo";

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
        <div className="flex flex-col items-start gap-2.5">
          <Logo dark className="h-9" />
          <p className="text-[14px] text-[#b6a898]">
            Great websites, made easy and affordable.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[#8f8271]">
            &copy; {year} Searchbar Studio
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[#b6a898] transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
