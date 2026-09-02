import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Services } from "@/components/marketing/services";
import { Work } from "@/components/marketing/work";
import { CarePlan } from "@/components/marketing/care-plan";
import { About } from "@/components/marketing/about";
import { Process } from "@/components/marketing/process";
import { Contact } from "@/components/marketing/contact";
import { Footer } from "@/components/marketing/footer";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://searchbarstudio.com";

// ProfessionalService structured data: anchors the business in Tempe/Phoenix
// and lists the metro cities served, so local search understands the area.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Searchbar Studio",
  description:
    "Web design, development, hosting, and maintenance for small businesses across the Phoenix metro.",
  url: APP_URL,
  email: "jacob@searchbarstudio.com",
  image: `${APP_URL}/og.png`,
  logo: `${APP_URL}/logo-lockup.png`,
  slogan: "Great websites, made easy and affordable.",
  founder: { "@type": "Person", name: "Jacob Taylor" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tempe",
    addressRegion: "AZ",
    addressCountry: "US",
  },
  areaServed: [
    "Tempe",
    "Phoenix",
    "Scottsdale",
    "Mesa",
    "Chandler",
    "Gilbert",
    "Glendale",
    "Peoria",
    "Goodyear",
    "Buckeye",
    "Ahwatukee",
  ].map((city) => ({ "@type": "City", name: `${city}, AZ` })),
  knowsAbout: [
    "Web design",
    "Web development",
    "WordPress",
    "Website hosting",
    "SEO",
  ],
};

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="flex-1">
        <Hero />
        <Services />
        <Work />
        <CarePlan />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
