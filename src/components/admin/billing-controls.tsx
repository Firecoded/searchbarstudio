"use client";

import { useActionState } from "react";
import { cancelPlan, type CancelState } from "@/lib/admin-actions";

const initial: CancelState = { ok: false };

const primary =
  "rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60";
const bordered =
  "rounded-xl border border-border px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ground disabled:opacity-60";
const danger =
  "rounded-xl border border-[#e2c3b8] px-5 py-2.5 text-[14px] font-semibold text-accent transition-colors hover:bg-accent-soft disabled:opacity-60";

function confirmSubmit(message: string) {
  return (e: React.MouseEvent) => {
    if (!window.confirm(message)) e.preventDefault();
  };
}

export function BillingControls({
  clientId,
  canceling,
}: {
  clientId: string;
  canceling: boolean;
}) {
  const [state, action, pending] = useActionState(cancelPlan, initial);

  return (
    <form action={action} className="mt-6 flex flex-wrap gap-3 border-t border-border-soft pt-5">
      <input type="hidden" name="clientId" value={clientId} />

      {canceling ? (
        <>
          <button name="mode" value="resume" disabled={pending} className={primary}>
            {pending ? "Working..." : "Resume plan"}
          </button>
          <button
            name="mode"
            value="immediate"
            disabled={pending}
            onClick={confirmSubmit(
              "Cancel now and refund the unused part of this month? The build fee is not refunded.",
            )}
            className={danger}
          >
            Cancel now &amp; refund
          </button>
        </>
      ) : (
        <>
          <button
            name="mode"
            value="period_end"
            disabled={pending}
            onClick={confirmSubmit(
              "Cancel at the end of the current paid month? The client keeps access until then.",
            )}
            className={bordered}
          >
            Cancel at period end
          </button>
          <button
            name="mode"
            value="immediate"
            disabled={pending}
            onClick={confirmSubmit(
              "Cancel now and refund the unused part of this month? The build fee is not refunded.",
            )}
            className={danger}
          >
            Cancel now &amp; refund
          </button>
        </>
      )}

      {!pending && state.error && (
        <p className="w-full rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
