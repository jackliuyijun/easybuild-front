import Link from "next/link"

import { cn } from "@/lib/utils"

type SiteLogoProps = {
  compact?: boolean
  className?: string
}

export function SiteLogo({ compact = false, className }: SiteLogoProps) {
  return (
    <Link
      href="#home"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="EasyBuild"
    >
      <span className="font-display flex size-7 items-center justify-center rounded-md bg-[var(--brand)] text-[11px] font-bold text-[#0B0C0E]">
        EB
      </span>
      {!compact ? (
        <span className="font-display text-xl font-bold tracking-[-0.03em] text-white">
          EasyBuild
        </span>
      ) : null}
    </Link>
  )
}
