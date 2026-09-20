// Preview only: the flanking-illustrations hero, served at /v2 for
// side-by-side comparison. The live hero is ./hero.tsx.
import Image from "next/image";
import { btnPrimary, btnGhost } from "./ui";
import { Search, ArrowRight } from "./icons";
import { TrackedLink } from "../tracked-link";
import heroBrowser from "../../../public/hero/hero-browser.webp";
import heroPhone from "../../../public/hero/hero-phone.webp";

const weaveTile =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cg stroke='%23d8c1a6' stroke-width='1.3' stroke-linecap='round' opacity='0.16'%3E%3Cline x1='4' y1='6' x2='20' y2='6'/%3E%3Cline x1='4' y1='12' x2='20' y2='12'/%3E%3Cline x1='4' y1='18' x2='20' y2='18'/%3E%3Cline x1='30' y1='4' x2='30' y2='20'/%3E%3Cline x1='36' y1='4' x2='36' y2='20'/%3E%3Cline x1='42' y1='4' x2='42' y2='20'/%3E%3Cline x1='6' y1='28' x2='6' y2='44'/%3E%3Cline x1='12' y1='28' x2='12' y2='44'/%3E%3Cline x1='18' y1='28' x2='18' y2='44'/%3E%3Cline x1='28' y1='30' x2='44' y2='30'/%3E%3Cline x1='28' y1='36' x2='44' y2='36'/%3E%3Cline x1='28' y1='42' x2='44' y2='42'/%3E%3C/g%3E%3C/svg%3E\")";

export function HeroV2() {
  return (
    <section className="relative flex min-h-[80svh] items-start overflow-hidden xl:items-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[2600px] w-[2600px] -translate-x-1/2 -translate-y-1/2 rotate-45"
        style={{ backgroundImage: weaveTile, backgroundSize: "54px 54px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1040px 560px at 50% 48%, rgba(250,246,240,0.97), rgba(250,246,240,0.97) 34%, rgba(250,246,240,0) 76%)",
        }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:px-12 xl:grid-cols-[1fr_minmax(auto,680px)_1fr] xl:gap-14 2xl:max-w-[1900px]">
        <Image
          src={heroBrowser}
          alt=""
          aria-hidden
          sizes="(min-width: 1536px) 520px, (min-width: 1280px) 26vw, 1px"
          className="hero-fade-graphic hidden h-auto w-full max-w-[460px] justify-self-end xl:mr-[10px] xl:block 2xl:max-w-[540px]"
        />

        <div className="hero-rise flex w-full flex-col items-center py-16 text-center sm:py-20">
          <h1 className="max-w-[900px] text-balance font-serif text-[40px] font-medium leading-[1.06] tracking-[-0.01em] sm:text-[54px] lg:text-[68px] lg:leading-[1.04]">
            The website your business has been{" "}
            <em className="italic text-accent">searching</em> for.
          </h1>
          <div className="mt-10 flex w-full max-w-[680px] items-center gap-2.5 rounded-[18px] border-[1.5px] border-border-soft bg-paper px-4 py-4 shadow-[0_20px_40px_-24px_rgba(120,70,40,0.35)] sm:mt-20 sm:py-2.5 sm:pl-[22px] sm:pr-2.5">
            <Search size={22} strokeWidth={2.2} className="shrink-0 text-[#a99a88]" />
            <span className="flex min-w-0 flex-1 items-center text-left font-mono text-[14px] text-[#3a3229] sm:text-[16px] lg:text-[18px]">
              <span className="hero-type hero-type-full hidden sm:inline-block">
                someone to handle my website for me
              </span>
              <span className="hero-type hero-type-short inline-block sm:hidden">
                someone to handle my website
              </span>
              <span
                className="ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-[1px] animate-caret bg-accent"
                style={{ animationDelay: "2.9s" }}
              />
            </span>
            <TrackedLink
              href="#services"
              event="cta_clicked"
              eventProps={{ location: "hero_search" }}
              className="hidden shrink-0 items-center gap-2 rounded-xl bg-ink px-4 py-3 text-[15px] font-semibold text-paper transition-colors hover:bg-[#3a3229] sm:inline-flex sm:px-6 sm:py-3.5"
            >
              Search
            </TrackedLink>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-20 sm:w-auto sm:flex-row sm:gap-3.5">
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

          {/* Mobile and tablet: one graphic under the CTAs, since the side
              flanks only appear at xl. */}
          <Image
            src={heroPhone}
            alt=""
            aria-hidden
            sizes="(max-width: 1279px) 360px, 1px"
            className="hero-fade-graphic mt-10 h-auto w-full max-w-[360px] xl:hidden"
          />
        </div>

        <Image
          src={heroPhone}
          alt=""
          aria-hidden
          sizes="(min-width: 1280px) 22vw, 1px"
          className="hero-fade-graphic hidden h-auto w-[95%] justify-self-start xl:block"
        />
      </div>

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
