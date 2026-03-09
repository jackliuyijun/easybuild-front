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
  { title: "Web 开发", items: [{ label: "Web 应用", href: "/docs/reader/web-prd" },{ label: "微服务 Web", href: "/docs/reader/web-micro" },{ label: "WebSocket", active: true }]},
  { title: "ORM 数据访问", items: [{ label: "Hibernate", href: "/docs/reader/orm-hibernate" },{ label: "MyBatis", href: "/docs/reader/orm-mybatis" },{ label: "MyBatis-Flex", href: "/docs/reader/orm-flex" },{ label: "ShardingSphere", href: "/docs/reader/orm-sharding" }]},
  { title: "数据库", items: [{ label: "Redis", href: "/docs/reader/db-redis" },{ label: "MongoDB", href: "/docs/reader/db-mongo" },{ label: "ClickHouse", href: "/docs/reader/db-clickhouse" }]},
  { title: "缓存与ID", items: [{ label: "Caffeine 缓存", href: "/docs/reader/cache-caffeine" },{ label: "Redis 自增ID", href: "/docs/reader/autoid-redis" }]},
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", href: "/docs/reader/mq-rabbit" },{ label: "Kafka", href: "/docs/reader/mq-kafka" }]},
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "项目概述" },
  { id: "sec-1", label: "项目结构" },
  { id: "sec-2", label: "核心组件详解" },
  { id: "sec-3", label: "配置参数" },
  { id: "sec-4", label: "扩展开发指南" },
  { id: "sec-5", label: "自动配置" },
  { id: "sec-6", label: "线程模型" },
  { id: "sec-7", label: "API 模块（websocket-api）" },
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

export default function WebSocketDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">WebSocket</span>
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
                easyfk-websocket WebSocket
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>WebSocket 通信 — 实时双向消息推送</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 项目概述 ============== */}
              <H2 id="sec-0">1. 项目概述</H2>
              <P><InlineCode>websocket-server</InlineCode> 是 EasyFK 框架中的 WebSocket 服务组件，基于 <Strong>Netty</Strong> 构建高性能 WebSocket 服务器，提供实时消息推送能力。支持多策略消息推送、频道订阅管理、JWT 认证、HMAC-SHA256 接口鉴权，以及基于 Disruptor 的高性能异步消息发送。</P>

              <H3>1.1 技术栈</H3>

                            <DocTable
                headers={["Netty", "WebSocket 服务器核心，处理连接、编解码、消息收发"]}
                rows={[
                  ["Caffeine", "高性能本地缓存，管理用户会话数据与活跃时间"],
                  ["JWT", "用户身份认证与令牌验证"],
                  ["HMAC-SHA256 / MD5", "接口签名鉴权"],
                  ["Spring Boot AutoConfiguration", "自动配置与 Bean 管理"],
                  ["Fastjson2", "JSON 序列化/反序列化"],
                ]}
              />

              <H3>1.2 模块依赖</H3>
              <CodeBlock lang="gradle">{`dependencies {
    api project(':component-cache:cache-caffeine')
    api project(':component-websocket:websocket-api')
    api('com.mcst:queue-disruptor')
    api('com.mcst:easyfk-authority')
    api('com.mcst:web-base')
    api('io.netty:netty-all')
}`}</CodeBlock>
              <P>父项目 <InlineCode>component-websocket</InlineCode> 统一依赖了 <InlineCode>com.mcst:easyfk-core</InlineCode>。</P>

              {/* ============== 2. 项目结构 ============== */}
              <H2 id="sec-1">2. 项目结构</H2>
              <CodeBlock lang="plaintext">{`websocket-server/
├── build.gradle
└── src/main/
    ├── java/com/mcst/easyfk/websocket/
    │   ├── config/
    │   │   └── ServerConfig.java              # Spring Boot 自动配置类
    │   ├── enums/
    │   │   └── EventType.java                 # 事件类型枚举
    │   ├── handler/
    │   │   ├── UserEventHandler.java          # 用户事件处理器接口（业务方实现）
    │   │   └── WebSocketHandler.java          # WebSocket 核心处理器
    │   ├── interceptor/
    │   │   ├── DefaultAuthInterceptor.java    # 默认认证拦截器
    │   │   ├── HandshakeResult.java           # 握手结果对象
    │   │   └── WebSocketInterceptor.java      # 拦截器接口
    │   ├── manager/
    │   │   ├── impl/
    │   │   │   └── SocketManagerImpl.java     # Socket 管理器实现
    │   │   ├── ISocketManager.java            # Socket 管理器接口
    │   │   ├── LocalSubManager.java           # 本地订阅管理器
    │   │   └── WsUserDataManager.java         # 用户会话数据管理器
    │   ├── properties/
    │   │   └── WebSocketProperties.java       # 配置属性类
    │   ├── sender/
    │   │   ├── SessionSendDispatcher.java     # 消息发送分发器（Disruptor 分片）
    │   │   ├── SessionSendEvent.java          # 发送事件对象
    │   │   ├── SessionSendWorker.java         # 实际发送工作器
    │   │   ├── WebSocketMessageSender.java    # 消息发送器（核心）
    │   │   └── WsSendProcessor.java           # Disruptor 消费处理器
    │   ├── server/
    │   │   ├── PushMessageServer.java         # 消息推送服务入口
    │   │   └── WebSocketServer.java           # Netty WebSocket 服务器
    │   ├── strategy/
    │   │   ├── impl/
    │   │   │   ├── ChannelCategoryPushStrategy.java  # 频道+类别推送策略
    │   │   │   ├── ChannelPushStrategy.java           # 频道推送策略
    │   │   │   ├── NotificationPushStrategy.java      # 通知推送策略
    │   │   │   └── UserPushStrategy.java              # 用户推送策略
    │   │   ├── MessagePushStrategy.java       # 推送策略接口
    │   │   └── MessagePushStrategySelector.java  # 策略选择器
    │   ├── util/
    │   │   └── SecuritySignUtil.java          # 安全签名工具类
    │   └── vo/
    │       ├── PushMessage.java               # 推送消息对象
    │       └── ResponseMessage.java           # 响应消息对象
    └── resources/META-INF/spring/
        └── org.springframework.boot.autoconfigure.AutoConfiguration.imports`}</CodeBlock>

              {/* ============== 3. 核心组件详解 ============== */}
              <H2 id="sec-2">3. 核心组件详解</H2>

              <H3>3.1 WebSocketServer — Netty 服务器</H3>
              <P><Strong>文件</Strong>: <InlineCode>server/WebSocketServer.java</InlineCode></P>
              <P>Netty WebSocket 服务器的启动与关闭管理。使用 <InlineCode>@PostConstruct</InlineCode> 在 Spring 容器启动后自动以守护线程启动 Netty 服务。</P>
              <P><Strong>Pipeline 组成</Strong>:</P>

                            <DocTable
                headers={["`IdleStateHandler`", "空闲超时检测，超时时长由 `sessionTimeoutSeconds` 配置"]}
                rows={[
                  ["`ChunkedWriteHandler`", "分块写入处理器"],
                  ["`HttpObjectAggregator`", "HTTP 消息聚合器，最大内容长度由 `maxContentLength` 配置"],
                  ["`WebSocketServerCompressionHandler`", "WebSocket 消息压缩"],
                  ["`WebSocketHandler`", "业务处理器（Sharable，全局单例）"],
                ]}
              />
              <P><Strong>关键配置项</Strong>:</P>

                            <DocTable
                headers={["`SO_BACKLOG`", "1024", "连接等待队列大小"]}
                rows={[
                  ["`SO_KEEPALIVE`", "true", "TCP 保活"],
                  ["`TCP_NODELAY`", "true", "禁用 Nagle 算法，减少延迟"],
                  ["`WRITE_BUFFER_WATER_MARK`", "8KB / 16KB", "写缓冲区水位线"],
                ]}
              />

              <H3>3.2 WebSocketHandler — 核心处理器</H3>
              <P><Strong>文件</Strong>: <InlineCode>handler/WebSocketHandler.java</InlineCode></P>
              <P><InlineCode>@ChannelHandler.Sharable</InlineCode> 标注，全局共享单例。负责处理 WebSocket 连接的完整生命周期。</P>
              <H4>3.2.1 连接建立流程</H4>
              <CodeBlock lang="plaintext">{`客户端发起 HTTP 升级请求
    ↓
handleHttpRequest()
    ↓
执行拦截器链 beforeHandshake()（按 order 排序，正序执行）
    ↓ 全部通过
从拦截器属性获取 userSessionId
    ↓
socketManager.connectUser() 建立连接
    ↓
更新会话活跃时间
    ↓
WebSocket 协议握手
    ↓
发送欢迎消息
    ↓
执行拦截器链 afterHandshake()（逆序执行）`}</CodeBlock>
              <H4>3.2.2 消息处理流程</H4>
              <P>客户端发送的 <InlineCode>TextWebSocketFrame</InlineCode> 被解析为 <InlineCode>WsUserOptParam</InlineCode>，根据 <InlineCode>eventType</InlineCode> 分类处理：</P>

                            <DocTable
                headers={["`pong`", "更新会话活跃时间（心跳响应）"]}
                rows={[
                  ["`login`", "验证 JWT Token，绑定用户信息到会话"],
                  ["其他", "如开启鉴权则验证签名，然后交给 `UserEventHandler` 处理"],
                ]}
              />
              <P>消息处理通过独立的线程池 <InlineCode>messageHandleExecutor</InlineCode> 异步执行，不阻塞 Netty 的 I/O 线程。</P>
              <H4>3.2.3 心跳机制</H4>
              <BulletList items={["**定时心跳任务**: 由 `heartbeatExecutor` 以 `heartbeatIntervalSeconds` 为间隔定期执行", "**心跳发送线程池**: `heartbeatSendExecutor` 并行发送 Ping 消息", "**超时检测**: 检查每个会话的最后活跃时间，超过 `sessionTimeoutSeconds` 则关闭连接", "**Ping 消息格式**: 使用 `PushMessage` 封装，channel 为 `heartbeat`"]} />
              <H4>3.2.4 连接关闭</H4>
              <BulletList items={["`channelInactive`: 连接关闭时清理 `socketManager`、`sessionLastActiveTime`、`WsUserDataManager`", "`userEventTriggered`: Netty `IdleStateEvent` 触发超时关闭", "`exceptionCaught`: 区分客户端主动断开与服务端异常，避免无意义的错误日志"]} />

              <H3>3.3 拦截器体系</H3>
              <H4>WebSocketInterceptor 接口</H4>
              <CodeBlock lang="java">{`public interface WebSocketInterceptor {
    HandshakeResult beforeHandshake(ChannelHandlerContext ctx, FullHttpRequest request, 
                                     Map<String, Object> attributes);
    default void afterHandshake(...) {}
    default int getOrder() { return 0; }
}`}</CodeBlock>
              <BulletList items={["`beforeHandshake`: 握手前拦截，可用于 Token 验证、IP 白名单、限流等", "`afterHandshake`: 握手后处理，可用于日志记录、事件触发", "`getOrder`: 数值越小越先执行"]} />
              <H4>DefaultAuthInterceptor — 默认认证拦截器</H4>
              <P><Strong>执行优先级</Strong>: <InlineCode>order = -100</InlineCode>（最先执行）</P>
              <P><Strong>处理流程</Strong>:</P>
              <P>1. 获取或生成 <InlineCode>clientId</InlineCode>（优先请求头 <InlineCode>Client-ID</InlineCode> &gt; 查询参数 &gt; 基于 <InlineCode>User-Agent</InlineCode> + IP 自动生成）</P>
              <P>2. 提取 <InlineCode>clientType</InlineCode>（请求头 <InlineCode>Client-Type</InlineCode>，默认 <InlineCode>APP</InlineCode>）</P>
              <P>3. 如开启接口鉴权，使用 HMAC-SHA256 验证连接签名</P>
              <P>4. 提取 JWT Token 并验证（如 <InlineCode>mustLogin=true</InlineCode> 则 Token 必填）</P>
              <P>5. 生成会话标识：<InlineCode>{'MD5(clientType + "-" + clientId)'}</InlineCode></P>
              <P>6. 将用户数据写入 <InlineCode>WsUserDataManager</InlineCode></P>
              <P><Strong>支持的请求参数提取方式</Strong>（同时支持请求头与查询参数）:</P>

                            <DocTable
                headers={["Token", "`Access-Token`", "`Access-Token`"]}
                rows={[
                  ["客户端类型", "`Client-Type`", "`Client-Type`"],
                  ["随机数", "`Request-Nonce`", "`Request-Nonce`"],
                  ["签名", "`Reset-Sign`", "`Reset-Sign`"],
                ]}
              />

              <H3>3.4 会话管理</H3>
              <H4>ISocketManager 接口 &amp; SocketManagerImpl 实现</H4>
              <P>管理在线用户的 Channel 映射关系：</P>
              <CodeBlock lang="plaintext">{`userSessionId  ←→  Channel（双向映射）`}</CodeBlock>
              <P><Strong>核心方法</Strong>:</P>
              <BulletList items={["`connectUser(channel, userSessionId)`: 建立连接，同步更新 `LocalSubManager` 的 Channel 缓存", "`disconnectUser(userSessionId)`: 断开连接，清理 Channel 缓存和订阅关系", "`getUserSession(userSessionId)`: 获取用户 Channel（自动检测 Channel 活跃状态）", "`getAllUserSessions()`: 获取所有在线 Channel", "`getUserSessionId(channel)`: 反向查找用户 ID"]} />
              <H4>WsUserDataManager — 用户数据管理</H4>
              <P>使用 <InlineCode>Caffeine</InlineCode> 缓存管理用户会话数据，支持以下两种索引：</P>

                            <DocTable
                headers={["`WS_USER_DATA_CACHE`", "userSessionId", "WsUserData", "10万", "访问后12小时"]}
                rows={[]}
              />
              <P>支持一个用户多个会话（多端登录/多标签页场景）。</P>
              <H4>LocalSubManager — 订阅管理</H4>
              <P>管理用户的频道+类别订阅关系，使用 <InlineCode>ConcurrentHashMap</InlineCode> + <InlineCode>CopyOnWriteArraySet</InlineCode> 实现线程安全：</P>

                            <DocTable
                headers={["`subscriptions`", "channel:category", "Set\&lt;userSessionId\&gt;", "正向索引"]}
                rows={[
                  ["`channelCache`", "userSessionId", "Channel", "Channel 缓存（跳过 SocketManager 二次查找）"],
                ]}
              />
              <P><Strong>支持功能</Strong>:</P>
              <BulletList items={["批量类别订阅/取消订阅（逗号分隔）", "直接获取订阅者 Channel 列表（性能优化）", "缓存命中/未命中统计", "订阅统计信息"]} />

              <H3>3.5 消息发送体系</H3>
              <H4>消息发送架构</H4>
              <CodeBlock lang="plaintext">{`PushMessageServer
    ↓ pushMessage(PushWsMessageParam)
MessagePushStrategySelector
    ↓ select() 选择策略
MessagePushStrategy（4种实现）
    ↓ push()
WebSocketMessageSender
    ├─ sendMessageToUser()       → SessionSendDispatcher → Disruptor → SessionSendWorker
    ├─ sendMessageToUserByUserId() → SessionSendDispatcher → Disruptor → SessionSendWorker
    ├─ sendToSubscribers()       → batchBroadcast()（直接批量写入，跳过 Disruptor）
    ├─ sendToChannelSubscribers() → batchBroadcast()
    └─ broadcastToAll()          → batchBroadcast()`}</CodeBlock>
              <H4>消息推送策略（策略模式）</H4>

                            <DocTable
                headers={["`NotificationPushStrategy`", "0（最高）", 'channel = "notification"', "全员广播"]}
                rows={[
                  ["`UserPushStrategy`", "2", "有 userSessionId 或 userId", "指定用户推送"],
                  ["`ChannelPushStrategy`", "4", "有 channel，无 userSessionId/userId/category", "频道全订阅者推送"],
                ]}
              />
              <H4>SessionSendDispatcher — Disruptor 分片分发</H4>
              <P>用于单用户/少量用户的消息发送，保证消息可靠性：</P>
              <BulletList items={["**分片机制**: 根据 `userSessionId` 的 hash 值选择分片，同一用户的消息进入同一分片队列", "**队列类型**: 基于 LMAX Disruptor 的 RingBuffer", "**监控统计**: 每 10 秒输出 Disruptor 入队/丢弃/发送/不可写统计"]} />
              <H4>WebSocketMessageSender — 消息发送器</H4>
              <P>三种性能优化方案：</P>
              <P>1. <Strong>零拷贝</Strong>: 使用 <InlineCode>retainedDuplicate()</InlineCode> 共享底层 ByteBuf，避免数据复制</P>
              <P>2. <Strong>Channel 直接获取</Strong>: 从 <InlineCode>LocalSubManager</InlineCode> 直接获取 Channel 列表，跳过二次查找</P>
              <P>3. <Strong>批量写入</Strong>: <InlineCode>batchBroadcast()</InlineCode> 先批量 <InlineCode>write()</InlineCode>，再统一 <InlineCode>flush()</InlineCode>，减少系统调用</P>
              <P><Strong>背压控制</Strong>: 发送前检查 <InlineCode>channel.isWritable()</InlineCode>，不可写时跳过，防止消息积压。</P>

              <H3>3.6 安全签名</H3>
              <P><Strong>文件</Strong>: <InlineCode>util/SecuritySignUtil.java</InlineCode></P>
              <P>支持两种签名方式：</P>
              <H4>MD5 签名</H4>
              <CodeBlock lang="plaintext">{`签名数据 = ClientType=xxx&ClientId=xxx&Nonce=xxx&Param=xxx&Secret=xxx
签名结果 = MD5(签名数据)`}</CodeBlock>
              <H4>HMAC-SHA256 签名（推荐，默认使用）</H4>
              <CodeBlock lang="plaintext">{`签名数据 = ClientType=xxx&ClientId=xxx&Nonce=xxx&Param=xxx
签名结果 = HMAC-SHA256(签名数据, secret)`}</CodeBlock>
              <P><Strong>Param 排序规则</Strong>: 如果 Param 是 JSON 格式，则按照 key 的 ASCII 码排序后再参与签名。</P>

              {/* ============== 4. 配置参数 ============== */}
              <H2 id="sec-3">4. 配置参数</H2>
              <P>配置前缀：<InlineCode>easyfk.config.websocket</InlineCode></P>

              <H3>4.1 基础配置</H3>

                            <DocTable
                headers={["`path`", "`/ws`", "WebSocket 访问路径"]}
                rows={[
                  ["`mustLogin`", "`false`", "是否要求登录才能连接"],
                  ["`securitySecret`", "`easyfk@ws#2026!`", "接口鉴权密钥（生产环境务必修改）"],
                  ["`enableSecurity`", "`false`", "是否开启接口鉴权"],
                  ["`allowCrossOrigin`", "`true`", "是否支持跨域"],
                  ["`allowedOrigins`", '`["*"]`', "允许的跨域来源"],
                  ["`sessionTimeoutSeconds`", "`1800`", "会话超时时间（秒，默认30分钟）"],
                  ["`heartbeatIntervalSeconds`", "`30`", "心跳检测间隔（秒）"],
                  ["`maxSubscriptionsPerUser`", "`100`", "单用户最大订阅数"],
                  ["`maxFrameSize`", "`65536`", "WebSocket 帧最大大小（字节，64KB）"],
                  ["`maxContentLength`", "`65536`", "HTTP 最大内容长度（字节，64KB）"],
                ]}
              />

              <H3>4.2 Netty 线程配置</H3>

                            <DocTable
                headers={["`bossThreads`", "`1`", "Boss 线程数（接受连接）"]}
                rows={[]}
              />

              <H3>4.3 SSL 配置</H3>

                            <DocTable
                headers={["`sslEnabled`", "`false`", "是否启用 SSL"]}
                rows={[
                  ["`sslKeyPath`", "-", "SSL 私钥路径"],
                ]}
              />

              <H3>4.4 CORS 配置 (`easyfk.config.websocket.cors`)</H3>

                            <DocTable
                headers={["`allowedMethods`", '`["GET","POST","PUT","DELETE","OPTIONS"]`', "允许的 HTTP 方法"]}
                rows={[
                  ["`exposedHeaders`", "`[]`", "暴露的响应头"],
                  ["`allowCredentials`", "`true`", "是否允许携带凭证"],
                  ["`maxAge`", "`3600`", "预检请求缓存时间（秒）"],
                ]}
              />

              <H3>4.5 性能配置 (`easyfk.config.websocket.performance`)</H3>

                            <DocTable
                headers={["`sendShardCount`", "`32`", "Disruptor 发送队列分片数"]}
                rows={[
                  ["`sendQueueBufferSize`", "`131072`", "每个分片的 RingBuffer 大小（必须是2的幂）"],
                  ["`sendQueueTryTimeoutMs`", "`50`", "入队最大等待时间（毫秒）"],
                  ["`sendQueueThreadPrefix`", "`ws-send-`", "发送线程名前缀"],
                  ["`sendQueueWaitStrategy`", "`YIELDING`", "Disruptor 等待策略（BLOCKING/YIELDING/BUSY_SPIN）"],
                  ["`broadcastParallelThreshold`", "`100`", "广播并行阈值"],
                  ["`heartbeatPoolCoreSize`", "`max(16, CPU×2)`", "心跳线程池核心线程数"],
                  ["`heartbeatPoolMaxSize`", "`max(32, CPU×4)`", "心跳线程池最大线程数"],
                  ["`heartbeatPoolQueueSize`", "`50000`", "心跳线程池队列容量"],
                  ["`messagePoolCoreSize`", "`max(32, CPU×4)`", "消息处理线程池核心线程数"],
                  ["`messagePoolMaxSize`", "`max(64, CPU×8)`", "消息处理线程池最大线程数"],
                  ["`messagePoolQueueSize`", "`20000`", "消息处理线程池队列容量"],
                ]}
              />

              <H3>4.6 配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    websocket:
      path: /ws
      port: 8081
      mustLogin: false
      enableSecurity: true
      securitySecret: "your-production-secret-key"
      sessionTimeoutSeconds: 1800
      heartbeatIntervalSeconds: 30
      performance:
        sendShardCount: 64
        sendQueueWorkersPerShard: 4
        sendQueueBufferSize: 262144
        sendQueueWaitStrategy: YIELDING`}</CodeBlock>

              {/* ============== 5. 扩展开发指南 ============== */}
              <H2 id="sec-4">5. 扩展开发指南</H2>

              <H3>5.1 实现自定义用户事件处理器</H3>
              <P>业务方通过实现 <InlineCode>UserEventHandler</InlineCode> 接口来处理客户端发送的业务事件：</P>
              <CodeBlock lang="java">{`@Component
public class MyUserEventHandler implements UserEventHandler {

    @Override
    public BaseResult<?> handleUserEvent(WsUserOptParam param) {
        String eventType = param.getEventType();
        Map<String, Object> eventData = param.getEventData();
        
        switch (eventType) {
            case "subscribe":
                // 处理订阅逻辑
                return BRBuilder.successResult();
            case "unsubscribe":
                // 处理取消订阅逻辑
                return BRBuilder.successResult();
            default:
                // 处理其他自定义事件
                return BRBuilder.successResult();
        }
    }

    @Override
    public void clearUserSubscriptions(String clientId) {
        // 用户断开连接时清理业务层订阅数据
    }
}`}</CodeBlock>

              <H3>5.2 实现自定义拦截器</H3>
              <P>业务方可以实现 <InlineCode>WebSocketInterceptor</InlineCode> 添加自定义拦截逻辑：</P>
              <CodeBlock lang="java">{`@Component
public class IpWhitelistInterceptor implements WebSocketInterceptor {

    @Override
    public HandshakeResult beforeHandshake(ChannelHandlerContext ctx, 
                                           FullHttpRequest request, 
                                           Map<String, Object> attributes) {
        String ip = getClientIp(ctx);
        if (!isAllowed(ip)) {
            return HandshakeResult.forbidden("IP_BLOCKED", "IP not in whitelist");
        }
        return HandshakeResult.success();
    }

    @Override
    public int getOrder() {
        return -200; // 在默认认证拦截器之前执行
    }
}`}</CodeBlock>

              <H3>5.3 服务端主动推送消息</H3>
              <P>通过 <InlineCode>PushMessageServer</InlineCode> 推送消息：</P>
              <CodeBlock lang="java">{`@Resource
private PushMessageServer pushMessageServer;

// 推送给指定用户
PushWsMessageParam param = new PushWsMessageParam()
    .setUserSessionId("user-session-id")
    .setChannel("order")
    .setCategory("fill")
    .setData(Map.of("orderId", "12345", "status", "filled"));
pushMessageServer.pushMessage(param);

// 推送给频道+类别订阅者
PushWsMessageParam param2 = new PushWsMessageParam()
    .setChannel("quote")
    .setCategory("BTCUSDT")
    .setData(Map.of("price", "50000.00", "volume", "123.45"));
pushMessageServer.pushMessage(param2);

// 发送系统通知
PushWsMessageParam param3 = new PushWsMessageParam()
    .setChannel("notification")
    .setData(Map.of("title", "系统维护通知", "content", "系统将于凌晨2点维护", "level", "IMPORTANT"));
pushMessageServer.pushMessage(param3);`}</CodeBlock>

              <H3>5.4 通过 API 接口远程推送</H3>
              <P><InlineCode>websocket-api</InlineCode> 模块定义了 <InlineCode>IPushWsMsgApi</InlineCode> 接口：</P>
              <CodeBlock lang="java">{`public interface IPushWsMsgApi {
    BaseResult<?> pushMessage(PushWsMessageParam param);
}`}</CodeBlock>
              <P>业务方可通过 RPC 或 HTTP 调用此接口实现跨服务推送。</P>

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-5">6. 自动配置</H2>
              <P><InlineCode>ServerConfig</InlineCode> 通过 Spring Boot <InlineCode>@AutoConfiguration</InlineCode> 自动注册以下 Bean：</P>

                            <DocTable
                headers={["`PushMessageServer`", "服务", "消息推送服务入口"]}
                rows={[
                  ["`WebSocketHandler`", "处理器", "WebSocket 核心处理器"],
                  ["`DefaultAuthInterceptor`", "拦截器", "默认认证拦截器"],
                  ["`SocketManagerImpl`", "管理器", "在线用户管理"],
                  ["`LocalSubManager`", "管理器", "订阅管理"],
                  ["`SessionSendWorker`", "发送器", "消息发送工作器"],
                  ["`SessionSendDispatcher`", "分发器", "Disruptor 分片分发器"],
                  ["`WebSocketMessageSender`", "发送器", "消息发送核心"],
                  ["`NotificationPushStrategy`", "策略", "通知推送策略"],
                  ["`UserPushStrategy`", "策略", "用户推送策略"],
                  ["`ChannelCategoryPushStrategy`", "策略", "频道+类别推送策略"],
                  ["`ChannelPushStrategy`", "策略", "频道推送策略"],
                  ["`MessagePushStrategySelector`", "选择器", "策略选择器"],
                ]}
              />
              <P>所有 Bean 均使用 <InlineCode>@ConditionalOnMissingBean</InlineCode>，业务方可通过自定义同类型 Bean 进行覆盖。</P>

              {/* ============== 7. 线程模型 ============== */}
              <H2 id="sec-6">7. 线程模型</H2>
              <CodeBlock lang="plaintext">{`┌─────────────────────────────────────────────────────────────────┐
│                    Netty Thread Model                           │
│  BossGroup (1 thread)     →  接受连接                           │
│  WorkerGroup (N threads)  →  I/O 读写、编解码                    │
├─────────────────────────────────────────────────────────────────┤
│                    业务线程池                                     │
│  messageHandleExecutor    →  消息业务处理（WebSocketHandler）     │
│  heartbeatSendExecutor    →  心跳 Ping 发送                     │
│  heartbeatExecutor        →  心跳定时检测调度（单线程）            │
├─────────────────────────────────────────────────────────────────┤
│                    Disruptor 发送队列                             │
│  shardQueues[0..N-1]      →  单用户消息异步发送                   │
│  每个分片有独立的 Worker 线程                                     │
├─────────────────────────────────────────────────────────────────┤
│                    直接广播                                       │
│  WebSocketMessageSender   →  订阅推送/全员广播（跳过 Disruptor）  │
│  批量 write + 统一 flush                                        │
├─────────────────────────────────────────────────────────────────┤
│                    监控线程                                       │
│  ws-send-monitor          →  每10秒输出发送统计                   │
└─────────────────────────────────────────────────────────────────┘`}</CodeBlock>

              {/* ============== 8. API 模块（websocket-api） ============== */}
              <H2 id="sec-7">8. API 模块（websocket-api）</H2>

              <H3>8.1 数据对象</H3>
              <H4>PushWsMessageParam — 推送消息参数</H4>

                            <DocTable
                headers={["`channel`", "String", "频道（如 kline, quote, order, notification, chat）"]}
                rows={[
                  ["`groupId`", "String", "群组ID"],
                  ["`userSessionId`", "String", "用户会话ID（多个逗号分隔）"],
                  ["`userId`", "String", "用户ID（多个逗号分隔）"],
                  ["`data`", "Map\&lt;String, Object\&gt;", "推送数据"],
                ]}
              />
              <H4>WsUserOptParam — 用户操作参数</H4>

                            <DocTable
                headers={["`eventType`", "String", "事件类型"]}
                rows={[
                  ["`token`", "String", "JWT Token"],
                  ["`nonce`", "String", "随机数（签名验证）"],
                  ["`sign`", "String", "签名（接口鉴权）"],
                ]}
              />

              <H3>8.2 枚举定义</H3>
              <H4>ChannelTypeEnum — 频道类型</H4>

                            <DocTable
                headers={["`NOTIFICATION`", "notification", "通知频道"]}
                rows={[
                  ["`HEARTBEAT`", "heartbeat", "心跳频道"],
                  ["`BIZ`", "biz", "业务频道"],
                ]}
              />
              <H4>NotificationLevel — 通知级别</H4>

                            <DocTable
                headers={["`NORMAL`", "normal", "普通通知"]}
                rows={[
                  ["`URGENT`", "urgent", "紧急通知"],
                ]}
              />
              <H4>EventType — 事件类型</H4>

                            <DocTable
                headers={["`LOGIN`", "login", "登录"]}
                rows={[
                  ["`UNSUBSCRIBE`", "unsubscribe", "取消订阅"],
                  ["`PING`", "ping", "心跳检测（服务端发送）"],
                  ["`PONG`", "pong", "心跳响应（客户端发送）"],
                  ["`ONLINE`", "online", "检查在线状态"],
                ]}
              />

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-websocket — 实时双向通信，构建高效消息推送能力。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/web-micro" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">微服务 Web</span>
                </Link>
                <Link href="/docs/reader/orm-hibernate" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Hibernate</span>
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
