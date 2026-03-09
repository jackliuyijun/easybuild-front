import type { Metadata } from "next"
import Image from "next/image"
import { GraduationCap, Handshake, Package, Rocket, UserCog, Users } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "合作咨询 — 商业授权与技术服务",
  description:
    "EasyBuild 提供商业源码授权、项目外包开发、技术顾问驻场、企业内训等多种合作模式，灵活长期保障，助力团队快速交付。",
}

const heroStats = [
  { value: "灵活", color: "#00FF88", label: "多种合作模式，总有一款适合你" },
  { value: "长期", color: "#FBBF24", label: "持续迭代，陪伴式服务" },
  { value: "保障", color: "#60A5FA", label: "负责到底，不让你踩坑" },
]

const coreCards = [
  {
    icon: Package,
    iconColor: "#00FF88",
    title: "商业源码授权",
    slogan: "即使没有我，你的团队也能掌控一切",
    sloganColor: "#00FF8890",
    border: "#00FF8835",
    shadow: "0 0 30px rgba(0,255,136,0.06)",
    recommended: true,
    items: [
      { emoji: "📦", text: "100% 源码交付：含后端 EasyFK、前端 Admin、代码生成器、业务模块" },
      { emoji: "©️", text: "商业无忧：签订正规授权合同，允许无限次商业使用" },
      { emoji: "🔄", text: "永久更新：享受后续版本免费升级权益" },
      { emoji: "🛡️", text: "专属社群：加入 VIP 开发者群，优先技术支持" },
    ],
    targets: ["软件外包", "企业 IT", "独立开发者"],
    btnText: "查看定价方案",
    btnStyle: "filled" as const,
    btnColor: "#00FF88",
  },
  {
    icon: Rocket,
    iconColor: "#60A5FA",
    title: "MVP 极速定制开发",
    slogan: "您出想法，我出技术，两周上线",
    sloganColor: "#60A5FA90",
    border: "#60A5FA25",
    shadow: "none",
    recommended: false,
    items: [
      { emoji: "⚡", text: "十倍速交付：基于 EasyBuild 底座，节省 80% 重复开发时间" },
      { emoji: "💎", text: "大厂级质量：资深架构师亲码，性能与扩展性兼备" },
      { emoji: "📱", text: "全端覆盖：Web 后台 + 小程序 + APP 一站式打通" },
      { emoji: "🔧", text: "维保期支持：项目上线后的技术兜底与维护" },
    ],
    targets: ["初创公司", "项目经理"],
    btnText: "预约沟通",
    btnStyle: "outline" as const,
    btnColor: "#60A5FA",
  },
]

const ecoCards = [
  {
    icon: Handshake,
    iconColor: "#FBBF24",
    title: "渠道分销与推广合作",
    slogan: "共享技术红利，最高 30%~50% 佣金分成",
    sloganColor: "#FBBF2490",
    border: "#FBBF2425",
    highlight: { emoji: "💰", text: "超高佣金分成比例", color: "#FBBF24", bg: "#FBBF240A", border: "#FBBF2420", fontSize: 14 },
    items: [
      { emoji: "📢", text: "技术博主/UP主：文章/视频植入，专属链接成交" },
      { emoji: "🤝", text: "线下代理：作为解决方案组件，可贴牌推销" },
      { emoji: "🔗", text: "资源置换：开发者社群/私域流量联合推广" },
    ],
    targets: ["技术博主", "SaaS代理", "社群群主"],
    btnText: "申请成为合伙人",
    btnColor: "#FBBF24",
  },
  {
    icon: UserCog,
    iconColor: "#A78BFA",
    title: "兼职 CTO / 架构顾问",
    slogan: "1/5 成本，雇佣十年大厂级架构师",
    sloganColor: "#A78BFA90",
    border: "#A78BFA25",
    highlight: null,
    items: [
      { emoji: "🏗️", text: "架构设计与评审：把关技术选型，避免起步即重构" },
      { emoji: "🔍", text: "代码审计：定期检查代码质量，优化核心链路" },
      { emoji: "🔥", text: "疑难杂症攻坚：解决死锁、OOM、高并发瓶颈" },
      { emoji: "👥", text: "团队面试：协助筛选核心开发，把控人才质量" },
    ],
    targets: ["缺 CTO 的中小企业"],
    btnText: "预约沟通",
    btnColor: "#A78BFA",
  },
  {
    icon: GraduationCap,
    iconColor: "#F472B6",
    title: "技术团队赋能与内训",
    slogan: "授人以渔，提升团队整体战斗力",
    sloganColor: "#F472B690",
    border: "#F472B625",
    highlight: null,
    items: [
      { emoji: "🎓", text: "EasyBuild 深度实战：手把手教团队用好框架" },
      { emoji: "🚀", text: "高并发架构演进：Disruptor、Netty、DDD 等高阶技术" },
      { emoji: "📜", text: "代码规范与工程化：建立大厂级研发流程" },
    ],
    targets: ["购买源码的团队", "提升技术氛围"],
    btnText: "预约沟通",
    btnColor: "#F472B6",
  },
  {
    icon: Users,
    iconColor: "#06B6D4",
    title: "资源合作伙伴",
    slogan: "你有客户，我有技术，一起落地",
    sloganColor: "#06B6D490",
    border: "#06B6D425",
    highlight: { emoji: "🚀", text: "你接单，我交付，利润共享", color: "#06B6D4", bg: "#06B6D40A", border: "#06B6D420", fontSize: 14 },
    items: [
      { emoji: "💼", text: "销售/BD：有客户需求但缺技术团队，我来做开发交付" },
      { emoji: "🎯", text: "行业人脉：客户转介绍即可获得项目分成" },
      { emoji: "🔗", text: "零门槛：无需懂技术，只要有客户资源就能合作" },
    ],
    targets: ["销售人员", "BD经理", "行业资源方"],
    btnText: "成为资源合伙人",
    btnColor: "#06B6D4",
  },
]

const steps = [
  { num: "01", color: "#00FF88", title: "聊需求", desc: "加微信，说说你的想法" },
  { num: "02", color: "#60A5FA", title: "定方案", desc: "明确范围和节奏" },
  { num: "03", color: "#A78BFA", title: "保障服务", desc: "负责到底，后顾无忧" },
]

export default function CooperationPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(254,188,46,0.08),transparent_20%),linear-gradient(180deg,#0b0c0e_0%,#0b0c0e_100%)]" />
      <SiteHeader />

      <main className="relative">
        <section className="pt-[120px] pb-[100px]">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-20">
            <div className="flex flex-col items-center gap-10 text-center">
              <div className="flex flex-col items-center gap-5">
                <h1 className="font-display text-[56px] font-bold tracking-[-2px] text-white md:text-[72px]">
                  灵活合作，价值共生
                </h1>
                <p className="font-display text-[24px] font-semibold text-[#00FF88] md:text-[28px]">
                  连接技术与商业，构建共赢生态
                </p>
              </div>

              <p className="max-w-[700px] text-[18px] leading-[1.8] text-[#9CA3AF]">
                不止于代码交付，更提供从架构设计、团队赋能到商业变现的全链路支持
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {heroStats.map((s) => (
                  <div key={s.value} className="flex flex-col items-center gap-1">
                    <span className="font-display text-[36px] font-bold" style={{ color: s.color }}>{s.value}</span>
                    <span className="text-[13px] text-[#9CA3AF]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: "linear-gradient(180deg, #0B0C0E 0%, #0D1117 50%, #0B0C0E 100%)" }} className="pb-16">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-20">
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">CORE PRODUCTS</p>
                <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">核心产品与服务</h2>
              </div>

              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                {coreCards.map((c) => {
                  const Icon = c.icon
                  return (
                    <div
                      key={c.title}
                      className="flex min-h-[460px] flex-col gap-5 rounded-2xl bg-white/[0.024] p-8"
                      style={{ border: `1px solid ${c.border}`, boxShadow: c.shadow }}
                    >
                      <div className="flex w-full items-center justify-between">
                        <Icon size={40} style={{ color: c.iconColor }} />
                        {c.recommended && (
                          <span className="rounded-full bg-[#00FF8818] px-3 py-1 text-[11px] font-semibold text-[#00FF88]">⭐ 推荐</span>
                        )}
                      </div>
                      <h3 className="font-display text-[24px] font-bold text-white">{c.title}</h3>
                      <p className="text-[14px] font-medium italic" style={{ color: c.sloganColor }}>{c.slogan}</p>
                      <div className="h-px w-full bg-[#1F2937]" />
                      <div className="flex flex-1 flex-col gap-3">
                        {c.items.map((item) => (
                          <div key={item.text} className="flex gap-2.5">
                            <span className="shrink-0 text-[14px]">{item.emoji}</span>
                            <span className="text-[13px] leading-[1.6] text-[#9CA3AF]">{item.text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#525252]">适合：</span>
                        <div className="flex items-center gap-2">
                          {c.targets.map((t) => (
                            <span key={t} className="rounded bg-white/[0.03] px-2 py-[3px] text-[11px] text-[#737373]">{t}</span>
                          ))}
                        </div>
                      </div>
                      {c.btnStyle === "filled" ? (
                        <div
                          className="flex h-11 w-full items-center justify-center rounded-lg text-[14px] font-semibold text-[#0B0C0E]"
                          style={{ backgroundColor: c.btnColor }}
                        >
                          {c.btnText}
                        </div>
                      ) : (
                        <div
                          className="flex h-11 w-full items-center justify-center rounded-lg text-[14px] font-semibold"
                          style={{ color: c.btnColor, border: `1px solid ${c.btnColor}` }}
                        >
                          {c.btnText}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0B0C0E] py-16">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-20">
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">ECOSYSTEM & EXPERT</p>
                <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">生态合作与专业服务</h2>
              </div>

              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {ecoCards.map((c) => {
                  const Icon = c.icon
                  return (
                    <div
                      key={c.title}
                      className="flex flex-col gap-5 rounded-2xl bg-white/[0.024] p-7"
                      style={{ border: `1px solid ${c.border}` }}
                    >
                      <div className="flex size-10 items-center justify-center">
                        <Icon size={28} style={{ color: c.iconColor }} />
                      </div>
                      <h3 className="font-display text-[20px] font-bold text-white">{c.title}</h3>
                      <p className="text-[13px] font-medium" style={{ color: c.sloganColor }}>{c.slogan}</p>

                      {c.highlight && (
                        <div
                          className="flex w-full items-center justify-center rounded-lg px-4 py-3"
                          style={{ backgroundColor: c.highlight.bg, border: `1px solid ${c.highlight.border}` }}
                        >
                          <span className="font-display font-bold" style={{ color: c.highlight.color, fontSize: c.highlight.fontSize }}>
                            {c.highlight.emoji} {c.highlight.text}
                          </span>
                        </div>
                      )}

                      <div className="h-px w-full bg-[#1F2937]" />

                      <div className="flex flex-1 flex-col gap-2.5">
                        {c.items.map((item) => (
                          <div key={item.text} className="flex gap-2">
                            <span className="shrink-0 text-[13px]">{item.emoji}</span>
                            <span className="text-[12px] leading-[1.6] text-[#9CA3AF]">{item.text}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] text-[#525252]">适合：</span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {c.targets.map((t) => (
                              <span key={t} className="rounded bg-white/[0.03] px-2 py-[3px] text-[10px] text-[#737373]">{t}</span>
                            ))}
                          </div>
                        </div>

                        <div
                          className="flex h-10 w-full shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold"
                          style={{ color: c.btnColor, border: `1px solid ${c.btnColor}` }}
                        >
                          {c.btnText}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: "linear-gradient(180deg, #0B0C0E 0%, #0D1117 50%, #0B0C0E 100%)" }} className="py-16">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-20">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">HOW IT WORKS</p>
                <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">三步开始合作</h2>
              </div>

              <div className="flex w-full flex-col items-center gap-8 md:flex-row md:gap-0">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex flex-1 flex-col items-center md:flex-row">
                    <div className="flex flex-1 flex-col items-center gap-4">
                      <div
                        className="flex size-14 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: `${s.color}10`, border: `1px solid ${s.color}30` }}
                      >
                        <span className="font-display text-[22px] font-bold" style={{ color: s.color }}>{s.num}</span>
                      </div>
                      <span className="text-[16px] font-semibold text-white">{s.title}</span>
                      <span className="text-[13px] text-[#9CA3AF]">{s.desc}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="hidden w-[60px] items-center justify-center md:flex">
                        <div
                          className="h-0.5 w-10 rounded-sm"
                          style={{
                            background: `linear-gradient(90deg, ${steps[i].color}40, ${steps[i + 1].color}40)`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-20">
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">CONTACT US</p>
                <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">有任何需求或疑问，欢迎随时骚扰</h2>
                <p className="text-[16px] text-[#9CA3AF]">添加微信时请备注来意，方便我们更快响应您的需求</p>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-[#00FF8825] bg-gradient-to-b from-[#00FF8808] to-transparent p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,136,0.08),transparent_60%)]" />
                <div className="relative flex flex-col items-center gap-6">
                  <div className="rounded-2xl border border-[#00FF8815] bg-white p-3 shadow-[0_0_40px_rgba(0,255,136,0.06)]">
                    <Image
                      src="/images/10004.png"
                      alt="微信二维码"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[15px] font-medium text-white">扫码添加微信</span>
                    <span className="text-[13px] text-[#525252]">微信号：eb-jack</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-lg bg-[#00FF88] px-10 py-3.5 shadow-[0_0_30px_rgba(0,255,136,0.15)] transition-shadow hover:shadow-[0_0_40px_rgba(0,255,136,0.25)]">
                <span className="text-[15px] font-semibold text-[#0B0C0E]">添加微信，聊聊您的需求或想法</span>
              </div>

              <p className="text-[12px] text-[#525252]">商务咨询免费，不强制销售，只提供专业建议</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
