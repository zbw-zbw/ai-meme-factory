import type { SVGProps } from "react";
import type { IconName } from "@/types/meme";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
});

/* ===== Brand / Logo ===== */
export function LogoIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 7a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 17.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
    </svg>
  );
}

/* ===== Lightning ===== */
export function BoltIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

/* ===== Palette ===== */
export function PaletteIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3.5 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  );
}

/* ===== Share / Upload ===== */
export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v14" />
    </svg>
  );
}

/* ===== Pen / Write ===== */
export function PenIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

/* ===== Search ===== */
export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/* ===== Save / Download ===== */
export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

/* ===== Trash ===== */
export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

/* ===== Sparkles ===== */
export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
      <path d="M5 16l.6 1.8L7.5 18.5l-1.9.7L5 21l-.6-1.8L2.5 18.5l1.9-.7L5 16z" />
    </svg>
  );
}

/* ===== Refresh ===== */
export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

/* ===== Eye ===== */
export function EyeIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ===== Arrow Right ===== */
export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ===== Check ===== */
export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ===== Image / Gallery ===== */
export function ImageIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

/* ===== Alert / Error ===== */
export function AlertIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 2L1 21h22L12 2zm0 6l7.53 13H4.47L12 8zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z" />
    </svg>
  );
}

/* ===== Heart (for cute style) ===== */
export function HeartIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/* ===== Fire (for savage style) ===== */
export function FireIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.35 4 10.04 4 13c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  );
}

/* ===== Fish (for chill style) ===== */
export function FishIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M2 12c2-4 5-6 9-6 4 0 7 2 9 6-2 4-5 6-9 6-4 0-7-2-9-6zm9-3a3 3 0 100 6 3 3 0 000-6zm10 3l3-3v6l-3-3z" />
    </svg>
  );
}

/* ===== Briefcase (for formal style) ===== */
export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  );
}

/* ===== Copy ===== */
export function CopyIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

/* ===== Menu ===== */
export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

/* ===== Close ===== */
export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)} stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ===== Style Icon: maps IconName to the right SVG component ===== */
export function StyleIcon({ name, ...props }: { name: IconName } & IconProps) {
  switch (name) {
    case "heart":
      return <HeartIcon {...props} />;
    case "fire":
      return <FireIcon {...props} />;
    case "fish":
      return <FishIcon {...props} />;
    case "briefcase":
      return <BriefcaseIcon {...props} />;
    default:
      return null;
  }
}
