import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/home-page";
import { HeroV1 } from "@/components/marketing/hero-v1";

// Hero preview for feedback; kept out of search and off the canonical URL.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HomeV1() {
  return <HomePage hero={<HeroV1 />} />;
}
