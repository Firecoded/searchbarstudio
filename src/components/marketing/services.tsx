"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Pill, btnGhost } from "./ui";
import { Reveal } from "./reveal";
import { DesignRuler, Shield, Search, Pencil, Code } from "./icons";
import { TrackedLink } from "../tracked-link";

type Service = {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
};

const services: Service[] = [
  {
    Icon: DesignRuler,
    title: "Design & build",
    body: "A custom site that looks the part and loads fast, built to fit your business, not a template.",
  },
  {
    Icon: Shield,
    title: "Hosting & upkeep",
    body: "Fast, secure hosting plus updates, backups, and monitoring, all handled in the background.",
  },
  {
    Icon: Search,
    title: "Getting found",
    body: "SEO done properly, so the people who need you can find you easily.",
  },
  {
    Icon: Pencil,
    title: "Easy Updates",
    body: "Update your website content through a simple dashboard, or I can handle it for you.",
  },
];

// True while at least half of `ref` is on screen, so each icon draws as its
// own card scrolls into view (and retracts on the way back up).
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0].isIntersecting),
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

// The accent-tinted icon tile whose strokes draw themselves in (.svc-icon).
function IconTile({
  Icon,
  drawn,
  className = "",
}: {
  Icon: Service["Icon"];
  drawn: boolean;
  className?: string;
}) {
  return (
    <div
      className={`svc-icon flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft${
        drawn ? " drawn" : ""
      } ${className}`}
    >
      <Icon size={24} className="text-accent" />
    </div>
  );
}

function ServiceCard({ Icon, title, body }: Service) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useInView(ref);

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-ground p-7">
      <IconTile Icon={Icon} drawn={drawn} />
      <h3 className="mt-5 text-[21px] font-medium">{title}</h3>
      <p className="mt-2.5 text-[15px] leading-[1.55] text-muted">{body}</p>
    </div>
  );
}

// The "need more" bar gets the same tile, drawn in as the bar comes into view.
function MoreCard() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useInView(ref);

  return (
    <div
      ref={ref}
      className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-ground px-7 py-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4 sm:items-center">
        <IconTile Icon={Code} drawn={drawn} className="shrink-0" />
        <div>
          <h3 className="text-[20px] font-medium">Need more than a website?</h3>
          <p className="mt-1 text-[15px] text-muted">
            Booking systems, customer portals, mobile apps, custom tools. If it
            runs on the web, I can build it.
          </p>
        </div>
      </div>
      <TrackedLink
        href="#contact"
        event="cta_clicked"
        eventProps={{ location: "services" }}
        className={`${btnGhost} shrink-0`}
      >
        Let&rsquo;s talk
      </TrackedLink>
    </div>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-20 border-y border-border bg-paper py-16 sm:py-24 lg:py-[120px]"
    >
      <Container>
        <Reveal>
          <Pill>What I do</Pill>
          <h2 className="mt-[18px] font-serif text-[30px] font-medium sm:text-[38px] lg:text-[44px]">
            Everything your website needs, start to finish.
          </h2>
        </Reveal>
      </Container>
      <Container className="mt-8 sm:mt-9">
        <Reveal
          stagger
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </Reveal>
      </Container>
      <Container className="pt-5">
        <Reveal>
          <MoreCard />
        </Reveal>
      </Container>
    </section>
  );
}
