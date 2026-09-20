import Image from "next/image";
import { Container, Pill, btnPrimary, btnGhost } from "./ui";
import { ArrowRight } from "./icons";
import { TrackedLink } from "../tracked-link";
import laptop from "../../../public/hero/laptop.webp";
import phone from "../../../public/hero/phone.webp";

const weaveTile =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cg stroke='%23d8c1a6' stroke-width='1.3' stroke-linecap='round' opacity='0.16'%3E%3Cline x1='4' y1='6' x2='20' y2='6'/%3E%3Cline x1='4' y1='12' x2='20' y2='12'/%3E%3Cline x1='4' y1='18' x2='20' y2='18'/%3E%3Cline x1='30' y1='4' x2='30' y2='20'/%3E%3Cline x1='36' y1='4' x2='36' y2='20'/%3E%3Cline x1='42' y1='4' x2='42' y2='20'/%3E%3Cline x1='6' y1='28' x2='6' y2='44'/%3E%3Cline x1='12' y1='28' x2='12' y2='44'/%3E%3Cline x1='18' y1='28' x2='18' y2='44'/%3E%3Cline x1='28' y1='30' x2='44' y2='30'/%3E%3Cline x1='28' y1='36' x2='44' y2='36'/%3E%3Cline x1='28' y1='42' x2='44' y2='42'/%3E%3C/g%3E%3C/svg%3E\")";

const arrowStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// A handwritten note with a sketched arrow, pinned around the device mockup
// on desktop. The arrow follows the text; `className` sets the flex direction
// so it can sit below (column) or beside (row) the words. `delay` is when
// this note's intro starts (text wipe, then arrow draw); see .hero-note-text.
function Note({
  children,
  className,
  arrow,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  arrow: React.ReactNode;
  delay: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-10 hidden ${className}`}
      style={{ "--note-delay": delay } as React.CSSProperties}
    >
      <span className="hero-note-text font-hand text-[22px] font-bold uppercase leading-[1.05] tracking-wide text-ink">
        {children}
      </span>
      {arrow}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[min(80svh,900px)] items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[2600px] w-[2600px] -translate-x-1/2 -translate-y-1/2 rotate-45"
        style={{ backgroundImage: weaveTile, backgroundSize: "54px 54px" }}
      />
      {/* Fades the weave out behind the copy so the words sit on clean
          paper; positioned per breakpoint in .hero-glow. */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      {/* A little extra bottom padding at lg+ makes room for the note tucked
          under the laptop, without pushing the device block up. */}
      <Container className="relative z-10 py-16 sm:py-20 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Copy column. Centered when stacked, left-aligned beside the
              device on desktop. Its children pick up the rise-in stagger. */}
          <div className="hero-rise @container flex flex-col items-center text-center lg:items-start lg:text-left">
            <Pill>Your search ends here</Pill>
            {/* From lg the size tracks the copy column (cqw), tuned so the
                longer first sentence holds a single line and the headline
                sits on two lines; capped at 56px. Mobile stays at 40px and
                wraps to three, since two lines there would mean tiny type. */}
            <h1 className="mt-5 max-w-[620px] text-balance font-serif text-[40px] font-medium leading-[1.06] tracking-[-0.01em] sm:text-[54px] lg:text-[clamp(2.5rem,10.4cqw,3.5rem)] lg:leading-[1.04]">
              A website you&rsquo;ll love.
              {/* Second sentence on its own line so the two never share one. */}
              <span className="block">None of the hassle.</span>
            </h1>
            <p className="mt-5 max-w-[540px] text-[17px] leading-[1.6] text-muted sm:text-[19px]">
              I design and build modern, mobile-friendly websites that look
              great, bring in customers, and are easy for you to update. You
              focus on your business, I&rsquo;ll handle the rest.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-3.5">
              <TrackedLink
                href="#contact"
                event="cta_clicked"
                eventProps={{ location: "hero" }}
                className={`${btnPrimary} justify-center px-[30px] py-4 text-base`}
              >
                Get started
                <ArrowRight size={16} />
              </TrackedLink>
              <TrackedLink
                href="#work"
                event="cta_clicked"
                eventProps={{ location: "hero_secondary" }}
                className={`${btnGhost} justify-center px-[26px] py-4 text-base`}
              >
                See recent work
              </TrackedLink>
            </div>
          </div>

          {/* Device mockup: the laptop is the base, the phone is anchored to
              its lower-right and overlaps it. The wrapper's box is just the
              laptop, so it centers on the copy column; the phone's overhang
              and the note below it overflow into the hero's bottom padding.
              From 2xl the whole thing grows and bleeds right (see
              .hero-device in globals.css). */}
          {/* Below lg the group is nudged left by a few percent of its own
              width: the angled laptop and the phone both carry their visual
              weight on the right, so box-centered reads off-center. */}
          <div className="hero-device hero-fade-graphic relative mx-auto w-[95%] max-w-[560px] -translate-x-[3%] lg:w-full lg:max-w-none lg:translate-x-0">
            <Image
              src={laptop}
              alt="A landscaping company's website shown on a laptop"
              priority
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="h-auto w-full"
            />

            {/* Phone overlapping the laptop's lower-right. The note is
                anchored to the phone in pixels so the arrow lands in the same
                spot at every width. */}
            <div className="hero-phone absolute bottom-[-4%] right-0 w-[22%] lg:right-[-3%]">
              <Image
                src={phone}
                alt=""
                aria-hidden
                priority
                sizes="(min-width: 1024px) 13vw, 22vw"
                className="h-auto w-full"
              />
              {/* Words sit down-left of the phone, below the laptop base; the
                  arrow runs right from them, then sweeps up to point at the
                  phone's underside about a third of the way across. */}
              <Note
                className="right-[52%] top-full mt-1 w-max -rotate-3 flex-row items-end gap-1 lg:flex"
                delay="1.8s"
                arrow={
                  <svg
                    viewBox="0 0 72 72"
                    {...arrowStroke}
                    className="h-[72px] w-[72px] text-accent"
                  >
                    <path
                      d="M4 66C34 72 64 50 64 22"
                      pathLength={100}
                      className="hero-arrow-line"
                    />
                    <path d="M54 32l10-10 10 10" className="hero-arrow-head" />
                  </svg>
                }
              >
                Looks great
                <br />
                on any device
              </Note>
            </div>

            {/* Above-left of the laptop; the arrow curves down and to the right
                into the screen. */}
            <Note
              className="left-[3%] top-[-9%] -rotate-6 flex-col items-start lg:flex"
              delay="1.5s"
              arrow={
                <svg
                  viewBox="0 0 64 64"
                  {...arrowStroke}
                  className="ml-9 h-16 w-16 text-accent"
                >
                  <path
                    d="M8 6c6 18 18 34 44 48"
                    pathLength={100}
                    className="hero-arrow-line"
                  />
                  <path d="M40 56l13-1-3-13" className="hero-arrow-head" />
                </svg>
              }
            >
              Clean design
              <br />
              that converts
            </Note>
          </div>
        </div>
      </Container>

      <a
        href="#services"
        aria-label="Scroll to see what I do"
        className="group absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="hero-scroll-chevron h-7 w-7 text-[#a99a88] transition-colors group-hover:text-accent"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
