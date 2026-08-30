"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";

const fieldClass =
  "mt-2 w-full rounded-[11px] border-[1.5px] border-[#e2d6c5] bg-paper px-[15px] py-[13px] text-[15px] text-ink placeholder:text-[#a99a88] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: ContactState = { ok: false };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  if (state.ok) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[18px] bg-paper p-[30px] text-center">
        <h3 className="font-serif text-[26px] font-medium text-ink">
          Message sent.
        </h3>
        <p className="mt-3 max-w-[300px] text-[15px] leading-[1.55] text-muted">
          Thanks for reaching out. I&rsquo;ll get back to you as soon as I can.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-[18px] bg-paper p-[30px]">
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
          <select id="need" name="need" className={fieldClass} defaultValue="">
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
  );
}
