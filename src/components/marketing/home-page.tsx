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

// The full landing page. `pinned` is the "sheet" variant (previewed at /v2):
// nav and hero hold still while the sections after them slide up to cover
// the hero. `hero` lets a preview route swap in an alternate hero.
export function HomePage({
  hero,
  pinned = false,
}: {
  hero?: React.ReactNode;
  pinned?: boolean;
}) {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav pinned={pinned} />
      <main className="flex-1">
        {hero ?? <Hero pinned={pinned} />}
        {/* Everything after the hero stacks above it with an opaque
            background, so the table's rim can run under the next section on
            short viewports, and in the pinned variant the sections slide up
            to cover the hero. Stays under the nav's mobile menu (z-40) except
            on wide screens, where the hero's layers reach z-50 to put the
            olive's leaves over the nav and there is no mobile menu. */}
        <div className="relative z-20 bg-ground min-[1880px]:z-[60]">
          <Services />
          <Work />
          <About />
          <CarePlan />
          <Process />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
