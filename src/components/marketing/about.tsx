import Image from "next/image";
import { Container, Pill } from "./ui";
import { Reveal } from "./reveal";
import { TrackedLink } from "../tracked-link";
import founder from "../../../public/founder.png";

const blob =
  "radial-gradient(560px 360px at 100% 0%, rgba(217,138,94,0.16), transparent 66%), #f5ecdd";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border"
      style={{ background: blob }}
    >
      <Container className="py-16 sm:py-[88px] lg:py-[120px]">
        <Reveal
          stagger
          className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
        >
        <div
          className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[20px] shadow-sm sm:max-w-[320px] lg:mx-0 lg:max-w-none"
          style={{
            background:
              "radial-gradient(78% 62% at 50% 26%, #f6e4c8 0%, #ecca9c 52%, #dcab77 100%)",
          }}
        >
          <Image
            src={founder}
            alt="Jacob Taylor, founder of Searchbar Studio"
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[1/1.05] w-full object-cover object-top"
          />
        </div>
        <div>
          <Pill>About</Pill>
          <h2 className="mt-[18px] font-serif text-[30px] font-medium leading-[1.15] sm:text-[36px] lg:text-[40px]">
            Hi, I&rsquo;m Jacob. I handle your website end to end, so you can get
            back to running your business.
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-muted">
            I&rsquo;m a senior software engineer with ten years of experience
            building websites and web apps for startups and large companies.
            Over the years, I watched friends and family pay too much for
            websites they couldn&rsquo;t update themselves, or spend hours
            trying to build one themselves that still didn&rsquo;t look or work
            the way they wanted.
          </p>
          <p className="mt-4 text-[18px] leading-[1.6] text-muted">
            They kept coming to me for help, so I started Searchbar Studio to do
            the same for other small business owners.
          </p>
          <p className="mt-4 text-[18px] leading-[1.6] text-muted">
            You work directly with me, and I build you a website you&rsquo;re
            proud to show your clients. You can easily update your content from a
            simple dashboard, or just send me a request and I&rsquo;ll handle it
            for you.
          </p>
          <p className="mt-4 text-[18px] leading-[1.6] text-muted">
            I&rsquo;m based in Tempe, working with businesses across the Phoenix
            metro and clients anywhere in the U.S.
          </p>
          <TrackedLink
            href="#contact"
            event="cta_clicked"
            eventProps={{ location: "about" }}
            className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            Get in touch
            <span aria-hidden="true">&rarr;</span>
          </TrackedLink>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
