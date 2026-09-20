import { Nav } from "./nav";
import { Hero } from "./hero";
import { Services } from "./services";
import { Work } from "./work";
import { CarePlan } from "./care-plan";
import { About } from "./about";
import { Process } from "./process";
import { Contact } from "./contact";
import { Footer } from "./footer";

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

// The full landing page. `hero` lets the /v1 and /v2 preview routes swap in
// an alternate hero while keeping everything else identical.
export function HomePage({ hero = <Hero /> }: { hero?: React.ReactNode }) {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="flex-1">
        {hero}
        <Services />
        <Work />
        <About />
        <CarePlan />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
