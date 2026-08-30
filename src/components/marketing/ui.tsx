import { Search } from "./icons";

export const btnPrimary =
  "inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover";

export const btnGhost =
  "inline-flex items-center gap-2 rounded-xl border-[1.5px] border-border-soft px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-accent";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const styles =
    tone === "dark"
      ? "bg-white/[0.06] border-white/15 text-[#e6b79f]"
      : "bg-paper border-border-soft text-[#7a6c5c]";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border py-[7px] pl-3 pr-[15px] text-[13px] font-semibold tracking-[0.01em] ${styles}`}
    >
      <Search
        size={14}
        strokeWidth={2.6}
        className={tone === "dark" ? "text-[#e6b79f]" : "text-accent"}
      />
      {children}
    </span>
  );
}
