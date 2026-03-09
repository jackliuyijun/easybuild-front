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
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", active: true },{ label: "Kafka", href: "/docs/reader/mq-kafka" }]},
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
  { id: "sec-5", label: "RabbitMessageUtil 工具类" },
  { id: "sec-6", label: "发布确认与返回回调" },
  { id: "sec-7", label: "自动配置机制" },
  { id: "sec-8", label: "包结构" },
  { id: "sec-9", label: "最佳实践" },
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

export default function MqRabbitDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">RabbitMQ</span>
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
                easyfk-mq-rabbit RabbitMQ
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>RabbitMQ 消息队列 — 轻量级消息中间件</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>mq-rabbit</InlineCode> 是 EasyFK 框架中基于 RabbitMQ 的消息队列组件。该模块基于 Spring AMQP，提供统一的消息发送 API（同步/异步）、延迟消息支持（基于 <InlineCode>rabbitmq_delayed_message_exchange</InlineCode> 插件）、Jackson JSON 自动序列化、发布确认与返回回调机制，并与框架内 Kafka、RocketMQ 组件共享 <InlineCode>CommonMessage</InlineCode> 消息模型，适用于微服务解耦、异步通信、延迟任务、事件驱动等场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>mq-rabbit</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:mq-rabbit'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`spring-boot-starter-amqp` — Spring AMQP 集成", "`mq-common` — EasyFK 通用消息模型（`CommonMessage`、`BaseMessage`）"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 启用模块</H3>

                            <DocTable
                headers={["`easyfk.config.mq.rabbit.enable-rabbit`", "Boolean", "`false`", "启用 RabbitMQ（**必须设为 `true`**）"]}
                rows={[
                  ["`easyfk.config.mq.rabbit.delay-exchange`", "String", "`easyfk.delay.exchange`", "延迟消息 Exchange 名称"],
                  ["`easyfk.config.mq.rabbit.confirm-callback`", "Boolean", "`false`", "是否启用发布确认回调"],
                  ["`easyfk.config.mq.rabbit.return-callback`", "Boolean", "`false`", "是否启用返回回调（消息无法路由时触发）"],
                ]}
              />

              <H3>3.2 基础配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    mq:
      rabbit:
        enable-rabbit: true
        exchange: my-app.direct.exchange
        delay-exchange: my-app.delay.exchange
        confirm-callback: true
        return-callback: true

spring:
  rabbitmq:
    host: 192.168.1.100
    port: 5672
    username: guest
    password: guest
    virtual-host: /`}</CodeBlock>

              <H3>3.3 生产环境配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    mq:
      rabbit:
        enable-rabbit: true
        exchange: order.direct.exchange
        delay-exchange: order.delay.exchange
        confirm-callback: true
        return-callback: true

spring:
  rabbitmq:
    host: mq-cluster.internal
    port: 5672
    username: \${RABBIT_USER}
    password: \${RABBIT_PASSWORD}
    virtual-host: /production
    publisher-confirm-type: correlated
    publisher-returns: true
    listener:
      simple:
        acknowledge-mode: manual
        prefetch: 10
        concurrency: 5
        max-concurrency: 20
    connection-timeout: 10000`}</CodeBlock>

              {/* ============== 4. 消息发送 ============== */}
              <H2 id="sec-3">4. 消息发送</H2>

              <H3>4.1 注入 RabbitProducer</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private RabbitProducer rabbitProducer;
}`}</CodeBlock>

              <H3>4.2 发送 API</H3>

                            <DocTable
                headers={["`syncSendMessage(message)`", "同步发送（阻塞等待 Broker 确认）"]}
                rows={[]}
              />
              <P>两个方法均自动识别延迟消息：当 <InlineCode>CommonMessage.delayTime &gt; 0</InlineCode> 时，自动路由到延迟交换机。</P>

              <H3>4.3 CommonMessage 消息结构</H3>
              <P><InlineCode>CommonMessage&lt;T&gt;</InlineCode> 是消息载体，继承自 <InlineCode>BaseMessage</InlineCode>：</P>

                            <DocTable
                headers={["`topic`", "String", "Exchange 名称", "为空时使用默认 Exchange"]}
                rows={[
                  ["`messageId`", "String", "MessageProperties.messageId", "消息 ID（为空时自动生成雪花 ID）"],
                  ["`messageKey`", "String", "RoutingKey（优先）", "分区路由键"],
                  ["`tags`", "String", "RoutingKey（次选）/ Header", "消息标签"],
                  ["`sendTimestamp`", "Long", "MessageProperties.timestamp", "发送时间戳（为空时自动填充）"],
                  ["`delayTime`", "Long", "x-delay Header", "延迟时间（毫秒），&gt; 0 时走延迟交换机"],
                  ["`properties`", "Map", "Headers", "自定义 Header 属性"],
                ]}
              />

              <H3>4.4 消息映射规则</H3>
              <P><Strong>Exchange 选择逻辑：</Strong></P>
              <P>1. <InlineCode>delayTime &gt; 0</InlineCode> → 使用 <InlineCode>delayExchange</InlineCode>（延迟交换机）</P>
              <P>2. <InlineCode>topic</InlineCode> 不为空 → 使用 <InlineCode>topic</InlineCode> 作为 Exchange</P>
              <P>3. 都为空 → 使用默认 <InlineCode>exchange</InlineCode>（配置文件中指定）</P>
              <P><Strong>RoutingKey 选择逻辑：</Strong></P>
              <P>1. <InlineCode>messageKey</InlineCode> 不为空 → 使用 <InlineCode>messageKey</InlineCode></P>
              <P>2. <InlineCode>tags</InlineCode> 不为空 → 使用 <InlineCode>tags</InlineCode></P>
              <P>3. 都为空 → 空字符串 <InlineCode>{'""'}</InlineCode></P>

              {/* ============== 5. 实战示例 ============== */}
              <H2 id="sec-4">5. 实战示例</H2>

              <H3>5.1 同步发送普通消息</H3>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setTopic("order.direct.exchange");
message.setData(orderDTO);
message.setMessageKey("order.created");
message.setTags("ORDER_CREATED");

rabbitProducer.syncSendMessage(message);`}</CodeBlock>

              <H3>5.2 异步发送普通消息</H3>
              <CodeBlock lang="java">{`CommonMessage<String> message = new CommonMessage<>();
message.setTopic("notification.fanout.exchange");
message.setData("用户注册成功");
message.setMessageKey("user.registered");

rabbitProducer.asyncSendMessage(message);`}</CodeBlock>

              <H3>5.3 发送延迟消息</H3>
              <P>延迟消息需要 RabbitMQ 安装 <InlineCode>rabbitmq_delayed_message_exchange</InlineCode> 插件。</P>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setData(orderDTO);
message.setMessageKey("order.timeout.check");
message.setDelayTime(30 * 60 * 1000L);  // 30 分钟后发送

rabbitProducer.syncSendMessage(message);
// 自动识别 delayTime > 0，路由到延迟交换机`}</CodeBlock>

              <H3>5.4 自定义 Header 属性</H3>
              <CodeBlock lang="java">{`CommonMessage<String> message = new CommonMessage<>();
message.setTopic("event.topic.exchange");
message.setData("event data");
message.setTags("USER_EVENT");

Map<String, String> props = new HashMap<>();
props.put("source", "order-service");
props.put("traceId", "trace_12345");
message.setProperties(props);

rabbitProducer.syncSendMessage(message);`}</CodeBlock>

              <H3>5.5 消费消息</H3>
              <CodeBlock lang="java">{`@Component
public class OrderConsumer {

    @RabbitListener(queues = "order-queue")
    public void onMessage(OrderDTO order) {
        // Jackson 自动反序列化为 OrderDTO
        // 处理订单
    }
}`}</CodeBlock>

              <H3>5.6 消费原生 Message（获取 Header）</H3>
              <CodeBlock lang="java">{`@Component
public class OrderConsumer {

    @RabbitListener(queues = "order-queue")
    public void onMessage(Message message) {
        // 获取消息 ID
        String messageId = RabbitMessageUtil.getMessageId(message);

        // 获取时间戳
        Long timestamp = RabbitMessageUtil.getTimestamp(message);

        // 获取自定义 Header
        String traceId = RabbitMessageUtil.getHeaderValue(message, "traceId", String.class);

        // 获取消息体
        String body = RabbitMessageUtil.getBodyAsString(message);
    }
}`}</CodeBlock>

              <H3>5.7 使用 RabbitProducerHelper（底层 API）</H3>
              <P><InlineCode>RabbitProducerHelper</InlineCode> 提供更底层的发送方法，适用于需要精细控制的场景：</P>
              <CodeBlock lang="java">{`@Resource
private RabbitProducerHelper rabbitProducerHelper;

// 同步发送
rabbitProducerHelper.syncSendMessage("my-exchange", "my-routing-key", data);

// 同步发送（带关联数据）
CorrelationData correlationData = new CorrelationData("unique-id");
rabbitProducerHelper.syncSendMessage("my-exchange", "my-routing-key", data, correlationData);

// 异步发送
rabbitProducerHelper.asyncSendMessage("my-exchange", "my-routing-key", data);

// 延迟消息
rabbitProducerHelper.sendDelayMessage("delay-exchange", "my-routing-key", data, 60000L);

// 带自定义属性发送
MessageProperties props = new MessageProperties();
props.setMessageId("msg-001");
props.setHeader("customKey", "customValue");
rabbitProducerHelper.sendMessageWithProperties("my-exchange", "my-routing-key", data, props);

// 发送原生消息
Message rawMessage = new Message(body, messageProperties);
rabbitProducerHelper.sendRawMessage("my-exchange", "my-routing-key", rawMessage);`}</CodeBlock>

              {/* ============== 6. RabbitMessageUtil 工具类 ============== */}
              <H2 id="sec-5">6. RabbitMessageUtil 工具类</H2>

                            <DocTable
                headers={["`getHeaderValue(message, key, clazz)`", "`T`", "获取 Header 值（支持类型转换）"]}
                rows={[
                  ["`getTimestamp(message)`", "`Long`", "获取时间戳（毫秒）"],
                  ["`getBody(message)`", "`byte[]`", "获取消息体字节数组"],
                  ["`getBodyAsString(message)`", "`String`", "获取消息体字符串"],
                ]}
              />
              <P><InlineCode>getHeaderValue</InlineCode> 支持自动类型转换：</P>
              <BulletList items={["目标类型为 `String` → 调用 `toString()`", "目标类型为 `Long` 且值为 `Number` → 数值转换", "目标类型为 `Integer` 且值为 `Number` → 数值转换"]} />

              {/* ============== 7. 发布确认与返回回调 ============== */}
              <H2 id="sec-6">7. 发布确认与返回回调</H2>

              <H3>7.1 发布确认（Confirm Callback）</H3>
              <P>启用 <InlineCode>confirm-callback: true</InlineCode> 后，消息发送到 Exchange 后会触发确认回调：</P>
              <BulletList items={["**确认成功**：消息已到达 Exchange", "**确认失败**：消息未到达 Exchange，日志输出失败原因"]} />
              <P>&gt; 需同时配置 <InlineCode>spring.rabbitmq.publisher-confirm-type: correlated</InlineCode></P>

              <H3>7.2 返回回调（Return Callback）</H3>
              <P>启用 <InlineCode>return-callback: true</InlineCode> 后，当消息无法从 Exchange 路由到 Queue 时触发回调：</P>
              <BulletList items={["日志输出 Exchange、RoutingKey、replyCode、replyText"]} />
              <P>&gt; 需同时配置 <InlineCode>spring.rabbitmq.publisher-returns: true</InlineCode></P>

              {/* ============== 8. 自动配置机制 ============== */}
              <H2 id="sec-7">8. 自动配置机制</H2>

              
              <P>自动注册的 Bean：</P>

                            <DocTable
                headers={["`jsonMessageConverter`", "`Jackson2JsonMessageConverter`", "JSON 消息转换器"]}
                rows={[
                  ["`rabbitProducer`", "`RabbitProducer`", "消息生产者（核心 API）"],
                  ["`rabbitProducerHelper`", "`RabbitProducerHelper`", "生产者辅助类（底层 API）"],
                ]}
              />
              <P>所有 Bean 均支持 <InlineCode>@ConditionalOnMissingBean</InlineCode>，可自定义覆盖。</P>

              {/* ============== 9. 包结构 ============== */}
              <H2 id="sec-8">9. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.mq.rabbit
├── config
│   └── RabbitMqConfig.java              # 自动配置（RabbitTemplate / 消息转换器 / 确认回调）
├── producer
│   ├── RabbitProducer.java              # 消息生产者（核心 API：同步/异步 + 延迟自动路由）
│   └── RabbitProducerHelper.java        # 生产者辅助类（底层 RabbitTemplate 封装）
├── properties
│   └── RabbitMqProperties.java          # 配置属性类
└── util
    └── RabbitMessageUtil.java           # 消息工具类（Header 提取 / 类型转换）`}</CodeBlock>

              {/* ============== 10. 最佳实践 ============== */}
              <H2 id="sec-9">10. 最佳实践</H2>
              <P>1. <Strong>Exchange 与 Queue 预先声明</Strong>：本组件只负责消息发送，Exchange、Queue、Binding 的声明建议在消费端通过 <InlineCode>@RabbitListener</InlineCode> 的 <InlineCode>bindings</InlineCode> 属性或 <InlineCode>@Bean</InlineCode> 声明。</P>
              <P>2. <Strong>合理选择 Exchange 类型</Strong>：</P>
              <BulletList items={["**Direct**：精确路由，适合点对点通信", "**Topic**：模式匹配路由，适合多级分类", "**Fanout**：广播，适合通知场景", "**Headers**：基于 Header 匹配路由"]} />
              <P>3. <Strong>启用发布确认</Strong>：生产环境建议开启 <InlineCode>confirm-callback</InlineCode> 和 <InlineCode>return-callback</InlineCode>，确保消息可靠投递。</P>
              <P>4. <Strong>延迟消息注意事项</Strong>：使用延迟消息前确保 RabbitMQ 安装了 <InlineCode>rabbitmq_delayed_message_exchange</InlineCode> 插件，并正确声明延迟交换机。</P>
              <P>5. <Strong>善用 messageKey</Strong>：将 messageKey 作为 RoutingKey，实现精确的消息路由。</P>
              <P>6. <Strong>消费者手动确认</Strong>：高可靠场景建议配置 <InlineCode>acknowledge-mode: manual</InlineCode>，处理完成后手动 ACK。</P>
              <P>7. <Strong>预取限制</Strong>：设置合理的 <InlineCode>prefetch</InlineCode> 值，避免消费者被大量消息淹没。</P>
              <P>8. <Strong>统一消息模型</Strong>：使用 <InlineCode>CommonMessage</InlineCode> 发送，便于未来在 Kafka / RocketMQ 之间切换。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-mq-rabbit — 轻量级消息中间件集成方案。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/mq-rocket" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">RocketMQ</span>
                </Link>
                <Link href="/docs/reader/mq-kafka" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Kafka</span>
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
