import { Container, btnPrimary, btnGhost } from "./ui";
import { Search, ArrowRight } from "./icons";

const weaveTile =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cg stroke='%23d8c1a6' stroke-width='1.3' stroke-linecap='round' opacity='0.16'%3E%3Cline x1='4' y1='6' x2='20' y2='6'/%3E%3Cline x1='4' y1='12' x2='20' y2='12'/%3E%3Cline x1='4' y1='18' x2='20' y2='18'/%3E%3Cline x1='30' y1='4' x2='30' y2='20'/%3E%3Cline x1='36' y1='4' x2='36' y2='20'/%3E%3Cline x1='42' y1='4' x2='42' y2='20'/%3E%3Cline x1='6' y1='28' x2='6' y2='44'/%3E%3Cline x1='12' y1='28' x2='12' y2='44'/%3E%3Cline x1='18' y1='28' x2='18' y2='44'/%3E%3Cline x1='28' y1='30' x2='44' y2='30'/%3E%3Cline x1='28' y1='36' x2='44' y2='36'/%3E%3Cline x1='28' y1='42' x2='44' y2='42'/%3E%3C/g%3E%3C/svg%3E\")";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
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
      <Container className="relative flex flex-col items-center py-[92px] text-center">
        <h1 className="max-w-[900px] text-balance font-serif text-[68px] font-medium leading-[1.04] tracking-[-0.01em]">
          The website your business has been{" "}
          <em className="italic text-accent">searching</em> for.
        </h1>
        <p className="mt-6 max-w-[620px] text-[20px] leading-[1.55] text-muted">
          I design, build, and look after modern websites for small businesses.
          You get a site you&rsquo;re proud of, and you never have to think about
          keeping it running.
        </p>

        <div className="mt-10 flex w-full max-w-[680px] items-center gap-2.5 rounded-[18px] border-[1.5px] border-border-soft bg-paper py-2.5 pl-[22px] pr-2.5 shadow-[0_20px_40px_-24px_rgba(120,70,40,0.35)]">
          <Search size={22} strokeWidth={2.2} className="shrink-0 text-[#a99a88]" />
          <span className="flex-1 text-left font-mono text-[18px] text-[#3a3229]">
            a web person who actually sticks around
            <span className="ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-[2px] animate-caret bg-accent align-[-2px]" />
          </span>
          <a href="#contact" className={`${btnPrimary} px-6 py-3.5`}>
            Search
          </a>
        </div>

        <div className="mt-9 flex gap-3.5">
          <a href="#contact" className={`${btnPrimary} px-[30px] py-4 text-base`}>
            Get a free quote
            <ArrowRight size={16} />
          </a>
          <a href="#work" className={`${btnGhost} px-[26px] py-4 text-base`}>
            See recent work
          </a>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex">
            <span className="h-8 w-8 rounded-full border-2 border-ground bg-[#e8b04a]" />
            <span className="-ml-2.5 h-8 w-8 rounded-full border-2 border-ground bg-[#7fa77f]" />
            <span className="-ml-2.5 h-8 w-8 rounded-full border-2 border-ground bg-accent" />
          </div>
          <span className="text-[15px] text-muted">
            Loved by local business owners across [Your Area]
          </span>
        </div>
      </Container>
    </section>
  );
}
