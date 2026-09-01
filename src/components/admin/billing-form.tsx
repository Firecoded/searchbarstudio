"use client";

import { useActionState, useState } from "react";
import { startPlan, type BillingState } from "@/lib/admin-actions";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: BillingState = { ok: false };

export function BillingForm({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(startPlan, initialState);
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [planName, setPlanName] = useState("");
  const [upfrontAmount, setUpfrontAmount] = useState("");
  const [upfrontDetails, setUpfrontDetails] = useState("");

  if (state.ok && state.sent) {
    return (
      <div className="rounded-2xl border border-border bg-paper p-6">
        <h3 className="font-serif text-[18px] font-medium">Plan invoice sent</h3>
        <p className="mt-2 text-[15px] leading-[1.55] text-muted">
          The client got a secure link to review and pay. The plan shows as
          active once they complete payment.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-border bg-paper p-6">
      <input type="hidden" name="clientId" value={clientId} />
      <h3 className="font-serif text-[18px] font-medium">Start a care plan</h3>
      <p className="mt-1 text-[14px] text-muted">
        A recurring monthly plan, with an optional upfront charge billed on the
        first invoice. Future months bill automatically.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="planName">
            Plan name
          </label>
          <input
            id="planName"
            name="planName"
            className={fieldClass}
            type="text"
            placeholder="Monthly care plan"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="buildAmount">
            Upfront charge{" "}
            <span className="font-medium text-faint">optional, first invoice</span>
          </label>
          <input
            id="buildAmount"
            name="buildAmount"
            className={fieldClass}
            inputMode="decimal"
            placeholder="2500"
            value={upfrontAmount}
            onChange={(e) => setUpfrontAmount(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="buildDetails">
            What&rsquo;s the upfront charge for?
          </label>
          <input
            id="buildDetails"
            name="buildDetails"
            className={fieldClass}
            type="text"
            placeholder="Build, deposit…"
            value={upfrontDetails}
            onChange={(e) => setUpfrontDetails(e.target.value)}
          />
        </div>
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
        {pending ? "Sending..." : "Send plan invoice"}
      </button>
    </form>
  );
}
