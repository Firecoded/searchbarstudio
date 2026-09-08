"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Container, Pill } from "./ui";
import { Reveal } from "./reveal";

const steps = [
  {
    n: "1",
    title: "Say hello",
    body: "Send a quick note about your business. I'll get back to you with a few questions and some initial ideas.",
  },
  {
    n: "2",
    title: "Plan & build",
    body: "I turn your ideas into a clear plan and price. We shake hands, I start building, and we work together to get it perfect.",
  },
  {
    n: "3",
    title: "Live & cared for",
    body: "We go live, and your care plan keeps it running while you run your business.",
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  // Desktop follows scroll state (draws in view, retracts on the way back up);
  // mobile latches once so it never reverses.
  const [inView, setInView] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        setInView(visible);
        if (visible) setHasDrawn(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-connector stagger: line then arrowhead, next connector after.
  const lineDelay = (i: number) => 0.2 + i * 0.85;
  const headDelay = (i: number) => lineDelay(i) + 0.65;
  const drawnDesktop = inView ? " drawn" : "";
  const drawnMobile = hasDrawn ? " drawn" : "";

  return (
    <section className="pt-16 sm:pt-24 lg:pt-[120px]">
      <Container>
        <Reveal>
          <Pill>How it works</Pill>
          <h2 className="mt-[18px] font-serif text-[30px] font-medium sm:text-[38px] lg:text-[44px]">
            Three steps, no surprises.
          </h2>
        </Reveal>
      </Container>
      <Container className="mt-9 pb-16 sm:pb-24 lg:pb-[120px]">
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-start">
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <Fragment key={s.n}>
                <div className="flex flex-col items-center text-center sm:block sm:flex-1 sm:text-left">
                  {/* Number paired with the connector that bridges to the next
                      number, so the arrow visibly runs circle-to-circle. */}
                  <div className="flex items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-[20px] font-semibold text-accent">
                      {s.n}
                    </div>
                    {!last && (
                      <span className="relative mx-14 hidden h-[1.5px] flex-1 sm:block">
                        <span
                          className={`proc-line absolute inset-0 rounded-full${drawnDesktop}`}
                          style={{
                            backgroundColor: "#d89a78",
                            transitionDelay: `${lineDelay(i)}s`,
                          }}
                        />
                        <svg
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className={`proc-head absolute -right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2${drawnDesktop}`}
                          style={{
                            color: "#c8794e",
                            transitionDelay: `${headDelay(i)}s`,
                          }}
                        >
                          <path d="M3 1 L7 5 L3 9" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-[21px] font-medium">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-muted">
                    {s.body}
                  </p>
                </div>

                {/* Mobile: a vertical connector down the stack, under the
                    number. */}
                {!last && (
                  <div className="flex justify-center py-3 sm:hidden">
                    <span className="relative h-14 w-[1.5px]">
                      <span
                        className={`proc-vline absolute inset-0 rounded-full${drawnMobile}`}
                        style={{
                          backgroundColor: "#d89a78",
                          transitionDelay: `${lineDelay(i)}s`,
                        }}
                      />
                      <svg
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`proc-head absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2${drawnMobile}`}
                        style={{
                          color: "#c8794e",
                          transitionDelay: `${headDelay(i)}s`,
                        }}
                      >
                        <path d="M1 3 L5 7 L9 3" />
                      </svg>
                    </span>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
