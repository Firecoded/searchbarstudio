"use client";

import { useState } from "react";
import { Container, btnPrimary } from "./ui";
import { Logo } from "./logo";
import { Menu, Close } from "./icons";

const links = [
  { label: "What I do", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="relative border-b border-border">
      <Container className="flex h-[72px] items-center justify-between sm:h-[78px]">
        <a
          href="#top"
          aria-label="SearchbarStudio home"
          className="flex items-center"
          onClick={close}
        >
          <Logo className="h-8 sm:h-9 lg:h-10" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-[#4a4038] hover:text-accent"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className={btnPrimary}>
            Get in touch
          </a>
        </nav>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
        >
          {open ? <Close size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-border bg-ground md:hidden">
          <Container className="flex flex-col py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="py-3 text-[17px] font-medium text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={close}
              className={`${btnPrimary} mt-3 justify-center py-3.5`}
            >
              Get in touch
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
