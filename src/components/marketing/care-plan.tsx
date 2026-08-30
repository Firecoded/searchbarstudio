import { Container, Pill, btnPrimary } from "./ui";
import { Reveal } from "./reveal";
import { Check } from "./icons";

const promises = [
  "Hosting, security & daily backups",
  "Edits handled for you, from your support hours",
  "Your own dashboard for billing & requests",
];

const included = [
  "Managed hosting & SSL",
  "Updates, backups & monitoring",
  "Support hours built in",
  "One simple invoice, on auto-pay",
];

const rings =
  "radial-gradient(circle at 90% 16%, transparent 88px, rgba(230,183,159,0.10) 90px, rgba(230,183,159,0.10) 92px, transparent 94px), radial-gradient(circle at 90% 16%, transparent 148px, rgba(230,183,159,0.07) 150px, rgba(230,183,159,0.07) 152px, transparent 154px), #2a2117";

export function CarePlan() {
  return (
    <section id="care" className="scroll-mt-20 bg-espresso" style={{ background: rings }}>
      <Container className="py-16 sm:py-[88px]">
        <Reveal
          stagger
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-[60px]"
        >
        <div>
          <Pill tone="dark">The care plan</Pill>
          <h2 className="mt-[18px] font-serif text-[32px] font-medium leading-[1.1] text-[#fbf5ee] sm:text-[40px] lg:text-[46px]">
            Build it once. Kept running, forever.
          </h2>
          <p className="mt-5 max-w-[470px] text-[18px] leading-[1.6] text-[#c3b4a5]">
            Most people build your site and disappear. I stick around. A simple
            monthly plan keeps everything fast, secure, and up to date, and means
            I&rsquo;m one message away whenever you need something.
          </p>
          <div className="mt-7 flex flex-col gap-3.5">
            {promises.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <Check size={20} strokeWidth={2.3} className="text-[#e6b79f]" />
                <span className="text-base text-[#e5dacd]">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] bg-[#fbf5ee] p-[38px]">
          <h3 className="font-serif text-[26px] font-medium">Simple monthly plans</h3>
          <p className="mt-2 text-[15px] text-muted">
            Priced to fit your site and how hands-on you want me. No lock-in,
            cancel anytime.
          </p>
          <div className="my-6 h-px bg-border" />
          <div className="flex flex-col gap-3.5">
            {included.map((i) => (
              <div key={i} className="flex items-center gap-2.5 text-[15px]">
                <Check size={17} strokeWidth={2.6} className="text-accent" />
                {i}
              </div>
            ))}
          </div>
          <a href="#contact" className={`${btnPrimary} mt-7 w-full justify-center py-[15px]`}>
            Get a quote
          </a>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
