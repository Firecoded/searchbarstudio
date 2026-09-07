import type { NextConfig } from "next";

// PostHog is proxied through the app (/ingest) so ad blockers don't drop
// analytics and session replay. If the PostHog project lives in the EU, swap
// these two hosts for the eu-assets / eu.i endpoints.
const POSTHOG_HOST = "https://us.i.posthog.com";
const POSTHOG_ASSETS = "https://us-assets.i.posthog.com";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${POSTHOG_ASSETS}/static/:path*`,
      },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  // PostHog's ingestion endpoints must not be trailing-slash redirected.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
