import { Container } from "./ui";
import { Reveal } from "./reveal";
import { Mail, Instagram } from "./icons";
import { ContactForm } from "./contact-form";

const rings =
  "radial-gradient(circle at 94% 84%, transparent 72px, rgba(255,255,255,0.14) 74px, rgba(255,255,255,0.14) 76px, transparent 78px), radial-gradient(circle at 94% 84%, transparent 116px, rgba(255,255,255,0.09) 118px, rgba(255,255,255,0.09) 120px, transparent 122px), linear-gradient(135deg,#c1592f,#e0996a)";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20">
      <Container className="pb-16 sm:pb-24">
        <Reveal
          className="grid grid-cols-1 items-start gap-10 overflow-hidden rounded-[26px] p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-[60px]"
          style={{ background: rings }}
        >
          <div>
            <h2 className="font-serif text-[30px] font-medium leading-[1.1] text-white sm:text-[38px] lg:text-[46px]">
              Let&rsquo;s build something you&rsquo;re proud of.
            </h2>
            <p className="mt-[18px] text-[18px] leading-[1.55] text-[#ffe6da]">
              Tell me a little about your business and what you&rsquo;re after. I
              read every message and reply as soon as I can.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-white/[0.16]">
                  <Mail size={20} className="text-white" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] text-[#ffe6da]">Email</div>
                  <div className="break-all text-base font-semibold text-white">
                    jacob@searchbarstudio.com
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

          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
