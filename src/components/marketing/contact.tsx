import { Container } from "./ui";
import { Reveal } from "./reveal";
import { Mail } from "./icons";
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
              Let&rsquo;s get your website started.
            </h2>
            <p className="mt-[18px] text-[18px] leading-[1.55] text-[#ffe6da]">
              Tell me a little about your business and what you&rsquo;re looking
              for. The more details you can share, the better. I read every
              message personally and will get back to you as soon as I can.
            </p>
            <div className="mt-8">
              <a
                href="mailto:jacob@searchbarstudio.com"
                className="group flex min-w-0 items-center gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-white/[0.16]">
                  <Mail size={20} className="text-white" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] text-[#ffe6da]">Email</div>
                  <div className="break-all text-base font-semibold text-white group-hover:underline">
                    jacob@searchbarstudio.com
                  </div>
                </div>
              </a>
            </div>
          </div>

          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
