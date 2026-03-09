import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "EasyBuild 易构 — 企业级 Java 快速开发平台",
  description:
    "告别重复造轮子，EasyBuild 提供代码生成、微服务架构、ORM、缓存、消息队列等开箱即用能力，让团队专注业务创新。",
}
import { PanelCard } from "@/components/home/panel-card"
import { SectionHeader } from "@/components/home/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  capabilityCards,
  compareRows,
  footerMeta,
  heroPoints,
  impactCards,
  painColumns,
  productCards,
  standardItems,
  whyCards,
} from "@/lib/home-content"
import { accentTheme, siteTheme } from "@/lib/site-theme"
import { cn } from "@/lib/utils"

export default function Home() {
  const PrimaryIcon = footerMeta.primaryCta.icon
  const SecondaryIcon = footerMeta.secondaryCta.icon

  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(254,188,46,0.08),transparent_20%),linear-gradient(180deg,#0b0c0e_0%,#0b0c0e_100%)]" />
      <SiteHeader />
      <main className="relative">
        <section
          id="home"
          className="border-b border-white/5 px-0 pb-[100px] pt-[120px]"
        >
          <div className={siteTheme.container}>
            <div className="flex flex-col items-center gap-10 text-center">
              <div className="flex flex-col items-center gap-5">
                <h1 className="font-display text-[56px] font-bold tracking-[-0.06em] text-white md:text-[72px]">
                  易构 EasyBuild
                </h1>
                <p className="font-display text-[24px] font-semibold tracking-[-0.04em] text-[var(--brand)] md:text-[28px]">
                  你写业务，基建交给易构
                </p>
              </div>
              <p className="max-w-[700px] text-base leading-[1.8] text-[#9CA3AF] md:text-[18px]">
                从依赖治理到微服务架构，从后端基建到前端脚手架。
                <br />
                让你专注业务创新，而不是反复造轮子。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {heroPoints.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-[10px]">
                      <Icon className={cn("size-5", accentTheme[item.tone].text)} />
                      <span className="text-[15px] font-medium text-white">{item.label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className={cn(siteTheme.primaryButton, "h-auto px-9 py-4")}>
                  <a href={footerMeta.primaryCta.href}>
                    <PrimaryIcon className="size-4" />
                    {footerMeta.primaryCta.label}
                  </a>
                </Button>
                <Button asChild size="lg" className={cn(siteTheme.secondaryButton, "h-auto px-9 py-4")}>
                  <a href="#what-is">查看架构全景</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="what-is" className="px-0 pt-14 pb-12">
          <div className={siteTheme.container}>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[0.28em] text-[var(--brand-yellow)]">
                WHAT IS EASYBUILD
              </p>
              <h2 className="font-display text-[32px] font-bold tracking-[-0.04em] text-white md:text-[40px]">
                什么是易构？一套产品，武装全栈
              </h2>
              <p className="max-w-[650px] text-[16px] leading-[1.6] text-[#9CA3AF]">
                技术底座打地基、业务模块装内核、前端脚手架出界面、AI 加速全流程
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {productCards.map((item) => {
                const Icon = item.icon
                return (
                  <PanelCard key={item.title} className="gap-0 p-0">
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className={cn(siteTheme.iconWrap, accentTheme[item.tone].icon)}>
                        <Icon className="size-[22px]" />
                      </div>
                      <CardTitle className="font-display text-[18px] font-semibold tracking-[-0.03em] text-white">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-[14px] leading-[1.6] text-[#9CA3AF]">
                        {item.description}
                      </CardDescription>
                      <Badge
                        variant="ghost"
                        className={cn(
                          "h-auto w-fit rounded-[4px] px-[10px] py-1 font-mono text-[11px] font-medium hover:bg-transparent",
                          accentTheme[item.tone].tag
                        )}
                      >
                        {item.tag}
                      </Badge>
                    </CardContent>
                  </PanelCard>
                )
              })}
            </div>
            <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/[0.08] pt-6 text-center">
              <p className="font-mono text-[14px] font-semibold text-[var(--brand-yellow)]">
                易构 = 技术基建 + 业务基建 + 工程模板 + 智能生成
              </p>
              <p className="text-[16px] font-medium text-[#9CA3AF]">
                它让一个独立开发者，也能拥有高可用、高性能、可扩展的企业级架构能力。
              </p>
            </div>
          </div>
        </section>

        <section className={cn("px-0 py-20", siteTheme.sectionMuted)}>
          <div className={siteTheme.container}>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[0.28em] text-[var(--brand-red)]">
                PAIN POINTS
              </p>
              <h2 className="font-display text-[32px] font-bold tracking-[-0.04em] text-white md:text-[40px]">
                你是不是也这样？
              </h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {painColumns.map((column) => {
                const Icon = column.icon
                return (
                  <div key={column.title} className="flex flex-col gap-4">
                    <div className="flex items-center gap-[10px] rounded-[10px] border border-white/10 bg-white/[0.06] px-5 py-4">
                      <Icon className="size-5 text-[var(--brand)]" />
                      <h3 className="font-display text-[16px] font-semibold text-white">
                        {column.title}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      {column.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-[10px] rounded-[8px] bg-white/[0.04] px-5 py-3"
                        >
                          <span className="text-base text-[var(--brand-red)]">·</span>
                          <p className="text-[14px] text-[#9CA3AF]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center">
              <p className="text-[16px] text-[#6B7280]">停一下。</p>
              <h3 className="font-display text-[28px] font-bold leading-[1.5] tracking-[-0.03em] text-white">
                你缺的不是能力。你缺的是——
                <br />
                一套经过生产验证的标准化技术底座。
              </h3>
              <p className="text-[18px] font-semibold text-[var(--brand-red)]">
                这正是易构存在的意义。
              </p>
            </div>
          </div>
        </section>

        <section id="capabilities" className={siteTheme.section}>
          <div className={siteTheme.container}>
            <SectionHeader tag="CAPABILITIES" title="易构能为你做什么？" tone="yellow" />
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {capabilityCards.map((item) => {
                const Icon = item.icon
                return (
                  <PanelCard
                    key={item.title}
                    className={cn("gap-0 p-0", item.title === "AI + 易构" && "bg-[#FEBC2E0D]")}
                  >
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className={cn(siteTheme.iconWrap, accentTheme[item.tone].icon)}>
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="font-display text-[18px] font-semibold tracking-[-0.03em] text-white">
                        {item.title}
                      </CardTitle>
                      <CardDescription
                        className="whitespace-pre-line text-[13px] leading-[1.8] text-[#9CA3AF]"
                      >
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </PanelCard>
                )
              })}
            </div>
          </div>
        </section>

        <section id="why" className={cn(siteTheme.section, siteTheme.sectionMuted)}>
          <div className={siteTheme.container}>
            <SectionHeader
              tag="WHY EASYBUILD"
              title="为什么用易构，而不是继续手写？"
              tone="red"
            />
            <div className="mt-10 space-y-4">
              <PanelCard className="gap-0 p-0">
                <CardContent className="space-y-5 p-7">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">🔥</span>
                    <CardTitle className="font-display text-[20px] font-semibold text-white">
                      时间成本对比
                    </CardTitle>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-white/5">
                    <Table>
                      <TableHeader className="[&_tr]:border-white/5">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="bg-[rgba(0,255,136,0.04)] px-4 py-3 font-mono text-[#9CA3AF]">
                            场景
                          </TableHead>
                          <TableHead className="bg-[rgba(0,255,136,0.04)] px-4 py-3 font-mono text-[#9CA3AF]">
                            传统开发
                          </TableHead>
                          <TableHead className="bg-[rgba(0,255,136,0.04)] px-4 py-3 font-mono text-[var(--brand)]">
                            易构
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="[&_tr]:border-white/5">
                        {compareRows.map((row) => (
                          <TableRow key={row.scene} className="hover:bg-white/[0.02]">
                            <TableCell className="px-4 py-3 text-white">{row.scene}</TableCell>
                            <TableCell className="px-4 py-3 font-mono text-[var(--brand-red)]">
                              {row.traditional}
                            </TableCell>
                            <TableCell className="px-4 py-3 font-mono font-semibold text-[var(--brand)]">
                              {row.easybuild}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </PanelCard>
              <div className="grid gap-4 lg:grid-cols-2">
                {whyCards.map((item) => (
                  <PanelCard key={item.title} className="gap-0 p-0">
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[20px]">🔥</span>
                        <CardTitle className="font-display text-[20px] font-semibold text-white">
                          {item.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="whitespace-pre-line text-[13px] leading-[1.8] text-[#9CA3AF]">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </PanelCard>
                ))}
              </div>
              <PanelCard className="gap-0 p-0">
                <CardContent className="space-y-5 p-7">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">🔥</span>
                    <CardTitle className="font-display text-[20px] font-semibold text-white">
                      统一工程规范
                    </CardTitle>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {standardItems.map((item) => (
                      <Badge
                        key={item}
                        variant="ghost"
                        className="flex h-auto items-center justify-center rounded-xl bg-white/[0.06] px-4 py-2.5 text-center font-mono text-[12px] font-normal text-[#9CA3AF] hover:bg-white/[0.08]"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-center text-[16px] leading-[1.6] font-semibold text-[var(--brand-red)]">
                    一个人，也能扛起高性能架构。一支小队，也能交出企业级品质。
                  </p>
                </CardContent>
              </PanelCard>
            </div>
          </div>
        </section>

        <section id="impact" className={siteTheme.section}>
          <div className={siteTheme.container}>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[0.28em] text-[var(--brand-yellow)]">
                IMPACT
              </p>
              <h2 className="font-display text-[32px] font-bold tracking-[-0.04em] text-white md:text-[40px]">
                易构，改变的不只是效率
              </h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {impactCards.map((item) => {
                const Icon = item.icon
                return (
                  <PanelCard key={item.title} className="gap-0 p-0">
                    <CardContent className="flex h-full flex-col gap-5 p-7">
                      <div className={cn("flex size-12 items-center justify-center rounded-[12px]", accentTheme[item.tone].icon)}>
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="font-display text-[18px] font-semibold tracking-[-0.03em] text-white">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="whitespace-pre-line text-[14px] leading-[1.8] text-[#9CA3AF]">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </PanelCard>
                )
              })}
            </div>
          </div>
        </section>

        <section id="get-started" className="px-0 py-[100px]">
          <div className={siteTheme.container}>
            <div className="flex flex-col items-center gap-8 text-center">
              <Badge
                variant="ghost"
                className="h-auto px-0 py-0 font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--brand-yellow)] hover:bg-transparent"
              >
                GET STARTED
              </Badge>
              <h2 className="font-display max-w-4xl text-[32px] font-bold tracking-[-0.04em] text-white md:text-[44px]">
                把复杂留给底座，把专注还给业务
              </h2>
              <p className="max-w-[600px] text-[18px] leading-[1.7] text-[#9CA3AF]">
                无论你是独立开发者、外包团队还是企业技术部，EasyBuild 易构都是你最值得信赖的好基友。
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className={cn(siteTheme.primaryButton, "h-auto px-10 py-4")}>
                  <a href={footerMeta.primaryCta.href}>
                    <PrimaryIcon className="size-4" />
                    {footerMeta.primaryCta.label}
                  </a>
                </Button>
                <Button asChild size="lg" className={cn(siteTheme.secondaryButton, "h-auto px-10 py-4")}>
                  <a href={footerMeta.secondaryCta.href}>
                    <SecondaryIcon className="size-4" />
                    {footerMeta.secondaryCta.label}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
