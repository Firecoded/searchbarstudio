import { Container } from "./ui";
import { Logo } from "./logo";

const links = [
  { label: "hello@searchbarstudio.com", href: "mailto:hello@searchbarstudio.com" },
  { label: "Instagram", href: "#" },
  { label: "Client login", href: "/login" },
];

export function Footer() {
  return (
    <footer className="bg-espresso">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <Logo dark className="h-9" />
        <div className="flex gap-[30px]">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-[14px] text-[#b6a898] hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
