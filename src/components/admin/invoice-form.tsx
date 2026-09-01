"use client";

import { useActionState, useState } from "react";
import { createPendingInvoice, type InvoiceState } from "@/lib/admin-actions";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: InvoiceState = { ok: false };

export function InvoiceForm() {
  const [state, action, pending] = useActionState(
    createPendingInvoice,
    initialState,
  );

  // Controlled so a failed submit keeps what they typed (React resets
  // uncontrolled fields after a form action). Cleared only on success.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buildAmount, setBuildAmount] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [planName, setPlanName] = useState("");
  const [buildDetails, setBuildDetails] = useState("");

  return (
    <form
      action={action}
      className="rounded-2xl border border-border bg-paper p-6"
    >
      <h2 className="font-serif text-[20px] font-medium">Invoice someone new</h2>
      <p className="mt-1 text-[14px] text-muted">
        For people who aren&rsquo;t clients yet. They pay first, then set a
        password and land in their dashboard.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="inv-name">
            Name
          </label>
          <input id="inv-name" name="name" required className={fieldClass} type="text" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="inv-email">
            Email
          </label>
          <input id="inv-email" name="email" required className={fieldClass} type="email" placeholder="jane@business.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="inv-build">
            One-time charge{" "}
            <span className="font-medium text-faint">optional</span>
          </label>
          <input id="inv-build" name="buildAmount" className={fieldClass} inputMode="decimal" placeholder="2500" value={buildAmount} onChange={(e) => setBuildAmount(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="inv-monthly">
            Monthly plan
          </label>
          <input id="inv-monthly" name="monthlyAmount" required className={fieldClass} inputMode="decimal" placeholder="99" value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)} />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="inv-plan">
          Plan name
        </label>
        <input id="inv-plan" name="planName" className={fieldClass} type="text" placeholder="Monthly care plan" value={planName} onChange={(e) => setPlanName(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="inv-details">
          What&rsquo;s this charge for?{" "}
          <span className="font-medium text-faint">optional, shown to client</span>
        </label>
        <input id="inv-details" name="buildDetails" className={fieldClass} type="text" placeholder="Deposit, final payment, new feature…" value={buildDetails} onChange={(e) => setBuildDetails(e.target.value)} />
      </div>

      {state.error && (
        <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
          {state.error}
        </p>
      )}
      {state.ok && state.sent && (
        <p className="mt-4 rounded-lg bg-sand px-3 py-2 text-[14px] text-ink">
          Invoice sent to {state.sent}.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send invoice"}
      </button>
    </form>
  );
}
