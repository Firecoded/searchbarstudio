import Image from "next/image";
import { Container, Pill } from "./ui";
import { Reveal } from "./reveal";
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
      <Container className="py-16 sm:py-[88px]">
        <Reveal
          stagger
          className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
        >
        <div
          className="overflow-hidden rounded-[20px] shadow-sm"
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
            I&rsquo;m a senior software engineer with ten years building web apps
            for startups and corporations. Along the way I saw how often small
            businesses get overcharged for sites they can&rsquo;t update and
            never hear about again, so I started Searchbar Studio to do it
            differently: you work with me directly, I build it properly, and I
            stick around to keep it running. And if you ever need more than a
            website, I can build that too.
          </p>
          <p className="mt-4 text-[18px] leading-[1.6] text-muted">
            I&rsquo;m based in Tempe, working with businesses across the Phoenix
            metro and with clients anywhere online.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            Get in touch
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
