"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// Token-gated URLs carry secrets in the path, and impersonation sessions show
// real client data. Both stay out of PostHog entirely (mirrors the Vercel
// analytics carve-out in analytics.tsx). Everything else is captured, with
// session-replay inputs masked.
const SECRET_PREFIXES = [
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

function isSecretPath(path: string) {
  return SECRET_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Only run in production builds, never in `next dev`, so local work doesn't
// pollute analytics or record dev sessions.
const ENABLED = Boolean(KEY) && process.env.NODE_ENV === "production";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!ENABLED || !KEY || posthog.__loaded) return;
    posthog.init(KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false, // captured manually below for the App Router
      capture_pageleave: true,
      autocapture: true,
      session_recording: { maskAllInputs: true },
      before_send: (event) => {
        if (!event) return event;
        // Drop everything (pageviews, autocapture, replay snapshots, custom
        // events) while on a secret page or impersonating a client.
        if (document.querySelector("[data-impersonating]")) return null;
        if (isSecretPath(window.location.pathname)) return null;
        return event;
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
      {children}
    </PHProvider>
  );
}

// App Router client navigations don't trigger a full load, so capture
// $pageview on path/query change. Also pause replay on secret pages as a
// second guard alongside before_send.
function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ENABLED || !posthog.__loaded || !pathname) return;
    if (isSecretPath(pathname)) {
      posthog.stopSessionRecording();
      return;
    }
    posthog.startSessionRecording();
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

// Fire a custom event. No-op until PostHog has initialized (e.g. no key set).
export function track(event: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}
