import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Blocks, Cpu, Flame, Monitor, Smartphone, TabletSmartphone } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "技术文档中心 — EasyBuild 开发指南",
  description:
    "EasyBuild 全栈技术文档，涵盖核心框架、ORM、缓存、消息队列、RPC、分布式锁、网关等 28 个模块的详细使用指南。",
}

const topCards = [
  {
    icon: Cpu,
    iconColor: "#00FF88",
    title: "核心框架 EasyFK",
    desc: "深入了解框架架构设计、核心原理与技术\n实现，掌握从设计到落地的全流程",
    tag: "Architecture · Principle · Core",
    tagColor: "#00FF88",
    tagBorder: "#00FF8840",
    border: "#00FF8825",
    href: "/docs/reader/core",
  },
  {
    icon: Blocks,
    iconColor: "#60A5FA",
    title: "业务模块",
    desc: "权限管理、基础数据、内容运营、系统\n配置等通用业务模块的使用指南",
    tag: "RBAC · CRUD · Modules",
    tagColor: "#60A5FA",
    tagBorder: "#60A5FA40",
    border: "#60A5FA25",
    href: "/docs/reader/auth",
  },
]

const bottomCards = [
  {
    icon: Monitor,
    iconColor: "#FBBF24",
    title: "中后台",
    desc: "Web 端管理系统开发指南\n与最佳实践",
    border: "#FBBF2425",
    href: "/docs/reader/admin",
  },
  {
    icon: Smartphone,
    iconColor: "#A78BFA",
    title: "小程序",
    desc: "微信/支付宝小程序\n开发与部署指南",
    border: "#A78BFA25",
    href: "/docs/reader",
  },
  {
    icon: TabletSmartphone,
    iconColor: "#F472B6",
    title: "APP",
    desc: "iOS / Android 原生应用\n开发框架与实践",
    border: "#F472B625",
    href: "/docs/reader",
  },
]

const hotDocs = [
  { num: "01", title: "快速上手：5分钟搭建你的第一个 CRUD 页面", tag: "核心框架" },
  { num: "02", title: "RBAC 权限体系完整配置指南", tag: "业务模块" },
  { num: "03", title: "动态路由与菜单注册机制详解", tag: "核心框架" },
  { num: "04", title: "中后台表格组件高级用法", tag: "中后台" },
  { num: "05", title: "微信小程序接入与发布流程", tag: "小程序" },
]

const searchHints = ["如何配置RBAC权限？", "EasyFK架构原理", "小程序快速上手"]

export default function DocsPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(254,188,46,0.08),transparent_20%),linear-gradient(180deg,#0b0c0e_0%,#0b0c0e_100%)]" />
      <SiteHeader />

      <main className="relative">
        {/* Hero Area */}
        <section className="px-0 pb-[100px] pt-[120px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-10 text-center">
              <div className="flex flex-col items-center gap-5">
                <h1 className="font-display text-[56px] font-bold tracking-[-2px] text-white md:text-[72px]">
                  EasyBuild 文档中心
                </h1>
                <p className="font-display text-[24px] font-semibold text-[#00FF88] md:text-[28px]">从快速上手到深度定制，一切尽在掌握</p>
              </div>

              {/* Terminal Search */}
              <div className="w-[720px] overflow-hidden rounded-xl border border-[#00FF8830] bg-[#0D1117] shadow-[0_0_40px_rgba(0,255,136,0.08)]">
                <div className="flex h-10 items-center gap-2 border-b border-[#1F2937] px-4">
                  <span className="size-3 rounded-full bg-[#FF5F57]" />
                  <span className="size-3 rounded-full bg-[#FEBC2E]" />
                  <span className="size-3 rounded-full bg-[#28C840]" />
                  <span className="ml-1 font-mono text-[11px] text-[#525252]">  easybuild-docs ~ terminal</span>
                </div>
                <div className="flex flex-col gap-3 px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[16px] font-semibold text-[#00FF88]">&gt;</span>
                    <span className="font-mono text-[16px] text-[#525252]">Ask EasyBuild anything...</span>
                    <span className="h-5 w-0.5 bg-[#00FF88]" />
                  </div>
                  <div className="flex items-center gap-3">
                    {searchHints.map((h) => (
                      <span key={h} className="rounded border border-[#1F2937] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-[#737373]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcut */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#525252]">快捷键</span>
                <span className="rounded border border-[#1F2937] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">⌘ K</span>
                <span className="text-[12px] text-[#525252]">或</span>
                <span className="rounded border border-[#1F2937] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">/</span>
                <span className="text-[12px] text-[#525252]">开始搜索</span>
              </div>
            </div>
          </div>
        </section>

        {/* Module Grid Section */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 pb-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-col items-center text-center">
                <h2 className="font-display text-[28px] font-bold tracking-[-1px] text-white">探索文档</h2>
                <p className="mt-4 text-[14px] text-[#737373]">选择你感兴趣的方向，开启学习之旅</p>
              </div>

              <div className="flex w-full flex-col gap-5">
                {/* Top Row - 2 large cards */}
                <div className="grid grid-cols-2 gap-5">
                  {topCards.map((c) => {
                    const Icon = c.icon
                    return (
                      <Link
                        key={c.title}
                        href={c.href}
                        className="flex h-[240px] flex-col gap-4 rounded-2xl bg-white/[0.024] p-8 transition-colors hover:bg-white/[0.04]"
                        style={{ border: `1px solid ${c.border}` }}
                      >
                        <Icon size={40} style={{ color: c.iconColor }} />
                        <h3 className="font-display text-[24px] font-bold text-white">{c.title}</h3>
                        <p className="whitespace-pre-line text-[14px] leading-[1.7] text-[#9CA3AF]">{c.desc}</p>
                        <span
                          className="inline-flex self-start rounded-full px-3 py-1 font-mono text-[10px] font-medium"
                          style={{ color: c.tagColor, border: `1px solid ${c.tagBorder}` }}
                        >
                          {c.tag}
                        </span>
                      </Link>
                    )
                  })}
                </div>

                {/* Bottom Row - 3 smaller cards */}
                <div className="grid grid-cols-3 gap-5">
                  {bottomCards.map((c) => {
                    const Icon = c.icon
                    return (
                      <Link
                        key={c.title}
                        href={c.href}
                        className="flex h-[180px] flex-col gap-3 rounded-2xl bg-white/[0.024] p-7 transition-colors hover:bg-white/[0.04]"
                        style={{ border: `1px solid ${c.border}` }}
                      >
                        <Icon size={32} style={{ color: c.iconColor }} />
                        <h3 className="font-display text-[20px] font-bold text-white">{c.title}</h3>
                        <p className="whitespace-pre-line text-[13px] leading-[1.6] text-[#9CA3AF]">{c.desc}</p>
                        <span className="text-[18px]" style={{ color: c.iconColor }}>→</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Docs Section */}
        <section className="bg-[#0B0C0E] px-0 pb-16 pt-12">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame size={20} className="text-[#FF5F57]" />
                  <h3 className="font-display text-[20px] font-bold text-white">热门文档</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] text-[#525252]">查看全部</span>
                  <ArrowRight size={14} className="text-[#525252]" />
                </div>
              </div>

              <div className="flex flex-col">
                {hotDocs.map((d, i) => (
                  <div
                    key={d.num}
                    className={`flex h-[52px] items-center justify-between px-4 ${i < hotDocs.length - 1 ? "border-b border-[#1F2937]" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[14px] font-semibold text-[#00FF88]">{d.num}</span>
                      <span className="text-[14px] font-medium text-[#E5E5E5]">{d.title}</span>
                    </div>
                    <span className="text-[12px] text-[#525252]">{d.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
