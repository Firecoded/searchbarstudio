import { Container, Pill } from "./ui";
import { Reveal } from "./reveal";
import { ArrowUpRight } from "./icons";
import { TrackedLink } from "../tracked-link";

type Project = {
  tag: string;
  name: string;
  blurb: string;
  gradient: string;
  image?: string;
  href: string;
};

const projects: Project[] = [
  {
    tag: "Live musician",
    name: "Ashley Downie",
    blurb:
      "A golden-hour booking site for an Arizona cover artist, with videos, show dates, and a book-a-set form.",
    gradient: "linear-gradient(150deg,#e8b04a,#f0cd82)",
    image: "/work/ashleydownie.jpg",
    href: "https://ashleydownie.com/sings/",
  },
  {
    tag: "Solo guitarist",
    name: "Mark Taylor Plays",
    blurb:
      "A refined site for a solo jazz guitarist, with video samples, a gallery, set list, and a contact form.",
    gradient: "linear-gradient(150deg,#7fa77f,#a9c8a4)",
    image: "/work/marktaylor.jpg",
    href: "https://www.marktaylorplays.com/",
  },
  {
    tag: "Photo gallery",
    name: "jacobshoots.pictures",
    blurb:
      "A fast travel photo gallery, filterable by place and style, built to stay quick with hundreds of images.",
    gradient: "linear-gradient(150deg,#d98a5e,#e8ab84)",
    image: "/work/jacobshoots.jpg",
    href: "https://jacobshoots.pictures/",
  },
];

export function Work() {
  return (
    <section id="work" className="scroll-mt-20 pt-16 sm:pt-24 lg:pt-[120px]">
      <Container>
        <Reveal>
          <Pill>Recent work</Pill>
          <h2 className="mt-[18px] font-serif text-[30px] font-medium sm:text-[38px] lg:text-[44px]">
            A few sites I&rsquo;ve built.
          </h2>
          <p className="mt-2.5 text-base text-muted">
            Click any project to see it live.
          </p>
        </Reveal>
      </Container>

      <Container className="mt-9 pb-16 sm:pb-24 lg:pb-[120px]">
        <Reveal
          stagger
          className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <TrackedLink
              key={p.name + p.tag}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              event="work_live_site_clicked"
              eventProps={{ project: p.name, href: p.href }}
              className="group block overflow-hidden rounded-[18px] border border-border bg-paper transition-transform hover:-translate-y-1 hover:shadow-[0_18px_34px_-22px_rgba(120,70,40,0.4)]"
            >
              <div
                className="h-[205px] bg-cover bg-center"
                style={
                  p.image
                    ? { backgroundImage: `url(${p.image})` }
                    : { background: p.gradient }
                }
              />
              <div className="p-[22px]">
                <div className="text-[13px] font-semibold text-muted">{p.tag}</div>
                <h3 className="mt-1.5 text-[21px] font-medium">{p.name}</h3>
                <p className="mt-2 text-[14px] text-muted">{p.blurb}</p>
                <div className="mt-3.5 flex items-center gap-1.5 text-[14px] font-semibold text-accent transition-colors group-hover:text-accent-hover">
                  Visit the live site
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </TrackedLink>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
