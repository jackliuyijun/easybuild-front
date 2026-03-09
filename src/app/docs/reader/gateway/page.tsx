"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, Copy, Check, Lightbulb, ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Sparkles, AlertTriangle } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const tabs = ["后端", "业务", "前端", "移动端"]

const sidebarSections: { title?: string; items: { label: string; active?: boolean; href?: string }[] }[] = [
  { title: "基础模块", items: [{ label: "基础核心", href: "/docs/reader/core" },{ label: "BOM", href: "/docs/reader/bom" },{ label: "认证鉴权", href: "/docs/reader/auth" },{ label: "网关", active: true }]},
  { title: "开发工具", items: [{ label: "代码生成器", href: "/docs/reader" }]},
  { title: "Web 开发", items: [{ label: "Web 应用", href: "/docs/reader/web-prd" },{ label: "微服务 Web", href: "/docs/reader/web-micro" },{ label: "WebSocket", href: "/docs/reader/websocket" }]},
  { title: "ORM 数据访问", items: [{ label: "Hibernate", href: "/docs/reader/orm-hibernate" },{ label: "MyBatis", href: "/docs/reader/orm-mybatis" },{ label: "MyBatis-Flex", href: "/docs/reader/orm-flex" },{ label: "ShardingSphere", href: "/docs/reader/orm-sharding" }]},
  { title: "数据库", items: [{ label: "Redis", href: "/docs/reader/db-redis" },{ label: "MongoDB", href: "/docs/reader/db-mongo" },{ label: "ClickHouse", href: "/docs/reader/db-clickhouse" }]},
  { title: "缓存与ID", items: [{ label: "Caffeine 缓存", href: "/docs/reader/cache-caffeine" },{ label: "Redis 自增ID", href: "/docs/reader/autoid-redis" }]},
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", href: "/docs/reader/mq-rabbit" },{ label: "Kafka", href: "/docs/reader/mq-kafka" }]},
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-overview", label: "模块概述" },
  { id: "sec-deps", label: "模块依赖" },
  { id: "sec-packages", label: "包结构" },
  { id: "sec-components", label: "核心组件详解" },
  { id: "sec-config", label: "配置项说明" },
  { id: "sec-headers", label: "请求头常量" },
  { id: "sec-integration", label: "集成指南" },
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

function NumberList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-1.5 pl-5 text-[15px] leading-[1.8] text-[#9CA3AF]" style={{ listStyleType: "decimal" }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  )
}

export default function GatewayDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">网关</span>
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
                easyfk-gateway 网关模块
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>网关过滤层模块 — 统一流量入口与安全防护</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />

              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>easyfk-gateway</InlineCode> 是 EasyFK 框架的<Strong>网关过滤层模块</Strong>，基于 Spring Cloud Gateway 构建，提供全局请求过滤、安全签名校验、会话管理、权限拦截等核心网关能力。该模块作为所有请求的<Highlight>统一入口</Highlight>，实现了请求头解析、接口安全验证、登录态检测、权限控制等完整的网关过滤链。
              </P>
              <TipBox>
                <InlineCode>easyfk-gateway</InlineCode> 作为微服务架构的<Strong>流量入口</Strong>，所有外部请求均经由此模块进行安全校验和权限拦截后，再转发至下游服务。
              </TipBox>

              {/* ============== 2. 模块依赖 ============== */}
              <H2 id="sec-deps">2. 模块依赖</H2>
              <DocTable
                headers={["依赖模块", "依赖方式", "说明"]}
                rows={[
                  ["easyfk-core", "api", "核心模块，提供 DTO、上下文、工具类等"],
                  ["easyfk-web:web-common", "api", "Web 公共模块，提供拦截配置、安全属性、URI 工具等"],
                  ["easyfk-authority", "api", "权限模块，提供权限校验和资源安全级别判断"],
                  ["spring-cloud-starter-gateway", "api", "Spring Cloud Gateway 核心（排除 logging）"],
                ]}
              />
              <CodeBlock lang="groovy">{`dependencies {
    api project(':easyfk-core')
    api project(':easyfk-web:web-common')
    api project(':easyfk-authority')
    api('org.springframework.cloud:spring-cloud-starter-gateway') {
        exclude group: 'org.springframework.boot', module: 'spring-boot-starter-logging'
    }
}`}</CodeBlock>

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-packages">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.gateway
├── config/                   # 自动配置
│   └── GatewayFilterConfigure  - Spring Boot 自动配置类
├── filter/                   # 过滤器
│   ├── RequestGatewayFilter    - 核心全局网关过滤器
│   ├── ICustomGatewayFilter    - 自定义网关过滤器接口
│   └── IExtendGatewayFilter    - 扩展网关过滤器接口
└── util/                     # 工具类
    └── FailRequestUtil         - 失败响应工具类`}</CodeBlock>

              {/* ============== 4. 核心组件详解 ============== */}
              <H2 id="sec-components">4. 核心组件详解</H2>

              <H3>4.1 RequestGatewayFilter —— 全局网关过滤器</H3>
              <P>
                <InlineCode>RequestGatewayFilter</InlineCode> 实现了 <InlineCode>GlobalFilter</InlineCode> 和 <InlineCode>Ordered</InlineCode> 接口，是模块的核心类，处理所有经过网关的请求。
              </P>
              <P>
                <Strong>执行优先级：</Strong><InlineCode>getOrder() = 0</InlineCode>（最高优先级）
              </P>

              <H4>4.1.1 依赖注入</H4>
              <DocTable
                headers={["依赖", "类型", "注入方式", "说明"]}
                rows={[
                  ["securityProperties", "SecurityProperties", "@Resource", "安全配置属性"],
                  ["gatewayProperties", "GatewayProperties", "@Resource", "Spring Cloud Gateway 路由配置"],
                  ["properties", "InterceptProperties", "@Resource", "拦截器配置属性"],
                  ["cacheService", "ICacheService", "@Resource @Lazy", "缓存服务（延迟加载）"],
                  ["userDataManager", "UserDataManager", "@Autowired(required=false)", "用户权限管理器（可选）"],
                  ["interceptProperties", "InterceptProperties", "@Resource", "拦截器配置"],
                  ["customGatewayFilter", "ICustomGatewayFilter", "@Autowired(required=false)", "自定义过滤器（可选）"],
                  ["authResourceApi", "IAuthResourceApi", "@Resource @Lazy", "权限资源 API（延迟加载）"],
                  ["contextDataManager", "ContextDataManager", "@Resource", "上下文数据管理器"],
                ]}
              />

              <H4>4.1.2 过滤器主流程</H4>
              <CodeBlock lang="plaintext">{`请求进入 filter()
    │
    ├─ 1. OPTIONS 请求 → 直接放行
    │
    ├─ 2. 自定义过滤器开关 → 委托 ICustomGatewayFilter 处理
    │
    ├─ 3. Knife4j 文档请求（/v3/api-docs）→ 路径重写后放行
    │
    ├─ 4. 解析请求头 → 构建 RequestHeaders 对象
    │     ├─ Reset-Sign（签名）
    │     ├─ Param-Sign（参数签名）
    │     ├─ Timestamp（时间戳）
    │     ├─ Request-Token（请求令牌）
    │     ├─ Access-Token（访问令牌）
    │     ├─ Request-Nonce（请求随机数）
    │     ├─ Device-No（设备号）
    │     └─ Client-Type（客户端类型）
    │
    ├─ 5. 创建 TraceId（链路追踪）
    │
    ├─ 6. 会话过滤（sessionFilter）→ 加载用户数据上下文
    │
    ├─ 7. 安全过滤（securityFilter，可开关）
    │     └─ 失败 → 清理上下文 + 返回错误响应
    │
    ├─ 8. 网关拦截（gatewayIntercept，可开关）
    │     ├─ 排除 URI → 直接放行
    │     ├─ LOGIN 级别 → 检查登录态
    │     └─ AUTHORITY 级别 → 检查登录态 + 权限
    │
    └─ 9. 返回成功 → 将 FilterChainData 写入请求头传递给下游服务
         └─ doFinally → 清理 ThreadLocal 上下文`}</CodeBlock>
              <NumberList items={[
                "OPTIONS 预检请求直接放行，不进入后续过滤链",
                "自定义过滤器开关启用时，委托 ICustomGatewayFilter 完全接管处理",
                "Knife4j 文档路径自动重写，确保网关层 API 文档聚合正常",
                "请求头解析为 RequestHeaders 对象，统一上下文传递",
                "每个请求生成唯一 TraceId，贯穿整个链路追踪",
                "会话过滤加载用户数据到 ThreadLocal 上下文",
                "安全签名校验可通过配置开关控制",
                "网关拦截根据资源安全级别执行不同策略",
                "过滤完成后，上下文数据写入请求头传递给下游服务",
              ]} />

              <H4>4.1.3 安全签名校验流程（securityFilter）</H4>
              <P>
                当 <InlineCode>securityProperties.isOpen() == true</InlineCode> 时启用：
              </P>
              <CodeBlock lang="plaintext">{`securityFilter(exchange)
    │
    ├─ 1. 检查是否在忽略 URI 列表中 → 是则直接通过
    │
    ├─ 2. 校验请求头必填项
    │     ├─ RequestHeaders 不能为空
    │     ├─ Request-Nonce 不能为空
    │     ├─ Reset-Sign 不能为空
    │     └─ Timestamp 不能为空
    │
    ├─ 3. 获取签名密钥
    │     ├─ 静态模式 → 使用配置的 signKey
    │     └─ 动态模式 → 从缓存获取动态密钥
    │
    ├─ 4. 签名验证
    │     拼接：Request-Nonce={nonce}&Timestamp={ts}&Key={key}
    │     计算：MD5(拼接字符串)
    │     比较：计算结果 vs 请求头中的 Reset-Sign
    │
    └─ 5. 防重放攻击
          ├─ 检查 Request-Nonce 是否已存在于缓存
          │   └─ 存在 → 拒绝（接口重复调用）
          └─ 不存在 → 缓存该 Nonce（设置超时时间）`}</CodeBlock>
              <P><Strong>签名算法：</Strong></P>
              <CodeBlock lang="plaintext">{`signText = "Request-Nonce=" + nonce + "&Timestamp=" + timestamp + "&Key=" + signKey
sign = MD5(signText)`}</CodeBlock>
              <WarnBox>
                签名校验采用 MD5 算法，请确保 <InlineCode>signKey</InlineCode> 的安全性。动态模式下密钥从缓存获取，需保证缓存服务的可用性。
              </WarnBox>

              <H4>4.1.4 网关拦截流程（gatewayIntercept）</H4>
              <P>
                当 <InlineCode>properties.isOpenGatewayInterceptor() == true</InlineCode> 时启用：
              </P>
              <CodeBlock lang="plaintext">{`gatewayIntercept(exchange, chain, gatewayData)
    │
    ├─ 1. 排除 URI 检查 → 匹配则直接放行
    │
    ├─ 2. 解析服务名
    │     └─ 从 Gateway 路由配置中匹配请求 URI 对应的服务
    │
    ├─ 3. 获取资源安全级别
    │     └─ authResourceApi.checkUriSecurityLevel(requestUri)
    │
    ├─ 4. 根据安全级别判断
    │     ├─ UNIMPEDED → 直接通过
    │     ├─ LOGIN → 检查 UserData 是否存在
    │     │   └─ 不存在 → 返回未登录错误
    │     └─ AUTHORITY → 检查 UserData + 权限
    │         ├─ 未登录 → 返回未登录错误
    │         └─ 无权限 → 返回未授权错误
    │
    └─ 5. 通过 → 写入 FilterChainData 到下游请求头`}</CodeBlock>
              <TipBox>
                资源安全级别分为三档：<Highlight>UNIMPEDED</Highlight>（完全放行）、<Highlight>LOGIN</Highlight>（需要登录）、<Highlight>AUTHORITY</Highlight>（需要登录 + 权限），由 <InlineCode>IAuthResourceApi</InlineCode> 动态判定。
              </TipBox>

              <H4>4.1.5 请求头传递机制</H4>
              <P>
                过滤器通过后，<InlineCode>FilterChainData</InlineCode>（包含解析后的请求头信息）被序列化为 JSON，写入下游请求的 <InlineCode>CHAIN_NAME</InlineCode> Header 中：
              </P>
              <CodeBlock lang="java">{`ServerHttpRequest request = exchange.getRequest().mutate()
    .header(RequestHeaderConstant.CHAIN_NAME, JSON.toJSONString(gatewayData))
    .build();`}</CodeBlock>
              <P>
                下游微服务可通过该 Header 获取网关层解析后的<Highlight>统一上下文数据</Highlight>。
              </P>

              <H3>4.2 ICustomGatewayFilter —— 自定义网关过滤器接口</H3>
              <P>
                当业务需要<Strong>完全替换</Strong>默认过滤逻辑时使用。
              </P>
              <CodeBlock lang="java">{`public interface ICustomGatewayFilter {
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}`}</CodeBlock>
              <P>
                <Strong>启用条件：</Strong>配置 <InlineCode>properties.isCustomGatewayFilter() == true</InlineCode>，并注册 <InlineCode>ICustomGatewayFilter</InlineCode> 实现 Bean。
              </P>
              <CodeBlock lang="java">{`@Component
public class MyCustomGatewayFilter implements ICustomGatewayFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 完全自定义的过滤逻辑
        return chain.filter(exchange);
    }
}`}</CodeBlock>

              <H3>4.3 IExtendGatewayFilter —— 扩展网关过滤器接口</H3>
              <P>
                当业务需要在默认过滤流程基础上<Strong>追加扩展逻辑</Strong>时使用。
              </P>
              <CodeBlock lang="java">{`public interface IExtendGatewayFilter {
    void doExtendIntercept(ServerWebExchange exchange);
}`}</CodeBlock>
              <CodeBlock lang="java">{`@Component
public class MyExtendFilter implements IExtendGatewayFilter {

    @Override
    public void doExtendIntercept(ServerWebExchange exchange) {
        // 附加的拦截逻辑，如日志记录、限流等
    }
}`}</CodeBlock>

              <H3>4.4 FailRequestUtil —— 失败响应工具类</H3>
              <P>
                提供统一的网关层错误响应构建能力：
              </P>
              <CodeBlock lang="java">{`public static Mono<Void> failRequest(ServerWebExchange exchange, ErrorRequest errorRequest)`}</CodeBlock>
              <P>
                <Strong>响应格式：</Strong>HTTP 状态码 <InlineCode>400 Bad Request</InlineCode>，Content-Type 为 <InlineCode>application/json; charset=utf-8</InlineCode>，响应体为 <InlineCode>ResponseResult</InlineCode> JSON 格式。
              </P>
              <DocTable
                headers={["错误", "说明"]}
                rows={[
                  ["HEARD_EMPTY", "请求头为空"],
                  ["NONCE_EMPTY", "随机数为空"],
                  ["RESET_SIGN_EMPTY", "签名为空"],
                  ["TIMESTAMP_EMPTY", "时间戳为空"],
                  ["DYNAMIC_SIGN_KEY_TIMEOUT", "动态签名密钥超时"],
                  ["SIGN_ERROR", "签名验证失败"],
                  ["API_AGAIN", "接口重复调用"],
                  ["UNLOGIN", "未登录"],
                  ["UNAUTH", "未授权"],
                ]}
              />

              <H3>4.5 GatewayFilterConfigure —— 自动配置</H3>
              <CodeBlock lang="java">{`@AutoConfiguration
public class GatewayFilterConfigure {

    @Bean
    @ConditionalOnMissingBean
    public RequestGatewayFilter requestHeaderGatewayFilter() {
        return new RequestGatewayFilter();
    }
}`}</CodeBlock>
              <P>
                通过 Spring Boot 自动配置注册 <InlineCode>RequestGatewayFilter</InlineCode> Bean。使用 <InlineCode>@ConditionalOnMissingBean</InlineCode>，支持业务覆盖默认实现。
              </P>

              {/* ============== 5. 配置项说明 ============== */}
              <H2 id="sec-config">5. 配置项说明</H2>
              <DocTable
                headers={["配置来源", "关键属性", "说明"]}
                rows={[
                  ["SecurityProperties", "open", "是否开启安全签名校验"],
                  ["", "signKey", "签名密钥"],
                  ["", "signKeyDynamic", "是否使用动态签名密钥"],
                  ["", "ignoreUri", "忽略安全校验的 URI 列表"],
                  ["", "timeout", "Nonce 缓存超时时间（防重放）"],
                  ["InterceptProperties", "openGatewayInterceptor", "是否开启网关权限拦截"],
                  ["", "customGatewayFilter", "是否启用自定义过滤器"],
                  ["", "refreshUserAuth", "是否刷新用户权限缓存"],
                  ["", "排除 URI 配置", "不拦截的 URI 列表"],
                ]}
              />

              {/* ============== 6. 请求头常量 ============== */}
              <H2 id="sec-headers">6. 请求头常量</H2>
              <P>
                以下请求头将被网关解析并封装到 <InlineCode>RequestHeaders</InlineCode> 对象中：
              </P>
              <DocTable
                headers={["Header 名称", "对应字段", "说明"]}
                rows={[
                  ["Reset-Sign", "resetSign", "请求签名"],
                  ["Param-Sign", "paramSign", "参数签名"],
                  ["Timestamp", "timestamp", "请求时间戳"],
                  ["Request-Token", "requestToken", "请求令牌"],
                  ["Access-Token", "accessToken", "访问令牌"],
                  ["Request-Nonce", "requestNonce", "请求随机数（防重放）"],
                  ["Device-No", "deviceNo", "设备编号"],
                  ["Client-Type", "clientType", "客户端类型"],
                ]}
              />

              {/* ============== 7. 集成指南 ============== */}
              <H2 id="sec-integration">7. 集成指南</H2>

              <H3>7.1 引入依赖</H3>
              <CodeBlock lang="groovy">{`dependencies {
    implementation project(':easyfk-gateway')
}`}</CodeBlock>

              <H3>7.2 基本配置</H3>
              <CodeBlock lang="yaml">{`# 开启安全签名校验
security:
  open: true
  sign-key: "your-sign-key"
  sign-key-dynamic: false
  timeout: 300

# 开启网关权限拦截
intercept:
  open-gateway-interceptor: true
  custom-gateway-filter: false
  refresh-user-auth: true`}</CodeBlock>

              <H3>7.3 自定义过滤器</H3>
              <P>
                <Strong>方式一：完全替换</Strong> —— 实现 <InlineCode>ICustomGatewayFilter</InlineCode>，开启 <InlineCode>customGatewayFilter</InlineCode> 配置。
              </P>
              <P>
                <Strong>方式二：扩展追加</Strong> —— 实现 <InlineCode>IExtendGatewayFilter</InlineCode>，在默认流程基础上追加逻辑。
              </P>
              <P>
                <Strong>方式三：替换核心过滤器</Strong> —— 注册自定义 <InlineCode>RequestGatewayFilter</InlineCode> Bean 覆盖默认实现。
              </P>
              <TipBox>
                三种自定义方式的优先级依次递增：扩展追加 &lt; 完全替换 &lt; 替换核心过滤器。推荐优先使用<Highlight>扩展追加</Highlight>方式，保留默认安全过滤链。
              </TipBox>

              <H3>7.4 Knife4j 文档集成</H3>
              <P>
                模块内置了对 Knife4j API 文档的支持。当请求 URI 包含 <InlineCode>/v3/api-docs</InlineCode> 时，自动将路径重写为 <InlineCode>/v3/api-docs</InlineCode>，确保网关层的文档聚合正常工作。
              </P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-gateway — API 网关，为微服务提供统一的流量入口与安全防护。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/auth" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">认证鉴权</span>
                </Link>
                <Link href="/docs/reader/web-prd" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Web 应用</span>
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
