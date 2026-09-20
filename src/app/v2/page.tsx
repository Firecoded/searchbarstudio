import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/home-page";
import { HeroV2 } from "@/components/marketing/hero-v2";

// Hero preview for feedback; kept out of search and off the canonical URL.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HomeV2() {
  return <HomePage hero={<HeroV2 />} />;
}
