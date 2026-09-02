"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { resolveSetPasswordEmail } from "@/app/actions";

export function SetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [resolved, setResolved] = useState<{ email: string | null } | null>(
    null,
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    resolveSetPasswordEmail(token).then((email) => {
      if (active) setResolved({ email });
    });
    return () => {
      active = false;
    };
  }, [token]);

  const email = resolved?.email ?? null;
  const checkedToken = !token || resolved !== null;
  const linkError = checkedToken && (!token || !email);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setPending(true);

    const reset = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });
    if (reset.error) {
      setPending(false);
      setError(reset.error.message ?? "Something went wrong.");
      return;
    }

    // Sign the new client straight in so they land on their dashboard.
    if (email) {
      const signIn = await authClient.signIn.email({ email, password });
      if (!signIn.error) {
        router.push("/dashboard");
        return;
      }
    }
    router.push("/login");
  }

  if (!checkedToken) {
    return (
      <div className="w-full max-w-[400px] rounded-2xl border border-border bg-paper p-8">
        <p className="text-[15px] text-muted">Checking your invite...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-border bg-paper p-8">
      <h1 className="font-serif text-[28px] font-medium">
        Welcome to Searchbar Studio
      </h1>

      {linkError ? (
        <>
          <p className="mt-1.5 text-[15px] text-muted">
            This invite link is invalid or has expired. Ask for a fresh one and
            try again.
          </p>
        </>
      ) : (
        <>
          <p className="mt-1.5 text-[15px] text-muted">
            Set a password for <span className="text-ink">{email}</span> to get
            into your dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-semibold text-muted" htmlFor="password">
                Password
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
              {pending ? "Setting up..." : "Set password and continue"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
