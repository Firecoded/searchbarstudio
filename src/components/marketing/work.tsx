"use client";

import { useState } from "react";
import { Container, Pill, btnGhost } from "./ui";
import { Reveal } from "./reveal";
import { ArrowRight, ArrowUpRight, Close } from "./icons";

type Project = {
  tag: string;
  name: string;
  blurb: string;
  gradient: string;
  detail: string;
  ask: string;
  built: string;
  result: string;
};

const projects: Project[] = [
  {
    tag: "Live musician",
    name: "[Project name]",
    blurb: "Booking site with dates, videos, and an inquiry form.",
    gradient: "linear-gradient(150deg,#e8b04a,#f0cd82)",
    detail:
      "A clean, photo-forward site for a working musician, built to turn a curious visitor into a booking.",
    ask: "Look professional and take bookings.",
    built: "A one-page site with dates, videos, and a simple inquiry form.",
    result: "Fewer back-and-forth DMs, more booked gigs.",
  },
  {
    tag: "Local shop",
    name: "[Project name]",
    blurb: "Storefront with online ordering and pickup.",
    gradient: "linear-gradient(150deg,#7fa77f,#a9c8a4)",
    detail: "A friendly storefront that lets regulars order ahead without a phone call.",
    ask: "Sell online without a clunky system.",
    built: "A simple shop with online ordering and local pickup.",
    result: "Orders roll in outside of open hours.",
  },
  {
    tag: "Service business",
    name: "[Project name]",
    blurb: "Lead-gen site with quote requests and reviews.",
    gradient: "linear-gradient(150deg,#d98a5e,#e8ab84)",
    detail:
      "A trust-building site for a local service business, designed to bring in qualified quote requests.",
    ask: "Get found and get more quote requests.",
    built: "A fast site with clear services, reviews, and a quote form.",
    result: "A steady stream of new enquiries.",
  },
];

export function Work() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="work" className="scroll-mt-20 pt-16 sm:pt-24">
      <Container>
        <Reveal>
          <Pill>Recent work</Pill>
          <h2 className="mt-[18px] font-serif text-[30px] font-medium sm:text-[38px] lg:text-[44px]">
            A few sites I&rsquo;ve built.
          </h2>
          <p className="mt-2.5 text-base text-muted">
            Click any project to see the story behind it.
          </p>
        </Reveal>
      </Container>

      <Container className="mt-9 pb-16 sm:pb-24">
        <Reveal
          stagger
          className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <button
              key={p.name + p.tag}
              onClick={() => setOpen(p)}
              className="group overflow-hidden rounded-[18px] border border-border bg-paper text-left transition-transform hover:-translate-y-1 hover:shadow-[0_18px_34px_-22px_rgba(120,70,40,0.4)]"
            >
              <div className="h-[205px]" style={{ background: p.gradient }} />
              <div className="p-[22px]">
                <div className="text-[13px] font-semibold text-muted">{p.tag}</div>
                <h3 className="mt-1.5 text-[21px] font-medium">{p.name}</h3>
                <p className="mt-2 text-[14px] text-muted">{p.blurb}</p>
                <div className="mt-3.5 flex items-center gap-1.5 text-[14px] font-semibold text-accent">
                  View project
                  <ArrowRight size={14} />
                </div>
              </div>
            </button>
          ))}
        </Reveal>
      </Container>

      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,20,12,0.55)] p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[720px] overflow-hidden rounded-[18px] border border-border bg-paper shadow-[0_40px_80px_-30px_rgba(20,12,6,0.6)]"
          >
            <div className="relative h-[240px]" style={{ background: open.gradient }}>
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/90 text-ink"
              >
                <Close size={18} />
              </button>
            </div>
            <div className="p-9">
              <div className="text-[13px] font-semibold text-muted">{open.tag}</div>
              <h3 className="mt-1.5 font-serif text-[30px] font-medium">{open.name}</h3>
              <p className="mt-3.5 text-base leading-[1.6] text-muted">{open.detail}</p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(
                  [
                    ["The ask", open.ask],
                    ["What I built", open.built],
                    ["The result", open.result],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[13px] font-semibold text-muted">{label}</div>
                    <div className="mt-1.5 text-[15px]">{value}</div>
                  </div>
                ))}
              </div>
              <a href="#" className={`${btnGhost} mt-7`}>
                Visit the live site
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
