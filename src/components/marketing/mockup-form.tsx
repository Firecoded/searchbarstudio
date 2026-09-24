"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { submitMockupRequest, type ContactState } from "@/app/actions";
import { track } from "../posthog";

const fieldClass =
  "mt-2 w-full rounded-[11px] border-[1.5px] border-[#e2d6c5] bg-paper px-[15px] py-[13px] text-[15px] text-ink placeholder:text-[#a99a88] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";
const optional = (
  <span className="font-medium text-[#a99a88]">(optional)</span>
);

const GOALS = [
  "Get more calls and quote requests",
  "Take bookings or appointments",
  "Look more professional than competitors",
  "Show off my work",
  "Not sure, help me figure it out",
];

const initialState: ContactState = { ok: false };

export function MockupForm() {
  const [state, action, pending] = useActionState(
    submitMockupRequest,
    initialState,
  );

  const started = useRef(false);
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("mockup_form_started");
  };

  useEffect(() => {
    if (state.ok) track("mockup_request_submitted");
  }, [state.ok]);
  useEffect(() => {
    if (state.error) track("mockup_request_failed", { error: state.error });
  }, [state.error]);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center rounded-[18px] bg-paper px-6 py-14 text-center shadow-[0_24px_60px_-34px_rgba(120,70,40,0.5)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
          <svg
            className="h-8 w-8 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-6 font-serif text-[28px] font-medium text-ink">
          Got it, thanks.
        </h2>
        <p className="mt-3 max-w-[360px] text-[15px] leading-[1.6] text-muted">
          I&rsquo;ll look through what you sent and design your homepage.
          I&rsquo;ll text or email you when it&rsquo;s ready. A confirmation is
          on its way to your inbox.
        </p>
      </div>
    );
  }

  return (
    // Submitting via onSubmit instead of the action prop, because React resets
    // action-prop forms after every run, which would wipe the fields whenever
    // the server sends back a validation error.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      onFocus={markStarted}
      className="rounded-[18px] bg-paper px-[18px] py-7 shadow-[0_24px_60px_-34px_rgba(120,70,40,0.5)] sm:px-[30px] sm:py-8"
    >
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <h2 className="font-serif text-[24px] font-medium text-ink">
        Request your free mockup
      </h2>
      <p className="mt-1 text-[14px] text-muted">
        Takes about two minutes. Nothing to pay until you see it.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="business">
            Business name
          </label>
          <input id="business" name="business" required autoComplete="organization" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="480-555-0123"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="about">
          What does your business do, and where?
        </label>
        <textarea
          id="about"
          name="about"
          required
          rows={2}
          placeholder="Residential landscaping and irrigation in Mesa and Gilbert."
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="presence">
          Where can I find you online now? {optional}
        </label>
        <input
          id="presence"
          name="presence"
          placeholder="Google listing, Facebook, Instagram, or a current site"
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="goal">
          What should the site do for you?
        </label>
        <select id="goal" name="goal" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Pick the closest one
          </option>
          {GOALS.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="message">
          Anything else? {optional}
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Colors you like, a site you like, services to feature."
          className={fieldClass}
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
        {pending ? "Sending..." : "Get my free mockup"}
      </button>
      <p className="mt-3 text-center text-[13px] text-muted">
        No spam, no pressure. Just a real reply from me.
      </p>
    </form>
  );
}
