"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  // Better Auth redirects here with ?error=INVALID_TOKEN when the link is bad or expired.
  const linkError = params.get("error") || !token;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setPending(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Something went wrong.");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-border bg-paper p-8">
      <h1 className="font-serif text-[28px] font-medium">Set a new password</h1>

      {linkError ? (
        <>
          <p className="mt-1.5 text-[15px] text-muted">
            This reset link is invalid or has expired. Request a new one to try
            again.
          </p>
          <p className="mt-6 text-center text-[14px] text-muted">
            <a href="/forgot-password" className="font-medium text-accent">
              Request a new link
            </a>
          </p>
        </>
      ) : (
        <>
          <p className="mt-1.5 text-[15px] text-muted">
            Choose a new password for your account.
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-semibold text-muted" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-3 text-[15px] focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-muted" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {pending ? "Saving..." : "Save new password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
