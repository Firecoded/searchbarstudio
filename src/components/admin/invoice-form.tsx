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

  const [mode, setMode] = useState<"plan" | "onetime">("plan");
  // Controlled so a failed submit keeps what they typed (React resets
  // uncontrolled fields after a form action). Cleared only on success.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buildAmount, setBuildAmount] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [planName, setPlanName] = useState("");
  const [buildDetails, setBuildDetails] = useState("");

  const isPlan = mode === "plan";

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

      <div className="mt-4 inline-flex rounded-xl border border-border bg-ground p-1 text-[13px] font-semibold">
        <button
          type="button"
          onClick={() => setMode("plan")}
          className={`rounded-lg px-3.5 py-1.5 transition-colors ${
            isPlan ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
          }`}
        >
          Care plan
        </button>
        <button
          type="button"
          onClick={() => setMode("onetime")}
          className={`rounded-lg px-3.5 py-1.5 transition-colors ${
            !isPlan ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
          }`}
        >
          One-time
        </button>
      </div>
      <p className="mt-2 text-[13px] text-muted">
        {isPlan
          ? "A recurring monthly plan, with an optional charge on the first invoice."
          : "A single payment, no recurring plan."}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="inv-name">
            Name
          </label>
          <input
            id="inv-name"
            name="name"
            required
            className={fieldClass}
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="inv-email">
            Email
          </label>
          <input
            id="inv-email"
            name="email"
            required
            className={fieldClass}
            type="email"
            placeholder="jane@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

      </div>

      {isPlan ? (
        <>
          <fieldset className="mt-5 rounded-xl border border-border-soft bg-ground/40 p-4">
            <legend className="px-1 text-[13px] font-semibold text-ink">
              Monthly care plan
            </legend>
            <p className="text-[13px] text-muted">
              Billed automatically every month, starting today. Appears on the
              invoice as the recurring line.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="inv-monthly">
                  Monthly amount ($)
                </label>
                <input
                  id="inv-monthly"
                  name="monthlyAmount"
                  required
                  className={fieldClass}
                  inputMode="decimal"
                  placeholder="49"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="inv-plan">
                  Plan name{" "}
                  <span className="font-medium text-faint">
                    shown to client
                  </span>
                </label>
                <input
                  id="inv-plan"
                  name="planName"
                  className={fieldClass}
                  type="text"
                  placeholder="Essential care plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-4 rounded-xl border border-border-soft bg-ground/40 p-4">
            <legend className="px-1 text-[13px] font-semibold text-ink">
              One-time charge{" "}
              <span className="font-medium text-faint">optional</span>
            </legend>
            <p className="text-[13px] text-muted">
              A one-off added to this first invoice only, e.g. the website
              build. Leave blank for none.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="inv-build">
                  Amount ($)
                </label>
                <input
                  id="inv-build"
                  name="buildAmount"
                  className={fieldClass}
                  inputMode="decimal"
                  placeholder="2500"
                  value={buildAmount}
                  onChange={(e) => setBuildAmount(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="inv-details">
                  Label{" "}
                  <span className="font-medium text-faint">
                    shown to client
                  </span>
                </label>
                <input
                  id="inv-details"
                  name="buildDetails"
                  className={fieldClass}
                  type="text"
                  placeholder="Website build"
                  value={buildDetails}
                  onChange={(e) => setBuildDetails(e.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </>
      ) : (
        <fieldset className="mt-5 rounded-xl border border-border-soft bg-ground/40 p-4">
          <legend className="px-1 text-[13px] font-semibold text-ink">
            One-time charge
          </legend>
          <p className="text-[13px] text-muted">
            A single payment. No recurring plan is created.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="inv-build">
                Amount ($)
              </label>
              <input
                id="inv-build"
                name="buildAmount"
                required
                className={fieldClass}
                inputMode="decimal"
                placeholder="2500"
                value={buildAmount}
                onChange={(e) => setBuildAmount(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="inv-details">
                Label{" "}
                <span className="font-medium text-faint">shown to client</span>
              </label>
              <input
                id="inv-details"
                name="buildDetails"
                className={fieldClass}
                type="text"
                placeholder="Website build"
                value={buildDetails}
                onChange={(e) => setBuildDetails(e.target.value)}
              />
            </div>
          </div>
        </fieldset>
      )}

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
