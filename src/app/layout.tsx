import type { Metadata } from "next";
import { Manrope, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics";

const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://searchbarstudio.com";

const title = "Searchbar Studio | Phoenix Web Design for Small Businesses";
const description =
  "Searchbar Studio designs, builds, and maintains websites for small businesses across Phoenix and the Valley. Work directly with a senior developer, no agencies, no jargon, no runaround.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: title,
    template: "%s · Searchbar Studio",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Searchbar Studio",
    title,
    description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Searchbar Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
