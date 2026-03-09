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
  { title: "Web 开发", items: [{ label: "Web 应用", active: true },{ label: "微服务 Web", href: "/docs/reader/web-micro" },{ label: "WebSocket", href: "/docs/reader/websocket" }]},
  { title: "ORM 数据访问", items: [{ label: "Hibernate", href: "/docs/reader/orm-hibernate" },{ label: "MyBatis", href: "/docs/reader/orm-mybatis" },{ label: "MyBatis-Flex", href: "/docs/reader/orm-flex" },{ label: "ShardingSphere", href: "/docs/reader/orm-sharding" }]},
  { title: "数据库", items: [{ label: "Redis", href: "/docs/reader/db-redis" },{ label: "MongoDB", href: "/docs/reader/db-mongo" },{ label: "ClickHouse", href: "/docs/reader/db-clickhouse" }]},
  { title: "缓存与ID", items: [{ label: "Caffeine 缓存", href: "/docs/reader/cache-caffeine" },{ label: "Redis 自增ID", href: "/docs/reader/autoid-redis" }]},
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", href: "/docs/reader/mq-rabbit" },{ label: "Kafka", href: "/docs/reader/mq-kafka" }]},
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖关系" },
  { id: "sec-2", label: "包结构" },
  { id: "sec-3", label: "配置属性" },
  { id: "sec-4", label: "配置示例" },
  { id: "sec-5", label: "自动配置" },
  { id: "sec-6", label: "RequestBaseFilter（请求前置过滤器）" },
  { id: "sec-7", label: "LocalInterceptor（本地权限拦截器）" },
  { id: "sec-8", label: "ControllerAspect（Controller 切面）" },
  { id: "sec-9", label: "PrdExceptionHandler（全局异常处理）" },
  { id: "sec-10", label: "InitResourceRunner（权限资源自动初始化）" },
  { id: "sec-11", label: "时间参数转换器" },
  { id: "sec-12", label: "工具类" },
  { id: "sec-13", label: "VO 对象" },
  { id: "sec-14", label: "CORS 跨域过滤器" },
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

export default function WebPrdDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Web 应用</span>
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
                easyfk-web-prd Web 应用
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Web 应用开发 — 企业级 Web 基础设施</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>web-prd</InlineCode> 是 EasyFK 框架为<Strong>独立部署（非微服务/无网关）</Strong>的 Web 应用提供的完整 Web 基础设施模块。与 <InlineCode>web-micro</InlineCode>（网关后端微服务）不同，<InlineCode>web-prd</InlineCode> 内置了完整的安全防护链（签名验证、防重放攻击）、本地权限拦截器、Controller 层 AOP 切面、CORS 跨域过滤器、时间参数转换器、权限资源自动初始化等能力，适用于面向前端直接访问的独立应用。</P>

              {/* ============== 2. 依赖关系 ============== */}
              <H2 id="sec-1">2. 依赖关系</H2>
              <CodeBlock lang="groovy">{`dependencies {
    api project(':easyfk-web:web-simple')
    api project(':easyfk-web:web-common')
}`}</CodeBlock>
              <CodeBlock lang="plaintext">{`web-prd
├── web-simple
│   ├── spring-boot-starter-web（排除 Tomcat + Logging）
│   ├── spring-boot-starter-undertow
│   └── easyfk-core
└── web-common
    ├── web-base
    │   ├── easyfk-authority
    │   └── easyfk-core
    ├── easyfk-core
    └── spring-web`}</CodeBlock>

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-2">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`web-prd/
├── config/
│   ├── PrdWebConfig.java               # 核心自动配置
│   ├── WebInterceptorRegister.java      # 拦截器注册
│   └── ControllerAspectConfigure.java   # Controller AOP 配置
├── filter/
│   └── RequestBaseFilter.java           # 请求前置过滤器（含安全链）
├── interceptor/
│   └── LocalInterceptor.java            # 本地权限拦截器
├── exception/
│   └── PrdExceptionHandler.java         # 全局异常处理
├── aspect/
│   └── ControllerAspect.java            # Controller 方法拦截切面
├── converter/
│   ├── DateConverter.java               # String → Date
│   ├── LocalDateConverter.java          # String → LocalDate
│   ├── LocalDateTimeConverter.java      # String → LocalDateTime
│   └── LocalTimeConverter.java          # String → LocalTime
├── runner/
│   └── InitResourceRunner.java          # 权限资源自动初始化
├── properties/
│   ├── PrdWebProperties.java            # PRD Web 配置
│   ├── ResourceInitProperties.java      # 资源初始化配置
│   └── ControllerAspectProperties.java  # 切面配置
├── util/
│   ├── FailRequestUtil.java             # 失败响应工具
│   ├── RequestUtil.java                 # 请求工具（URL/Ajax/微信检测）
│   └── StaticUriUtil.java               # 静态资源判断
└── vo/
    ├── LoginRequestVO.java              # 登录请求 VO
    ├── SiteLoginSuccessVO.java          # 登录成功响应 VO
    └── RegistryRequestVO.java           # 注册请求 VO`}</CodeBlock>

              {/* ============== 4. 配置属性 ============== */}
              <H2 id="sec-3">4. 配置属性</H2>

              <H3>4.1 PrdWebProperties</H3>
              <P>配置前缀：<InlineCode>easyfk.config.web.prd</InlineCode></P>

                            <DocTable
                headers={["`open-interceptor`", "Boolean", "`true`", "是否开启本地拦截器"]}
                rows={[
                  ["`pic-code-cache-name`", "String", "`PicCodes`", "图片验证码缓存名称"],
                  ["`code-time-to-live`", "Duration", "5min", "图片验证码有效期"],
                ]}
              />

              <H3>4.2 ResourceInitProperties</H3>
              <P>配置前缀：<InlineCode>easyfk.config.resource.init</InlineCode></P>

                            <DocTable
                headers={["`open`", "Boolean", "`false`", "是否启用权限资源自动初始化"]}
                rows={[
                  ["`normal`", "Boolean", "`false`", "是否生成非权限资源（`@LoginResource` 标记的）"],
                ]}
              />

              <H3>4.3 ControllerAspectProperties</H3>
              <P>配置前缀：<InlineCode>easyfk.config.aspect.controller</InlineCode></P>

                            <DocTable
                headers={["`open`", "Boolean", "`true`", "是否开启 Controller 切面"]}
                rows={[]}
              />

              <H3>4.4 继承的配置</H3>
              <P>来自 <InlineCode>web-common</InlineCode>：</P>

                            <DocTable
                headers={["`easyfk.config.web.security.*`", "安全配置（签名、防重放）"]}
                rows={[
                  ["`easyfk.config.web.cors.*`", "跨域配置"],
                  ["`easyfk.config.web.jwt.*`", "JWT 配置"],
                ]}
              />

              {/* ============== 5. 配置示例 ============== */}
              <H2 id="sec-4">5. 配置示例</H2>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    web:
      prd:
        open-interceptor: true
        open-filter: true
        pic-code-cache-name: PicCodes
        code-time-to-live: 5m
      security:
        open: true
        sign-key: "your-sign-key"
        sign-key-dynamic: false
        timeout: 150s
        ignore-uri:
          - /api/public
          - /health
      intercept:
        exclude-paths:
          - /api/login
          - /api/register
        auth-type: 1
        refresh-user-auth: true
      cors:
        open: true
        cors-domain: "https://yourdomain.com"
      jwt:
        secret: "your-jwt-secret"
    aspect:
      controller:
        open: true
        pointcut: "execution(public * com.example..*.controller..*.*(..))"
    resource:
      init:
        open: true
        group: default
        normal: false`}</CodeBlock>

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-5">6. 自动配置</H2>

              <H3>6.1 PrdWebConfig</H3>
              <P>注册的 Bean：</P>

                            <DocTable
                headers={["`dateConverter`", "`Converter&lt;String, Date&gt;`", "无条件", "Date 参数转换"]}
                rows={[
                  ["`localDateTimeConverter`", "`Converter&lt;String, LocalDateTime&gt;`", "无条件", "LocalDateTime 参数转换"],
                  ["`localTimeConverter`", "`Converter&lt;String, LocalTime&gt;`", "无条件", "LocalTime 参数转换"],
                  ["`apiInterceptorRegister`", "`WebInterceptorRegister`", "`open-interceptor=true`（默认生效）", "拦截器注册"],
                  ["`localInterceptor`", "`LocalInterceptor`", "`open-interceptor=true`", "本地权限拦截器"],
                  ["`requestBaseFilter`", "`RequestBaseFilter`", "`open-filter=true`（默认生效）", "请求前置过滤器"],
                  ["`prdExceptionHandler`", "`PrdExceptionHandler`", "`@ConditionalOnMissingBean`", "全局异常处理"],
                  ["`serializingObjectMapper`", "`ObjectMapper`", "`@ConditionalOnMissingBean`", "Jackson 全局配置"],
                  ["`myCorsFilter`", "`CorsFilter`", "`cors.open=true`", "CORS 跨域过滤器"],
                  ["`startedCallback`", "`InitResourceRunner`", "`resource.init.open=true`", "权限资源初始化"],
                ]}
              />

              <H3>6.2 ControllerAspectConfigure</H3>

                            <DocTable
                headers={["`controllerInterceptorAdvisor`", "`AspectJExpressionPointcutAdvisor`", "`aspect.controller.open=true`（默认生效）", "Controller AOP 切面"]}
                rows={[]}
              />

              {/* ============== 7. RequestBaseFilter（请求前置过滤器） ============== */}
              <H2 id="sec-6">7. RequestBaseFilter（请求前置过滤器）</H2>
              <P><InlineCode>web-prd</InlineCode> 的核心过滤器，继承 <InlineCode>OncePerRequestFilter</InlineCode>，包含完整的安全防护链：</P>
              <CodeBlock lang="plaintext">{`HTTP 请求到达
    │
    ├─ TRACE 方法 → 返回 405（安全防护）
    │
    ├─ 静态资源（StaticUriUtil.isStaticUrl）
    │   └─ 直接 filterChain.doFilter()（跳过全部逻辑）
    │
    └─ 非静态请求
        │
        ├─ 1. createTraceId()（生成全链路追踪 ID）
        │
        ├─ 2. doLocalHeaderFilter()（提取 10 个请求头字段）
        │      ├─ accessToken（优先 URL 参数，其次 Header）
        │      ├─ language / resetSign / paramSign
        │      ├─ timestamp / requestToken / accessToken
        │      ├─ requestNonce / deviceNo / clientType
        │      └─ → RequestHeaderContext（ThreadLocal）
        │
        ├─ 3. doDataContext()（JWT 解析 + 用户数据加载）
        │
        ├─ 4. doSecurityFilterMethod()（安全签名校验）
        │      ├─ 忽略白名单 URI → 放行
        │      ├─ 检查请求头完整性（headers/nonce/sign/timestamp）
        │      ├─ 获取签名密钥（静态或动态）
        │      ├─ MD5 签名验证
        │      └─ Nonce 防重放校验（缓存检查 + 写入）
        │
        ├─ 5. filterChain.doFilter()
        │
        └─ finally: clearContext()`}</CodeBlock>

              <H3>7.1 提取的请求头字段</H3>

                            <DocTable
                headers={["`accessToken`", "`Access-Token`（或 URL 参数 `accessToken`）", "认证令牌"]}
                rows={[
                  ["`resetSign`", "`Reset-Sign`", "请求签名"],
                  ["`paramSign`", "`Param-Sign`", "参数签名"],
                  ["`timestamp`", "`Timestamp`", "时间戳"],
                  ["`requestToken`", "`Request-Token`", "请求令牌"],
                  ["`requestNonce`", "`Request-Nonce`", "防重放随机串"],
                  ["`deviceNo`", "`Device-No`", "设备编号"],
                  ["`clientType`", "`Client-Type`", "客户端类型"],
                ]}
              />

              <H3>7.2 安全签名验证</H3>
              <CodeBlock lang="plaintext">{`签名原文 = "Request-Nonce={nonce}&Timestamp={timestamp}&Key={signKey}"
签名结果 = MD5(签名原文)
验证条件 = 签名结果 == headers.getResetSign()`}</CodeBlock>

              <H3>7.3 防重放攻击</H3>
              <CodeBlock lang="plaintext">{`1. cacheService.existKey(nonce) → 已存在 → API_AGAIN 错误
2. 不存在 → cacheService.cacheObject(nonce, timeout) → 放行
3. timeout 后 nonce 自动过期`}</CodeBlock>

              {/* ============== 8. LocalInterceptor（本地权限拦截器） ============== */}
              <H2 id="sec-7">8. LocalInterceptor（本地权限拦截器）</H2>
              <P>基于 <InlineCode>HandlerInterceptor</InlineCode> 实现注解驱动的权限校验：</P>
              <CodeBlock lang="plaintext">{`请求到达 Controller 方法
    │
    ├─ URI 在排除列表中 → 放行
    │
    ├─ handler 是 HandlerMethod？
    │   │
    │   ├─ 有 @LoginResource 或 @AuthResource？
    │   │   │
    │   │   ├─ UserData 为空 → 返回 UN_LOGIN
    │   │   │
    │   │   ├─ 有 @AuthResource？
    │   │   │   │
    │   │   │   ├─ 检查 authCachedKey → UserAuth 为空 → UN_LOGIN
    │   │   │   │
    │   │   │   └─ authType != 0？
    │   │   │       ├─ checkAuth(key, url) 成功 → 放行
    │   │   │       └─ 失败 → 返回 UN_AUTH + 自定义消息
    │   │   │
    │   │   └─ 只有 @LoginResource → 有 UserData 即放行
    │   │
    │   └─ 无权限注解 → 放行
    │
    └─ 非 HandlerMethod → 放行`}</CodeBlock>

              {/* ============== 9. ControllerAspect（Controller 切面） ============== */}
              <H2 id="sec-8">9. ControllerAspect（Controller 切面）</H2>
              <P>基于 <InlineCode>MethodInterceptor</InlineCode> 实现 Controller 层方法拦截：</P>
              <P><Strong>默认切面表达式：</Strong></P>
              <CodeBlock lang="plaintext">{`execution(public * com.mcst..*.controller..*.*(..))`}</CodeBlock>
              <P>可通过 <InlineCode>pointcut</InlineCode> 配置追加自定义表达式（OR 合并）。</P>
              <P><Strong>功能：</Strong></P>
              <BulletList items={["记录方法调用开始/结束的 debug 日志", "记录当前操作人信息（UserDataContext）", "序列化并记录方法参数（过滤 HttpServletRequest/Response/MultipartRequest）", "捕获并记录异常，然后继续抛出"]} />

              {/* ============== 10. PrdExceptionHandler（全局异常处理） ============== */}
              <H2 id="sec-9">10. PrdExceptionHandler（全局异常处理）</H2>
              <P>五级异常分类处理：</P>

                            <DocTable
                headers={["`BindException` / `ValidationException`", "`RRBuilder.buildFailByException(e)` 提取校验错误"]}
                rows={[
                  ["`HttpRequestMethodNotSupportedException`", "返回方法不支持消息"],
                  ["`SocketTimeoutException`", "I18N 消息 `ServerBusyMsg`，状态码 BUSYNESS"],
                  ["`Exception`（兜底）", "I18N 消息，智能识别日期反序列化错误"],
                ]}
              />
              <P><Strong>智能日期错误识别：</Strong></P>
              <CodeBlock lang="java">{`if (errMsg.contains("Failed to deserialize java.time.LocalDate")) {
    code = "DateFormatErrorMsg";
} else if (errMsg.contains("Failed to deserialize java.time.LocalDateTime")) {
    code = "DateTimeFormatErrorMsg";
} else if (errMsg.contains("Failed to deserialize java.time.LocalTime")) {
    code = "TimeFormatErrorMsg";
}`}</CodeBlock>

              {/* ============== 11. InitResourceRunner（权限资源自动初始化） ============== */}
              <H2 id="sec-10">11. InitResourceRunner（权限资源自动初始化）</H2>
              <P>启动时自动扫描带有 <InlineCode>@ResourceController</InlineCode> 注解的 Controller，提取权限资源并批量保存：</P>
              <CodeBlock lang="plaintext">{`应用启动（CommandLineRunner，Order=0）
    │
    ├─ open=false → 跳过
    │
    ├─ 扫描 @ResourceController Bean
    │   ├─ group="default" → 全部
    │   └─ group="xxx" → 按组过滤
    │
    └─ 遍历每个 Controller
        │
        ├─ 创建菜单资源（@ResourceController 元数据）
        │
        └─ 遍历所有方法
            ├─ 解析 URL（@GetMapping/@PostMapping/@PutMapping/@DeleteMapping/@RequestMapping）
            ├─ 跳过通配路径（*、{参数}）
            │
            ├─ 有 @AuthResource → 创建权限资源
            └─ 无 @AuthResource + normal=true
                ├─ 有 @LoginResource → level=1（需登录）
                └─ 无注解 → level=0（公开）`}</CodeBlock>

              {/* ============== 12. 时间参数转换器 ============== */}
              <H2 id="sec-11">12. 时间参数转换器</H2>
              <P>四种 Spring MVC 参数转换器，处理前端字符串形式的时间参数：</P>

                            <DocTable
                headers={["`DateConverter`", "`yyyy-MM-dd HH:mm:ss` / `yyyy-MM-dd` / `HH:mm:ss`（自动识别长度）", "`Date`"]}
                rows={[
                  ["`LocalDateTimeConverter`", "`yyyy-MM-dd HH:mm:ss`", "`LocalDateTime`"],
                  ["`LocalTimeConverter`", "`HH:mm:ss`", "`LocalTime`"],
                ]}
              />

              {/* ============== 13. 工具类 ============== */}
              <H2 id="sec-12">13. 工具类</H2>

              <H3>13.1 FailRequestUtil</H3>
              <CodeBlock lang="java">{`// 构建失败响应对象
ResponseResult<?> result = FailRequestUtil.failRequestInfo(ErrorRequest.SIGN_ERROR);

// 直接写入 HTTP 响应
FailRequestUtil.failRequest(httpServletResponse, ErrorRequest.UNLOGIN);
FailRequestUtil.failRequest(httpServletResponse, responseResult);`}</CodeBlock>

              <H3>13.2 RequestUtil</H3>
              <CodeBlock lang="java">{`String url = RequestUtil.getRequestUrl(request);       // 获取去除 contextPath 后的 URI
boolean isAjax = RequestUtil.isAjax(request);           // 判断 Ajax 请求
boolean isWeChat = RequestUtil.isWeChatRequest(request); // 判断微信浏览器
boolean isQQ = RequestUtil.isQqRequest(request);         // 判断 QQ 浏览器`}</CodeBlock>

              <H3>13.3 StaticUriUtil</H3>
              <CodeBlock lang="java">{`boolean isStatic = StaticUriUtil.isStaticUrl(url);`}</CodeBlock>
              <P>匹配 <InlineCode>/static/</InlineCode> 前缀和静态文件扩展名。</P>

              {/* ============== 14. VO 对象 ============== */}
              <H2 id="sec-13">14. VO 对象</H2>

              <H3>14.1 LoginRequestVO（登录请求）</H3>

                            <DocTable
                headers={["`loginAccount`", "账号/手机号/邮箱", "`@NotBlank`"]}
                rows={[
                  ["`picToken`", "图形验证码 Token", "—"],
                  ["`picCode`", "图片验证码", "—"],
                  ["`smsCode`", "手机验证码", "—"],
                  ["`type`", "登录类型：`accountAndPic` / `account` / `mobile`", "—"],
                  ["`returnUrl`", "登录成功跳转 URL", "—"],
                ]}
              />

              <H3>14.2 SiteLoginSuccessVO（登录成功响应）</H3>

                            <DocTable
                headers={["`accessToken`", "JWT Token"]}
                rows={[
                  ["`returnUrl`", "跳转 URL"],
                  ["`status`", "状态码"],
                ]}
              />

              <H3>14.3 RegistryRequestVO（注册请求）</H3>

                            <DocTable
                headers={["`phone`", "手机号码"]}
                rows={[
                  ["`loginPwd`", "登录密码（密文）"],
                  ["`email`", "邮箱"],
                  ["`name`", "用户名"],
                  ["`referrerId`", "推荐人"],
                  ["`registryChannel`", "注册渠道"],
                ]}
              />

              {/* ============== 15. CORS 跨域过滤器 ============== */}
              <H2 id="sec-14">15. CORS 跨域过滤器</H2>
              <P>通过 <InlineCode>easyfk.config.web.cors.open=true</InlineCode> 启用：</P>
              <CodeBlock lang="java">{`CorsConfiguration corsConfiguration = new CorsConfiguration();
corsConfiguration.addAllowedOriginPattern(corsProperties.getCorsDomain());
corsConfiguration.addAllowedHeader(corsProperties.getAllowedHeader());
corsConfiguration.addAllowedMethod(corsProperties.getAllowedMethod());
corsConfiguration.setAllowCredentials(true);
corsConfiguration.setMaxAge(3600L);`}</CodeBlock>
              <P>使用 <InlineCode>addAllowedOriginPattern</InlineCode> 替代 <InlineCode>addAllowedOrigin</InlineCode>，支持通配符模式匹配。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-web-prd — 企业级 Web 应用基础设施。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/gateway" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">网关</span>
                </Link>
                <Link href="/docs/reader/web-micro" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">微服务 Web</span>
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
