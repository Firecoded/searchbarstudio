"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-3 text-[15px] focus:border-accent focus:outline-none";

export function WelcomeSetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
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
    const reset = await authClient.resetPassword({ newPassword: password, token });
    if (reset.error) {
      setPending(false);
      setError(reset.error.message ?? "Something went wrong.");
      return;
    }
    const signIn = await authClient.signIn.email({ email, password });
    if (!signIn.error) {
      router.push("/dashboard");
      return;
    }
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
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
          className={fieldClass}
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
          className={fieldClass}
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
        {pending ? "Creating your account..." : "Create my account"}
      </button>
    </form>
  );
}
