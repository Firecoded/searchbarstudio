"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Starts a real impersonation session (admin-gated by Better Auth) and drops
// the admin into the client's own dashboard. A banner lets them exit.
export function ImpersonateButton({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const firstName = name.trim().split(" ")[0] || "client";

  async function viewAs() {
    setPending(true);
    setError(false);
    const { error } = await authClient.admin.impersonateUser({ userId });
    if (error) {
      setError(true);
      setPending(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      onClick={viewAs}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ground disabled:opacity-60"
    >
      <svg
        className="h-[16px] w-[16px] text-faint"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {error ? "Couldn't start" : pending ? "Starting…" : `View as ${firstName}`}
    </button>
  );
}
