import { Container } from "./ui";
import { Mail, Instagram } from "./icons";

const fieldClass =
  "mt-2 w-full rounded-[11px] border-[1.5px] border-[#e2d6c5] bg-paper px-[15px] py-[13px] text-[15px] text-ink placeholder:text-[#a99a88] focus:border-accent focus:outline-none";
const labelClass = "text-[13px] font-semibold text-muted";

const rings =
  "radial-gradient(circle at 94% 84%, transparent 72px, rgba(255,255,255,0.14) 74px, rgba(255,255,255,0.14) 76px, transparent 78px), radial-gradient(circle at 94% 84%, transparent 116px, rgba(255,255,255,0.09) 118px, rgba(255,255,255,0.09) 120px, transparent 122px), linear-gradient(135deg,#c1592f,#e0996a)";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20">
      <Container className="pb-24">
        <div
          className="grid grid-cols-1 items-start gap-14 overflow-hidden rounded-[26px] p-[60px] lg:grid-cols-2"
          style={{ background: rings }}
        >
          <div>
            <h2 className="font-serif text-[46px] font-medium leading-[1.1] text-white">
              Let&rsquo;s build something you&rsquo;re proud of.
            </h2>
            <p className="mt-[18px] text-[18px] leading-[1.55] text-[#ffe6da]">
              Tell me a little about your business and what you&rsquo;re after. I
              read every message and reply within a day, usually sooner.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/[0.16]">
                  <Mail size={20} className="text-white" />
                </span>
                <div>
                  <div className="text-[13px] text-[#ffe6da]">Email</div>
                  <div className="text-base font-semibold text-white">
                    hello@searchbarstudio.com
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/[0.16]">
                  <Instagram size={20} className="text-white" />
                </span>
                <div>
                  <div className="text-[13px] text-[#ffe6da]">Instagram</div>
                  <div className="text-base font-semibold text-white">
                    @searchbarstudio
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form className="rounded-[18px] bg-paper p-[30px]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className={labelClass}>Your name</span>
                <input className={fieldClass} type="text" placeholder="Jane Smith" />
              </div>
              <div>
                <span className={labelClass}>Email</span>
                <input
                  className={fieldClass}
                  type="email"
                  placeholder="jane@yourbusiness.com"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className={labelClass}>What do you need?</span>
                <select className={fieldClass} defaultValue="">
                  <option value="" disabled hidden>
                    Select one
                  </option>
                  <option>New website</option>
                  <option>Website redesign</option>
                  <option>Web app</option>
                  <option>Mobile app</option>
                  <option>Care for an existing site</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <span className={labelClass}>Timeline</span>
                <select className={fieldClass} defaultValue="">
                  <option value="" disabled hidden>
                    Select one
                  </option>
                  <option>Just exploring</option>
                  <option>In the next 1-3 months</option>
                  <option>As soon as possible</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <span className={labelClass}>
                Your current site, or one you like{" "}
                <span className="font-medium text-[#a99a88]">(optional)</span>
              </span>
              <input
                className={fieldClass}
                type="text"
                placeholder="yourbusiness.com, or a site whose style you love"
              />
            </div>
            <div className="mt-4">
              <span className={labelClass}>
                How did you hear about me?{" "}
                <span className="font-medium text-[#a99a88]">(optional)</span>
              </span>
              <select className={fieldClass} defaultValue="">
                <option value="" disabled hidden>
                  Select one
                </option>
                <option>A friend or past client</option>
                <option>Google search</option>
                <option>Instagram</option>
                <option>Somewhere else</option>
              </select>
            </div>
            <div className="mt-4">
              <span className={labelClass}>A little about your project</span>
              <textarea
                className={fieldClass}
                rows={3}
                placeholder="I run a small [type of business] and need a website that..."
              />
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-accent px-6 py-[15px] text-base font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
            >
              Send message
            </button>
            <p className="mt-3 text-center text-[13px] text-muted">
              No spam, no pressure. Just a reply within a day.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
