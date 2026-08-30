import { Container, Pill } from "./ui";
import { Reveal } from "./reveal";

const steps = [
  {
    n: "1",
    title: "Say hello",
    body: "Send a message about your business. I reply with a simple plan and a fixed price.",
  },
  {
    n: "2",
    title: "Build & review",
    body: "I design and build your site, and we shape it together until it's right.",
  },
  {
    n: "3",
    title: "Live & cared for",
    body: "We go live, and your care plan keeps it running while you run your business.",
  },
];

export function Process() {
  return (
    <section className="pt-16 sm:pt-24">
      <Container>
        <Reveal>
          <Pill>How it works</Pill>
          <h2 className="mt-[18px] font-serif text-[30px] font-medium sm:text-[38px] lg:text-[44px]">
            Three steps, no surprises.
          </h2>
        </Reveal>
      </Container>
      <Container className="mt-9 pb-16 sm:pb-24">
        <Reveal
          stagger
          className="grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
        {steps.map((s) => (
          <div key={s.n}>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft font-serif text-[20px] font-semibold text-accent">
              {s.n}
            </div>
            <h3 className="mt-4 text-[21px] font-medium">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.55] text-muted">{s.body}</p>
          </div>
        ))}
        </Reveal>
      </Container>
    </section>
  );
}
