"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Drop events for the admin portal, auth, and token-gated pages (the token
// URLs also carry secrets we don't want in analytics). The client dashboard
// is deliberately kept, for a rough portal-usage pulse.
const PRIVATE_PREFIXES = [
  "/admin",
  "/clients",
  "/emails",
  "/settings",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/invoice",
  "/pay",
  "/welcome",
  "/set-password",
];

export function AnalyticsScripts() {
  return (
    <>
      <Analytics
        beforeSend={(event) => {
          // While an admin impersonates a client, the impersonation banner is
          // in the DOM. Drop those views so the admin's "view as client"
          // sessions don't pollute the client dashboard pulse.
          if (document.querySelector("[data-impersonating]")) return null;
          const path = new URL(event.url).pathname;
          const isPrivate = PRIVATE_PREFIXES.some(
            (p) => path === p || path.startsWith(`${p}/`),
          );
          return isPrivate ? null : event;
        }}
      />
      <SpeedInsights />
    </>
  );
}
