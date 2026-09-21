import Image, { type StaticImageData } from "next/image";
import { Container, Pill, btnPrimary, btnGhost } from "./ui";
import { ArrowRight } from "./icons";
import { TrackedLink } from "../tracked-link";
import laptopDefault from "../../../public/hero/laptop.webp";
import phoneDefault from "../../../public/hero/phone.webp";
import underline from "../../../public/hero/underline.png";
import wallShadows from "../../../public/hero/wall-shadows.webp";
import table from "../../../public/hero/table.webp";
import plant from "../../../public/hero/plant.webp";
import foliage from "../../../public/hero/foliage.webp";

const weaveTile =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cg stroke='%23d8c1a6' stroke-width='1.3' stroke-linecap='round' opacity='0.16'%3E%3Cline x1='4' y1='6' x2='20' y2='6'/%3E%3Cline x1='4' y1='12' x2='20' y2='12'/%3E%3Cline x1='4' y1='18' x2='20' y2='18'/%3E%3Cline x1='30' y1='4' x2='30' y2='20'/%3E%3Cline x1='36' y1='4' x2='36' y2='20'/%3E%3Cline x1='42' y1='4' x2='42' y2='20'/%3E%3Cline x1='6' y1='28' x2='6' y2='44'/%3E%3Cline x1='12' y1='28' x2='12' y2='44'/%3E%3Cline x1='18' y1='28' x2='18' y2='44'/%3E%3Cline x1='28' y1='30' x2='44' y2='30'/%3E%3Cline x1='28' y1='36' x2='44' y2='36'/%3E%3Cline x1='28' y1='42' x2='44' y2='42'/%3E%3C/g%3E%3C/svg%3E\")";

// `laptop` and `phone` are the screen mockups, swappable so the same hero can
// be previewed with different sites on it. `pinned` holds the hero in place
// below the (then also pinned) nav while the rest of the page slides up over
// it like a sheet; see HomePage.
export function Hero({
  laptop = laptopDefault,
  phone = phoneDefault,
  pinned = false,
}: {
  laptop?: StaticImageData;
  phone?: StaticImageData;
  pinned?: boolean;
}) {
  return (
    // Only horizontal overflow is clipped: the table and plant bleed off the
    // right, while the plant is free to rise above the section and over the
    // nav on wide screens. Pinned, it sits under the nav (72px on phones,
    // 78px from sm); the stacked phone layout fits above the fold, so it
    // pins there too.
    <section
      className={`flex min-h-[min(80svh,900px)] items-center overflow-x-clip ${
        pinned ? "sticky top-[72px] sm:top-[78px]" : "relative"
      }`}
    >
      {/* The weave and wall layers reach 5rem above the section so they
          continue behind the translucent nav. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-20 bottom-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-[2600px] w-[2600px] -translate-x-1/2 -translate-y-1/2 rotate-45"
          style={{ backgroundImage: weaveTile, backgroundSize: "54px 54px" }}
        />
      </div>
      {/* Wall atmosphere: leafy sunlight shadows as a transparent layer over
          the paper (leaves left, window light right, clean middle). Covers
          and crops from the top so it never stretches. */}
      <div aria-hidden className="hero-wall pointer-events-none absolute inset-x-0 -top-20 bottom-0">
        <Image
          src={wallShadows}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
      {/* Fades the weave and shadows out behind the copy so the words sit on
          clean paper; positioned per breakpoint in .hero-glow. */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      {/* A little extra bottom padding at lg+ gives the table's front edge
          room below the laptop, without pushing the device block up. From 1880px
          the content stacks above the header (z-40) so the plant's leaves
          can overlap the nav; below that the mobile menu needs to stay on
          top, so it drops back under. */}
      <Container className="relative z-10 pb-16 pt-9 sm:py-20 lg:pb-24 min-[1880px]:z-50">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Copy column. Centered when stacked, left-aligned beside the
              device on desktop. Its children pick up the rise-in stagger. */}
          <div className="hero-rise @container flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* The eyebrow is dropped on phones so the headline leads. */}
            <div className="hidden sm:block">
              <Pill>Your search ends here</Pill>
            </div>
            {/* From lg the size tracks the copy column (cqw), tuned so the
                longer first sentence holds a single line and the headline
                sits on two lines; capped at 56px. Mobile stays at 40px and
                wraps to three, since two lines there would mean tiny type. */}
            <h1 className="max-w-[620px] sm:mt-5 text-balance font-serif text-[40px] font-medium leading-[1.06] tracking-[-0.01em] sm:text-[54px] lg:text-[clamp(2.5rem,10.4cqw,3.5rem)] lg:leading-[1.04]">
              The website your
              {/* Second half on its own line so the break is always here. */}
              <span className="block">
                business{" "}
                <span className="relative inline-block">
                  deserves
                  {/* Brush-stroke underline (a real stroke, isolated from a
                      painted reference and recolored to the accent). Sized
                      relative to the word so it scales with the type; wipes
                      in once the headline has risen (.hero-underline). */}
                  <Image
                    src={underline}
                    alt=""
                    aria-hidden
                    className="hero-underline pointer-events-none absolute -bottom-[0.13em] left-[5%] h-auto w-[93%]"
                  />
                </span>
                .
              </span>
            </h1>
            <p className="mt-5 max-w-[540px] text-[17px] leading-[1.6] text-muted sm:text-[19px]">
              Modern, mobile-friendly websites that bring in customers and are
              easy to update.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-3.5">
              <TrackedLink
                href="#contact"
                event="cta_clicked"
                eventProps={{ location: "hero" }}
                className={`${btnPrimary} justify-center px-[30px] py-4 text-base`}
              >
                Get started
                <ArrowRight size={16} />
              </TrackedLink>
              <TrackedLink
                href="#work"
                event="cta_clicked"
                eventProps={{ location: "hero_secondary" }}
                className={`${btnGhost} justify-center px-[26px] py-4 text-base`}
              >
                See recent work
              </TrackedLink>
            </div>
          </div>

          {/* Device mockup: the laptop is the base, the phone is anchored to
              its lower-right and overlaps it. The wrapper's box is just the
              laptop, so it centers on the copy column; the phone's overhang
              and the note below it overflow into the hero's bottom padding.
              From 2xl the whole thing grows and bleeds right (see
              .hero-device in globals.css). */}
          {/* Below lg the group is nudged left by a few percent of its own
              width: the angled laptop and the phone both carry their visual
              weight on the right, so box-centered reads off-center. */}
          <div className="hero-device relative mx-auto w-[95%] max-w-[560px] -translate-x-[3%] lg:w-full lg:max-w-none lg:translate-x-0">
            {/* Round stone table behind the devices: the asset is the left
                part of a large round top, so the laptop sits near its curved
                left edge and the rest runs off the section (which clips it).
                At 2x the laptop's width the top face is deep enough that the
                base sits fully on it, with the back edge just above the
                hinge. Beside the copy the left end pulls in so it clears the
                buttons. Sizing is relative to the laptop, so the scene
                scales as one piece. */}
            <Image
              src={table}
              alt=""
              aria-hidden
              priority
              sizes="(min-width: 1024px) 110vw, 200vw"
              className="hero-table hero-table-in pointer-events-none absolute left-[-30%] top-[37%] h-auto w-[200%] max-w-none lg:left-[-15%] xl:left-[-25%]"
            />
            {/* Contact shadow grounding the laptop on the stone. The shape is
                the laptop's own footprint (its bottom contour, traced from
                the image: the front edge runs down to the right, then the
                right side rises back up) extruded a little down and right,
                the way light from the upper left would throw it. Drawn in
                the image's coordinate space so it scales with the laptop. */}
            <svg
              aria-hidden
              viewBox="0 0 1455 989"
              className="hero-laptop-in pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <defs>
                <filter id="hero-laptop-shadow" x="-20%" y="-50%" width="140%" height="220%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id="hero-laptop-shadow-soft" x="-20%" y="-50%" width="140%" height="220%">
                  <feGaussianBlur stdDeviation="36" />
                </filter>
              </defs>
              <path
                d="M3 863L300 905L600 935L900 964L1160 988L1300 890L1395 822L1440 860L1190 1030L900 1002L600 972L300 940L3 900Z"
                fill="#3d2e24"
                opacity="0.28"
                filter="url(#hero-laptop-shadow-soft)"
              />
              <path
                d="M3 863L300 905L600 935L900 964L1160 988L1300 890L1395 822L1415 842L1180 1012L900 989L600 959L300 928L3 888Z"
                fill="#3d2e24"
                opacity="0.5"
                filter="url(#hero-laptop-shadow)"
              />
            </svg>
            {/* Potted olive further back on the table, right of the phone,
                big enough that its leaves run past the top of the hero. From
                lg it sits mostly off the right edge so only its left leaves
                reach in; from 1880px the pot fits inside the viewport, so it
                moves left into full view (leaves may crop, a cut pot would
                not read). The foot lands toward the back of the table's top
                face. Same opacity as the table so the two read as one
                background. */}
            <div
              aria-hidden
              className="hero-plant hero-plant-in pointer-events-none absolute bottom-[20%] hidden w-[70%] opacity-70 lg:block"
            >
              {/* Pot shadow (its foot spans 37-65% of the asset's width,
                  bottom at 97% of its height): a soft cast trailing right and
                  back, since the light comes from the upper left, plus a
                  band under the foot. Kept light so the pot stays as quiet
                  as the table. */}
              <div className="absolute bottom-[1.2%] left-[42%] right-[-18%] h-[4.5%] rounded-[50%] bg-[#3d2e24] opacity-20 blur-lg" />
              <div className="absolute bottom-[1.8%] left-[37%] right-[35%] h-[2.6%] rounded-[50%] bg-[#3d2e24] opacity-40 blur-sm" />
              <Image
                src={plant}
                alt=""
                aria-hidden
                sizes="20vw"
                className="hero-plant-img relative h-auto w-full"
              />
            </div>
            <Image
              src={laptop}
              alt="A landscaping company's website shown on a laptop"
              priority
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="hero-laptop-in relative h-auto w-full"
            />

            {/* Phone overlapping the laptop's lower-right. The note is
                anchored to the phone in pixels so the arrow lands in the same
                spot at every width. */}
            <div className="hero-phone absolute bottom-[-2%] right-0 w-[22%] lg:right-[-3%]">
              {/* Contact shadow under the phone's foot, with a soft cast
                  trailing right (light comes from the upper left). */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-[-3%] left-[10%] right-[-25%] h-[7%] rounded-[50%] bg-[#4a3a2e] opacity-30 blur-lg"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-[-2%] left-[6%] right-[6%] h-[4.5%] rounded-[50%] bg-[#3d2e24] opacity-55 blur"
              />
              <Image
                src={phone}
                alt=""
                aria-hidden
                priority
                sizes="(min-width: 1024px) 13vw, 22vw"
                className="relative h-auto w-full"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Foreground foliage in the bottom-left corner, in front of the whole
          scene: out-of-focus leaves reaching in from the edge for depth. The
          wrapper clips it at the section's bottom. Wide screens only, where
          the margin left of the copy has room for it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[60] hidden overflow-hidden min-[1880px]:block"
      >
        <Image
          src={foliage}
          alt=""
          aria-hidden
          sizes="15vw"
          className="hero-foliage-in absolute bottom-[-12%] left-[-2%] h-auto w-[15vw] max-w-[380px] opacity-80"
        />
      </div>

      <a
        href="#services"
        aria-label="Scroll to see what I do"
        className="group absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="hero-scroll-chevron h-7 w-7 text-[#a99a88] transition-colors group-hover:text-accent"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
