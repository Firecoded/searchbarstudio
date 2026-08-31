"use client";

import { useActionState } from "react";
import { setupBilling, type BillingState } from "@/lib/admin-actions";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: BillingState = { ok: false };

export function BillingForm({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(setupBilling, initialState);

  if (state.ok && state.sent) {
    return (
      <div className="rounded-2xl border border-border bg-paper p-6">
        <h2 className="font-serif text-[20px] font-medium">Invoice sent</h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-muted">
          The client got an email with a secure link to review and pay. It&rsquo;s
          also waiting on their dashboard. This card will show as active once
          they complete payment.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-border bg-paper p-6">
      <input type="hidden" name="clientId" value={clientId} />
      <h2 className="font-serif text-[20px] font-medium">Set up billing</h2>
      <p className="mt-1 text-[14px] text-muted">
        One invoice covers the build (charged once) plus the first month. Future
        months bill automatically.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="buildAmount">
            Build fee (one-time){" "}
            <span className="font-medium text-faint">optional</span>
          </label>
          <input
            id="buildAmount"
            name="buildAmount"
            className={fieldClass}
            inputMode="decimal"
            placeholder="2500"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="monthlyAmount">
            Monthly plan
          </label>
          <input
            id="monthlyAmount"
            name="monthlyAmount"
            required
            className={fieldClass}
            inputMode="decimal"
            placeholder="99"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="planName">
          Plan name
        </label>
        <input
          id="planName"
          name="planName"
          className={fieldClass}
          type="text"
          placeholder="Monthly care plan"
        />
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="buildDetails">
          Build details{" "}
          <span className="font-medium text-faint">optional</span>
        </label>
        <textarea
          id="buildDetails"
          name="buildDetails"
          className={fieldClass}
          rows={2}
          placeholder="5-page website, copywriting, and launch."
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
        className="mt-5 rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Setting up..." : "Send invoice"}
      </button>
    </form>
  );
}
