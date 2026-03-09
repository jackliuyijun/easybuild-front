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
  { title: "缓存与ID", items: [{ label: "Caffeine 缓存", href: "/docs/reader/cache-caffeine" },{ label: "Redis 自增ID", href: "/docs/reader/autoid-redis" }]},
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", href: "/docs/reader/mq-rabbit" },{ label: "Kafka", href: "/docs/reader/mq-kafka" }]},
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", active: true },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖关系" },
  { id: "sec-2", label: "包结构" },
  { id: "sec-3", label: "配置属性" },
  { id: "sec-4", label: "配置示例" },
  { id: "sec-5", label: "自动配置" },
  { id: "sec-6", label: "CustomTaskExecutor（TraceId 传递）" },
  { id: "sec-7", label: "线程池监控" },
  { id: "sec-8", label: "CompletableFuture 转换工具" },
  { id: "sec-9", label: "重试执行器" },
  { id: "sec-10", label: "预定义配置模板" },
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

function DocTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
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

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc text-[15px] leading-[1.8] text-[#9CA3AF]">{item}</li>
      ))}
    </ul>
  )
}

function NumberList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-decimal text-[15px] leading-[1.8] text-[#9CA3AF]">{item}</li>
      ))}
    </ol>
  )
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

export default function ThreadDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">线程池</span>
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
                easyfk-thread 线程池
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>线程池管理 — 高性能并发任务调度</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>easyfk-thread</InlineCode> 是 EasyFK 框架的<Strong>线程池管理与异步任务模块</Strong>，提供以下核心能力：</P>
              <BulletList items={["**六种预定义线程池**：通用、异步（@Async）、调度（@Scheduled）、I/O 密集型、CPU 密集型、重试线程池", "**全链路 TraceId 传递**：自动在父子线程间传递 TraceId + MDC 日志上下文", "**线程池动态监控与自动伸缩**：基于负载指标（线程利用率 / 队列利用率）自动扩缩容", "**重试执行器**：支持同步/异步模式、三种退避策略、信号量并发控制、降级处理", "**CompletableFuture 转换工具**：将阻塞调用转为异步，并自动解包 BaseResult"]} />

              {/* ============== 2. 依赖关系 ============== */}
              <H2 id="sec-1">2. 依赖关系</H2>
              <CodeBlock lang="groovy">{`dependencies {
    compileOnly project(':easyfk-core')
}`}</CodeBlock>

              

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-2">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`easyfk-thread/
├── build.gradle
└── src/main/java/com/mcst/easyfk/thread/
    ├── config/
    │   ├── ThreadPoolConfig.java              # 线程池自动配置（核心）
    │   └── ThreadPoolMonitorAutoConfig.java   # 监控自动配置
    ├── properties/
    │   ├── ThreadPoolBaseProperties.java       # 线程池基础配置
    │   ├── ThreadPoolArgs.java                # 线程池参数（可复用）
    │   ├── ThreadPoolMonitorProperties.java   # 监控配置
    │   └── DynamicAdjustmentConfig.java       # 动态调整配置
    ├── CustomTaskExecutor.java                # 增强的任务执行器（TraceId 传递）
    ├── ThreadPoolMetrics.java                 # 线程池指标数据
    ├── ThreadPoolMonitor.java                 # 线程池监控器
    ├── AsyncThreadPoolMonitor.java            # 异步线程池监控器
    ├── ThreadPoolMonitorManager.java          # 监控器管理器
    ├── AdjustmentDecision.java                # 调整决策
    ├── async/
    │   └── CompletableFutureConvert.java      # CompletableFuture 转换工具
    └── retry/
        ├── RetryConfig.java                   # 重试配置
        ├── RetryContext.java                  # 重试上下文
        ├── RetryCallback.java                 # 重试回调接口
        ├── BackoffStrategy.java               # 退避策略枚举
        ├── RetryableOperation.java            # 可重试操作接口
        └── RetryExecutor.java                 # 重试执行器`}</CodeBlock>

              {/* ============== 4. 配置属性 ============== */}
              <H2 id="sec-3">4. 配置属性</H2>

              <H3>4.1 线程池基础配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.thread.pool</InlineCode></P>

                            <DocTable
                headers={["`create-common-pool`", "Boolean", "`false`", "是否创建通用线程池"]}
                rows={[
                  ["`create-schedule-pool`", "Boolean", "`false`", "是否创建任务调度线程池（配合 @Scheduled）"],
                  ["`create-io-intensive-pool`", "Boolean", "`false`", "是否创建 I/O 密集型线程池"],
                  ["`create-cpu-intensive-pool`", "Boolean", "`false`", "是否创建 CPU 密集型线程池"],
                  ["`create-retry`", "Boolean", "`false`", "是否创建重试线程池 + RetryExecutor"],
                ]}
              />

              <H3>4.2 线程池参数（ThreadPoolArgs）</H3>
              <P>每种线程池都有独立的参数配置：</P>

                            <DocTable
                headers={["`core-pool-size`", "Integer", "CPU 核心数", "核心线程数（未设置时自动获取）"]}
                rows={[
                  ["`queue-capacity`", "Integer", "200", "队列容量"],
                  ["`keep-alive-seconds`", "Integer", "60", "空闲线程存活时间"],
                  ["`thread-name-prefix`", "String", "`custom-thread-`", "线程名前缀"],
                  ["`wait-for-tasks-to-complete-on-shutdown`", "Boolean", "`true`", "关闭时等待任务完成"],
                  ["`await-termination-seconds`", "Integer", "60", "等待终止时间"],
                  ["`allow-core-thread-time-out`", "Boolean", "`false`", "核心线程是否超时回收"],
                  ["`prestart-all-core-threads`", "Boolean", "`false`", "是否预热核心线程"],
                  ["`rejected-execution-handler`", "String", "`CALLER_RUNS`", "拒绝策略：ABORT / CALLER_RUNS / DISCARD / DISCARD_OLDEST"],
                ]}
              />
              <P><Strong>配置路径映射：</Strong></P>

                            <DocTable
                headers={["通用", "`easyfk.config.thread.pool.common-pool-args.*`"]}
                rows={[
                  ["调度", "`easyfk.config.thread.pool.schedule-pool-args.*`"],
                  ["I/O 密集", "`easyfk.config.thread.pool.io-intensive-pool-args.*`"],
                  ["CPU 密集", "`easyfk.config.thread.pool.cpu-intensive-pool-args.*`"],
                  ["重试", "`easyfk.config.thread.pool.retry-pool-args.*`"],
                ]}
              />

              <H3>4.3 监控配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.thread.pool.monitor</InlineCode></P>

                            <DocTable
                headers={["`enabled`", "boolean", "`false`", "是否启用监控"]}
                rows={[
                  ["`auto-start`", "boolean", "`true`", "是否自动启动监控"],
                  ["`include-names`", "List\&lt;String\&gt;", "`[]`", "包含的线程池名称（空表示全部）"],
                  ["`exclude-names`", "List\&lt;String\&gt;", "`[]`", "排除的线程池名称"],
                ]}
              />

              <H3>4.4 动态调整配置（DynamicAdjustmentConfig）</H3>

                            <DocTable
                headers={["`enabled`", "Boolean", "`true`", "是否启用动态调整"]}
                rows={[
                  ["`cooldown-period`", "Duration", "2min", "冷却期（两次调整最小间隔）"],
                  ["`min-core-pool-size`", "Integer", "2", "最小核心线程数"],
                  ["`max-core-pool-size`", "Integer", "20", "最大核心线程数"],
                  ["`scale-up-step`", "Integer", "2", "扩容步长"],
                  ["`scale-down-step`", "Integer", "1", "缩容步长"],
                  ["`high-load-threshold`", "Double", "80.0", "高负载阈值（线程利用率 %）"],
                  ["`low-load-threshold`", "Double", "30.0", "低负载阈值（线程利用率 %）"],
                  ["`queue-high-threshold`", "Double", "70.0", "队列高负载阈值（%）"],
                  ["`queue-low-threshold`", "Double", "20.0", "队列低负载阈值（%）"],
                  ["`async-monitoring-enabled`", "Boolean", "`true`", "是否启用异步监控"],
                  ["`async-monitoring-pool-size`", "Integer", "2", "异步监控线程池大小"],
                  ["`async-monitoring-queue-capacity`", "Integer", "100", "异步监控队列容量"],
                  ["`async-monitoring-timeout-seconds`", "Integer", "30", "异步监控超时时间"],
                ]}
              />

              {/* ============== 5. 配置示例 ============== */}
              <H2 id="sec-4">5. 配置示例</H2>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    thread:
      pool:
        create-common-pool: true
        create-async-pool: true
        create-schedule-pool: true
        create-io-intensive-pool: true
        create-retry: true

        common-pool-args:
          core-pool-size: 8
          max-pool-size: 16
          queue-capacity: 500
          thread-name-prefix: "common-"
          rejected-execution-handler: CALLER_RUNS

        async-pool-args:
          core-pool-size: 4
          queue-capacity: 200

        io-intensive-pool-args:
          core-pool-size: 16
          max-pool-size: 32
          queue-capacity: 1000
          keep-alive-seconds: 120

        retry-pool-args:
          core-pool-size: 2
          thread-name-prefix: "retry-"

        monitor:
          enabled: true
          auto-discovery: true
          auto-start: true
          exclude-names:
            - retryScheduledExecutor
          default-config:
            monitoring-interval: 30s
            cooldown-period: 2m
            high-load-threshold: 80.0
            low-load-threshold: 30.0
            async-monitoring-enabled: true
          configs:
            commonTaskExecutor:
              high-load-threshold: 70.0
              max-core-pool-size: 30
              scale-up-step: 3`}</CodeBlock>

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-5">6. 自动配置</H2>

              <H3>6.1 ThreadPoolConfig</H3>
              <P><InlineCode>@AutoConfiguration</InlineCode> 类，注册所有线程池 Bean：</P>

                            <DocTable
                headers={["`commonTaskExecutor`", "`CustomTaskExecutor`", "`create-common-pool=true`", "通用线程池"]}
                rows={[
                  ["`scheduleTaskExecutor` / `taskScheduler`", "`TaskScheduler`", "`create-schedule-pool=true`", "调度线程池（`@Primary`）"],
                  ["`ioIntensiveTaskExecutor`", "`CustomTaskExecutor`", "`create-io-intensive-pool=true`", "I/O 密集型线程池"],
                  ["`cpuIntensiveTaskExecutor`", "`CustomTaskExecutor`", "`create-cpu-intensive-pool=true`", "CPU 密集型线程池"],
                  ["`retryScheduledExecutor`", "`ScheduledExecutorService`", "`create-retry=true`", "重试调度线程池"],
                  ["`retryExecutor`", "`RetryExecutor`", "`create-retry=true`", "重试执行器"],
                ]}
              />

              <H3>6.2 ThreadPoolMonitorAutoConfig</H3>
              <P><InlineCode>@AutoConfiguration</InlineCode> 类，条件：<InlineCode>monitor.enabled=true</InlineCode></P>
              <BulletList items={["注册 `ThreadPoolMonitorManager` Bean", "通过 `@PostConstruct` 自动发现所有 `ThreadPoolTaskExecutor` Bean", "根据 include/exclude 规则过滤", "为每个线程池创建 `ThreadPoolMonitor`，支持特定配置和默认配置", "自动启动监控（`auto-start=true` 时）"]} />

              {/* ============== 7. CustomTaskExecutor（TraceId 传递） ============== */}
              <H2 id="sec-6">7. CustomTaskExecutor（TraceId 传递）</H2>
              <P>继承 <InlineCode>ThreadPoolTaskExecutor</InlineCode>，重写 <InlineCode>execute()</InlineCode> 方法：</P>
              <CodeBlock lang="java">{`public class CustomTaskExecutor extends ThreadPoolTaskExecutor {
    @Override
    public void execute(Runnable task) {
        final String traceId = TraceIdContext.getTraceId();
        super.execute(() -> {
            try {
                if (EmptyUtil.isNotEmpty(traceId)) {
                    TraceIdContext.setTraceId(traceId);
                    MDC.put(RequestHeaderConstant.TRACE_ID, traceId);
                }
                task.run();
            } finally {
                TraceIdContext.remove();
                MDC.remove(RequestHeaderConstant.TRACE_ID);
            }
        });
    }
}`}</CodeBlock>
              <P><Strong>功能：</Strong></P>
              <BulletList items={["提交任务前捕获当前线程的 TraceId", "任务执行时自动注入 TraceId 到子线程的 `TraceIdContext` 和 `MDC`", "任务结束后清理，防止泄漏"]} />

              {/* ============== 8. 线程池监控 ============== */}
              <H2 id="sec-7">8. 线程池监控</H2>

              <H3>8.1 ThreadPoolMetrics（指标数据）</H3>

                            <DocTable
                headers={["`corePoolSize`", "核心线程数"]}
                rows={[
                  ["`activeThreadCount`", "活跃线程数"],
                  ["`poolSize`", "当前线程池大小"],
                  ["`queueSize`", "队列中等待任务数"],
                  ["`queueCapacity`", "队列容量"],
                  ["`completedTaskCount`", "已完成任务数"],
                  ["`taskCount`", "总任务数"],
                  ["`threadUtilization`", "线程利用率（active / core × 100）"],
                  ["`queueUtilization`", "队列利用率（queueSize / capacity × 100）"],
                  ["`loadStatus`", "负载状态：LOW / MEDIUM / HIGH / CRITICAL"],
                ]}
              />

              <H3>8.2 AdjustmentDecision（调整决策）</H3>

                            <DocTable
                headers={["`SCALE_UP`", "扩容"]}
                rows={[
                  ["`NO_CHANGE`", "无需调整"],
                ]}
              />
              <P>提供工厂方法：<InlineCode>scaleUp()</InlineCode>、<InlineCode>scaleDown()</InlineCode>、<InlineCode>noChange()</InlineCode></P>

              <H3>8.3 ThreadPoolMonitor（监控器）</H3>
              <P>核心功能：</P>
              <BulletList items={["`startMonitoring()` — 启动监控（CAS 幂等保护）", "`stopMonitoring()` — 停止监控", "`manualAdjust()` — 手动触发一次调整", "`getStatistics()` — 获取完整统计信息", "`resetStatistics()` — 重置统计数据"]} />
              <P>支持同步 / 异步两种监控模式，OOM 时自动降级为同步模式。</P>

              <H3>8.4 ThreadPoolMonitorManager（管理器）</H3>
              <P>集中管理所有监控器：</P>
              <CodeBlock lang="java">{`// 获取指定监控器
ThreadPoolMonitor monitor = manager.getMonitor("commonTaskExecutor");

// 获取所有统计
Map<String, Map<String, Object>> stats = manager.getAllStatistics();

// 启动/停止所有监控
manager.startAllMonitoring();
manager.stopAllMonitoring();`}</CodeBlock>

              {/* ============== 9. CompletableFuture 转换工具 ============== */}
              <H2 id="sec-8">9. CompletableFuture 转换工具</H2>

              <H3>9.1 通用异步转换</H3>
              <CodeBlock lang="java">{`CompletableFuture<Result> future = CompletableFutureConvert.async(
    () -> slowService.query(param),
    5,   // 超时秒数
    ioIntensiveTaskExecutor
);`}</CodeBlock>

              <H3>9.2 BaseResult 自动解包</H3>
              <CodeBlock lang="java">{`CompletableFuture<UserDto> future = CompletableFutureConvert.asyncForBaseResult(
    () -> userApi.getUser(userId),
    3,   // 超时秒数
    ioIntensiveTaskExecutor
);

// future 直接包含 UserDto，无需手动解包 BaseResult
// 失败时自动抛出 RuntimeException("REMOTE_FAIL: code:msg")`}</CodeBlock>

              {/* ============== 10. 重试执行器 ============== */}
              <H2 id="sec-9">10. 重试执行器</H2>

              <H3>10.1 退避策略（BackoffStrategy）</H3>

                            <DocTable
                headers={["`LINEAR`", "base × attempt", "500ms, 1000ms, 1500ms"]}
                rows={[
                  ["`FIXED`", "base（恒定）", "500ms, 500ms, 500ms"],
                ]}
              />

              <H3>10.2 RetryConfig（重试配置）</H3>
              <CodeBlock lang="java">{`RetryConfig config = RetryConfig.builder()
    .maxRetries(3)                              // 最大重试 3 次
    .baseDelayMs(500)                           // 基础延迟 500ms
    .backoffStrategy(BackoffStrategy.LINEAR)    // 线性退避
    .maxConcurrentRetries(100)                  // 最大并发重试数
    .businessKey("pushMsg:user123")             // 业务标识
    .enableFallback(true)                       // 启用降级
    .retryFor(new Class[]{IOException.class})   // 仅重试 IO 异常
    .noRetryFor(new Class[]{IllegalArgumentException.class}) // 参数异常不重试
    .build();`}</CodeBlock>

              <H3>10.3 同步模式</H3>
              <CodeBlock lang="java">{`@Resource
private RetryExecutor retryExecutor;

// 同步执行，失败自动重试，所有重试完成后返回或抛异常
try {
    String result = retryExecutor.execute(config, () -> {
        return httpClient.get(url);
    });
} catch (Exception e) {
    // 所有重试都失败后的异常
}`}</CodeBlock>

              <H3>10.4 异步模式</H3>
              <CodeBlock lang="java">{`retryExecutor.executeAsync(config, () -> {
    rocketProducer.send(message);
    return null;
}, new RetryCallback<Void>() {
    @Override
    public void onSuccess(Void result, int attempt) {
        log.info("发送成功，尝试次数: {}", attempt);
    }

    @Override
    public void onFinalFailure(Exception e, int totalAttempts) {
        log.error("发送最终失败，总尝试: {}", totalAttempts, e);
    }
});`}</CodeBlock>

              <H3>10.5 RetryCallback（回调接口）</H3>

                            <DocTable
                headers={["`onSuccess(T result, int attempt)`", "操作成功时调用（首次或重试后）"]}
                rows={[]}
              />
              <P>两个方法都有默认空实现，可按需覆盖。</P>

              {/* ============== 11. 预定义配置模板 ============== */}
              <H2 id="sec-10">11. 预定义配置模板</H2>
              <P><InlineCode>DynamicAdjustmentConfig</InlineCode> 提供三种预置配置：</P>

                            <DocTable
                headers={["默认", "`defaultConfig()`", "30s", "2min", "80%", "2", "启用"]}
                rows={[
                  ["保守", "`conservativeConfig()`", "2min", "5min", "90%", "1", "关闭"],
                ]}
              />

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-thread — 高性能线程池管理，提升并发任务调度效率。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/lock-redisson" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Redisson 分布式锁</span>
                </Link>
                <Link href="/docs/reader/disruptor" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Disruptor</span>
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
