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
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", href: "/docs/reader/mq-rabbit" },{ label: "Kafka", active: true }]},
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "消息发送" },
  { id: "sec-4", label: "实战示例" },
  { id: "sec-5", label: "Kafka Streams 流处理" },
  { id: "sec-6", label: "自动配置机制" },
  { id: "sec-7", label: "包结构" },
  { id: "sec-8", label: "最佳实践" },
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

export default function MqKafkaDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Kafka</span>
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
                easyfk-mq-kafka Kafka
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Kafka 消息队列 — 高吞吐流式数据平台</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>mq-kafka</InlineCode> 是 EasyFK 框架中基于 Apache Kafka 的消息队列组件。该模块基于 Spring Kafka，提供统一的消息发送 API（同步/异步）、双序列化通道（JSON 字符串 + Protobuf 二进制）、完整的生产者/消费者自动配置、Kafka Streams 流处理支持，以及丰富的 Streams 工具类和 Serde 工厂，适用于高吞吐量消息传递、事件驱动架构、实时流处理等场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>mq-kafka</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:mq-kafka'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`spring-kafka` — Spring Kafka 集成", "`mq-common` — EasyFK 通用消息模型（`CommonMessage`、`ProtobufMessage`、`BaseMessage`）", "`kafka-streams` — Kafka Streams 流处理库"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 启用模块</H3>
              <P>模块通过 <InlineCode>easyfk.config.mq.kafka</InlineCode> 前缀控制开关：</P>

                            <DocTable
                headers={["`enable-kafka`", "Boolean", "`false`", "启用 Kafka 消息队列（**必须设为 `true`**）"]}
                rows={[]}
              />

              <H3>3.2 基础配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    mq:
      kafka:
        enable-kafka: true

spring:
  kafka:
    bootstrap-servers: 192.168.1.100:9092,192.168.1.101:9092
    consumer:
      group-id: my-app-group
      auto-offset-reset: earliest
      enable-auto-commit: true
      max-poll-records: 500
      session-timeout-ms: 30000
      heartbeat-interval-ms: 10000
      concurrency: 3
      ack-mode: batch
      isolation-level: read_committed
    producer:
      retries: 3
      batch-size: 16384
      linger-ms: 5
      buffer-memory: 33554432
      acks: all
      enable-idempotence: true
      compression-type: snappy`}</CodeBlock>

              <H3>3.3 生产者配置参考</H3>

                            <DocTable
                headers={["`producer.retries`", "`3`", "发送失败重试次数"]}
                rows={[
                  ["`producer.linger-ms`", "`5`", "批量等待时间（毫秒）"],
                  ["`producer.buffer-memory`", "`33554432`", "缓冲区大小（32MB）"],
                  ["`producer.acks`", "`all`", "确认级别（`0`/`1`/`all`）"],
                  ["`producer.enable-idempotence`", "`true`", "启用幂等性"],
                  ["`producer.compression-type`", "`snappy`", "压缩类型（`none`/`gzip`/`snappy`/`lz4`/`zstd`）"],
                  ["`producer.request-timeout-ms`", "`30000`", "请求超时时间"],
                  ["`producer.delivery-timeout-ms`", "`120000`", "传输超时时间"],
                  ["`producer.max-in-flight-requests-per-connection`", "`5`", "每个连接最大在途请求数"],
                ]}
              />

              <H3>3.4 消费者配置参考</H3>

                            <DocTable
                headers={["`consumer.group-id`", "`default-group`", "消费者组 ID"]}
                rows={[
                  ["`consumer.enable-auto-commit`", "`true`", "是否自动提交偏移量"],
                  ["`consumer.max-poll-records`", "`500`", "单次拉取最大记录数"],
                  ["`consumer.session-timeout-ms`", "`30000`", "会话超时时间"],
                  ["`consumer.heartbeat-interval-ms`", "`10000`", "心跳间隔"],
                  ["`consumer.concurrency`", "`3`", "并发消费者数量"],
                  ["`consumer.ack-mode`", "`auto`", "ACK 模式"],
                  ["`consumer.isolation-level`", "`read_committed`", "事务隔离级别"],
                  ["`consumer.fetch-min-bytes`", "`1024`", "最小拉取字节数"],
                  ["`consumer.fetch-max-wait-ms`", "`500`", "最大拉取等待时间"],
                ]}
              />

              <H3>3.5 ACK 模式</H3>

                            <DocTable
                headers={["`auto` / `batch`", "自动批量确认（默认）"]}
                rows={[
                  ["`manual`", "手动确认"],
                  ["`manual_immediate`", "手动立即确认"],
                  ["`count`", "按计数确认"],
                  ["`time`", "按时间确认"],
                  ["`count_time`", "按计数和时间确认"],
                ]}
              />

              <H3>3.6 Kafka Streams 配置</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    mq:
      kafka:
        enable-kafka: true
        enable-streams: true
        streams:
          application-id: my-streams-app
          state-dir: /tmp/kafka-streams
          processing-guarantee: at_least_once
          commit-interval-ms: 30000
          num-stream-threads: 2
          default-deserialization-exception-handler: logAndContinue
          default-production-exception-handler: fail
          retry-backoff-ms: 100
          reconnect-backoff-ms: 50`}</CodeBlock>

                            <DocTable
                headers={["`application-id`", "`streams-app`", "Streams 应用标识"]}
                rows={[
                  ["`processing-guarantee`", "`at_least_once`", "处理保证（`at_least_once`/`exactly_once`/`exactly_once_v2`）"],
                  ["`commit-interval-ms`", "`30000`", "提交间隔（毫秒）"],
                  ["`num-stream-threads`", "`2`", "流处理线程数"],
                  ["`default-deserialization-exception-handler`", "`logAndContinue`", "反序列化异常处理（`logAndContinue`/`logAndFail`）"],
                  ["`default-production-exception-handler`", "`fail`", "生产异常处理（`fail`/`continue`）"],
                ]}
              />

              {/* ============== 4. 消息发送 ============== */}
              <H2 id="sec-3">4. 消息发送</H2>

              <H3>4.1 注入 KafkaProducer</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private KafkaProducer kafkaProducer;
}`}</CodeBlock>

              <H3>4.2 发送 API</H3>
              <H4>JSON 字符串消息</H4>

                            <DocTable
                headers={["`syncSendMessage(message)`", "同步发送（阻塞等待确认，30 秒超时）"]}
                rows={[]}
              />
              <H4>Protobuf 二进制消息</H4>

                            <DocTable
                headers={["`syncSendProtobufMessage(message)`", "同步发送 Protobuf 消息"]}
                rows={[]}
              />

              <H3>4.3 CommonMessage 消息结构</H3>
              <P><InlineCode>CommonMessage&lt;T&gt;</InlineCode> 是 JSON 字符串消息的载体，继承自 <InlineCode>BaseMessage</InlineCode>：</P>

                            <DocTable
                headers={["`topic`", "String", "目标 Topic"]}
                rows={[
                  ["`messageId`", "String", "消息 ID（为空时自动生成雪花 ID）"],
                  ["`messageKey`", "String", "分区路由 Key"],
                  ["`partition`", "Integer", "指定分区（优先级高于 messageKey）"],
                  ["`tags`", "String", "消息标签"],
                  ["`sendTimestamp`", "Long", "发送时间戳（为空时自动填充）"],
                  ["`properties`", "Map", "自定义 Header 属性"],
                ]}
              />

              <H3>4.4 ProtobufMessage 消息结构</H3>
              <P><InlineCode>ProtobufMessage&lt;T&gt;</InlineCode> 是 Protobuf 二进制消息的载体，属性与 <InlineCode>CommonMessage</InlineCode> 一致，<InlineCode>data</InlineCode> 类型为 <InlineCode>com.google.protobuf.Message</InlineCode>。</P>

              {/* ============== 5. 实战示例 ============== */}
              <H2 id="sec-4">5. 实战示例</H2>

              <H3>5.1 同步发送 JSON 消息</H3>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setTopic("order-topic");
message.setData(orderDTO);
message.setMessageKey(orderDTO.getOrderId());
message.setTags("ORDER_CREATED");

kafkaProducer.syncSendMessage(message);`}</CodeBlock>

              <H3>5.2 异步发送 JSON 消息</H3>
              <CodeBlock lang="java">{`CommonMessage<String> message = new CommonMessage<>();
message.setTopic("notification-topic");
message.setData("用户注册成功");
message.setMessageKey(userId);

kafkaProducer.asyncSendMessage(message);`}</CodeBlock>

              <H3>5.3 发送 Protobuf 消息</H3>
              <CodeBlock lang="java">{`// 假设已定义 OrderProto.Order Protobuf 消息
OrderProto.Order order = OrderProto.Order.newBuilder()
    .setOrderId("ORD_001")
    .setAmount(9999)
    .build();

ProtobufMessage<OrderProto.Order> message = new ProtobufMessage<>();
message.setTopic("order-protobuf-topic");
message.setData(order);
message.setMessageKey("ORD_001");

kafkaProducer.syncSendProtobufMessage(message);`}</CodeBlock>

              <H3>5.4 自定义 Header 属性</H3>
              <CodeBlock lang="java">{`CommonMessage<String> message = new CommonMessage<>();
message.setTopic("event-topic");
message.setData("event data");
message.setTags("USER_EVENT");

Map<String, String> props = new HashMap<>();
props.put("source", "order-service");
props.put("traceId", "trace_12345");
message.setProperties(props);

kafkaProducer.syncSendMessage(message);`}</CodeBlock>

              <H3>5.5 消费 JSON 消息</H3>
              <CodeBlock lang="java">{`@Component
public class OrderConsumer {

    @KafkaListener(topics = "order-topic", containerFactory = "listenerContainerFactory")
    public void onMessage(ConsumerRecord<String, String> record) {
        OrderDTO order = JSONObject.parseObject(record.value(), OrderDTO.class);
        // 处理订单
    }
}`}</CodeBlock>

              <H3>5.6 消费 Protobuf 消息</H3>
              <CodeBlock lang="java">{`@Component
public class OrderProtobufConsumer {

    @KafkaListener(topics = "order-protobuf-topic", containerFactory = "protobufKafkaListenerContainerFactory")
    public void onMessage(ConsumerRecord<String, byte[]> record) {
        OrderProto.Order order = ProtobufUtils.deserialize(record.value(), OrderProto.Order.class);
        // 处理订单
    }
}`}</CodeBlock>

              <H3>5.7 使用 KafkaMessageUtil 提取消息</H3>
              <CodeBlock lang="java">{`@Resource
private KafkaMessageUtil kafkaMessageUtil;

@KafkaListener(topics = "order-topic", containerFactory = "listenerContainerFactory")
public void onMessage(ConsumerRecord<String, String> record) {
    // 提取消息体
    OrderDTO order = kafkaMessageUtil.getMessageBodyFromStringRecord(record, OrderDTO.class);

    // 提取 Header 信息
    Map<String, String> headers = kafkaMessageUtil.extractHeaders(record);
    String messageId = headers.get("messageId");
    String tags = headers.get("tags");
}`}</CodeBlock>

              {/* ============== 6. Kafka Streams 流处理 ============== */}
              <H2 id="sec-5">6. Kafka Streams 流处理</H2>

              <H3>6.1 继承 BaseStreamProcessor</H3>
              <CodeBlock lang="java">{`@Component
public class OrderStreamProcessor extends BaseStreamProcessor {

    @Override
    protected String getProcessorName() {
        return "order-stream-processor";
    }

    @Override
    protected String[] getInputTopics() {
        return new String[]{"order-topic"};
    }

    @Override
    protected String[] getOutputTopics() {
        return new String[]{"order-result-topic"};
    }

    @Override
    protected void buildTopology(StreamsBuilder builder) {
        builder.<String, String>stream("order-topic")
            .filter((key, value) -> value != null && !value.isEmpty())
            .mapValues(value -> {
                // 处理逻辑
                return processOrder(value);
            })
            .to("order-result-topic");
    }
}`}</CodeBlock>

              <H3>6.2 使用 SerdeFactory</H3>
              <CodeBlock lang="java">{`@Override
protected void buildTopology(StreamsBuilder builder) {
    builder.stream("input-topic", Consumed.with(SerdeFactory.string(), SerdeFactory.byteArray()))
        .mapValues(value -> {
            // 处理逻辑
            return transform(value);
        })
        .to("output-topic", Produced.with(SerdeFactory.string(), SerdeFactory.byteArray()));
}`}</CodeBlock>

              <H3>6.3 SerdeFactory 提供的 Serde</H3>

                            <DocTable
                headers={["`SerdeFactory.string()`", "`Serde&lt;String&gt;`", "字符串"]}
                rows={[
                  ["`SerdeFactory.integer()`", "`Serde&lt;Integer&gt;`", "Integer"],
                  ["`SerdeFactory.doubleValue()`", "`Serde&lt;Double&gt;`", "Double"],
                  ["`SerdeFactory.floatValue()`", "`Serde&lt;Float&gt;`", "Float"],
                  ["`SerdeFactory.byteArray()`", "`Serde&lt;byte[]&gt;`", "字节数组"],
                  ["`SerdeFactory.jsonMessage()`", "`Serde&lt;CommonMessage&gt;`", "JSON 消息"],
                  ["`SerdeFactory.protobufMessage(clazz)`", "`Serde&lt;ProtobufMessage&gt;`", "Protobuf 消息"],
                  ["`SerdeFactory.baseMessage(clazz)`", "`Serde&lt;BaseMessage&gt;`", "基础消息"],
                ]}
              />

              <H3>6.4 StreamProcessorRegistry 处理器注册表</H3>
              <P>Streams 启用后，<InlineCode>StreamProcessorRegistry</InlineCode> 自动注册所有 <InlineCode>BaseStreamProcessor</InlineCode> 实例：</P>
              <CodeBlock lang="java">{`@Resource
private StreamProcessorRegistry registry;

// 获取所有处理器名称
List<String> names = registry.getAllProcessorNames();

// 获取处理器数量
int count = registry.getProcessorCount();

// 获取所有处理器状态
List<ProcessorStatus> statuses = registry.getAllProcessorStatus();

// 获取统计信息
ProcessorStatistics stats = registry.getStatistics();`}</CodeBlock>

              <H3>6.5 KafkaMessageUtil Streams 工具方法</H3>

                            <DocTable
                headers={["`extractKeyValue(message)`", "从 BaseMessage 提取 KeyValue"]}
                rows={[
                  ["`jsonMessageDataExtractor()`", "提取 CommonMessage 中的 data"],
                  ["`protobufMessageDataExtractor()`", "提取 ProtobufMessage 中的 data"],
                  ["`topicFilter(topic)`", "按 Topic 过滤"],
                  ["`timeRangeFilter(start, end)`", "按时间范围过滤"],
                  ["`topicGrouper()`", "按 Topic 分组"],
                  ["`jsonMessageWrapper(topic)`", "包装为 CommonMessage"],
                  ["`protobufMessageWrapper(topic)`", "包装为 ProtobufMessage"],
                ]}
              />

              {/* ============== 7. 自动配置机制 ============== */}
              <H2 id="sec-6">7. 自动配置机制</H2>

                            <DocTable
                headers={["`KafkaMqConfig`", "`enable-kafka = true`", "核心自动配置，注册生产者/消费者工厂和模板"]}
                rows={[]}
              />
              <P>自动注册的 Bean：</P>

                            <DocTable
                headers={["`kafkaTemplate`", "`KafkaTemplate&lt;String, String&gt;`", "JSON 字符串消息模板"]}
                rows={[
                  ["`kafkaProducer`", "`KafkaProducer`", "消息生产者"],
                  ["`producerFactory`", "`ProducerFactory&lt;String, String&gt;`", "字符串生产者工厂"],
                  ["`protobufProducerFactory`", "`ProducerFactory&lt;String, byte[]&gt;`", "Protobuf 生产者工厂"],
                  ["`consumerFactory`", "`ConsumerFactory&lt;String, String&gt;`", "字符串消费者工厂"],
                  ["`protobufConsumerFactory`", "`ConsumerFactory&lt;String, byte[]&gt;`", "Protobuf 消费者工厂"],
                  ["`listenerContainerFactory`", "`ConcurrentKafkaListenerContainerFactory`", "字符串监听容器工厂"],
                  ["`protobufKafkaListenerContainerFactory`", "`ConcurrentKafkaListenerContainerFactory`", "Protobuf 监听容器工厂"],
                ]}
              />

              {/* ============== 8. 包结构 ============== */}
              <H2 id="sec-7">8. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.mq.kafka
├── config
│   ├── KafkaMqConfig.java                 # 核心自动配置（生产者/消费者工厂）
│   └── KafkaStreamsConfig.java            # Kafka Streams 自动配置
├── producer
│   └── KafkaProducer.java                 # 消息生产者（同步/异步 + JSON/Protobuf）
├── properties
│   └── KafkaMqProperties.java             # 配置属性类
├── streams
│   ├── processor
│   │   ├── BaseStreamProcessor.java       # 流处理器抽象基类
│   │   └── StreamProcessorRegistry.java   # 处理器注册管理器
│   └── serde
│       ├── BaseMessageSerde.java          # BaseMessage 序列化器
│       ├── ProtobufMessageSerde.java      # Protobuf 消息序列化器
│       └── SerdeFactory.java              # Serde 工厂类
└── util
    └── KafkaMessageUtil.java              # 消息处理工具类`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-8">9. 最佳实践</H2>
              <P>1. <Strong>合理选择发送模式</Strong>：需要可靠性保证用 <InlineCode>syncSendMessage</InlineCode>，追求吞吐量用 <InlineCode>asyncSendMessage</InlineCode>。</P>
              <P>2. <Strong>善用 messageKey</Strong>：相同 key 的消息会路由到同一分区，保证局部有序性。</P>
              <P>3. <Strong>启用幂等性</Strong>：<InlineCode>enable-idempotence: true</InlineCode>（默认已启用），防止网络抖动导致重复消息。</P>
              <P>4. <Strong>压缩优化</Strong>：默认使用 <InlineCode>snappy</InlineCode> 压缩，平衡压缩率与速度。大消息可考虑 <InlineCode>lz4</InlineCode> 或 <InlineCode>zstd</InlineCode>。</P>
              <P>5. <Strong>消费者并发</Strong>：<InlineCode>concurrency</InlineCode> 设置应不超过 Topic 分区数，否则多余的消费者空闲。</P>
              <P>6. <Strong>Protobuf 优先</Strong>：高吞吐量场景推荐使用 Protobuf 序列化，体积更小、序列化更快。</P>
              <P>7. <Strong>Streams 异常处理</Strong>：生产环境建议 <InlineCode>defaultDeserializationExceptionHandler</InlineCode> 设为 <InlineCode>logAndContinue</InlineCode>，避免单条异常消息阻塞流处理。</P>
              <P>8. <Strong>流处理器命名</Strong>：每个 <InlineCode>BaseStreamProcessor</InlineCode> 使用唯一的 <InlineCode>getProcessorName()</InlineCode>，便于监控和排查。</P>
              <P>9. <Strong>ACK 模式选择</Strong>：高可靠场景用 <InlineCode>manual</InlineCode> 或 <InlineCode>manual_immediate</InlineCode>，高吞吐场景用 <InlineCode>batch</InlineCode>（默认）。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-mq-kafka — 高吞吐流式数据平台集成方案。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/mq-rabbit" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">RabbitMQ</span>
                </Link>
                <Link href="/docs/reader/rpc-dubbo" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Dubbo</span>
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
