import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Deduped per request so the portal layout and the page it renders share one
// session lookup instead of hitting the database twice.
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
