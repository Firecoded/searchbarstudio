"use client";

import { useActionState, useEffect, useRef } from "react";
import { inviteClient, type InviteState } from "@/app/admin/actions";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: InviteState = { ok: false };

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteClient, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-border bg-paper p-6"
    >
      <h2 className="font-serif text-[20px] font-medium">Invite a client</h2>
      <p className="mt-1 text-[14px] text-muted">
        They&rsquo;ll get an email to set a password and reach their dashboard.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label className={labelClass} htmlFor="invite-name">
            Name
          </label>
          <input
            id="invite-name"
            name="name"
            required
            className={fieldClass}
            type="text"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="invite-email">
            Email
          </label>
          <input
            id="invite-email"
            name="email"
            required
            className={fieldClass}
            type="email"
            placeholder="jane@business.com"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-xl bg-accent px-6 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send invite"}
        </button>
      </div>

      {state.error && (
        <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
          {state.error}
        </p>
      )}
      {state.ok && state.invited && (
        <p className="mt-4 rounded-lg bg-sand px-3 py-2 text-[14px] text-ink">
          Invite sent to {state.invited}.
        </p>
      )}
    </form>
  );
}
