"use client";

import { useActionState, useState } from "react";
import { sendCharge, type ChargeState } from "@/lib/admin-actions";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: ChargeState = { ok: false };

export function ChargeForm({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(sendCharge, initialState);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-border bg-paper px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ground"
      >
        + New charge
      </button>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-border bg-paper p-6">
      <input type="hidden" name="clientId" value={clientId} />
      <h3 className="font-serif text-[18px] font-medium">New one-time charge</h3>
      <p className="mt-1 text-[14px] text-muted">
        A single payment (deposit, final payment, add-on). Sent as a pay link and
        doesn&rsquo;t affect their plan.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            required
            className={fieldClass}
            inputMode="decimal"
            placeholder="300"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="description">
            What&rsquo;s it for?{" "}
            <span className="font-medium text-faint">shown to client</span>
          </label>
          <input
            id="description"
            name="description"
            className={fieldClass}
            type="text"
            placeholder="Final payment, new feature…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {state.error && (
        <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
          {state.error}
        </p>
      )}
      {state.ok && state.sent && (
        <p className="mt-4 rounded-lg bg-sand px-3 py-2 text-[14px] text-ink">
          Charge sent, it&rsquo;s listed above. Add another below or close this.
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send charge"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[14px] font-medium text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
