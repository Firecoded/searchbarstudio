"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    setPending(true);
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Couldn't change your password.");
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex max-w-[360px] flex-col gap-4">
      <div>
        <label className={labelClass} htmlFor="current">
          Current password
        </label>
        <input
          id="current"
          type="password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="next">
          New password
        </label>
        <input
          id="next"
          type="password"
          required
          minLength={8}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="confirm">
          Confirm new password
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={fieldClass}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
          {error}
        </p>
      )}
      {done && (
        <p className="rounded-lg bg-sand px-3 py-2 text-[14px] text-ink">
          Password updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-xl bg-accent px-6 py-2.5 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update password"}
      </button>
    </form>
  );
}
