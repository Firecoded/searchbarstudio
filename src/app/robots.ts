import type { MetadataRoute } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://searchbarstudio.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // App/private surfaces (also noindex'd per-page); keep them out of crawl.
      disallow: [
        "/api/",
        "/admin",
        "/dashboard",
        "/clients",
        "/settings",
        "/emails",
        "/login",
        "/set-password",
        "/welcome",
        "/invoice",
        "/pay",
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
