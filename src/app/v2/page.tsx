import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/home-page";

// Preview of the "sheet" scroll: nav and hero stay pinned while the rest of
// the page slides up over them. Kept out of search and off the canonical URL.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HomeV2() {
  return <HomePage pinned />;
}
