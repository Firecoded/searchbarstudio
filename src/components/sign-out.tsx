"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOut() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
      }}
      className="text-[14px] font-medium text-accent hover:text-accent-hover"
    >
      Sign out
    </button>
  );
}
