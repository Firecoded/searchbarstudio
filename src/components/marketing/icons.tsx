type IconProps = { className?: string; size?: number; strokeWidth?: number };

function Svg({
  className,
  size = 24,
  strokeWidth = 2,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const Search = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.3}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </Svg>
);

export const ArrowRight = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.4}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.4}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.4}>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </Svg>
);

export const Menu = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </Svg>
);

export const DesignRuler = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 1.9}>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </Svg>
);

export const Shield = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 1.9}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

export const Chat = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 1.9}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const Mail = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </Svg>
);

export const Instagram = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </Svg>
);
