import type { LucideIcon } from "lucide-react"
import { BookOpen, Boxes, FileCode, Repeat, Rocket, ShieldCheck, Sparkles, Zap } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { PanelCard } from "@/components/home/panel-card"
import { cn } from "@/lib/utils"

const heroPoints = [
  "⚡ 12 大核心模块",
  "⚙️ 40+ 可插拔组件",
  "🚀 秒级代码生成",
  "🔒 统一依赖治理",
]

const painItems = [
  {
    number: "01",
    title: "基础设施重复建设",
    description:
      "每个新项目花数天搭建基础框架：统一返回格式、异常处理、日志配置、拦截器、安全认证……上个项目做过，下个还要再做一遍。",
  },
  {
    number: "02",
    title: "各项目标准不一，协作困难",
    description:
      "A 项目的响应格式是 {code, msg, data}，B 项目是 {status, result}。人员跨项目调动适应成本极高，代码复用几乎不可能。",
  },
  {
    number: "03",
    title: "基础代码暗藏隐患",
    description:
      "反射不加缓存导致性能劣化、ThreadLocal 不清理导致内存泄漏、线程池参数不当导致任务堆积……生产才暴露。",
  },
  {
    number: "04",
    title: "技术升级困难重重",
    description:
      "基础代码散落在各个项目中，升级变成逐项目人肉改造。工作量巨大，版本碎片化严重，无人敢动。",
  },
]

const valueRows = [
  {
    number: "01",
    title: "项目启动从“搭地基”变为“选模块”",
    description: "引入几个模块依赖，基础设施即刻就绪，第一天就能写业务代码。",
  },
  {
    number: "02",
    title: "所有项目共享同一套标准，协作零摩擦",
    description:
      "统一的响应格式、异常处理、权限模型、日志规范。人员跨项目无需重新适应，组件跨项目无需额外适配。",
  },
  {
    number: "03",
    title: "经过生产锤炼的基础代码，安全可靠",
    description:
      "反射操作内置多级缓存，业务异常零堆栈设计，线程上下文自动传递与清理，接口安全防护内置签名验证与防重放。",
  },
  {
    number: "04",
    title: "升级一处，所有项目同步受益",
    description:
      "框架进行性能优化、安全修补或技术升级时，所有业务项目只需升级版本号即可同步获得改进。",
  },
  {
    number: "05",
    title: "模块按需组合，不引入一行多余代码",
    description:
      "用什么引什么，项目保持精简，没有冗余依赖。每个模块都可以独立引入。",
  },
]

const frameworkModules = [
  "easyfk-core       核心基础（响应封装、异常、上下文、DTO）",
  "easyfk-authority  权限管理（三级安全模型、多租户）",
  "easyfk-web        Web 层（5 种场景化配置）",
  "easyfk-repository 数据访问（统一 CRUD、查询构建器）",
  "easyfk-service    服务层（接口分离、SaaS 隔离）",
  "easyfk-remote     远程调用（Dubbo + Cloud 双协议）",
  "easyfk-cache      缓存体系（多级缓存、一致性策略）",
  "easyfk-log        日志体系（TraceId 全链路透传）",
  "easyfk-gateway    网关 / thread 线程池 / queue 队列 / serializer",
]

const frameworkHighlights = [
  {
    title: "引入即生效",
    description: "Spring Boot AutoConfiguration 自动装配，无需手动注册 Bean",
    highlight: true,
  },
  {
    title: "模块按需组合",
    description: "用什么引什么，不引入一行多余代码，项目保持精简",
  },
  {
    title: "生产级性能调优",
    description: "业务异常零堆栈、反射多级缓存、TraceId 全链路透传",
  },
]

const generatorCards = [
  {
    icon: Zap,
    title: "秒级生成，全层覆盖",
    description:
      "一张表自动产出 8-15 个 Java 类，覆盖 Entity 到 Controller 完整链路。智能类型映射、注解感知生成业务逻辑。",
  },
  {
    icon: Repeat,
    title: "三种架构一键切换",
    description:
      "Single → Microservice → SMART，修改一行配置切换架构。支持 22 种数据库，增量生成安全无忧。",
  },
  {
    icon: FileCode,
    title: "规范内置，代码即标准",
    description:
      "60+ 精心设计的模板，统一命名、分层、编码风格。编码规范直接内置在生成器中自动执行。",
  },
]

const archStages = [
  { tag: "SINGLE", title: "单体架构", description: "中小型项目、快速原型验证", active: false },
  { tag: "MICROSERVICE", title: "微服务架构", description: "标准微服务拆分", active: true },
  { tag: "SMART", title: "多栈微服务", description: "Cloud + Dubbo 双协议", active: false },
]

const componentCards = [
  {
    title: "🗄️ 持久层 + 数据访问",
    lines: ["orm-mybatis / flex / hibernate", "db-redis / mongo / clickhouse", "orm-sharding (分库分表)"],
    summary: "三套 ORM 共享统一接口，底层可换。每种存储引擎独立封装。",
  },
  {
    title: "📨 消息队列 + 缓存体系",
    lines: ["mq-kafka / rocket / rabbit", "cache-caffeine / redis / mult", "chronicle-map (堆外缓存)"],
    summary: "统一消息模型三引擎切换零改动。多级缓存按需组合。",
  },
  {
    title: "🔌 服务治理 + 更多组件",
    lines: ["nacos / sentinel / seata", "websocket / lock-redisson", "autoId / job-xxl / doc-knife4j"],
    summary: "注册发现、限流熔断、分布式事务、实时通信、分布式锁等。",
  },
]

const swapColumns = [
  [
    "IBaseRepository<T, PK>  ←  统一接口",
    "  ├─ orm-mybatis     (MyBatis-Plus)",
    "  ├─ orm-flex        (MyBatis-Flex)",
    "  └─ orm-hibernate   (Hibernate/JPA)",
  ],
  [
    "CommonMessage<T>       ←  统一消息模型",
    "  ├─ mq-kafka        (百万级 TPS)",
    "  ├─ mq-rocket       (金融级可靠)",
    "  └─ mq-rabbit       (灵活路由)",
  ],
]

const dependencyBenefits: {
  icon: LucideIcon
  title: string
  description: string
  tone: "green" | "yellow" | "red"
}[] = [
  {
    icon: ShieldCheck,
    title: "彻底告别依赖冲突",
    description: "所有依赖经过系统性兼容性验证和冲突排除，不必再关心版本能不能共存。",
    tone: "green",
  },
  {
    icon: Boxes,
    title: "版本选型严谨可靠",
    description: "严格参照官方兼容性矩阵，经过真实项目验证，稳定优先不盲目追新。",
    tone: "yellow",
  },
  {
    icon: Sparkles,
    title: "升级一处，全局生效",
    description: "升级路径从“逐项目逐依赖修改”缩短为“改一个版本号”，风险可控、效率极高。",
    tone: "red",
  },
]

const impactTagClass = {
  green: "bg-[#00FF8815] text-[#00FF88]",
  yellow: "bg-[#FEBC2E15] text-[#FEBC2E]",
  red: "bg-[#FF5F5715] text-[#FF5F57]",
} as const

export default function EasyFkPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(254,188,46,0.08),transparent_20%),linear-gradient(180deg,#0b0c0e_0%,#0b0c0e_100%)]" />
      <SiteHeader />
      <main className="relative">
        <section id="home" className="px-0 pb-[100px] pt-[120px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-10 text-center">
              <div className="flex flex-col items-center gap-5">
                <h1 className="font-display text-[56px] font-bold tracking-[-2px] text-white md:text-[72px]">
                  易架构 EasyFK
                </h1>
                <p className="font-display text-[24px] font-semibold text-[#00FF88] md:text-[28px]">
                  企业级 Java 技术底座，一次建设，全局复用
                </p>
              </div>
              <p className="max-w-[900px] text-[18px] leading-[2] text-[#9CA3AF] md:text-[20px]">
                覆盖核心框架、全栈代码生成、40+ 可插拔组件、统一依赖治理。
                <br />
                把重复的基础设施建设做一次，让所有项目永远不必再做第二次。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {heroPoints.map((item) => (
                  <div key={item} className="text-[18px] font-medium text-white">
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-auto border-0 bg-[#00FF88] px-8 py-3.5 text-[#0B0C0E] hover:bg-[#31ff9d]">
                  <a href="#core-framework">
                    <Rocket className="size-4" />
                    快速开始
                  </a>
                </Button>
                <Button asChild size="lg" className="h-auto border border-white/20 bg-white/[0.08] px-8 py-3.5 text-white hover:bg-white/[0.12]">
                  <a href="#get-started">
                    <BookOpen className="size-4" />
                    查看文档
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 pb-14 pt-12">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#FF5F57]">WHY EASYFK</p>
              <h2 className="font-display text-[32px] font-bold tracking-[-1px] text-white md:text-[40px]">
                为什么需要易架构？
              </h2>
              <p className="text-[18px] text-[#9CA3AF]">每个 Java 团队都在重复踩的坑，易架构替你填平了。</p>
            </div>
            <div className="mt-9 grid gap-4 lg:grid-cols-4">
              {painItems.map((item) => (
                <div
                  key={item.number}
                  className="flex flex-col gap-3 border-l-2 border-l-[#00FF8840] bg-transparent py-5 pl-6 pr-0"
                >
                  <p className="font-display text-[32px] font-bold text-[#00FF8840]">{item.number}</p>
                  <h3 className="font-display text-[18px] font-semibold text-white">{item.title}</h3>
                  <p className="text-[14px] leading-[1.7] text-[#9CA3AF]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 pb-16 pt-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#FEBC2E]">CORE VALUES</p>
              <h2 className="font-display text-[32px] font-bold tracking-[-1px] text-white md:text-[40px]">
                核心价值
              </h2>
              <p className="text-[18px] text-[#9CA3AF]">
                一次建设，全局复用。把基础设施做成标准化组件，让业务项目像搭积木一样按需引入。
              </p>
            </div>
            <div className="mt-10 overflow-hidden rounded-[10px] border border-white/10">
              {valueRows.map((row, index) => (
                <div
                  key={row.number}
                  className={cn(
                    "grid gap-4 px-7 py-5 md:grid-cols-[72px_320px_minmax(0,1fr)] md:items-center",
                    index % 2 === 0 ? "bg-white/[0.08]" : "bg-transparent"
                  )}
                >
                  <p className="font-mono text-[14px] font-semibold text-[#00FF88]">{row.number}</p>
                  <h3 className="font-display text-[15px] font-semibold text-white">{row.title}</h3>
                  <p className="text-[14px] text-[#9CA3AF]">{row.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="core-framework" className="px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">CORE FRAMEWORK</p>
              <h2 className="font-display text-[32px] font-bold tracking-[-1px] text-white md:text-[40px]">
                核心基础框架
              </h2>
              <p className="text-[18px] text-[#9CA3AF]">12 个模块按需引入，不引入一行多余代码。引入即生效，无需手动配置。</p>
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
              <PanelCard className="rounded-xl gap-0 p-0">
                <CardContent className="space-y-3 px-8 py-7">
                  <p className="font-mono text-[13px] font-semibold tracking-[1px] text-[#00FF88]">模块全景</p>
                  <div className="space-y-1 pt-3">
                    {frameworkModules.map((line, index) => (
                      <p
                        key={line}
                        className={cn(
                          "font-mono text-[13px] leading-[1.8]",
                          index < 6 ? "text-[#D1D5DB]" : index < 8 ? "text-[#6B7280]" : "text-[#4B5563]"
                        )}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </PanelCard>
              <div className="flex flex-col gap-4">
                {frameworkHighlights.map((item) => (
                  <PanelCard
                    key={item.title}
                    className={cn(
                      "rounded-xl gap-0 p-0",
                      item.highlight ? "border-[#00FF8830] bg-[#00FF880D]" : ""
                    )}
                  >
                    <CardContent className="space-y-[10px] p-6">
                      <CardTitle className="font-display text-[16px] font-semibold text-white">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-[13px] leading-[1.5] text-[#9CA3AF]">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </PanelCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#FF5F57]">CODE GENERATOR</p>
              <h2 className="font-display text-[32px] font-bold tracking-[-1px] text-white md:text-[40px]">
                Java后端代码生成器
              </h2>
              <p className="max-w-[700px] text-[18px] text-[#9CA3AF]">
                定义好数据库表，剩下的交给生成器。从项目骨架到完整业务代码，分钟级交付。
              </p>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {generatorCards.map((item) => {
                const Icon = item.icon
                return (
                  <PanelCard key={item.title} className="rounded-xl gap-0 p-0">
                    <CardContent className="flex h-full flex-col gap-4 p-8">
                      <div className="flex size-12 items-center justify-center rounded-[10px] bg-[#00FF8815] text-[#00FF88]">
                        <Icon className="size-6" />
                      </div>
                      <CardTitle className="font-display text-[20px] font-semibold text-white">{item.title}</CardTitle>
                      <CardDescription className="text-[14px] leading-[1.7] text-[#9CA3AF]">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </PanelCard>
                )
              })}
            </div>
            <div className="mt-12 flex items-center gap-4">
              {archStages.flatMap((stage, index) => [
                  <PanelCard
                    key={stage.tag}
                    className={cn(
                      "min-w-0 flex-1 gap-0 rounded-xl p-0",
                      stage.active ? "border-[#00FF8830] bg-[#00FF880D]" : ""
                    )}
                  >
                    <CardContent className="flex flex-col items-center gap-2 px-7 py-6 text-center">
                      <p className={cn("font-mono text-[11px] font-semibold tracking-[1px]", stage.active ? "text-[#00FF88]" : "text-[#6B7280]")}>
                        {stage.tag}
                      </p>
                      <p className="font-display text-[16px] font-semibold text-white">{stage.title}</p>
                      <p className={cn("text-[12px] leading-[1.5]", stage.active ? "text-[#9CA3AF]" : "text-[#6B7280]")}>
                        {stage.description}
                      </p>
                    </CardContent>
                  </PanelCard>,
                  ...(index < archStages.length - 1 ? [<span key={`arrow-${index}`} className="shrink-0 text-[20px] font-semibold text-[#00FF88]">→</span>] : []),
              ])}
            </div>
            <p className="mt-12 text-center text-[16px] font-semibold text-[#FF5F57]">
              让机器做重复的事，让开发者做创造性的事。
            </p>
          </div>
        </section>

        <section className="px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#FEBC2E]">COMPONENT LIBRARY</p>
              <h2 className="font-display text-[32px] font-bold tracking-[-1px] text-white md:text-[40px]">
                40+ 可插拔技术组件
              </h2>
              <p className="max-w-[700px] text-[18px] text-[#9CA3AF]">
                用什么引什么，引入即可用。同类组件共享统一接口，底层实现可自由切换。
              </p>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {componentCards.map((card) => (
                <PanelCard key={card.title} className="rounded-xl gap-0 p-0">
                  <CardContent className="space-y-4 p-7">
                    <CardTitle className="font-display text-[16px] font-semibold text-white">{card.title}</CardTitle>
                    <div className="space-y-1">
                      {card.lines.map((line) => (
                        <p key={line} className="font-mono text-[12px] leading-[1.8] text-[#9CA3AF]">
                          {line}
                        </p>
                      ))}
                    </div>
                    <p className="text-[12px] leading-[1.5] text-[#6B7280]">{card.summary}</p>
                  </CardContent>
                </PanelCard>
              ))}
            </div>
            <div className="mt-12 overflow-hidden rounded-[12px] border border-[#1F2937] bg-[#0D1117]">
              <div className="grid gap-0 lg:grid-cols-[480px_minmax(0,1fr)]">
                <div className="flex flex-col justify-center gap-4 p-8">
                  <p className="font-display text-[20px] font-bold text-[#00FF88]">上层统一，底层可换</p>
                  <p className="text-[14px] leading-[1.7] text-[#9CA3AF]">
                    同类组件共享统一接口，底层实现可自由切换。从 MyBatis-Plus 迁移到 MyBatis-Flex，从 RabbitMQ 切换到 Kafka，业务代码一行不动。
                  </p>
                </div>
                <div className="grid gap-8 bg-[#0B0C0E] px-7 py-5 lg:grid-cols-2">
                  {swapColumns.map((column, index) => (
                    <div key={index} className="space-y-1">
                      {column.map((line, lineIndex) => (
                        <p
                          key={line}
                          className={cn(
                            "font-mono text-[12px] leading-[1.6]",
                            lineIndex === 0 ? "text-[#00FF88]" : lineIndex < 3 ? "text-[#C9D1D9]" : "text-[#6B7280]"
                          )}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-12 text-center text-[16px] font-semibold text-[#FEBC2E]">
              90% 以上的组件经过深度二次封装 —— 不是简单的 API 包装，而是生产级的开箱即用。
            </p>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#FF5F57]">DEPENDENCY GOVERNANCE</p>
              <h2 className="font-display text-[32px] font-bold tracking-[-1px] text-white md:text-[40px]">
                统一依赖治理
              </h2>
              <p className="text-[18px] text-[#9CA3AF]">引入一个依赖，告别所有依赖烦恼。</p>
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div className="overflow-hidden rounded-[12px] border border-[#1F2937] bg-[#0D1117]">
                <div className="flex items-center gap-3 border-b border-[#1F2937] bg-[#161B22] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#FF5F57]" />
                    <span className="size-2 rounded-full bg-[#FEBC2E]" />
                    <span className="size-2 rounded-full bg-[#28C840]" />
                  </div>
                  <p className="font-mono text-[12px] text-[#6B7280]">pom.xml</p>
                </div>
                <pre className="px-7 py-6 font-mono text-[13px] leading-[2] text-[#C9D1D9]">
                  <code>{`<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.mcst</groupId>
      `}<span className="text-[#FF5F57]">{`<artifactId>easyfk-dependencies</artifactId>`}</span>{`
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
`}
<span className="text-[#6B7280]">{`<!-- 以下依赖无需声明版本号 -->`}</span>{`
<dependencies>
  <dependency>
    <groupId>com.mcst</groupId>
    `}<span className="text-[#FF5F57]">{`<artifactId>orm-mybatis</artifactId>`}</span>{`
  </dependency>
  <dependency>
    <groupId>com.mcst</groupId>
    `}<span className="text-[#FF5F57]">{`<artifactId>db-redis</artifactId>`}</span>{`
  </dependency>
</dependencies>`}</code>
                </pre>
              </div>
              <div className="flex flex-col justify-between gap-4">
                {dependencyBenefits.map((item) => {
                  const Icon = item.icon
                  return (
                    <PanelCard
                      key={item.title}
                      className={cn(
                        "rounded-xl gap-0 p-0",
                        item.tone === "red" ? "bg-[#FF5F570D]" : ""
                      )}
                    >
                      <CardContent className="space-y-[10px] p-6">
                        <div className={cn("flex size-10 items-center justify-center rounded-[10px]", impactTagClass[item.tone])}>
                          <Icon className="size-5" />
                        </div>
                        <CardTitle className={cn("font-display text-[16px] font-semibold", item.tone === "red" ? "text-[#FF5F57]" : "text-white")}>
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-[13px] leading-[1.6] text-[#9CA3AF]">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </PanelCard>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="get-started" className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-8 text-center">
              <Badge
                variant="ghost"
                className="h-auto px-0 py-0 font-mono text-[12px] uppercase tracking-[2px] text-[#00FF88] hover:bg-transparent"
              >
                GET STARTED
              </Badge>
              <h2 className="font-display max-w-4xl text-[30px] font-bold tracking-[-1px] text-white md:text-[36px]">
                把重复的事情做一次，做到极致
              </h2>
              <p className="max-w-[800px] text-[18px] leading-[1.6] text-[#9CA3AF]">
                然后让所有项目共享成果。无论你是独立开发者、小型团队还是企业技术部，易架构都是你最值得信赖的技术底座。
              </p>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Button asChild size="lg" className="h-auto border-0 bg-[#00FF88] px-8 py-3.5 text-[#0B0C0E] hover:bg-[#31ff9d]">
                  <a href="#core-framework">快速开始</a>
                </Button>
                <Button asChild size="lg" className="h-auto border border-[#374151] bg-transparent px-8 py-3.5 text-[#D1D5DB] hover:bg-white/[0.04]">
                  <a href="#get-started">查看文档</a>
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
