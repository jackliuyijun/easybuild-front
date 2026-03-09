"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, Copy, Check, Lightbulb, ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Sparkles, AlertTriangle } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const tabs = ["后端", "业务", "前端", "移动端"]

const sidebarSections: { title?: string; items: { label: string; active?: boolean; href?: string }[] }[] = [
  { title: "基础模块", items: [{ label: "基础核心", href: "/docs/reader/core" },{ label: "BOM", href: "/docs/reader/bom" },{ label: "认证鉴权", href: "/docs/reader/auth" },{ label: "网关", href: "/docs/reader/gateway" }]},
  { title: "开发工具", items: [{ label: "代码生成器", href: "/docs/reader" }]},
  { title: "Web 开发", items: [{ label: "Web 应用", href: "/docs/reader/web-prd" },{ label: "微服务 Web", href: "/docs/reader/web-micro" },{ label: "WebSocket", href: "/docs/reader/websocket" }]},
  { title: "ORM 数据访问", items: [{ label: "Hibernate", href: "/docs/reader/orm-hibernate" },{ label: "MyBatis", href: "/docs/reader/orm-mybatis" },{ label: "MyBatis-Flex", href: "/docs/reader/orm-flex" },{ label: "ShardingSphere", href: "/docs/reader/orm-sharding" }]},
  { title: "数据库", items: [{ label: "Redis", href: "/docs/reader/db-redis" },{ label: "MongoDB", href: "/docs/reader/db-mongo" },{ label: "ClickHouse", href: "/docs/reader/db-clickhouse" }]},
  { title: "缓存与ID", items: [{ label: "Caffeine 缓存", href: "/docs/reader/cache-caffeine" },{ label: "Redis 自增ID", active: true }]},
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", href: "/docs/reader/mq-rabbit" },{ label: "Kafka", href: "/docs/reader/mq-kafka" }]},
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-overview", label: "模块概述" },
  { id: "sec-deps", label: "依赖引入" },
  { id: "sec-config", label: "配置说明" },
  { id: "sec-usage", label: "使用方式" },
  { id: "sec-api", label: "API 参考" },
  { id: "sec-autoconfig", label: "自动配置" },
  { id: "sec-internal", label: "内部实现" },
  { id: "sec-examples", label: "实战示例" },
  { id: "sec-best", label: "最佳实践" },
  { id: "sec-packages", label: "包结构" },
]

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
      <div className="flex h-9 items-center justify-between border-b border-[#1F2937] px-4">
        <span className="font-mono text-[11px] font-medium text-[#525252]">{lang}</span>
        <button type="button" onClick={handleCopy} className={cn("flex items-center gap-1.5 transition-colors", copied ? "text-[#00FF88]" : "text-[#525252] hover:text-[#9CA3AF]")}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span className="text-[11px]">{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4">
        <code className="whitespace-pre font-mono text-[13px] leading-[1.7] text-[#E5E5E5]">{children}</code>
      </pre>
    </div>
  )
}

function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-[#1F2937]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#1F2937] bg-[#161B22]">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 font-mono text-[11px] font-semibold tracking-wide text-[#9CA3AF]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[#1F2937] last:border-b-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-[13px] leading-[1.6] text-[#9CA3AF]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TipBox({ title = "TIP", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border-l-[3px] border-[#00FF8830] bg-[#00FF880A] px-5 py-4">
      <Lightbulb className="mt-0.5 size-[18px] shrink-0 text-[#00FF88]" />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#00FF88]">{title}</span>
        <div className="text-[13px] leading-[1.6] text-[#9CA3AF]">{children}</div>
      </div>
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border-l-[3px] border-[#FBBF2430] bg-[#FBBF240A] px-5 py-4">
      <AlertTriangle className="mt-0.5 size-[18px] shrink-0 text-[#FBBF24]" />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#FBBF24]">注意</span>
        <div className="text-[13px] leading-[1.6] text-[#9CA3AF]">{children}</div>
      </div>
    </div>
  )
}

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="flex items-center gap-3 scroll-mt-4">
      <h2 className="font-display text-[24px] font-bold text-white">{children}</h2>
      <span className="text-[14px] text-[#00FF8860]">✨</span>
    </div>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-[18px] font-bold text-white">{children}</h3>
}

function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="font-display text-[15px] font-semibold text-[#E5E5E5]">{children}</h4>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-[1.8] text-[#9CA3AF]">{children}</p>
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[#1F2937] px-1.5 py-0.5 font-mono text-[13px] text-[#00FF88]">{children}</code>
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#E5E5E5]">{children}</span>
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-[#00FF8820] px-1 py-0.5 text-[#00FF88]">{children}</span>
}

export default function AutoidRedisDocPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [atTop, setAtTop] = useState(true)
  const [atBottom, setAtBottom] = useState(false)
  const [activeSection, setActiveSection] = useState(outlineItems[0].id)
  const contentWrapRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = contentWrapRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]')
    if (!viewport) return
    const onScroll = () => {
      setAtTop(viewport.scrollTop <= 100)
      setAtBottom(viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 100)

      let current = outlineItems[0].id
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
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative isolate h-screen overflow-hidden bg-[#0B0C0E] text-white">
      {/* Nav Bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#1F2937] bg-[#0B0C0E] px-6">
        <Link href="/docs" className="inline-flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-[#00FF88] font-display text-sm font-bold text-[#0B0C0E]">
            E
          </span>
          <span className="size-[5px] rounded-full bg-[#00FF88]" />
          <span className="font-display text-[15px] font-bold text-white">EasyBuild Docs</span>
        </Link>
        <div className="flex items-center gap-2 text-[13px] text-[#525252]">
          <span>文档</span>
          <span>/</span>
          <span>后端</span>
          <span>/</span>
          <span className="font-medium text-[#9CA3AF]">Redis 自增ID</span>
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
                  {section.items.map((item) => (
                    item.href ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex h-9 items-center px-5 text-[13px] text-[#9CA3AF]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div
                        key={item.label}
                        className={cn(
                          "flex h-9 items-center",
                          "active" in item && item.active
                            ? "border-l-[3px] border-[#00FF88] bg-gradient-to-r from-[#00FF8812] to-transparent px-5 text-[13px] font-semibold text-white"
                            : section.title
                              ? "px-8 text-[12px] text-[#737373]"
                              : "px-5 text-[13px] text-[#9CA3AF]"
                        )}
                      >
                        {item.label}
                      </div>
                    )
                  ))}
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
                easyfk-autoid-redis Redis 自增ID
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Redis 自增ID — 分布式全局唯一ID生成</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~8 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />

              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>autoId-redis</InlineCode> 是 EasyFK 框架中基于 Redis 的<Strong>分布式自增 ID 生成组件</Strong>。该模块利用 Redis 的<Highlight>原子自增（INCR）</Highlight>特性，提供全局唯一、有序递增的 ID 生成能力，支持纯数字自增 ID、日期前缀自增 ID、日期小时前缀自增 ID 三种生成模式，适用于订单号、流水号、业务编码等场景。
              </P>
              <TipBox>
                该模块依赖 <InlineCode>autoId-api</InlineCode>（接口定义）和 <InlineCode>db-redis</InlineCode>（Redis 操作组件），引入 <InlineCode>autoId-redis</InlineCode> 后会自动传递引入这些依赖。
              </TipBox>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-deps">2. 依赖引入</H2>
              <P>在项目的 <InlineCode>build.gradle</InlineCode> 中添加依赖：</P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation project(':component-autoId:autoId-redis')
}`}</CodeBlock>
              <DocTable
                headers={["传递依赖", "说明"]}
                rows={[
                  ["autoId-api", "自增 ID 服务接口定义"],
                  ["db-redis", "EasyFK Redis 操作组件"],
                ]}
              />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-config">3. 配置说明</H2>
              <P>所有配置项统一在 <InlineCode>easyfk.config.autoid.redisson</InlineCode> 前缀下。</P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["datasource", "String", "RedisConstants.DEFAULT_DATASOURCE", "Redis 数据源名称"],
                  ["database", "String", "RedisConstants.DEFAULT_DATABASE", "Redis 数据库名称"],
                ]}
              />
              <CodeBlock lang="yaml">{`easyfk:
  config:
    autoid:
      redisson:
        datasource: default
        database: default`}</CodeBlock>
              <TipBox>
                大多数场景下，使用默认配置即可，无需额外配置。
              </TipBox>

              {/* ============== 4. 使用方式 ============== */}
              <H2 id="sec-usage">4. 使用方式</H2>
              <H3>4.1 注入服务</H3>
              <P>
                引入依赖后，<InlineCode>IAutoIdService</InlineCode> 会通过 Spring Boot 自动配置自动注册为 Bean，直接注入即可使用。
              </P>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private IAutoIdService autoIdService;
}`}</CodeBlock>

              <H3>4.2 模式一：纯数字自增 ID</H3>
              <P>生成全局递增的纯数字 ID，默认 6 位，不足前补零。</P>
              <CodeBlock lang="java">{`// 生成默认6位自增ID，如：000001、000002、000110
String id = autoIdService.createIncrementId();

// 按分类生成自增ID（不同分类独立计数）
String orderId = autoIdService.createIncrementId("order");
String userId = autoIdService.createIncrementId("user");

// 指定ID长度，如8位：00000001
String id = autoIdService.createIncrementId(8);

// 按分类 + 指定长度
String orderId = autoIdService.createIncrementId("order", 10);`}</CodeBlock>
              <DocTable
                headers={["调用", "输出"]}
                rows={[
                  ["createIncrementId()", "000001"],
                  ["createIncrementId()", "000002"],
                  ["createIncrementId(\"order\")", "000001"],
                  ["createIncrementId(8)", "00000001"],
                ]}
              />

              <H3>4.3 模式二：日期 + 自增 ID</H3>
              <P>
                生成 <InlineCode>yyyyMMdd</InlineCode> 日期前缀 + 自增序号的 ID，每日自动归零重新计数，缓存有效期 25 小时。
              </P>
              <CodeBlock lang="java">{`// 默认6位序号：20260227000001
String id = autoIdService.createDateIncrementId();

// 按分类生成
String orderId = autoIdService.createDateIncrementId("order");

// 指定序号长度，如8位：2026022700000001
String id = autoIdService.createDateIncrementId(8);

// 按分类 + 指定长度
String orderId = autoIdService.createDateIncrementId("order", 10);`}</CodeBlock>
              <DocTable
                headers={["调用", "输出格式", "示例"]}
                rows={[
                  ["createDateIncrementId()", "yyyyMMdd + 6位序号", "20260227000001"],
                  ["createDateIncrementId(8)", "yyyyMMdd + 8位序号", "2026022700000001"],
                ]}
              />

              <H3>4.4 模式三：日期小时 + 自增 ID</H3>
              <P>
                生成 <InlineCode>yyyyMMddHH</InlineCode> 日期小时前缀 + 自增序号的 ID，每小时自动归零重新计数，缓存有效期 65 分钟。
              </P>
              <CodeBlock lang="java">{`// 默认6位序号：2026022714000001
String id = autoIdService.createDateHourIncrementId();

// 按分类生成
String orderId = autoIdService.createDateHourIncrementId("order");

// 指定序号长度
String id = autoIdService.createDateHourIncrementId(8);

// 按分类 + 指定长度
String orderId = autoIdService.createDateHourIncrementId("order", 10);`}</CodeBlock>
              <DocTable
                headers={["调用", "输出格式", "示例"]}
                rows={[
                  ["createDateHourIncrementId()", "yyyyMMddHH + 6位序号", "2026022714000001"],
                  ["createDateHourIncrementId(8)", "yyyyMMddHH + 8位序号", "202602271400000001"],
                ]}
              />

              {/* ============== 5. API 参考 ============== */}
              <H2 id="sec-api">5. API 参考</H2>
              <H3>IAutoIdService 接口方法</H3>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["createIncrementId()", "—", "6位自增ID", "全局自增 ID"],
                  ["createIncrementId(category)", "分类名称", "6位自增ID", "按分类独立计数"],
                  ["createIncrementId(length)", "ID长度", "指定长度自增ID", "自定义位数"],
                  ["createIncrementId(category, length)", "分类名称, ID长度", "指定长度自增ID", "分类 + 自定义位数"],
                  ["createDateIncrementId()", "—", "日期+6位序号", "每日归零"],
                  ["createDateIncrementId(category)", "分类名称", "日期+6位序号", "按分类每日归零"],
                  ["createDateIncrementId(length)", "序号长度", "日期+指定长度序号", "自定义序号位数"],
                  ["createDateIncrementId(category, length)", "分类名称, 序号长度", "日期+指定长度序号", "分类 + 自定义序号位数"],
                  ["createDateHourIncrementId()", "—", "日期小时+6位序号", "每小时归零"],
                  ["createDateHourIncrementId(category)", "分类名称", "日期小时+6位序号", "按分类每小时归零"],
                  ["createDateHourIncrementId(length)", "序号长度", "日期小时+指定长度序号", "自定义序号位数"],
                  ["createDateHourIncrementId(category, length)", "分类名称, 序号长度", "日期小时+指定长度序号", "分类 + 自定义序号位数"],
                ]}
              />

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-autoconfig">6. 自动配置机制</H2>
              <DocTable
                headers={["配置类", "说明"]}
                rows={[
                  ["RedisAutoIdConfig", "自动注册 IAutoIdService Bean（实现类 AutoIdRedisServiceImpl）"],
                ]}
              />
              <P>
                通过 Spring Boot <InlineCode>AutoConfiguration.imports</InlineCode> 声明自动配置入口，使用 <InlineCode>@EnableConfigurationProperties</InlineCode> 自动绑定配置属性。引入依赖即生效，无需手动注册 Bean。
              </P>

              {/* ============== 7. 内部实现 ============== */}
              <H2 id="sec-internal">7. 内部实现说明</H2>
              <H3>7.1 Redis Key 结构</H3>
              <DocTable
                headers={["类型", "Key 格式", "过期时间"]}
                rows={[
                  ["纯自增", "{namespace}:{database}:{category}", "不过期（永久递增）"],
                  ["日期自增", "{namespace}:{database}:{category}_yyyyMMdd", "25 小时"],
                  ["日期小时自增", "{namespace}:{database}:{category}_yyyyMMddHH", "65 分钟"],
                ]}
              />
              <P>
                命名空间固定为 <InlineCode>AutoIdCache</InlineCode>，默认 category 为 <InlineCode>AutoIdKey</InlineCode>。日期/小时类型的 Key 包含时间戳后缀，过期后自动清理。
              </P>

              <H3>7.2 ID 补零规则</H3>
              <P>
                所有生成的序号部分均会左补零到指定位数。例如序号值为 <InlineCode>110</InlineCode>，指定长度为 6，则输出 <InlineCode>000110</InlineCode>。
              </P>

              {/* ============== 8. 实战示例 ============== */}
              <H2 id="sec-examples">8. 实战示例</H2>
              <H3>8.1 订单号生成</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private IAutoIdService autoIdService;

    public String generateOrderNo() {
        // 生成格式：ORD20260227000001
        return "ORD" + autoIdService.createDateIncrementId("order");
    }

    public String generateRefundNo() {
        // 生成格式：REF2026022714000001
        return "REF" + autoIdService.createDateHourIncrementId("refund");
    }
}`}</CodeBlock>

              <H3>8.2 多业务独立编号</H3>
              <CodeBlock lang="java">{`@Service
public class CodeGenerator {

    @Resource
    private IAutoIdService autoIdService;

    public String generateUserCode() {
        // 用户编码：U000001（全局递增，不归零）
        return "U" + autoIdService.createIncrementId("user");
    }

    public String generateInvoiceNo() {
        // 发票号：INV20260227-00000001（日期+8位序号，每日归零）
        String dateId = autoIdService.createDateIncrementId("invoice", 8);
        return "INV" + dateId.substring(0, 8) + "-" + dateId.substring(8);
    }
}`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-best">9. 最佳实践</H2>
              <TipBox title="BEST PRACTICE">
                <Strong>合理使用分类（category）</Strong>：不同业务使用不同分类名，避免 ID 序号空间冲突，如 <InlineCode>{'"order"'}</InlineCode>、<InlineCode>{'"user"'}</InlineCode>、<InlineCode>{'"payment"'}</InlineCode> 等。
              </TipBox>
              <P>
                <Strong>选择合适的 ID 模式：</Strong>
              </P>
              <DocTable
                headers={["场景", "推荐模式"]}
                rows={[
                  ["需要全局唯一递增", "createIncrementId"],
                  ["需要按日区分且可读性强", "createDateIncrementId"],
                  ["高频业务需要更细粒度归零", "createDateHourIncrementId"],
                ]}
              />
              <WarnBox>
                根据业务量预估日/小时最大 ID 数，设置足够的 <InlineCode>length</InlineCode>，避免溢出指定位数。默认 6 位最多支持 999999 条/周期。该组件依赖 Redis <Highlight>原子操作</Highlight>，请确保 Redis 服务高可用，避免 ID 生成中断。
              </WarnBox>

              {/* ============== 10. 包结构 ============== */}
              <H2 id="sec-packages">10. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.autoId.redis
├── config
│   └── RedisAutoIdConfig.java            # Spring Boot 自动配置类
├── properties
│   └── RedisAutoIdProperties.java        # 配置属性绑定类
└── AutoIdRedisServiceImpl.java           # IAutoIdService 接口的 Redis 实现

com.mcst.eayfk.autoId.api
└── IAutoIdService.java                   # 自增 ID 服务接口定义（autoId-api 模块）`}</CodeBlock>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-autoid-redis — 基于 Redis 的分布式自增ID生成方案。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/cache-caffeine" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Caffeine 缓存</span>
                </Link>
                <Link href="/docs/reader/mq-rocket" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">RocketMQ</span>
                </Link>
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

      {/* AI Floating Button */}
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
    </div>
  )
}
