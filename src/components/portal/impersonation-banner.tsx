"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Shown across the portal whenever an admin is impersonating a client, so they
// always know and can get back to their own account in one click.
export function ImpersonationBanner({
  name,
  returnTo,
}: {
  name: string;
  returnTo: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function exit() {
    setPending(true);
    await authClient.admin.stopImpersonating();
    router.push(returnTo);
    router.refresh();
  }

  return (
    <div
      data-impersonating
      className="flex items-center justify-center gap-3 bg-accent px-4 py-2 text-center text-[13px] font-medium text-accent-ink"
    >
      <span>
        Viewing as <span className="font-semibold">{name}</span>. This is the
        client&rsquo;s view.
      </span>
      <button
        onClick={exit}
        disabled={pending}
        className="rounded-full bg-accent-ink/15 px-3 py-1 font-semibold transition-colors hover:bg-accent-ink/25 disabled:opacity-60"
      >
        {pending ? "Exiting…" : "Exit"}
      </button>
    </div>
  );
}
