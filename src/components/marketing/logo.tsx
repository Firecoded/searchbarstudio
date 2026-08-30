import Image from "next/image";
import mark from "../../../public/logo-mark.png";

export function Logo({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-[0.2rem] leading-none ${className}`}>
      <Image
        src={mark}
        alt=""
        priority
        className={`h-[1.35em] w-auto ${dark ? "[filter:brightness(0)_invert(1)]" : ""}`}
      />
      <span
        className={`translate-y-[0.12em] font-serif font-semibold tracking-[-0.015em] ${dark ? "text-[#fbf5ee]" : "text-ink"}`}
      >
        Searchbar
        <span className={dark ? "text-[#e59268]" : "text-accent"}>Studio</span>
      </span>
    </span>
  );
}
