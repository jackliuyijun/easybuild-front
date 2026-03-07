import Link from "next/link"

import { footerColumns, footerMeta } from "@/lib/home-content"

export function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-[#1F2937] bg-[#080909]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-10 md:px-10 xl:px-20">
        <div className="flex flex-col items-start gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-10 lg:pt-1">
            {footerColumns.map((group) => (
              <div key={group.title} className="mx-auto flex min-w-[96px] flex-col items-center gap-3">
                <h3 className="text-center text-[13px] font-semibold text-white">{group.title}</h3>
                <div className="flex flex-col items-center gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link}
                      href="#footer"
                      className="text-center text-[13px] text-[#6B7280] transition-colors hover:text-white"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full max-w-[300px] space-y-3 lg:ml-auto lg:pt-1 lg:text-right">
            <Link
              href="#home"
              className="inline-flex items-center gap-2.5 lg:justify-end"
              aria-label="EasyBuild"
            >
              <span className="font-display flex size-[22px] items-center justify-center rounded-[5px] bg-[var(--brand)] text-[12px] font-bold text-[#0B0C0E]">
                E
              </span>
              <span className="font-display text-[17px] font-bold tracking-[-0.03em] text-white">
                EasyBuild
              </span>
            </Link>
            <p className="text-[13px] text-[#6B7280]">{footerMeta.slogan}</p>
            {footerMeta.lines.map((line) => (
              <p key={line} className="text-[13px] leading-[1.6] text-[#9CA3AF]">
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-3 border-t border-[#1F2937] pt-5 text-[11px] text-[#4B5563] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">{footerMeta.version}</p>
          <p>{footerMeta.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
