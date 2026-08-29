import { Container, btnPrimary } from "./ui";
import { Search } from "./icons";

const links = [
  { label: "What I do", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export function Nav() {
  return (
    <header className="border-b border-border">
      <Container className="flex h-[78px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-accent">
            <Search size={19} className="text-white" />
          </span>
          <span className="text-[18px] font-extrabold tracking-[-0.02em]">
            Searchbar<span className="text-accent">Studio</span>
          </span>
        </a>
        <nav className="flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden text-[15px] font-medium text-[#4a4038] hover:text-accent md:block"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className={btnPrimary}>
            Get in touch
          </a>
        </nav>
      </Container>
    </header>
  );
}
