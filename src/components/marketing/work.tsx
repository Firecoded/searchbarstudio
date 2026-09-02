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
  image?: string;
  href?: string;
  detail: string;
  ask: string;
  built: string;
  result: string;
};

const projects: Project[] = [
  {
    tag: "Live musician",
    name: "Ashley Downie",
    blurb:
      "A golden-hour booking site for an Arizona cover artist, with videos, show dates, and a book-a-set form.",
    gradient: "linear-gradient(150deg,#e8b04a,#f0cd82)",
    image: "/work/ashleydownie.jpg",
    href: "https://ashleydownie.com/sings/",
    detail:
      "A warm, desert-toned site for an Arizona cover musician, built to turn fans and venue owners into booked sets. The homepage doubles as a split landing that routes visitors to her music or her Phoenix real-estate side.",
    ask: "A site that shows what she's about and makes it effortless for bars, restaurants, and event planners to book her.",
    built:
      "A photo-forward site with videos, a live shows calendar, set lists, and a contact form to book a set or request a song.",
    result:
      "A professional website she can add to her marketing that elevates her online presence and leads to more bookings.",
  },
  {
    tag: "Solo guitarist",
    name: "Mark Taylor Plays",
    blurb:
      "A refined site for a solo jazz guitarist, with video samples, a gallery, set list, and a contact form.",
    gradient: "linear-gradient(150deg,#7fa77f,#a9c8a4)",
    image: "/work/marktaylor.jpg",
    href: "https://www.marktaylorplays.com/",
    detail:
      "An elegant, understated site for a Phoenix solo jazz guitarist who plays restaurant lounges, resorts, and upscale events. Built to convey a refined, unobtrusive ambiance and make booking effortless.",
    ask: "Present an upscale, polished image and make it easy for hotels, resorts, and event planners to book him.",
    built:
      "A clean site with video samples, a photo gallery, set list, testimonials, and a contact form for booking.",
    result:
      "An elevated web presence that helps him stand out to high-end venues and land more gigs.",
  },
  {
    tag: "Photo gallery",
    name: "jacobshoots.pictures",
    blurb:
      "A fast travel photo gallery, filterable by place and style, built to stay quick with hundreds of images.",
    gradient: "linear-gradient(150deg,#d98a5e,#e8ab84)",
    image: "/work/jacobshoots.jpg",
    href: "https://jacobshoots.pictures/",
    detail:
      "A personal project and a bit of a playground: a masonry gallery for my travel photography, filterable by category and country, and tuned to load fast even with hundreds of full-size photos.",
    ask: "A fast, good-looking home for my photography that's easy to browse by place and style.",
    built:
      "A responsive masonry gallery with category and location filters, quick lightbox viewing, and lazy-loaded images for speed.",
    result:
      "A clean showcase for my work, and a sandbox where I try ideas that end up on client sites.",
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
              <div
                className="h-[205px] bg-cover bg-center"
                style={
                  p.image
                    ? { backgroundImage: `url(${p.image})` }
                    : { background: p.gradient }
                }
              />
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
            <div
              className="relative h-[240px] bg-cover bg-center"
              style={
                open.image
                  ? { backgroundImage: `url(${open.image})` }
                  : { background: open.gradient }
              }
            >
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
              <a
                href={open.href ?? "#"}
                target="_blank"
                rel="noreferrer"
                className={`${btnGhost} mt-7`}
              >
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
