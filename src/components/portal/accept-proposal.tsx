"use client";

import { useActionState, useState } from "react";
import { acceptProposal, type ProjectActionState } from "@/lib/project-actions";

const init: ProjectActionState = { ok: false };

// The client's confirmation of the proposal. Friendly on the surface, but the
// checkbox + submit records an accepted-scope agreement server-side. The button
// stays disabled until the box is ticked, with a hover popover explaining why.
export function AcceptProposal({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(acceptProposal, init);
  const [agreed, setAgreed] = useState(false);

  return (
    <form
      action={action}
      className="rounded-2xl border border-accent/25 bg-accent-soft/60 p-6 sm:p-7"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <label className="flex items-start gap-3 text-[15px] leading-[1.5] text-ink">
        <input
          type="checkbox"
          name="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#c1592f]"
        />
        <span>
          I&rsquo;ve reviewed the build and estimate above, and I&rsquo;m happy
          to go ahead.
        </span>
      </label>

      {state.error && (
        <p className="mt-3 text-[14px] font-medium text-accent">{state.error}</p>
      )}

      <span className="group relative mt-4 inline-block">
        <button
          type="submit"
          disabled={!agreed || pending}
          className="rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent"
        >
          {pending ? "Confirming…" : "Sounds good, let's go"}
        </button>
        {!agreed && (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-[13px] font-medium text-paper opacity-0 shadow-[0_10px_24px_-12px_rgba(20,12,6,0.6)] transition-opacity duration-150 group-hover:opacity-100"
          >
            Accept the build terms to continue
            <span
              aria-hidden
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink"
            />
          </span>
        )}
      </span>
    </form>
  );
}
