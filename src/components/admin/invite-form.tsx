"use client";

import { useActionState, useState } from "react";
import { inviteClient, type InviteState } from "@/lib/admin-actions";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const initialState: InviteState = { ok: false };

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteClient, initialState);
  // Controlled so a failed submit keeps what they typed; cleared on success.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [scope, setScope] = useState("");
  const [estimate, setEstimate] = useState("");
  const [brief, setBrief] = useState("");

  return (
    <form
      action={action}
      className="rounded-2xl border border-border bg-paper p-6"
    >
      <h2 className="font-serif text-[20px] font-medium">Invite a client</h2>
      <p className="mt-1 text-[14px] text-muted">
        They&rsquo;ll get an email to set a password and reach their account.
      </p>

      <div className="mt-5 space-y-4">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-border-soft pt-5">
        <h3 className="font-serif text-[16px] font-medium">
          Project{" "}
          <span className="text-[13px] font-normal text-faint">(optional)</span>
        </h3>
        <p className="mt-1 text-[13px] text-muted">
          Add the build you agreed on and they&rsquo;ll land on the proposal to
          confirm, with a warmer invite email. Leave blank for a plain invite.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass} htmlFor="invite-project-title">
              Project title
            </label>
            <input
              id="invite-project-title"
              name="projectTitle"
              className={fieldClass}
              type="text"
              placeholder="Marketing site for Jane's Bakery"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="invite-scope">
              The build
            </label>
            <textarea
              id="invite-scope"
              name="scope"
              rows={4}
              className={fieldClass}
              placeholder="Five-page site, contact form, gallery, mobile-friendly, launch in about three weeks."
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="invite-estimate">
              Estimate
            </label>
            <input
              id="invite-estimate"
              name="estimate"
              className={fieldClass}
              type="text"
              placeholder="$1,800 build, then $40/mo care plan"
              value={estimate}
              onChange={(e) => setEstimate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="invite-brief">
              Brief{" "}
              <span className="text-[12px] font-normal text-faint">
                (internal notes, not shown until they accept)
              </span>
            </label>
            <textarea
              id="invite-brief"
              name="brief"
              rows={3}
              className={fieldClass}
              placeholder="Anything to remember about the build."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 h-[42px] w-full rounded-xl bg-accent px-6 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send invite"}
      </button>

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
