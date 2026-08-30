"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const { data, error } = await authClient.signIn.email({ email, password });
    setPending(false);
    if (error) {
      setError(error.message ?? "Something went wrong.");
      return;
    }
    const isAdmin = (data?.user as { role?: string } | undefined)?.role === "admin";
    router.push(next ?? (isAdmin ? "/admin" : "/dashboard"));
  }

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-border bg-paper p-8">
      <h1 className="font-serif text-[28px] font-medium">Welcome back</h1>
      <p className="mt-1.5 text-[15px] text-muted">Sign in to your account.</p>

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
        <div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-muted" htmlFor="password">
              Password
            </label>
            <a href="/forgot-password" className="text-[13px] font-medium text-accent">
              Forgot?
            </a>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
