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
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", active: true },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "模块依赖" },
  { id: "sec-2", label: "包结构" },
  { id: "sec-3", label: "快速开始" },
  { id: "sec-4", label: "核心接口" },
  { id: "sec-5", label: "核心组件详解" },
  { id: "sec-6", label: "等待策略" },
  { id: "sec-7", label: "配置属性详解" },
  { id: "sec-8", label: "自动配置机制" },
  { id: "sec-9", label: "使用模式" },
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

export default function DisruptorDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Disruptor</span>
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
                easyfk-disruptor Disruptor
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Disruptor 高性能队列 — 无锁并发编程</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>queue-disruptor</InlineCode> 是 EasyFK 框架的<Strong>高性能内存队列模块</Strong>，基于 LMAX Disruptor 4.0 构建，提供了低延迟、高吞吐量的事件处理能力。该模块通过 Spring Boot 自动配置机制，支持声明式的队列定义和 Processor 自动绑定，开发者只需实现 <InlineCode>Processor</InlineCode> 接口即可完成队列的消费逻辑。</P>

              {/* ============== 2. 模块依赖 ============== */}
              <H2 id="sec-1">2. 模块依赖</H2>

              
              <P><Strong>build.gradle:</Strong></P>
              <CodeBlock lang="groovy">{`dependencies {
    api('com.lmax:disruptor:4.0.0')
}`}</CodeBlock>

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-2">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.queue.disruptor
├── api/                          # 接口定义
│   ├── IIngestQueue<T>             - 摄入队列接口
│   ├── Processor<T>                - 数据处理器接口
│   └── IQueueLifecycle             - 队列生命周期接口
├── config/                       # 自动配置
│   ├── DisruptorQueueAutoConfiguration - 自动配置类
│   └── ShutdownManager             - 优雅关闭管理器
├── core/                         # 核心实现
│   ├── DisruptorIngestQueue<T>     - Disruptor 队列实现（含 Builder）
│   ├── IngestQueueManager          - 队列管理器（门面类）
│   ├── IngestQueueRegistry         - 队列注册表
│   ├── Event<T>                    - 事件对象
│   ├── EventFactoryImpl<T>         - 事件工厂
│   └── GenericWorkHandler<T>       - 通用工作处理器（分片）
├── enums/                        # 枚举
│   └── WaitStrategyType            - 等待策略类型
└── properties/                   # 配置属性
    └── DisruptorQueuesProperties   - 队列配置属性`}</CodeBlock>

              {/* ============== 4. 快速开始 ============== */}
              <H2 id="sec-3">4. 快速开始</H2>

              <H3>4.1 实现 Processor</H3>
              <CodeBlock lang="java">{`@Component("orderProcessor")
public class OrderProcessor implements Processor<OrderData> {

    @Override
    public void process(OrderData item) throws Exception {
        // 处理订单数据
        orderService.processOrder(item);
    }
}`}</CodeBlock>

              <H3>4.2 发送数据到队列</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private IngestQueueManager queueManager;

    public void submitOrder(OrderData order) {
        // 阻塞模式发送
        queueManager.send("orderProcessor", order);

        // 非阻塞模式发送（推荐）
        boolean success = queueManager.trySend("orderProcessor", order, 100, TimeUnit.MILLISECONDS);
    }
}`}</CodeBlock>
              <P><Strong>说明：</Strong> 模块会自动发现 <InlineCode>Processor</InlineCode> Bean 并创建同名队列，无需任何配置即可使用。</P>

              <H3>4.3 可选配置</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    queue:
      disruptor:
        buffer-size: 65536          # 全局 RingBuffer 大小（2的幂）
        workers: 4                  # 全局工作线程数
        producer-type: SINGLE       # 全局生产者类型
        wait-strategy: BLOCKING     # 全局等待策略
        queues:
          orderProcessor:           # 队列名称（对应 Processor Bean 名称）
            buffer-size: 131072     # 覆盖全局配置
            workers: 8
            producer-type: MULTI
            wait-strategy: YIELDING
            processor-bean: orderProcessor  # 可选，显式绑定
            ingest:
              max-spin-nanos: 500000
            thread:
              name-prefix: order-worker-
              daemon: true
              priority: 5
            shutdown:
              await-ms: 60000`}</CodeBlock>

              {/* ============== 5. 核心接口 ============== */}
              <H2 id="sec-4">5. 核心接口</H2>

              <H3>5.1 Processor\&lt;T\&gt; —— 数据处理器</H3>
              <CodeBlock lang="java">{`public interface Processor<T> {
    void process(T item) throws Exception;
}`}</CodeBlock>
              <P>实现该接口定义队列的消费逻辑。每个 <InlineCode>Processor</InlineCode> Bean 会自动关联一个同名队列。</P>

              <H3>5.2 IIngestQueue\&lt;T\&gt; —— 摄入队列接口</H3>

                            <DocTable
                headers={["`accept(T item)`", "阻塞式放入队列，队列满时自旋等待"]}
                rows={[]}
              />

              <H3>5.3 IQueueLifecycle —— 生命周期接口</H3>

                            <DocTable
                headers={["`start()`", "启动队列"]}
                rows={[]}
              />

              {/* ============== 6. 核心组件详解 ============== */}
              <H2 id="sec-5">6. 核心组件详解</H2>

              <H3>6.1 IngestQueueManager —— 队列管理器（门面类）</H3>
              <P>提供统一的队列操作入口，<Strong>推荐在业务代码中使用此类</Strong>。</P>

                            <DocTable
                headers={["`getQueue(name)`", "`IIngestQueue&lt;T&gt;`", "获取队列实例"]}
                rows={[
                  ["`trySend(name, item, timeout, unit)`", "`boolean`", "非阻塞超时发送（推荐）"],
                  ["`sendBatch(name, items, timeout, unit)`", "`int`", "批量发送，返回成功数量"],
                  ["`sendWithRetry(name, item, maxRetries, timeout, unit)`", "`boolean`", "带重试的发送（递增退避）"],
                  ["`hasQueue(name)`", "`boolean`", "检查队列是否存在"],
                  ["`getAllQueueNames()`", "`Set&lt;String&gt;`", "获取所有队列名称"],
                  ["`getAllQueues()`", "`Map&lt;String, IIngestQueue&lt;?&gt;&gt;`", "获取所有队列实例"],
                ]}
              />
              <P><Strong>在 Processor 中访问其他队列：</Strong></P>
              <CodeBlock lang="java">{`@Component("stepOneProcessor")
public class StepOneProcessor implements Processor<RawData> {

    @Resource
    private IngestQueueManager queueManager;

    @Override
    public void process(RawData item) throws Exception {
        ProcessedData result = doProcess(item);
        // 发送到下一个队列（管道模式）
        queueManager.trySend("stepTwoProcessor", result, 100, TimeUnit.MILLISECONDS);
    }
}`}</CodeBlock>

              <H3>6.2 DisruptorIngestQueue —— 核心队列实现</H3>
              <P>基于 Disruptor RingBuffer 实现的高性能队列。</P>
              <P><Strong>accept() 流程：</Strong></P>
              <CodeBlock lang="plaintext">{`accept(item)
    │
    ├─ null 检查 → null 直接返回
    │
    ├─ running 检查 → 已关闭抛 RejectedExecutionException
    │
    └─ 自旋循环
        ├─ 中断检查 → 已中断抛 RejectedExecutionException
        ├─ running 检查 → 已关闭抛 RejectedExecutionException
        ├─ 容量检查 → 有空间 → tryPublishEvent → 成功返回
        └─ 无空间 → LockSupport.parkNanos(maxSpinNanos) → 继续循环`}</CodeBlock>
              <P><Strong>tryPublishEvent() 流程：</Strong></P>
              <CodeBlock lang="plaintext">{`tryPublishEvent(item)
    │
    ├─ ringBuffer.next() → 获取序列号
    ├─ ringBuffer.get(seq) → 获取 Event 对象
    ├─ event.setPayload(item) → 设置负载
    ├─ ringBuffer.publish(seq) → 发布事件
    │
    └─ 异常处理
        └─ 发布空事件（payload=null）→ 保持序列号一致性`}</CodeBlock>

              <H3>6.3 GenericWorkHandler —— 分片工作处理器</H3>
              <P>使用 Java <InlineCode>record</InlineCode> 实现，基于序列号取模的分片策略：</P>
              <CodeBlock lang="java">{`public void onEvent(Event<T> event, long sequence, boolean endOfBatch) {
    if ((sequence % shardTotal) != shardIndex) return;  // 不属于当前分片，跳过
    processor.process(event.getPayload());
    event.setPayload(null);  // 清空负载，允许 GC
}`}</CodeBlock>
              <P><Strong>分片示例（4个 Worker）：</Strong></P>

                            <DocTable
                headers={["0", "处理", "跳过", "跳过", "跳过"]}
                rows={[
                  ["2", "跳过", "跳过", "处理", "跳过"],
                  ["3", "跳过", "跳过", "跳过", "处理"],
                ]}
              />

              <H3>6.4 ShutdownManager —— 优雅关闭</H3>
              <P>实现 <InlineCode>DisposableBean</InlineCode>，在 Spring 容器销毁时自动关闭所有队列：</P>
              <CodeBlock lang="plaintext">{`Spring 容器关闭
    │
    └─ ShutdownManager.destroy()
        │
        └─ 遍历所有注册的队列
            ├─ 获取该队列的 awaitMs 配置（默认 60000ms）
            └─ 调用 IQueueLifecycle.shutdown(awaitMs)
                ├─ CAS 设置 running=false（幂等）
                ├─ 等待进行中的 accept 完成
                └─ disruptor.shutdown(awaitMs, MILLISECONDS)`}</CodeBlock>

              {/* ============== 7. 等待策略 ============== */}
              <H2 id="sec-6">7. 等待策略</H2>

                            <DocTable
                headers={["阻塞等待", "`BLOCKING`", "低", "较高", "默认策略，适合大多数场景"]}
                rows={[
                  ["忙等待", "`BUSY_SPIN`", "极高（100%）", "最低", "对延迟极其敏感的场景"],
                ]}
              />

              {/* ============== 8. 配置属性详解 ============== */}
              <H2 id="sec-7">8. 配置属性详解</H2>

              <H3>8.1 全局配置</H3>

                            <DocTable
                headers={["`buffer-size`", "Integer", "65536", "RingBuffer 大小（自动对齐到 2 的幂）"]}
                rows={[
                  ["`producer-type`", "String", "`SINGLE`", "生产者类型：`SINGLE` / `MULTI`"],
                  ["`wait-strategy`", "String", "`BLOCKING`", "等待策略：`BLOCKING` / `YIELDING` / `BUSY_SPIN`"],
                ]}
              />

              <H3>8.2 队列级配置（覆盖全局）</H3>

                            <DocTable
                headers={["`buffer-size`", "Integer", "全局值", "RingBuffer 大小"]}
                rows={[
                  ["`producer-type`", "String", "全局值", "生产者类型"],
                  ["`wait-strategy`", "String", "全局值", "等待策略"],
                  ["`processor-bean`", "String", "队列名称", "显式绑定 Processor Bean"],
                  ["`ingest.max-spin-nanos`", "long", "500000", "生产者自旋等待纳秒数"],
                  ["`thread.name-prefix`", "String", "Processor Bean 名称", "工作线程名称前缀"],
                  ["`thread.daemon`", "boolean", "true", "是否为守护线程"],
                  ["`thread.priority`", "int", "5", "线程优先级（1-10）"],
                  ["`shutdown.await-ms`", "long", "60000", "关闭等待时间（毫秒）"],
                ]}
              />
              <P><Strong>配置优先级：</Strong> 队列特定配置 &gt; 全局配置 &gt; 代码默认值</P>

              {/* ============== 9. 自动配置机制 ============== */}
              <H2 id="sec-8">9. 自动配置机制</H2>

              <H3>9.1 Processor 自动发现</H3>
              <P>模块启动时自动扫描所有 <InlineCode>Processor</InlineCode> 类型的 Bean，并为每个 Processor 创建对应的队列：</P>
              <CodeBlock lang="plaintext">{`启动流程
    │
    ├─ 1. 扫描配置文件中显式定义的队列（优先级最高）
    │     └─ 查找对应 Processor Bean → 创建并注册队列
    │
    └─ 2. 扫描未被绑定的 Processor Bean
          └─ 使用全局默认配置 → 自动创建并注册队列`}</CodeBlock>

              <H3>9.2 Processor 查找规则</H3>
              <P>1. 如果配置了 <InlineCode>processor-bean</InlineCode>，直接按名称查找</P>
              <P>2. 如果未配置，尝试用队列名称匹配 Processor Bean 名称</P>
              <P>3. 如果容器中只有一个 Processor，直接使用</P>
              <P>4. 以上都不匹配时抛出异常</P>

              {/* ============== 10. 使用模式 ============== */}
              <H2 id="sec-9">10. 使用模式</H2>

              <H3>10.1 单队列模式</H3>
              <CodeBlock lang="java">{`@Component("logProcessor")
public class LogProcessor implements Processor<LogEntry> {
    @Override
    public void process(LogEntry item) {
        // 写入日志存储
    }
}`}</CodeBlock>

              <H3>10.2 管道模式（多队列串联）</H3>
              <CodeBlock lang="java">{`@Component("parseProcessor")
public class ParseProcessor implements Processor<RawData> {
    @Resource
    private IngestQueueManager queueManager;

    @Override
    public void process(RawData item) {
        ParsedData parsed = parse(item);
        queueManager.trySend("enrichProcessor", parsed, 100, TimeUnit.MILLISECONDS);
    }
}

@Component("enrichProcessor")
public class EnrichProcessor implements Processor<ParsedData> {
    @Override
    public void process(ParsedData item) {
        // 数据增强处理
    }
}`}</CodeBlock>

              <H3>10.3 带重试的发送</H3>
              <CodeBlock lang="java">{`boolean success = queueManager.sendWithRetry("targetQueue", data, 3, 50, TimeUnit.MILLISECONDS);`}</CodeBlock>

              <H3>10.4 批量发送</H3>
              <CodeBlock lang="java">{`List<OrderData> orders = getOrders();
int sent = queueManager.sendBatch("orderProcessor", orders, 100, TimeUnit.MILLISECONDS);`}</CodeBlock>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-disruptor — 高性能无锁队列，实现极致并发性能。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/thread" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">线程池</span>
                </Link>
                <Link href="/docs/reader/fory" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Fory 序列化</span>
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
