import { Container, Pill, btnGhost } from "./ui";
import { Reveal } from "./reveal";
import { DesignRuler, Shield, Search, Pencil } from "./icons";

const services = [
  {
    Icon: DesignRuler,
    title: "Design & build",
    body: "A custom site that looks the part and loads fast, built to fit your business, not a template.",
  },
  {
    Icon: Shield,
    title: "Hosting & upkeep",
    body: "Fast, secure hosting plus updates, backups, and monitoring, all handled in the background.",
  },
  {
    Icon: Search,
    title: "Getting found",
    body: "SEO done properly, so the people who need you can find you easily.",
  },
  {
    Icon: Pencil,
    title: "Easy Updates",
    body: "Update your website content through a simple dashboard, or I can handle it for you.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-20 border-y border-border bg-paper py-16 sm:py-24"
    >
      <Container>
        <Reveal>
          <Pill>What I do</Pill>
          <h2 className="mt-[18px] max-w-[660px] font-serif text-[30px] font-medium sm:text-[38px] lg:text-[44px]">
            Everything your website needs, handled by one person.
          </h2>
        </Reveal>
      </Container>
      <Container className="mt-8 sm:mt-9">
        <Reveal
          stagger
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-ground p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft">
                <Icon size={24} className="text-accent" />
              </div>
              <h3 className="mt-5 text-[21px] font-medium">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-muted">{body}</p>
            </div>
          ))}
        </Reveal>
      </Container>
      <Container className="pt-5">
        <Reveal className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-ground px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[20px] font-medium">Need more than a website?</h3>
            <p className="mt-1 text-[15px] text-muted">
              Booking systems, customer portals, mobile apps, custom tools. If it
              runs on the web, I can build it.
            </p>
          </div>
          <a href="#contact" className={`${btnGhost} shrink-0`}>
            Let&rsquo;s talk
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
