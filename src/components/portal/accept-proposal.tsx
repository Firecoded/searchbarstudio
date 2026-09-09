"use client";

import { useActionState, useState } from "react";
import { acceptProposal, type ProjectActionState } from "@/lib/project-actions";

const init: ProjectActionState = { ok: false };

// The client's confirmation of the proposal. Kept light: the button always
// looks active, and the checkbox is a soft acknowledgment rather than a gate
// that greys the button out. `required` still blocks an accidental empty
// submit, but instead of the browser's default bubble we catch `onInvalid` and
// gently highlight the box.
export function AcceptProposal({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(acceptProposal, init);
  const [agreed, setAgreed] = useState(false);
  const [nudge, setNudge] = useState(false);

  return (
    <form
      action={action}
      className="rounded-2xl border border-border bg-paper p-6 sm:p-7"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <label
        className={`flex items-start gap-3 rounded-lg p-2.5 text-[15px] leading-[1.5] text-ink transition-colors ${
          nudge && !agreed ? "bg-accent-soft/60 ring-1 ring-accent/40" : ""
        }`}
      >
        <input
          type="checkbox"
          name="agree"
          required
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (e.target.checked) setNudge(false);
          }}
          onInvalid={(e) => {
            // Suppress the native validation bubble; we show our own hint.
            e.preventDefault();
            setNudge(true);
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#c1592f]"
        />
        <span>I&rsquo;ve looked it over and I&rsquo;m happy to go ahead.</span>
      </label>

      {nudge && !agreed && (
        <p className="mt-2 pl-2.5 text-[13px] text-muted">
          Just tick the box above, then we&rsquo;re good to go.
        </p>
      )}

      {state.error && (
        <p className="mt-3 text-[14px] font-medium text-accent">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
      >
        {pending ? "Confirming…" : "Sounds good, let's go"}
      </button>
    </form>
  );
}
