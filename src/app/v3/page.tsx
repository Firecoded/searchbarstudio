import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/home-page";
import { Hero } from "@/components/marketing/hero";
import laptop from "../../../public/hero/laptop-v3.webp";
import phone from "../../../public/hero/phone-v3.webp";

// Hero preview with a real client site (ashleydownie.com) on the devices;
// kept out of search and off the canonical URL.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HomeV3() {
  return <HomePage hero={<Hero laptop={laptop} phone={phone} />} />;
}
