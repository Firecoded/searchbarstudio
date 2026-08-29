import { Container } from "./ui";
import { Search } from "./icons";

const links = [
  { label: "hello@searchbarstudio.com", href: "mailto:hello@searchbarstudio.com" },
  { label: "Instagram", href: "#" },
  { label: "Client login", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-espresso">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[31px] w-[31px] items-center justify-center rounded-lg bg-accent">
            <Search size={16} className="text-white" />
          </span>
          <span className="text-base font-extrabold tracking-[-0.02em] text-[#fbf5ee]">
            SearchbarStudio
          </span>
        </div>
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
