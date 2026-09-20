"use client";

import { useState } from "react";
import { Container, btnPrimary } from "./ui";
import { Logo } from "./logo";
import { track } from "../posthog";

const links = [
  { label: "What I do", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Cascade the mobile menu items: top-down on open, bottom-up on close, so the
  // exit mirrors the reveal instead of leaving all at once. `count` is the
  // number of items (nav links + Log in + Get in touch).
  const count = links.length + 2;
  const itemDelay = (i: number) => (open ? i : count - 1 - i) * 45;

  return (
    <header className="relative z-40 border-b border-border bg-paper">
      {/* Three columns from md: logo, links dead-center, account actions.
          The outer 1fr tracks match so the links center on the header. */}
      <Container className="relative z-40 flex h-[72px] items-center justify-between sm:h-[78px] md:grid md:grid-cols-[1fr_auto_1fr]">
        <a
          href="#top"
          aria-label="Searchbar Studio home"
          className="flex items-center justify-self-start"
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
        </nav>

        <div className="hidden items-center gap-8 justify-self-end md:flex">
          <a
            href="/login"
            className="text-[15px] font-medium text-[#4a4038] hover:text-accent"
          >
            Log in
          </a>
          <a
            href="#contact"
            onClick={() => track("cta_clicked", { location: "nav" })}
            className={btnPrimary}
          >
            Get in touch
          </a>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
        >
          <span className="relative block h-[18px] w-6" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 ease-out ${open ? "translate-y-[8px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 ease-out ${open ? "-translate-y-[8px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </Container>

      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-30 bg-ink/25 backdrop-blur-[1px] transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* The panel unfolds from beneath the header bar: a grid row eases from
          0fr to 1fr so it can animate to its natural height, and the middle
          div clips the contents while it grows. Closing runs the same in
          reverse. `inert` keeps the collapsed links out of the tab order. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`absolute left-0 right-0 top-full z-40 grid transition-[grid-template-rows,box-shadow] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open
            ? "grid-rows-[1fr] shadow-[0_16px_30px_-18px_rgba(60,30,15,0.4)]"
            : "grid-rows-[0fr] shadow-none"
        }`}
      >
        <div className="min-h-0 overflow-hidden bg-ground">
          <Container className="flex flex-col border-t border-border py-3">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                style={{ transitionDelay: `${itemDelay(i)}ms` }}
                className={`py-3 text-[17px] font-medium text-ink transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none ${
                  open
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1 opacity-0"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={close}
              style={{ transitionDelay: `${itemDelay(links.length)}ms` }}
              className={`py-3 text-[17px] font-medium text-ink transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
              }`}
            >
              Log in
            </a>
            <a
              href="#contact"
              onClick={() => {
                track("cta_clicked", { location: "nav_mobile" });
                close();
              }}
              style={{ transitionDelay: `${itemDelay(links.length + 1)}ms` }}
              className={`${btnPrimary} mt-3 justify-center py-3.5 transition-[transform,opacity,background-color] duration-200 ease-out motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
              }`}
            >
              Get in touch
            </a>
          </Container>
        </div>
      </div>
    </header>
  );
}
