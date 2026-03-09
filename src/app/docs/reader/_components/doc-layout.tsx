"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ArrowDown, ArrowUp, Sparkles } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { tabs, sidebarSections } from "./sidebar-data"

export type OutlineItem = { id: string; label: string }

interface DocLayoutProps {
  outlineItems: OutlineItem[]
  breadcrumb: string
  title: string
  subtitle: string
  readingTime: string
  children: React.ReactNode
}

export function DocLayout({ outlineItems, breadcrumb, title, subtitle, readingTime, children }: DocLayoutProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(0)
  const [atTop, setAtTop] = useState(true)
  const [atBottom, setAtBottom] = useState(false)
  const [activeSection, setActiveSection] = useState(outlineItems[0]?.id ?? "")
  const contentWrapRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = contentWrapRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]')
    if (!viewport) return
    const onScroll = () => {
      setAtTop(viewport.scrollTop <= 100)
      setAtBottom(viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 100)

      let current = outlineItems[0]?.id ?? ""
      for (const item of outlineItems) {
        const el = document.getElementById(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) current = item.id
        }
      }
      setActiveSection(current)
    }
    viewport.addEventListener("scroll", onScroll, { passive: true })
    return () => viewport.removeEventListener("scroll", onScroll)
  }, [outlineItems])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: subtitle,
    url: `https://easybuild.mcst.com${pathname}`,
    publisher: { "@type": "Organization", name: "EasyBuild" },
    inLanguage: "zh-CN",
  }

  return (
    <div className="relative isolate h-screen overflow-hidden bg-[#0B0C0E] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Nav Bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#1F2937] bg-[#0B0C0E] px-6">
        <Link href="/docs" className="inline-flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-[#00FF88] font-display text-sm font-bold text-[#0B0C0E]">
            E
          </span>
          <span className="font-display text-[15px] font-bold text-white">EasyBuild Docs</span>
        </Link>
        <div className="flex items-center gap-2 text-[13px] text-[#525252]">
          <span>文档</span>
          <span>/</span>
          <span>后端</span>
          <span>/</span>
          <span className="font-medium text-[#9CA3AF]">{breadcrumb}</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-[#1F2937] bg-white/[0.03] px-3 py-1.5"
        >
          <Search className="size-3.5 text-[#525252]" />
          <span className="text-[12px] text-[#525252]">搜索文档...</span>
          <span className="font-mono text-[11px] text-[#525252]">⌘K</span>
        </button>
      </header>

      {/* Doc Body */}
      <div className="flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        {/* Left Sidebar */}
        <aside className="sticky top-14 h-[calc(100vh-56px)] w-[280px] shrink-0 border-r border-[#1F2937] bg-[#0A0B0D]">
          <div className="flex border-b border-[#1F2937]">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex h-10 flex-1 items-center justify-center text-[12px]",
                  i === activeTab
                    ? "border-b-2 border-[#00FF88] font-semibold text-white"
                    : "font-medium text-[#525252]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <ScrollArea className="h-[calc(100vh-56px-40px)]">
            <nav className="flex flex-col gap-0.5 py-4">
              {sidebarSections.map((section, si) => (
                <div key={si}>
                  {section.title && (
                    <div className="flex h-9 items-center px-4">
                      <span className="font-mono text-[13px] font-semibold tracking-[0.5px] text-[#9CA3AF]">
                        {section.title}
                      </span>
                    </div>
                  )}
                  {section.items.map((item) => {
                    const isActive = item.href === pathname
                    return isActive ? (
                      <div
                        key={item.label}
                        className="flex h-9 items-center border-l-[3px] border-[#00FF88] bg-gradient-to-r from-[#00FF8812] to-transparent px-5 text-[13px] font-semibold text-white"
                      >
                        {item.label}
                      </div>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex h-9 items-center px-5 text-[13px] text-[#9CA3AF]"
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <div ref={contentWrapRef} className="relative flex-1">
        <ScrollArea className="h-[calc(100vh-56px)]">
          <div ref={topRef} />
          <div className="mx-auto max-w-[800px] px-[60px] py-10">
            <div className="flex flex-col gap-8">

              <h1 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>{subtitle}</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 {readingTime}</span>
              </div>
              <div className="h-px bg-[#1F2937]" />

              {children}

              {/* Footer */}
              <div className="h-px bg-[#1F2937]" />
              <div className="flex justify-center py-6">
                <span className="font-mono text-[12px] text-[#525252]">— END —</span>
              </div>

            </div>
          </div>
          <div ref={bottomRef} />
        </ScrollArea>
        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
          <button
            type="button"
            disabled={atTop}
            onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border transition-colors",
              atTop
                ? "cursor-not-allowed border-[#1F2937]/50 bg-[#161B22]/50 text-[#525252]/30"
                : "border-[#1F2937] bg-[#161B22] text-[#525252] hover:border-[#374151] hover:text-[#9CA3AF]"
            )}
            title="回到顶部"
          >
            <ArrowUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={atBottom}
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border transition-colors",
              atBottom
                ? "cursor-not-allowed border-[#1F2937]/50 bg-[#161B22]/50 text-[#525252]/30"
                : "border-[#1F2937] bg-[#161B22] text-[#525252] hover:border-[#374151] hover:text-[#9CA3AF]"
            )}
            title="回到底部"
          >
            <ArrowDown className="size-4" />
          </button>
        </div>
        </div>

        {/* Right Sidebar */}
        <aside className="sticky top-14 h-[calc(100vh-56px)] w-[240px] shrink-0 border-l border-[#1F2937] bg-[#0A0B0D]">
          <ScrollArea className="h-full px-6 py-10">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#525252]">本页大纲</span>
              <div className="flex flex-col">
                {outlineItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "flex h-8 items-center border-l-2 px-3 text-left text-[12px] transition-colors",
                      activeSection === item.id
                        ? "border-[#00FF88] font-medium text-[#00FF88]"
                        : "border-transparent text-[#737373] hover:text-[#9CA3AF]"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* AI Floating Button - 暂时隐藏，待功能实现后启用
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <div className="rounded-lg border border-[#1F2937] bg-[#161B22] px-3.5 py-2 text-[12px] text-[#9CA3AF]">
          对文档有疑问？问 AI
        </div>
        <button
          type="button"
          className="flex size-[52px] items-center justify-center rounded-full bg-[#00FF88] shadow-[0_4px_20px_#00FF8840] transition-transform hover:scale-105"
        >
          <Sparkles className="size-6 text-[#0B0C0E]" />
        </button>
      </div>
      */}
    </div>
  )
}
