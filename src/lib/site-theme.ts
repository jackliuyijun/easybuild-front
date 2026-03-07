export const siteTheme = {
  container: "mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10",
  section: "py-14 md:py-20",
  sectionMuted:
    "bg-[linear-gradient(180deg,#0b0c0e_0%,#0d1117_50%,#0b0c0e_100%)]",
  panel:
    "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-[20px]",
  panelSoft:
    "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-[16px]",
  rowSoft: "rounded-xl bg-white/[0.04]",
  iconWrap: "flex size-11 items-center justify-center rounded-xl",
  title: "font-display tracking-[-0.04em] text-white",
  body: "text-sm leading-7 text-[#9CA3AF] md:text-base",
  mono: "font-mono text-[11px] uppercase tracking-[0.28em]",
  primaryButton:
    "border-0 bg-[var(--brand)] text-[#0B0C0E] shadow-[0_0_32px_rgba(0,255,136,0.22)] hover:bg-[#3aff9f]",
  secondaryButton:
    "border border-white/10 bg-white/[0.06] text-[#9CA3AF] hover:bg-white/[0.1] hover:text-white",
} as const

export const accentTheme = {
  green: {
    text: "text-[var(--brand)]",
    icon: "bg-[rgba(0,255,136,0.08)] text-[var(--brand)]",
    tag: "bg-[rgba(0,255,136,0.08)] text-[var(--brand)]",
  },
  yellow: {
    text: "text-[var(--brand-yellow)]",
    icon: "bg-[rgba(254,188,46,0.10)] text-[var(--brand-yellow)]",
    tag: "bg-[rgba(254,188,46,0.08)] text-[var(--brand-yellow)]",
  },
  red: {
    text: "text-[var(--brand-red)]",
    icon: "bg-[rgba(255,95,87,0.10)] text-[var(--brand-red)]",
    tag: "bg-[rgba(255,95,87,0.08)] text-[var(--brand-red)]",
  },
} as const

export type AccentTone = keyof typeof accentTheme
