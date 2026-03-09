import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "AI+ 智能开发 — AI 驱动的高效编码体验",
  description:
    "EasyBuild 结合 AI 能力，通过标准化工程结构与代码生成，让 AI 编码效率提升数倍，从噪音到信号，让 AI 真正读懂你的项目。",
}

const noiseTree = [
  { text: "src/", color: "#9CA3AF" },
  { text: "  utils/", color: "#6B7280" },
  { text: "  helpers/", color: "#6B7280" },
  { text: "  common/", color: "#6B7280" },
  { text: "  UserCtrl.java    ❌ 混乱命名", color: "#EF444480" },
  { text: "  myService.java   ❌ 无规范", color: "#EF444480" },
  { text: "  DataHelper.java  ❌ 职责不清", color: "#EF444480" },
]

const signalTree = [
  { text: "com.easybuild.module/", color: "#00FF88" },
  { text: "  controller/     ✅ 接口层", color: "#00FF8880" },
  { text: "  service/        ✅ 业务层", color: "#00FF8880" },
  { text: "  mapper/         ✅ 数据层", color: "#00FF8880" },
  { text: "  entity/         ✅ 实体层", color: "#00FF8880" },
  { text: "  dto/            ✅ 传输层", color: "#00FF8880" },
  { text: "  vo/             ✅ 视图层", color: "#00FF8880" },
]

const signalAdvantages = [
  "固定分层：AI 默认知道代码该往哪写",
  "统一基类：AI 自动继承 BaseEntity / BaseController",
  "零噪音：基础设施已封装，AI 只需专注填充业务逻辑",
]

const configYml = [
  { text: "project:", color: "#A78BFA" },
  { text: "  name: ecommerce-service", color: "#E5E7EB" },
  { text: "  version: 1.0.0", color: "#E5E7EB" },
  { text: "  architecture: microservice", color: "#00FF88" },
  { text: " ", color: "#9CA3AF" },
  { text: "database:", color: "#A78BFA" },
  { text: "  type: mysql", color: "#E5E7EB" },
  { text: "  orm: mybatis-flex", color: "#00FF88" },
  { text: " ", color: "#9CA3AF" },
  { text: "cache:", color: "#A78BFA" },
  { text: "  type: redis", color: "#E5E7EB" },
  { text: " ", color: "#9CA3AF" },
  { text: "mq:", color: "#A78BFA" },
  { text: "  type: rocketmq", color: "#E5E7EB" },
  { text: " ", color: "#9CA3AF" },
  { text: "build: gradle  # auto-configured", color: "#6B7280", italic: true },
]

const skillCards = [
  {
    title: "场景 A：分布式锁",
    withoutCode: [
      { text: "RLock lock = redisson.getLock(key);", color: "#EF444480" },
      { text: "try {", color: "#EF444480" },
      { text: "  lock.lock(30, TimeUnit.SECONDS);", color: "#EF444480" },
      { text: "  // business logic...", color: "#6B7280", italic: true },
      { text: "} finally {", color: "#EF444480" },
      { text: "  lock.unlock();", color: "#EF444480" },
      { text: "}", color: "#EF444480" },
    ],
    withoutDesc: "AI 生成了 20 行 Redisson 的 try-catch 代码",
    withCode: [
      { text: '@EasyLock(key = "#id")', color: "#00FF88", size: 13, bold: true },
      { text: "public void process(Long id) {", color: "#E5E7EB" },
      { text: "  // business logic only", color: "#6B7280", italic: true },
      { text: "}", color: "#E5E7EB" },
    ],
    withDesc: "一行注解搞定，代码减少 90%",
  },
  {
    title: "场景 B：缓存",
    withoutCode: [
      { text: "redisTemplate", color: "#EF444480" },
      { text: "  .opsForValue()", color: "#EF444480" },
      { text: '  .set(key, val, 30, TimeUnit.MIN);', color: "#EF444480" },
      { text: "// + get, delete, refresh...", color: "#6B7280", italic: true },
    ],
    withoutDesc: "AI 手写 RedisTemplate 繁琐操作",
    withCode: [
      { text: '@Cacheable(key = "user:#id")', color: "#00FF88", size: 13, bold: true },
      { text: "public User getUser(Long id) {", color: "#E5E7EB" },
      { text: "  return userMapper.selectById(id);", color: "#E5E7EB" },
      { text: "}", color: "#E5E7EB" },
    ],
    withDesc: "注解驱动缓存，自动管理生命周期",
  },
  {
    title: "场景 C：消息队列",
    withoutCode: [
      { text: "// 原生 RocketMQ 配置", color: "#6B7280", italic: true },
      { text: "DefaultMQProducer producer =", color: "#EF444480" },
      { text: '  new DefaultMQProducer("group");', color: "#EF444480" },
      { text: "producer.setNamesrvAddr(addr);", color: "#EF444480" },
      { text: "producer.start();", color: "#EF444480" },
      { text: "// + Message, SendResult...", color: "#6B7280", italic: true },
    ],
    withoutDesc: "AI 引入原生依赖，配置复杂",
    withCode: [
      { text: 'producer.send("order-topic", orderDTO);', color: "#00FF88", size: 13, bold: true },
      { text: "// 自动适配 TraceId，自动序列化", color: "#6B7280", italic: true },
    ],
    withDesc: "easyfk-mq 封装，自动适配 TraceId",
  },
]

export default function AiPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.08),transparent_28%)]" />
      <SiteHeader />
      <main className="relative">
        {/* ── Hero Section ── */}
        <section className="px-0 pb-16 pt-[120px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-10 text-center">
              <h1 className="font-display text-[56px] font-bold tracking-[-2px] text-white md:text-[72px]">
                AI + 易构，智能编程加速器
              </h1>
              <p className="font-display text-[24px] font-semibold text-[#A78BFA] md:text-[28px]">
                规范即导航，组件即工具。
              </p>
              <p className="max-w-[720px] text-[18px] leading-[1.8] text-[#9CA3AF]">
                为什么 EasyBuild 能让 AI 编程效率翻倍？因为我们提供了标准化的项目结构和意图驱动的初始化方式，
                消除了 AI 的幻觉与上下文噪音。
              </p>
              {/* Hero Visual - Highway */}
              <div className="relative mx-auto h-[240px] w-full max-w-[1100px] overflow-hidden">
                <style>{`
                  @keyframes carDrive {
                    0% { left: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    100% { left: 45%; opacity: 1; }
                  }
                  @keyframes trailGrow {
                    0% { width: 0; left: 5%; opacity: 0; }
                    15% { opacity: 0.6; }
                    100% { width: 30%; left: 14%; opacity: 1; }
                  }
                  @keyframes runwayReveal {
                    0% { clip-path: inset(0 100% 0 0); }
                    100% { clip-path: inset(0 0 0 0); }
                  }
                  @keyframes dashFade {
                    0% { opacity: 0; transform: scaleX(0); }
                    100% { opacity: 1; transform: scaleX(1); }
                  }
                  @keyframes glowPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                  }
                  @keyframes particleTwinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                  }
                  @keyframes labelSlide {
                    0% { opacity: 0; transform: translateY(8px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                {/* Grid lines */}
                <div className="absolute left-0 top-[80px] h-px w-full bg-white/[0.024]" />
                <div className="absolute left-0 top-[180px] h-px w-full bg-white/[0.024]" />
                <div className="absolute left-[18%] top-0 h-full w-px bg-white/[0.016]" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.016]" />
                <div className="absolute left-[82%] top-0 h-full w-px bg-white/[0.016]" />
                {/* Lane lines */}
                <div className="absolute left-[18%] top-[100px] h-px w-[64%] bg-gradient-to-r from-transparent via-[#00FF8830] to-transparent" />
                <div className="absolute left-[18%] top-[156px] h-px w-[64%] bg-gradient-to-r from-transparent via-[#00FF8830] to-transparent" />
                {/* Runway glow */}
                <div
                  className="absolute left-[23%] top-[96px] h-16 w-[55%] rounded-[40px] bg-[radial-gradient(ellipse_at_center,#00FF8818,transparent)]"
                  style={{ animation: "glowPulse 3s ease-in-out infinite 1.8s" }}
                />
                {/* Runway */}
                <div
                  className="absolute left-[14%] top-[124px] h-2 w-[73%] rounded bg-gradient-to-r from-transparent via-[#00FF8880] to-[#00FF88] shadow-[0_0_20px_#00FF8840]"
                  style={{ animation: "runwayReveal 1.2s ease-out forwards" }}
                />
                {/* Dashes */}
                {[280, 380, 480, 580, 680, 780].map((x, i) => (
                  <div
                    key={i}
                    className="absolute top-[126px] h-[3px] w-10 origin-left rounded-sm"
                    style={{
                      left: `${(x / 1100) * 100}%`,
                      backgroundColor: `rgba(0,255,136,${0.25 + i * 0.08})`,
                      animation: `dashFade 0.3s ease-out forwards ${0.4 + i * 0.15}s`,
                      opacity: 0,
                    }}
                  />
                ))}
                {/* Trail */}
                <div
                  className="absolute top-[122px] h-3 rounded-md bg-gradient-to-r from-transparent via-[#A78BFA40] to-[#A78BFA80]"
                  style={{ animation: "trailGrow 1.8s cubic-bezier(0.22,1,0.36,1) forwards 0.3s", width: 0, opacity: 0 }}
                />
                {/* AI Car */}
                <div
                  className="absolute z-10 top-[106px] flex h-[40px] w-[120px] items-center justify-center rounded-[4px_18px_18px_4px] bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] shadow-[0_0_40px_#A78BFA80,-20px_0_80px_#A78BFA40]"
                  style={{ animation: "carDrive 1.8s cubic-bezier(0.22,1,0.36,1) forwards 0.3s", left: "-10%", opacity: 0 }}
                >
                  <span className="font-display text-[16px] font-bold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
                    AI
                  </span>
                </div>
                {/* Road label */}
                <span
                  className="absolute left-[41%] top-[172px] font-mono text-[10px] font-medium tracking-[3px] text-[#00FF8860]"
                  style={{ animation: "labelSlide 0.6s ease-out forwards 2s", opacity: 0 }}
                >
                  EasyBuild Architecture
                </span>
                {/* Particles */}
                {[
                  [100, 40, 3, "#A78BFA40"], [300, 20, 2, "#00FF8830"], [500, 60, 4, "#A78BFA30"],
                  [700, 30, 2, "#00FF8840"], [900, 50, 3, "#A78BFA40"], [200, 200, 2, "#00FF8830"],
                  [800, 190, 3, "#A78BFA30"], [1000, 80, 2, "#00FF8830"], [50, 120, 4, "#A78BFA20"],
                  [1050, 150, 3, "#00FF8820"],
                ].map(([x, y, size, color], i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${((x as number) / 1100) * 100}%`,
                      top: `${y}px`,
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color as string,
                      animation: `particleTwinkle ${2 + (i % 3)}s ease-in-out infinite ${0.5 * i}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2 - VS Comparison ── */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-12">
              <p className="font-mono text-[12px] font-semibold tracking-[3px] text-[#00FF88]">
                STANDARDIZATION
              </p>
              <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white text-center">
                为什么配合 AI 更高效？
              </h2>
              <p className="max-w-[700px] text-center text-[16px] leading-[1.7] text-[#9CA3AF]">
                AI 编程最大的痛点是{'"'}不知道你的项目结构{'"'}。EasyBuild 锁死了分层和规范，AI 闭着眼都能写对。
              </p>
              {/* VS Cards */}
              <div className="flex w-full gap-6">
                {/* Card Noise */}
                <div className="flex flex-1 flex-col gap-5 rounded-2xl border border-[#EF444425] bg-white/[0.024] p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[20px] font-bold text-[#EF4444]">普通项目</span>
                    <span className="rounded border border-transparent bg-[#EF444412] px-2.5 py-1 font-mono text-[11px] font-medium text-[#EF4444]">
                      The Noise
                    </span>
                  </div>
                  <p className="text-[15px] font-semibold text-white">结构发散，AI 需反复调教</p>
                  <div className="flex h-[60px] items-center gap-3 rounded-[10px] border border-[#EF444415] bg-[#EF444408] px-5">
                    <span className="text-[24px]">🤖</span>
                    <span className="text-[12px] font-medium text-[#EF4444]">
                      每次都要告诉 AI &quot;Controller 不要写业务逻辑&quot;...
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-[10px] bg-[#0D1117] p-4">
                    {noiseTree.map((line) => (
                      <code key={line.text} className="whitespace-pre font-mono text-[11px]" style={{ color: line.color }}>
                        {line.text}
                      </code>
                    ))}
                  </div>
                  <p className="text-[13px] leading-[1.6] text-[#9CA3AF]">
                    痛点：每次都要告诉 AI &ldquo;返回格式是 Result&rdquo;、
                    <br />
                    &ldquo;Service 不要调用 Mapper&rdquo;... 浪费大量时间。
                  </p>
                </div>
                {/* Card Signal */}
                <div className="flex flex-1 flex-col gap-5 rounded-2xl border border-[#00FF8825] bg-white/[0.024] p-8 shadow-[0_0_40px_#00FF8808]">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[20px] font-bold text-[#00FF88]">EasyBuild 项目</span>
                    <span className="rounded border border-transparent bg-[#00FF8812] px-2.5 py-1 font-mono text-[11px] font-medium text-[#00FF88]">
                      The Signal
                    </span>
                  </div>
                  <p className="text-[15px] font-semibold text-white">规范统一，AI 开箱即懂</p>
                  <div className="flex h-[60px] items-center gap-3 rounded-[10px] border border-[#00FF8815] bg-[#00FF8808] px-5">
                    <span className="text-[24px]">🤖</span>
                    <span className="text-[12px] font-medium text-[#00FF88]">
                      标准分层，我知道代码写在哪！👌
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-[10px] bg-[#0D1117] p-4">
                    {signalTree.map((line) => (
                      <code key={line.text} className="whitespace-pre font-mono text-[11px]" style={{ color: line.color }}>
                        {line.text}
                      </code>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {signalAdvantages.map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <span className="text-[12px]">✅</span>
                        <span className="text-[13px] font-medium text-[#E5E7EB]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3 - Conversational Generator ── */}
        <section className="px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-12">
              <p className="font-mono text-[12px] font-semibold tracking-[3px] text-[#A78BFA]">
                INTENT-DRIVEN
              </p>
              <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white text-center">
                对话式项目生成器
              </h2>
              <p className="text-center text-[16px] text-[#9CA3AF]">
                告别繁琐配置，一句指令，项目就绪。
              </p>
              {/* Chat + Build */}
              <div className="flex w-full gap-8">
                {/* Chat Window */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#A78BFA25] bg-[#0D1117]">
                  <div className="flex h-11 items-center gap-2 bg-[#161B22] px-5">
                    <span className="size-2.5 rounded-full bg-[#A78BFA]" />
                    <span className="font-mono text-[12px] font-medium text-[#9CA3AF]">EasyBuild AI Assistant</span>
                  </div>
                  <div className="flex flex-col gap-4 p-5">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="max-w-[420px] rounded-[12px_12px_4px_12px] border border-[#A78BFA30] bg-[#A78BFA20] px-4 py-3">
                        <p className="text-[13px] font-medium leading-[1.6] text-[#E5E7EB]">
                          帮我生成一个电商微服务项目，用 MySQL 和 Redis，消息队列用 RocketMQ，构建工具用 Gradle。
                        </p>
                      </div>
                    </div>
                    {/* AI response */}
                    <div className="flex flex-col gap-2.5">
                      <div className="max-w-[440px] rounded-[12px_12px_12px_4px] border border-[#1F2937] bg-white/[0.024] px-4 py-3">
                        <div className="flex flex-col gap-2.5">
                          <p className="text-[13px] font-medium text-[#E5E7EB]">收到。已为您配置：</p>
                          <div className="flex flex-col gap-1.5 rounded-lg bg-[#0B0C0E] px-3 py-2">
                            <code className="font-mono text-[11px] font-medium text-[#00FF88]">架构：Smart Microservice</code>
                            <code className="font-mono text-[11px] font-medium text-[#00FF88]">ORM：MyBatis-Flex (高性能推荐)</code>
                            <code className="font-mono text-[11px] font-medium text-[#00FF88]">组件：db-mysql, db-redis, mq-rocket</code>
                          </div>
                          <p className="text-[13px] font-semibold text-[#A78BFA]">🚀 项目脚手架生成中...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Build Panel */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#00FF8825] bg-[#0D1117]">
                  <div className="flex h-11 items-center gap-2 bg-[#161B22] px-5">
                    <span className="size-2.5 rounded-full bg-[#00FF88]" />
                    <span className="font-mono text-[12px] font-medium text-[#9CA3AF]">project-config.yml</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-5">
                    {configYml.map((line, i) => (
                      <code
                        key={i}
                        className={`whitespace-pre font-mono text-[12px] ${line.italic ? "italic" : ""}`}
                        style={{ color: line.color }}
                      >
                        {line.text}
                      </code>
                    ))}
                  </div>
                  <div className="mt-auto flex h-12 items-center justify-between border-t border-[#1F2937] bg-[#161B22] px-5">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] text-[#00FF88]">📁</span>
                      <span className="font-mono text-[12px] font-semibold text-[#00FF88]">ecommerce-service.zip</span>
                    </div>
                    <span className="rounded-md bg-[#00FF8820] px-3 py-1 font-mono text-[11px] font-semibold text-[#00FF88]">
                      ✓ Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4 - Agent Skills ── */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-12">
              <p className="font-mono text-[12px] font-semibold tracking-[3px] text-[#A78BFA]">
                AGENT SKILLS
              </p>
              <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white text-center">
                让 AI 学会使用 EasyFK 的&ldquo;核武器&rdquo;
              </h2>
              <p className="max-w-[750px] text-center text-[16px] leading-[1.7] text-[#9CA3AF]">
                我们提供了核心组件的 Agent Skills (Function Definitions)，让 AI 能够精准调用 EasyBuild 的封装能力，而不是写原生代码。
              </p>
              {/* Skill Cards */}
              <div className="flex w-full flex-col gap-6">
                {skillCards.map((card) => (
                  <div
                    key={card.title}
                    className="flex overflow-hidden rounded-2xl border border-[#1F293780] bg-white/[0.024]"
                  >
                    {/* Without Skill */}
                    <div className="flex flex-1 flex-col gap-3 bg-[#EF444406] p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-[#EF444412]" />
                        <span className="font-display text-[15px] font-semibold text-white">{card.title}</span>
                      </div>
                      <span className="rounded bg-[#EF444412] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#EF4444] self-start">
                        Without Skill
                      </span>
                      <div className="flex flex-col gap-[3px] rounded-lg bg-[#0B0C0E] p-3">
                        {card.withoutCode.map((line, i) => (
                          <code
                            key={i}
                            className={`whitespace-pre font-mono text-[10px] ${line.italic ? "italic" : ""}`}
                            style={{ color: line.color }}
                          >
                            {line.text}
                          </code>
                        ))}
                      </div>
                      <p className="text-[12px] text-[#9CA3AF]">{card.withoutDesc}</p>
                    </div>
                    {/* Divider */}
                    <div className="w-px bg-[#1F2937]" />
                    {/* With Skill */}
                    <div className="flex flex-1 flex-col gap-3 bg-[#00FF8806] p-6">
                      <span className="rounded bg-[#00FF8812] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#00FF88] self-start">
                        With Skill
                      </span>
                      <div className="flex flex-col gap-[3px] rounded-lg bg-[#0B0C0E] p-3">
                        {card.withCode.map((line, i) => (
                          <code
                            key={i}
                            className={`whitespace-pre font-mono ${line.italic ? "italic" : ""}`}
                            style={{
                              color: line.color,
                              fontSize: `${line.size || 11}px`,
                              fontWeight: line.bold ? 600 : 400,
                            }}
                          >
                            {line.text}
                          </code>
                        ))}
                      </div>
                      <p className="text-[12px] font-semibold text-[#00FF88]">{card.withDesc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5 - CTA ── */}
        <section className="px-0 py-[100px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-8 text-center">
              <h2 className="font-display text-[40px] font-bold tracking-[-1px] text-white">
                架构已就绪，让 AI 开始工作
              </h2>
              <p className="text-[16px] text-[#9CA3AF]">
                EasyBuild + AI，让编程效率提升 10 倍
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2.5 rounded-[10px] bg-[#00FF88] px-9 py-4 text-[16px] font-bold text-[#0B0C0E] shadow-[0_4px_30px_#00FF8830] transition-colors hover:bg-[#31ff9d]"
                >
                  获取 EasyBuild 源码
                  <span className="text-[18px] font-bold">→</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center rounded-[10px] border border-[#A78BFA40] px-9 py-4 text-[16px] font-semibold text-[#A78BFA] transition-colors hover:border-[#A78BFA80] hover:text-white"
                >
                  下载 Agent Skills 知识库
                </a>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#00FF88]" />
                  <span className="text-[13px] font-medium text-[#9CA3AF]">EasyBuild Framework</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#A78BFA]" />
                  <span className="text-[13px] font-medium text-[#9CA3AF]">AI Agent Skills</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
