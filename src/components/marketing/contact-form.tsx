"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactState } from "@/app/actions";
import { Search, ArrowRight } from "./icons";
import { track } from "../posthog";

const fieldClass =
  "mt-2 w-full rounded-[11px] border-[1.5px] border-[#e2d6c5] bg-paper px-[15px] py-[13px] text-[15px] text-ink placeholder:text-[#a99a88] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: ContactState = { ok: false };

// Quiet entrance for the success state: the check draws in, then the text
// rises. Gated on prefers-reduced-motion so it renders static for opt-outs.
const sentStyles = `
  @media (prefers-reduced-motion: no-preference) {
    @keyframes csPop {
      from { transform: scale(0.6); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes csDraw { to { stroke-dashoffset: 0; } }
    @keyframes csRise {
      from { transform: translateY(8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .cs-pop { animation: csPop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1.2) both; }
    .cs-check path {
      stroke-dasharray: 24;
      stroke-dashoffset: 24;
      animation: csDraw 0.4s 0.25s ease-out forwards;
    }
    .cs-rise { opacity: 0; animation: csRise 0.5s ease-out both; }
  }
`;

// A single light that travels around the first intent option's border, purely
// an affordance that says "these are tappable". It's an SVG rounded-rect stroke
// with a moving dash: stroke-dashoffset animates along the real path length, so
// the light keeps a constant speed through the corners (a conic sweep surges
// and stalls on a wide rectangle). pathLength normalizes the dash math so it's
// size-independent, and the geometry is set in CSS so it tracks the button.
// Stops for good once the user engages the list; nothing for reduced-motion.
const glowStyles = `
  @media (prefers-reduced-motion: no-preference) {
    @keyframes csTrace {
      to { stroke-dashoffset: -100; }
    }
    .cs-glow {
      position: relative;
      box-shadow: 0 12px 28px -20px rgba(193, 89, 47, 0.35);
    }
    .cs-trace {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }
    .cs-trace rect {
      x: 1px;
      y: 1px;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      rx: 11px;
      ry: 11px;
      fill: none;
      stroke: #e0a079;
      stroke-width: 1.6px;
      stroke-linecap: round;
      stroke-dasharray: 24 76;
      filter: drop-shadow(0 0 3px rgba(216, 120, 66, 0.45));
      animation: csTrace 3.6s linear infinite;
    }
  }
`;

const REFERRAL_SOURCE = "Someone referred me";

const INTENTS = [
  "a brand-new website",
  "a redesign of my current site",
  "an online store",
  "someone to just handle it all",
  "not sure yet, help me figure it out",
];
const BUSINESS_TYPES = [
  "Trades / services",
  "Health / wellness",
  "Shop / retail",
  "Restaurant / cafe",
  "Creative / personal",
  "Something else",
];
const GOALS = [
  "Bring in more customers",
  "Take bookings & inquiries",
  "Sell online",
  "Look more professional",
  "Show my work",
];

// Distinct hover (lifts, light tint) vs selected (coral fill), so a hovered
// option never looks pre-selected.
const optOff =
  "cursor-pointer border-[#e2d6c5] bg-paper text-ink hover:-translate-y-0.5 hover:border-accent hover:bg-[#fdf3ee] hover:shadow-[0_12px_24px_-16px_rgba(120,70,40,0.55)]";
const rowBase =
  "group flex w-full items-center justify-between rounded-xl border-[1.5px] px-5 py-[17px] text-left text-[16px] transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0";
// Full-width rows on mobile, square-ish tiles from sm up.
const tileBase =
  "group flex items-center rounded-xl border-[1.5px] px-5 py-[17px] text-left text-[16px] transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-[168px] sm:justify-center sm:px-3 sm:py-3 sm:text-center sm:text-[15px]";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  // The wizard is client-side state; only the final step submits the form.
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [goal, setGoal] = useState("");
  const [source, setSource] = useState("");
  const isReferral = source === REFERRAL_SOURCE;

  // The first-option "tap me" glow hides while the user is engaging the intent
  // list, then returns after a stretch of no interaction so it keeps nudging.
  const [showGlow, setShowGlow] = useState(true);
  const glowTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideGlow = () => {
    if (glowTimer.current) clearTimeout(glowTimer.current);
    setShowGlow(false);
  };
  const restoreGlowSoon = () => {
    if (glowTimer.current) clearTimeout(glowTimer.current);
    glowTimer.current = setTimeout(() => setShowGlow(true), 10000);
  };
  useEffect(() => () => clearTimeout(glowTimer.current), []);

  // Funnel end: a successful send, or a server-side failure worth watching.
  useEffect(() => {
    if (state.ok) track("contact_submitted", { intent, businessType, goal });
  }, [state.ok]);
  useEffect(() => {
    if (state.error) track("contact_submit_failed", { error: state.error });
  }, [state.error]);

  // Measure the content so the box height animates when it changes (e.g. the
  // referral field appearing). A min-height on the inner keeps steps a
  // consistent size so they don't jump between one another.
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const showChrome = step > 0 && !state.ok;

  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-[18px] bg-paper transition-[height] duration-300 ease-out motion-reduce:transition-none"
    >
      <div ref={inner} className="flex flex-col" style={{ minHeight: 531 }}>
        {showChrome && (
          <div className="px-[30px] pt-6">
            <div className="flex items-center justify-between text-[12px] font-medium text-muted">
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1 transition-colors hover:text-ink"
              >
                <span aria-hidden="true">&lsaquo;</span> Back
              </button>
              <span>Step {step + 1} of 4</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                style={{ width: `${((step + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-1 items-center px-[30px] py-8">
          <div className="w-full">
            {state.ok ? (
              <div className="flex flex-col items-center text-center">
                <style>{sentStyles}</style>
                <div className="cs-pop flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                  <svg
                    className="cs-check h-8 w-8 text-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path
                      d="m5 13 4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="cs-rise mt-6 font-serif text-[26px] font-medium text-ink"
                  style={{ animationDelay: "0.15s" }}
                >
                  Message sent.
                </h3>
                <p
                  className="cs-rise mt-3 max-w-[320px] text-[15px] leading-[1.55] text-muted"
                  style={{ animationDelay: "0.24s" }}
                >
                  Thanks for reaching out. I&rsquo;ll get back to you as soon as
                  I can.
                </p>
              </div>
            ) : step === 0 ? (
              <div>
                <style>{glowStyles}</style>
                <div className="flex items-center gap-3 rounded-[13px] border-[1.5px] border-[#e2d6c5] bg-paper px-[18px] py-[17px] shadow-[0_10px_26px_-20px_rgba(120,70,40,0.4)]">
                  <Search size={20} className="shrink-0 text-[#a99a88]" />
                  <span className="translate-y-[2.5px] font-serif text-[21px] leading-none text-ink">
                    I&rsquo;m looking for<span className="text-faint">…</span>
                  </span>
                </div>
                <p className="mt-3 text-[13px] text-muted">
                  Tap the closest match, we&rsquo;ll get into the details next.
                </p>
                <div
                  className="mt-4 flex flex-col gap-3"
                  onMouseEnter={hideGlow}
                  onMouseLeave={restoreGlowSoon}
                  onFocus={hideGlow}
                  onBlur={restoreGlowSoon}
                >
                  {INTENTS.map((o, i) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => {
                        if (step === 0 && !intent) track("contact_started");
                        track("contact_intent_selected", { intent: o });
                        setIntent(o);
                        setStep(1);
                      }}
                      className={`${rowBase} ${optOff} ${
                        i === 0 && showGlow ? "cs-glow" : ""
                      }`}
                    >
                      {i === 0 && showGlow && (
                        <svg aria-hidden="true" className="cs-trace">
                          <rect pathLength={100} />
                        </svg>
                      )}
                      <span>{o}</span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-[#9a8c7b] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : step === 1 ? (
              <div>
                <h3 className="font-serif text-[23px] font-medium text-ink">
                  What kind of business are you?
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {BUSINESS_TYPES.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => {
                        track("contact_business_selected", { businessType: o });
                        setBusinessType(o);
                        setStep(2);
                      }}
                      className={`${tileBase} ${optOff}`}
                    >
                      <span className="flex-1">{o}</span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-[#9a8c7b] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent sm:hidden"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : step === 2 ? (
              <div>
                <h3 className="font-serif text-[23px] font-medium text-ink">
                  What&rsquo;s the main goal?
                </h3>
                <div className="mt-6 flex flex-col gap-3">
                  {GOALS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => {
                        track("contact_goal_selected", { goal: o });
                        setGoal(o);
                        setStep(3);
                      }}
                      className={`${rowBase} ${optOff}`}
                    >
                      <span>{o}</span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-[#9a8c7b] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form action={action}>
                <div className="hidden" aria-hidden="true">
                  <label>
                    Company
                    <input name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <input type="hidden" name="need" value={intent} />
                <input type="hidden" name="businessType" value={businessType} />
                <input type="hidden" name="goal" value={goal} />

                <h3 className="font-serif text-[23px] font-medium text-ink">
                  Last thing, how do I reach you?
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="name">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className={fieldClass}
                      type="text"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      required
                      className={fieldClass}
                      type="email"
                      placeholder="jane@yourbusiness.com"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass} htmlFor="business">
                    Business name{" "}
                    <span className="font-medium text-[#a99a88]">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="business"
                    name="business"
                    className={fieldClass}
                    type="text"
                    placeholder="Your business"
                  />
                </div>
                <div className="mt-4">
                  <label className={labelClass} htmlFor="source">
                    How did you hear about me?{" "}
                    <span className="font-medium text-[#a99a88]">
                      (optional)
                    </span>
                  </label>
                  <select
                    id="source"
                    name="source"
                    className={fieldClass}
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>{REFERRAL_SOURCE}</option>
                    <option>Google or another search</option>
                    <option>Instagram or Facebook</option>
                    <option>I saw a website you built</option>
                    <option>Somewhere else</option>
                  </select>
                </div>
                {isReferral && (
                  <div className="mt-4">
                    <label className={labelClass} htmlFor="referredBy">
                      Who referred you?
                    </label>
                    <input
                      id="referredBy"
                      name="referredBy"
                      className={fieldClass}
                      type="text"
                      placeholder="Their name or business"
                    />
                  </div>
                )}
                <div className="mt-4">
                  <label className={labelClass} htmlFor="message">
                    Any other details?{" "}
                    <span className="font-medium text-[#a99a88]">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={fieldClass}
                    rows={3}
                    placeholder="A website you like, your timeline, your rough budget."
                  />
                </div>

                {state.error && (
                  <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
                    {state.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="mt-5 w-full rounded-xl bg-accent px-6 py-[15px] text-base font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
                >
                  {pending ? "Sending..." : "Send"}
                </button>
                <p className="mt-3 text-center text-[13px] text-muted">
                  No spam, no pressure. Just a real reply from me.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
