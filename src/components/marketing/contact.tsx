import { Container } from "./ui";
import { Reveal } from "./reveal";
import { ContactForm } from "./contact-form";
import { TrackedLink } from "../tracked-link";

const rings =
  "radial-gradient(circle at 94% 84%, transparent 72px, rgba(255,255,255,0.14) 74px, rgba(255,255,255,0.14) 76px, transparent 78px), radial-gradient(circle at 94% 84%, transparent 116px, rgba(255,255,255,0.09) 118px, rgba(255,255,255,0.09) 120px, transparent 122px), linear-gradient(135deg,#c1592f,#e0996a)";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20">
      <Container className="pb-16 sm:pb-24">
        <Reveal
          className="flex flex-col items-center overflow-hidden rounded-[26px] p-6 text-center sm:p-10 lg:p-[60px]"
          style={{ background: rings }}
        >
          <h2 className="font-serif text-[30px] font-medium leading-[1.1] text-white sm:text-[38px] lg:text-[46px]">
            Tell me about your project.
          </h2>
          <p className="mt-[18px] max-w-[520px] text-[18px] leading-[1.55] text-[#ffe6da]">
            Answer a few quick questions and I&rsquo;ll get back to you.
          </p>

          <div className="mt-9 w-full max-w-[600px] text-left">
            <ContactForm />
          </div>

          <p className="mt-7 text-[14px] text-[#ffe6da]">
            Prefer to email me?{" "}
            <TrackedLink
              href="mailto:jacob@searchbarstudio.com"
              event="email_link_clicked"
              eventProps={{ location: "contact" }}
              className="font-semibold text-white underline-offset-2 hover:underline"
            >
              jacob@searchbarstudio.com
            </TrackedLink>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
