import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Services } from "@/components/marketing/services";
import { Work } from "@/components/marketing/work";
import { CarePlan } from "@/components/marketing/care-plan";
import { About } from "@/components/marketing/about";
import { Process } from "@/components/marketing/process";
import { Contact } from "@/components/marketing/contact";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
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
