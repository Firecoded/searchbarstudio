import { Container, Pill, btnGhost } from "./ui";

const blob =
  "radial-gradient(560px 360px at 100% 0%, rgba(217,138,94,0.16), transparent 66%), #f5ecdd";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border"
      style={{ background: blob }}
    >
      <Container className="grid grid-cols-1 items-center gap-14 py-[88px] lg:grid-cols-[0.8fr_1.2fr]">
        <div
          className="flex aspect-[1/1.05] items-center justify-center rounded-[20px] text-[14px] text-white"
          style={{ background: "linear-gradient(160deg,#e9c98a,#d98a5e)" }}
        >
          [Your photo]
        </div>
        <div>
          <Pill>About</Pill>
          <h2 className="mt-[18px] font-serif text-[40px] font-medium leading-[1.15]">
            Hi, I&rsquo;m [Your Name]. I build websites for people, not committees.
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-muted">
            SearchbarStudio is a one-person studio, which means you work directly
            with the person building your site, start to finish. No account
            managers, no hand-offs, no jargon. Just a site that does its job, and
            someone who genuinely cares that it keeps doing it. And because
            I&rsquo;m a senior full-stack developer, if your project ever needs
            more than a website, I can build that too.
          </p>
          <a href="#contact" className={`${btnGhost} mt-7`}>
            Get in touch
          </a>
        </div>
      </Container>
    </section>
  );
}
