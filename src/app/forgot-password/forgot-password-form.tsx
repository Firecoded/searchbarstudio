"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Something went wrong.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-border bg-paper p-8">
      <h1 className="font-serif text-[28px] font-medium">Reset your password</h1>

      {sent ? (
        <p className="mt-1.5 text-[15px] text-muted">
          If an account exists for <span className="text-ink">{email}</span>,
          a reset link is on its way. Check your inbox.
        </p>
      ) : (
        <>
          <p className="mt-1.5 text-[15px] text-muted">
            Enter your email and we&apos;ll send you a link to set a new one.
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-semibold text-muted" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-3 text-[15px] focus:border-accent focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-1 w-full rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? "Sending..." : "Send reset link"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-[14px] text-muted">
        <a href="/login" className="font-medium text-accent">
          Back to sign in
        </a>
      </p>
    </div>
  );
}
