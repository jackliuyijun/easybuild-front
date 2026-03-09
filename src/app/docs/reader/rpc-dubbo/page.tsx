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
  { title: "RPC 远程调用", items: [{ label: "Dubbo", active: true },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "工作原理" },
  { id: "sec-3", label: "SPI 注册机制" },
  { id: "sec-4", label: "使用指南" },
  { id: "sec-5", label: "配置说明" },
  { id: "sec-6", label: "上下文透传" },
  { id: "sec-7", label: "高级用法" },
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

export default function RpcDubboDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Dubbo</span>
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
                easyfk-rpc-dubbo Dubbo
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Dubbo RPC — 高性能远程服务调用</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>rpc-dubbo</InlineCode> 是 EasyFK 框架中基于 Apache Dubbo 的高性能 RPC 远程调用组件。该模块集成了 Dubbo Spring Boot Starter 和 Nacos 注册中心，并通过自定义 <InlineCode>DubboFilter</InlineCode> 实现了 <Strong>TraceId 链路追踪透传</Strong>和 <Strong>AccessToken 身份凭证透传</Strong>，使 Dubbo 服务间的调用具备完整的上下文传递能力，同时在服务端调用完成后自动清理线程上下文，避免资源泄漏。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>rpc-dubbo</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:rpc-dubbo'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`dubbo-spring-boot-starter` — Apache Dubbo Spring Boot 集成", "`dubbo-registry-nacos` — Dubbo Nacos 注册中心适配", "`web-base` — EasyFK Web 基础模块（包含 `ContextDataManager` 等上下文管理能力）"]} />

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-2">3. 工作原理</H2>
              <P>rpc-dubbo 通过 Dubbo SPI 扩展机制注册 <InlineCode>DubboFilter</InlineCode>，在 Consumer（消费端）和 Provider（服务端）两侧自动激活，实现上下文的双向透传：</P>
              <CodeBlock lang="plaintext">{`Consumer 端                              Provider 端
┌────────────────────┐                   ┌────────────────────┐
│  业务代码发起调用    │                   │  接收 Dubbo 请求    │
│        │           │                   │        │           │
│        ▼           │                   │        ▼           │
│  DubboFilter       │   Dubbo RPC       │  DubboFilter       │
│  (Consumer 侧)     │ ──────────────▶   │  (Provider 侧)     │
│  · 读取 TraceId    │   Attachment:     │  · 提取 TraceId    │
│  · 读取 AccessToken│   traceId         │  · 提取 AccessToken│
│  · 写入 Attachment │   accessToken     │  · 设置上下文       │
│        │           │                   │        │           │
│        ▼           │                   │        ▼           │
│  发送 RPC 请求      │                   │  执行业务逻辑       │
└────────────────────┘                   │        │           │
                                         │        ▼           │
                                         │  清理线程上下文     │
                                         └────────────────────┘`}</CodeBlock>

              <H3>核心流程</H3>
              <P>1. <Strong>Consumer 端</Strong>：从当前线程的 <InlineCode>TraceIdContext</InlineCode> 获取 TraceId，从 <InlineCode>RequestHeaderContext</InlineCode> 获取 AccessToken，通过 Dubbo 的 <InlineCode>Invocation.setAttachment()</InlineCode> 机制传递到 Provider 端</P>
              <P>2. <Strong>Provider 端</Strong>：从 <InlineCode>Invocation.getAttachment()</InlineCode> 中提取 TraceId 和 AccessToken，通过 <InlineCode>ContextDataManager</InlineCode> 初始化上下文数据（包括 TraceId 设置、请求头信息恢复等）</P>
              <P>3. <Strong>资源清理</Strong>：Provider 端业务逻辑执行完成后，在 <InlineCode>finally</InlineCode> 块中调用 <InlineCode>ContextDataManager.clearContext()</InlineCode> 清理线程上下文，避免线程池复用导致的数据污染</P>

              {/* ============== 4. SPI 注册机制 ============== */}
              <H2 id="sec-3">4. SPI 注册机制</H2>
              <P>DubboFilter 通过 Dubbo SPI 扩展机制自动注册，无需在 Spring 配置中手动声明：</P>
              <P><Strong>SPI 配置文件</Strong>：<InlineCode>META-INF/dubbo/org.apache.dubbo.rpc.Filter</InlineCode></P>
              <CodeBlock lang="plaintext">{`dubboFilter=com.mcst.easyfk.rpc.dubbo.filter.DubboFilter`}</CodeBlock>
              <P><Strong>激活条件</Strong>：</P>
              <CodeBlock lang="java">{`@Activate(group = {CommonConstants.CONSUMER, CommonConstants.PROVIDER}, order = -1000)`}</CodeBlock>

                            <DocTable
                headers={["`group`", "`CONSUMER, PROVIDER`", "消费端和服务端双向激活"]}
                rows={[]}
              />
              <P>&gt; Filter 自动激活，开发者无需在配置文件中手动添加 filter 声明。</P>

              {/* ============== 5. 使用指南 ============== */}
              <H2 id="sec-4">5. 使用指南</H2>

              <H3>5.1 服务提供者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  application:
    name: user-service
  protocol:
    name: dubbo
    port: 20880
  registry:
    address: nacos://192.168.1.100:8848
    parameters:
      namespace: dev
  scan:
    base-packages: com.example.service.impl`}</CodeBlock>

              <H3>5.2 定义 Dubbo 服务接口</H3>
              <P>在公共 API 模块中定义接口：</P>
              <CodeBlock lang="java">{`public interface UserService {

    UserDTO getUserById(Long id);

    List<UserDTO> queryUsers(UserQueryDTO query);

    void createUser(UserCreateDTO dto);

    void updateUser(Long id, UserUpdateDTO dto);

    void deleteUser(Long id);
}`}</CodeBlock>

              <H3>5.3 实现服务提供者</H3>
              <CodeBlock lang="java">{`@DubboService(version = "1.0.0")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.queryById(id);
    }

    @Override
    public List<UserDTO> queryUsers(UserQueryDTO query) {
        return userRepository.queryList(query);
    }

    @Override
    public void createUser(UserCreateDTO dto) {
        userRepository.insert(dto);
    }

    @Override
    public void updateUser(Long id, UserUpdateDTO dto) {
        dto.setId(id);
        userRepository.updateById(dto);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}`}</CodeBlock>

              <H3>5.4 服务消费者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  application:
    name: order-service
  registry:
    address: nacos://192.168.1.100:8848
    parameters:
      namespace: dev`}</CodeBlock>

              <H3>5.5 注入并调用</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @DubboReference(version = "1.0.0")
    private UserService userService;

    public OrderDTO createOrder(OrderCreateDTO dto) {
        // 像调用本地方法一样调用远程服务
        // DubboFilter 自动透传 TraceId 和 AccessToken
        UserDTO user = userService.getUserById(dto.getUserId());
        // ... 业务逻辑
    }
}`}</CodeBlock>

              {/* ============== 6. 配置说明 ============== */}
              <H2 id="sec-5">6. 配置说明</H2>

              <H3>6.1 注册中心配置（Nacos）</H3>
              <CodeBlock lang="yaml">{`dubbo:
  registry:
    address: nacos://192.168.1.100:8848
    parameters:
      namespace: dev
      group: DEFAULT_GROUP`}</CodeBlock>

              <H3>6.2 协议配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  protocol:
    name: dubbo
    port: 20880
    threads: 200            # 业务线程池大小
    payload: 8388608        # 最大请求体 8MB
    serialization: hessian2 # 序列化方式`}</CodeBlock>

              <H3>6.3 消费者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  consumer:
    timeout: 3000           # 调用超时（毫秒）
    retries: 2              # 失败重试次数
    check: false            # 启动时不检查服务是否可用
    loadbalance: random     # 负载均衡策略`}</CodeBlock>

              <H3>6.4 提供者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  provider:
    timeout: 5000           # 服务端超时（毫秒）
    threads: 200            # 业务线程数
    executes: 0             # 服务端并发执行限制，0 不限制`}</CodeBlock>

              <H3>6.5 多注册中心配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  registries:
    registry1:
      address: nacos://192.168.1.100:8848
      parameters:
        namespace: dev
    registry2:
      address: nacos://192.168.1.200:8848
      parameters:
        namespace: dev`}</CodeBlock>

              {/* ============== 7. 上下文透传 ============== */}
              <H2 id="sec-6">7. 上下文透传</H2>

              <H3>7.1 TraceId 透传</H3>
              <P><InlineCode>DubboFilter</InlineCode> 自动在消费端和服务端之间传递 TraceId：</P>
              <CodeBlock lang="plaintext">{`网关生成 TraceId: abc123
  → 服务A (Consumer) DubboFilter 写入 Attachment: traceId=abc123
    → 服务B (Provider) DubboFilter 提取 traceId=abc123，设置到 TraceIdContext
      → 服务B (Consumer) DubboFilter 写入 Attachment: traceId=abc123
        → 服务C (Provider) DubboFilter 提取 traceId=abc123`}</CodeBlock>
              <P>&gt; TraceId 在整个 Dubbo 调用链中保持一致，配合日志框架可实现全链路日志串联。</P>

              <H3>7.2 AccessToken 透传</H3>
              <P>DubboFilter 同时支持 AccessToken 的跨服务传递：</P>
              <BulletList items={["Consumer 端：从 `RequestHeaderContext` 获取 AccessToken，过滤 `undefined` 等无效值后写入 Attachment", "Provider 端：从 Attachment 提取 AccessToken，恢复到 `RequestHeaderContext`，使下游服务可获取当前用户身份信息"]} />

              <H3>7.3 上下文清理</H3>
              <P>Provider 端在业务逻辑执行完成后，自动调用 <InlineCode>ContextDataManager.clearContext()</InlineCode> 清理线程上下文：</P>
              <BulletList items={["防止 Dubbo 线程池复用时上下文数据污染", "清理操作在 `finally` 块中执行，保证异常场景也能正常清理", "清理失败仅打印 warn 日志，不影响业务流程"]} />

              {/* ============== 8. 高级用法 ============== */}
              <H2 id="sec-7">8. 高级用法</H2>

              <H3>8.1 服务版本管理</H3>
              <CodeBlock lang="java">{`// 提供者 —— 多版本并存
@DubboService(version = "1.0.0")
public class UserServiceV1Impl implements UserService { ... }

@DubboService(version = "2.0.0")
public class UserServiceV2Impl implements UserService { ... }

// 消费者 —— 指定版本
@DubboReference(version = "2.0.0")
private UserService userService;`}</CodeBlock>

              <H3>8.2 服务分组</H3>
              <CodeBlock lang="java">{`@DubboService(group = "primary")
public class PrimaryUserServiceImpl implements UserService { ... }

@DubboService(group = "secondary")
public class SecondaryUserServiceImpl implements UserService { ... }

@DubboReference(group = "primary")
private UserService userService;`}</CodeBlock>

              <H3>8.3 直连调试</H3>
              <P>开发环境可跳过注册中心直接指定服务地址：</P>
              <CodeBlock lang="java">{`@DubboReference(url = "dubbo://192.168.1.100:20880")
private UserService userService;`}</CodeBlock>

              <H3>8.4 异步调用</H3>
              <CodeBlock lang="java">{`@DubboReference(version = "1.0.0")
private UserService userService;

public CompletableFuture<UserDTO> getUserAsync(Long id) {
    // Dubbo 3 原生异步支持
    return CompletableFuture.supplyAsync(() -> userService.getUserById(id));
}`}</CodeBlock>

              <H3>8.5 负载均衡策略</H3>
              <CodeBlock lang="java">{`// 支持：random（随机）、roundrobin（轮询）、leastactive（最少活跃）、consistenthash（一致性哈希）
@DubboReference(version = "1.0.0", loadbalance = "roundrobin")
private UserService userService;`}</CodeBlock>

              <H3>8.6 服务降级</H3>
              <CodeBlock lang="java">{`@DubboReference(version = "1.0.0", mock = "com.example.mock.UserServiceMock")
private UserService userService;`}</CodeBlock>
              <CodeBlock lang="java">{`public class UserServiceMock implements UserService {

    @Override
    public UserDTO getUserById(Long id) {
        // 降级逻辑：返回默认值或缓存数据
        return new UserDTO();
    }

    // ... 其他方法的降级实现
}`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-8">9. 最佳实践</H2>
              <P>1. <Strong>接口独立模块</Strong>：将 Dubbo 服务接口定义在独立的 API 模块中，提供者和消费者共同引用，保证接口一致性。</P>
              <P>2. <Strong>版本管理</Strong>：使用 <InlineCode>version</InlineCode> 进行服务版本管理，支持灰度发布和多版本并存。</P>
              <P>3. <Strong>超时设置</Strong>：根据接口复杂度合理设置 <InlineCode>timeout</InlineCode>，避免全局统一超时导致慢接口拖垮快接口。</P>
              <P>4. <Strong>重试策略</Strong>：幂等接口可配置重试（<InlineCode>retries</InlineCode>），非幂等接口（如创建、扣款）应设为 <InlineCode>retries: 0</InlineCode>。</P>
              <P>5. <Strong>启动检查</Strong>：开发环境可设置 <InlineCode>check: false</InlineCode> 避免依赖服务未启动时无法启动，生产环境建议设为 <InlineCode>true</InlineCode>。</P>
              <P>6. <Strong>线程池配置</Strong>：根据业务特点调整 Provider 端线程池大小，IO 密集型可适当调大。</P>
              <P>7. <Strong>序列化</Strong>：默认 <InlineCode>hessian2</InlineCode> 序列化，DTO 对象需实现 <InlineCode>Serializable</InlineCode> 接口。</P>
              <P>8. <Strong>链路追踪</Strong>：确保所有微服务都引入 rpc-dubbo 组件，保证 TraceId 和 AccessToken 在整个调用链中完整传递。</P>
              <P>9. <Strong>避免大对象传输</Strong>：Dubbo 适合传输小数据量的 RPC 调用，大文件传输应使用其他方案（如 OSS）。</P>
              <P>10. <Strong>服务降级</Strong>：核心调用链路建议配置 mock 降级，避免下游服务故障导致级联失败。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-rpc-dubbo — 高性能 RPC 远程服务调用框架。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/mq-kafka" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Kafka</span>
                </Link>
                <Link href="/docs/reader/rpc-cloud" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Spring Cloud</span>
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
