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
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", active: true }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "工作原理" },
  { id: "sec-3", label: "自动配置" },
  { id: "sec-4", label: "使用指南" },
  { id: "sec-5", label: "配置说明" },
  { id: "sec-6", label: "链路追踪" },
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

export default function RpcCloudDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Spring Cloud</span>
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
                easyfk-rpc-cloud Spring Cloud
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Spring Cloud 微服务 — 云原生服务治理</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>rpc-cloud</InlineCode> 是 EasyFK 框架中基于 Spring Cloud OpenFeign 的远程服务调用组件。该模块封装了 Feign 客户端的自动配置，提供<Strong>统一的错误解码</Strong>和<Strong>链路追踪 TraceId 透传</Strong>能力，使微服务间的 HTTP 调用像本地方法一样简单，同时保障异常信息准确传递和分布式链路的完整性。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>rpc-cloud</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:rpc-cloud'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`spring-cloud-starter-openfeign` — Spring Cloud OpenFeign 声明式 HTTP 客户端", "`spring-cloud-loadbalancer` — Spring Cloud 客户端负载均衡", "`web-common` — EasyFK Web 公共模块"]} />
              <P>&gt; <Strong>注意</Strong>：模块已排除 <InlineCode>jackson</InlineCode>、<InlineCode>spring-boot-starter-logging</InlineCode>、<InlineCode>spring-cloud-starter-netflix-ribbon</InlineCode> 等冲突依赖，避免与框架其他组件产生版本冲突。</P>

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-2">3. 工作原理</H2>
              <P>rpc-cloud 基于 Spring Cloud OpenFeign 的声明式调用模型，并在此基础上增强了两项能力：</P>
              <CodeBlock lang="plaintext">{`Feign 客户端接口调用
        │
        ▼
FeignClientInterceptor（请求拦截器）
  → 自动注入 TraceId 到请求头
        │
        ▼
Spring Cloud LoadBalancer（负载均衡）
  → 从注册中心选择服务实例
        │
        ▼
HTTP 请求发送到目标服务
        │
        ▼
FeignErrorDecoder（错误解码器）
  → 非 200 响应时解析业务异常
  → 业务异常透传，系统异常国际化`}</CodeBlock>
              <BulletList items={["**FeignClientInterceptor**：在每次 Feign 请求发出前，自动从 `TraceIdContext` 获取当前链路 TraceId，注入到请求头 `traceId` 中，实现跨服务链路追踪", "**FeignErrorDecoder**：当远程服务返回非 200 响应时，解析响应体中的 `code` 和 `msg` 字段，将业务异常（`BusinessException`）准确透传给调用方，系统级错误则返回国际化错误信息"]} />

              {/* ============== 4. 自动配置 ============== */}
              <H2 id="sec-3">4. 自动配置</H2>
              <P>模块通过 Spring Boot 自动配置机制（<InlineCode>AutoConfiguration.imports</InlineCode>）自动注册以下 Bean：</P>

                            <DocTable
                headers={["`FeignErrorDecoder`", "`ErrorDecoder`", "`@ConditionalOnMissingBean`", "可被业务自定义实现覆盖"]}
                rows={[]}
              />
              <P>&gt; <Strong>自定义 ErrorDecoder</Strong>：如需自定义错误解码逻辑，只需在业务项目中声明一个 <InlineCode>FeignErrorDecoder</InlineCode> 类型的 Bean，框架默认实现将自动失效。</P>

              {/* ============== 5. 使用指南 ============== */}
              <H2 id="sec-4">5. 使用指南</H2>

              <H3>5.1 启用 Feign 客户端</H3>
              <P>在 Spring Boot 启动类或配置类上添加 <InlineCode>@EnableFeignClients</InlineCode> 注解：</P>
              <CodeBlock lang="java">{`@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.client")
public class OrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}`}</CodeBlock>

              <H3>5.2 定义 Feign 客户端接口</H3>
              <CodeBlock lang="java">{`@FeignClient(name = "user-service", path = "/api/user")
public interface UserServiceClient {

    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

    @PostMapping("/list")
    List<UserDTO> queryUsers(@RequestBody UserQueryDTO query);

    @PutMapping("/{id}")
    UserDTO updateUser(@PathVariable("id") Long id, @RequestBody UserUpdateDTO dto);

    @DeleteMapping("/{id}")
    void deleteUser(@PathVariable("id") Long id);
}`}</CodeBlock>

              <H3>5.3 注入并调用</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Autowired
    private UserServiceClient userServiceClient;

    public OrderDTO createOrder(OrderCreateDTO dto) {
        // 像调用本地方法一样调用远程服务
        UserDTO user = userServiceClient.getUserById(dto.getUserId());
        // ... 业务逻辑
    }
}`}</CodeBlock>

              <H3>5.4 异常处理</H3>
              <P>当远程服务返回异常时，<InlineCode>FeignErrorDecoder</InlineCode> 会自动解析：</P>
              <BulletList items={["**业务异常**：远程服务抛出的 `BusinessException`（code 不为 `SystemError`），将原样透传给调用方", "**系统异常**：code 为 `SystemError` 或解析失败时，返回国际化的系统错误信息"]} />
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Autowired
    private UserServiceClient userServiceClient;

    public UserDTO getUser(Long userId) {
        try {
            return userServiceClient.getUserById(userId);
        } catch (BusinessException e) {
            // 捕获远程服务的业务异常，code 和 msg 原样保留
            log.warn("远程调用业务异常: code={}, msg={}", e.getCode(), e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            // 系统级异常
            log.error("远程调用系统异常", e);
            throw e;
        }
    }
}`}</CodeBlock>

              {/* ============== 6. 配置说明 ============== */}
              <H2 id="sec-5">6. 配置说明</H2>

              <H3>6.1 注册中心配置（Nacos 示例）</H3>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.1.100:8848
        namespace: dev`}</CodeBlock>

              <H3>6.2 Feign 超时配置</H3>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    openfeign:
      client:
        config:
          default:
            connect-timeout: 5000
            read-timeout: 10000
          user-service:           # 针对特定服务的配置
            connect-timeout: 3000
            read-timeout: 5000`}</CodeBlock>

              <H3>6.3 Feign 日志配置</H3>
              <CodeBlock lang="yaml">{`logging:
  level:
    com.example.client: DEBUG     # Feign 客户端接口所在包

spring:
  cloud:
    openfeign:
      client:
        config:
          default:
            logger-level: FULL    # NONE / BASIC / HEADERS / FULL`}</CodeBlock>

              <H3>6.4 负载均衡配置</H3>
              <P>模块默认使用 Spring Cloud LoadBalancer 进行客户端负载均衡：</P>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    loadbalancer:
      retry:
        enabled: true
      cache:
        enabled: true
        ttl: 30s`}</CodeBlock>

              <H3>6.5 请求压缩配置</H3>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    openfeign:
      compression:
        request:
          enabled: true
          mime-types: text/xml,application/xml,application/json
          min-request-size: 2048
        response:
          enabled: true`}</CodeBlock>

              {/* ============== 7. 链路追踪 ============== */}
              <H2 id="sec-6">7. 链路追踪</H2>
              <P>rpc-cloud 通过 <InlineCode>FeignClientInterceptor</InlineCode> 自动实现 TraceId 的跨服务透传：</P>
              <P>1. 上游服务处理请求时，<InlineCode>TraceIdContext</InlineCode> 中会存储当前请求的 TraceId</P>
              <P>2. 通过 Feign 调用下游服务时，拦截器自动将 TraceId 注入到 HTTP 请求头</P>
              <P>3. 下游服务通过请求头获取 TraceId，实现完整的调用链追踪</P>
              <CodeBlock lang="plaintext">{`服务A (TraceId: abc123)
  → FeignClientInterceptor 注入 Header: traceId=abc123
    → 服务B 接收到 traceId=abc123
      → FeignClientInterceptor 注入 Header: traceId=abc123
        → 服务C 接收到 traceId=abc123`}</CodeBlock>
              <P>&gt; TraceId 在整个调用链中保持一致，便于日志排查和链路分析。</P>

              {/* ============== 8. 高级用法 ============== */}
              <H2 id="sec-7">8. 高级用法</H2>

              <H3>8.1 Feign 降级处理</H3>
              <CodeBlock lang="java">{`@FeignClient(name = "user-service", path = "/api/user", fallback = UserServiceFallback.class)
public interface UserServiceClient {

    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
}

@Component
public class UserServiceFallback implements UserServiceClient {

    @Override
    public UserDTO getUserById(Long id) {
        // 降级逻辑：返回默认值或缓存数据
        return new UserDTO();
    }
}`}</CodeBlock>

              <H3>8.2 自定义请求拦截器</H3>
              <P>如需在请求头中传递更多信息（如用户 Token），可添加自定义拦截器：</P>
              <CodeBlock lang="java">{`@Component
public class AuthFeignInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate requestTemplate) {
        ServletRequestAttributes attributes =
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            requestTemplate.header("Authorization", request.getHeader("Authorization"));
        }
    }
}`}</CodeBlock>

              <H3>8.3 自定义错误解码器</H3>
              <P>覆盖默认的 <InlineCode>FeignErrorDecoder</InlineCode>：</P>
              <CodeBlock lang="java">{`@Component
public class CustomFeignErrorDecoder extends FeignErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        // 自定义错误处理逻辑
        if (response.status() == 404) {
            return new ResourceNotFoundException("资源不存在");
        }
        return super.decode(methodKey, response);
    }
}`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-8">9. 最佳实践</H2>
              <P>1. <Strong>接口独立模块</Strong>：将 Feign 客户端接口定义在独立的 API 模块中，服务提供者和消费者共同引用，保证接口一致性。</P>
              <P>2. <Strong>合理设置超时</Strong>：根据接口的实际响应时间设置 <InlineCode>connect-timeout</InlineCode> 和 <InlineCode>read-timeout</InlineCode>，避免使用过长的全局超时。</P>
              <P>3. <Strong>降级容错</Strong>：核心调用链路建议配置 fallback 降级，避免下游服务故障导致级联失败。</P>
              <P>4. <Strong>日志级别</Strong>：生产环境使用 <InlineCode>BASIC</InlineCode> 或 <InlineCode>NONE</InlineCode> 级别，开发/测试环境可使用 <InlineCode>FULL</InlineCode> 级别排查问题。</P>
              <P>5. <Strong>请求压缩</Strong>：大报文场景开启 Gzip 压缩，减少网络传输开销。</P>
              <P>6. <Strong>链路追踪</Strong>：确保所有微服务都引入 rpc-cloud 组件，保证 TraceId 在整个调用链中完整传递。</P>
              <P>7. <Strong>异常透传</Strong>：利用 <InlineCode>FeignErrorDecoder</InlineCode> 的业务异常透传能力，避免在调用方重复定义相同的错误码。</P>
              <P>8. <Strong>负载均衡</Strong>：默认使用 Spring Cloud LoadBalancer 轮询策略，如需自定义可实现 <InlineCode>ReactorServiceInstanceLoadBalancer</InlineCode> 接口。</P>
              <P>9. <Strong>避免循环依赖</Strong>：微服务间避免双向 Feign 调用，如有需要可通过消息队列解耦。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-rpc-cloud — Spring Cloud 微服务治理框架集成。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/rpc-dubbo" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Dubbo</span>
                </Link>
                <Link href="/docs/reader/lock-redisson" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Redisson 分布式锁</span>
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
