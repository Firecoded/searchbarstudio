"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactState } from "@/app/actions";

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

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  // Keep the outer box sized to whatever's inside (form or success) and let CSS
  // transition the height, so swapping to the success state glides instead of
  // jumping. The ResizeObserver also catches the form growing (e.g. an error).
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-[18px] bg-paper transition-[height] duration-500 ease-out motion-reduce:transition-none"
    >
      <div ref={inner}>
        {state.ok ? (
          <div className="flex flex-col items-center px-[30px] py-16 text-center">
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
              className="cs-rise mt-3 max-w-[300px] text-[15px] leading-[1.55] text-muted"
              style={{ animationDelay: "0.24s" }}
            >
              Thanks for reaching out. I&rsquo;ll get back to you as soon as I
              can.
            </p>
          </div>
        ) : (
          <form action={action} className="p-[30px]">
            <div className="hidden" aria-hidden="true">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="need">
                  What do you need?
                </label>
                <select
                  id="need"
                  name="need"
                  className={fieldClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option>New website</option>
                  <option>Website redesign</option>
                  <option>Web app</option>
                  <option>Mobile app</option>
                  <option>Care for an existing site</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="timeline">
                  Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  className={fieldClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option>Just exploring</option>
                  <option>In the next 1-3 months</option>
                  <option>As soon as possible</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass} htmlFor="site">
                Your current site, or one you like{" "}
                <span className="font-medium text-[#a99a88]">(optional)</span>
              </label>
              <input
                id="site"
                name="site"
                className={fieldClass}
                type="text"
                placeholder="yourbusiness.com, or a site whose style you love"
              />
            </div>
            <div className="mt-4">
              <label className={labelClass} htmlFor="source">
                How did you hear about me?{" "}
                <span className="font-medium text-[#a99a88]">(optional)</span>
              </label>
              <select
                id="source"
                name="source"
                className={fieldClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Select one
                </option>
                <option>A friend or past client</option>
                <option>Google search</option>
                <option>Instagram</option>
                <option>Somewhere else</option>
              </select>
            </div>
            <div className="mt-4">
              <label className={labelClass} htmlFor="message">
                A little about your project
              </label>
              <textarea
                id="message"
                name="message"
                required
                className={fieldClass}
                rows={3}
                placeholder="I run a small [type of business] and need a website that..."
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
              {pending ? "Sending..." : "Send message"}
            </button>
            <p className="mt-3 text-center text-[13px] text-muted">
              No spam, no pressure. Just a real reply from me.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
