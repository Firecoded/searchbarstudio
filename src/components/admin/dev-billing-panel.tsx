"use client";

import { useActionState } from "react";
import { devSetBillingState } from "@/lib/admin-actions";

const initial = { ok: false };
const states = ["active", "canceling", "canceled", "pending", "clear"] as const;

const btn =
  "rounded-lg border border-[#d9c9b0] bg-[#fbf4e6] px-3 py-1.5 text-[13px] font-semibold text-[#7a6a4f] transition-colors hover:bg-[#f5ebd6] disabled:opacity-60";

export function DevBillingPanel({ clientId }: { clientId: string }) {
  const [, action, pending] = useActionState(devSetBillingState, initial);

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-dashed border-[#d9c9b0] bg-[#fdf8ee] p-4"
    >
      <input type="hidden" name="clientId" value={clientId} />
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#a3915f]">
        Dev tools · not shown in production
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {states.map((s) => (
          <button key={s} name="state" value={s} disabled={pending} className={btn}>
            {s === "clear" ? "clear billing" : s}
          </button>
        ))}
      </div>
    </form>
  );
}
