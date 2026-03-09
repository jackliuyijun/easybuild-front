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
  { title: "缓存与ID", items: [{ label: "Caffeine 缓存", active: true },{ label: "Redis 自增ID", href: "/docs/reader/autoid-redis" }]},
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
  { id: "sec-autoconfig", label: "自动配置" },
  { id: "sec-expiry", label: "过期策略" },
  { id: "sec-api", label: "API 参考" },
  { id: "sec-practices", label: "最佳实践" },
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

function NumberList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-2 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-[1.8] text-[#9CA3AF]">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1F2937] font-mono text-[11px] font-bold text-[#00FF88]">{i + 1}</span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ol>
  )
}

export default function CacheCaffeineDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Caffeine 缓存</span>
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
                easyfk-cache-caffeine 本地缓存
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Caffeine 本地缓存 — 高性能进程内缓存方案</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~12 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />

              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>cache-caffeine</InlineCode> 是 EasyFK 框架中基于 <InlineCode>Caffeine</InlineCode> 的<Strong>高性能本地缓存组件</Strong>。该模块封装了 Caffeine 缓存库，提供统一的缓存管理能力，并与 Spring Boot 自动配置机制深度集成，支持<Highlight>编程式缓存操作</Highlight>和 <Highlight>Spring Cache 注解</Highlight>两种使用方式。
              </P>
              <TipBox>
                引入依赖后 <InlineCode>LocalCacheManager</InlineCode> 会自动注册为 Spring Bean，<Strong>无需任何配置</Strong>即可使用编程式缓存。
              </TipBox>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-deps">2. 依赖引入</H2>
              <P>在项目的 <InlineCode>build.gradle</InlineCode> 中添加依赖：</P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:cache-caffeine'
}`}</CodeBlock>
              <P>该模块会自动传递引入以下依赖：</P>
              <DocTable
                headers={["依赖", "说明"]}
                rows={[
                  ["com.github.ben-manes.caffeine:caffeine", "Caffeine 缓存核心库"],
                  ["com.mcst:easyfk-core", "EasyFK 核心模块"],
                  ["spring-boot-starter-cache", "Spring Boot 缓存 Starter"],
                ]}
              />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-config">3. 配置说明</H2>

              <H3>3.1 配置属性</H3>
              <P>所有配置项统一在 <InlineCode>easyfk.config.cache.caffeine</InlineCode> 前缀下，可在 <InlineCode>application.yml</InlineCode> 或 <InlineCode>application.properties</InlineCode> 中配置。</P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["create-spring-cache-manager", "Boolean", "false", "是否创建 Spring CacheManager，设为 true 后可使用 @Cacheable 等注解"],
                  ["default-cache-name", "String", '"default"', "默认缓存名称"],
                  ["time-to-live", "Duration", "0（不过期）", "默认缓存过期时间"],
                  ["maximum-size", "Long", "10000", "默认最大缓存条目数"],
                  ["caches", "List", "—", "自定义缓存配置列表"],
                ]}
              />

              <H3>3.2 自定义缓存配置（caches 列表项）</H3>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["cache-name", "String", "—", "缓存名称（必填）"],
                  ["time-to-live", "Duration", "30m", "缓存过期时间"],
                  ["maximum-size", "Long", "10000", "最大缓存条目数"],
                ]}
              />

              <H3>3.3 配置示例</H3>

              <H4>仅使用编程式缓存（默认模式）</H4>
              <P>无需任何配置，引入依赖后 <InlineCode>LocalCacheManager</InlineCode> 会自动注册为 Spring Bean。</P>

              <H4>启用 Spring Cache 注解支持</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    cache:
      caffeine:
        create-spring-cache-manager: true
        default-cache-name: default
        time-to-live: 10m
        maximum-size: 5000
        caches:
          - cache-name: userCache
            time-to-live: 30m
            maximum-size: 2000
          - cache-name: configCache
            time-to-live: 1h
            maximum-size: 500`}</CodeBlock>

              {/* ============== 4. 使用方式 ============== */}
              <H2 id="sec-usage">4. 使用方式</H2>

              <H3>4.1 编程式缓存 — LocalCacheManager</H3>
              <P><InlineCode>LocalCacheManager</InlineCode> 是核心缓存管理器，引入依赖后自动注入即可使用。它统一管理四种 Caffeine 缓存类型的创建和访问。</P>

              <H4>注入 LocalCacheManager</H4>
              <CodeBlock lang="java">{`@Service
public class MyService {

    @Resource
    private LocalCacheManager localCacheManager;
}`}</CodeBlock>

              <H4>基础缓存（Cache）</H4>
              <P><Strong>创建缓存：</Strong></P>
              <CodeBlock lang="java">{`// 创建一个写后10分钟过期、最多缓存1000条的缓存
Cache<String, User> userCache = localCacheManager.getOrCreateCache("userCache", Duration.ofMinutes(10), 1000);

// 仅指定最大数量（不过期）
Cache<String, Config> configCache = localCacheManager.getOrCreateCache("configCache", 5000);

// 指定过期类型：0=写后过期，1=读后过期
Cache<String, Token> tokenCache = localCacheManager.getOrCreateCache("tokenCache", Duration.ofHours(1), 1, 2000);`}</CodeBlock>

              <P><Strong>CRUD 操作：</Strong></P>
              <CodeBlock lang="java">{`// 写入
localCacheManager.put("userCache", "user:1001", userObj);

// 读取
User user = localCacheManager.get("userCache", "user:1001");

// 读取（缓存未命中时自动加载）
User user = localCacheManager.get("userCache", "user:1001", key -> userService.findById(key));

// 删除
localCacheManager.evict("userCache", "user:1001");

// 清空整个缓存
localCacheManager.clear("userCache");`}</CodeBlock>

              <P><Strong>批量操作：</Strong></P>
              <CodeBlock lang="java">{`// 批量读取
Set<String> keys = Set.of("user:1001", "user:1002", "user:1003");
Map<String, User> users = localCacheManager.getAll("userCache", keys);

// 批量写入
Map<String, Object> entries = Map.of("user:1001", user1, "user:1002", user2);
localCacheManager.putAll("userCache", entries);

// 批量删除
localCacheManager.evictAll("userCache", keys);`}</CodeBlock>

              <P><Strong>缓存信息与维护：</Strong></P>
              <CodeBlock lang="java">{`// 获取缓存预估大小
long size = localCacheManager.estimatedSize("userCache");

// 手动触发缓存清理（触发过期条目回收）
localCacheManager.cleanUp("userCache");

// 删除已管理的缓存实例
localCacheManager.removeCache("userCache");`}</CodeBlock>

              <H4>自动加载缓存（LoadingCache）</H4>
              <P>适用于缓存未命中时需要自动从数据源加载的场景。</P>
              <CodeBlock lang="java">{`// 创建自动加载缓存
LoadingCache<String, User> cache = localCacheManager.getOrCreateLoadingCache(
    "userCache",
    Duration.ofMinutes(10),
    1000,
    key -> userService.findById(key)  // CacheLoader
);

// 获取值（缓存未命中时自动调用 loader）
User user = localCacheManager.getFromLoadingCache("userCache", "user:1001");

// 批量获取（自动加载缺失的键）
Map<String, User> users = localCacheManager.getAllFromLoadingCache("userCache", Set.of("user:1001", "user:1002"));

// 手动刷新某个键
localCacheManager.refreshLoadingCache("userCache", "user:1001");`}</CodeBlock>

              <P><Strong>支持写后自动刷新：</Strong></P>
              <CodeBlock lang="java">{`// 写后10分钟过期，写后5分钟触发异步刷新
LoadingCache<String, Config> cache = localCacheManager.getOrCreateLoadingCache(
    "configCache",
    Duration.ofMinutes(10),    // 过期时间
    Duration.ofMinutes(5),     // 刷新时间
    5000,
    key -> configService.load(key)
);`}</CodeBlock>

              <P><Strong>带统计功能的 LoadingCache：</Strong></P>
              <CodeBlock lang="java">{`LoadingCache<String, User> cache = localCacheManager.getOrCreateLoadingCacheWithStats(
    "userCache",
    Duration.ofMinutes(10),
    1000,
    key -> userService.findById(key)
);

// 获取统计信息
CacheStats stats = cache.stats();
// stats.hitRate(), stats.missRate(), stats.loadCount() 等`}</CodeBlock>

              <H4>异步缓存（AsyncCache）</H4>
              <P>适用于需要非阻塞式缓存操作的场景。</P>
              <CodeBlock lang="java">{`// 创建异步缓存
AsyncCache<String, User> asyncCache = localCacheManager.getOrCreateAsyncCache(
    "asyncUserCache",
    Duration.ofMinutes(10),
    1000
);

// 异步获取（未命中时通过函数加载）
CompletableFuture<User> future = localCacheManager.getFromAsyncCache(
    "asyncUserCache",
    "user:1001",
    key -> userService.findById(key)
);

// 异步放入
localCacheManager.putToAsyncCache(
    "asyncUserCache",
    "user:1001",
    CompletableFuture.supplyAsync(() -> userService.findById("user:1001"))
);`}</CodeBlock>

              <H4>异步自动加载缓存（AsyncLoadingCache）</H4>
              <P>结合自动加载与异步处理的缓存类型。</P>
              <CodeBlock lang="java">{`// 使用同步 loader（Caffeine 自动包装为异步执行）
AsyncLoadingCache<String, User> cache = localCacheManager.getOrCreateAsyncLoadingCache(
    "asyncUserCache",
    Duration.ofMinutes(10),
    1000,
    (CacheLoader<String, User>) key -> userService.findById(key)
);

// 使用异步 loader
AsyncLoadingCache<String, User> cache = localCacheManager.getOrCreateAsyncLoadingCache(
    "asyncUserCache",
    Duration.ofMinutes(10),
    1000,
    (AsyncCacheLoader<String, User>) (key, executor) ->
        CompletableFuture.supplyAsync(() -> userService.findById(key), executor)
);

// 异步获取
CompletableFuture<User> future = localCacheManager.getFromAsyncLoadingCache("asyncUserCache", "user:1001");

// 异步批量获取
CompletableFuture<Map<String, User>> futures = localCacheManager.getAllFromAsyncLoadingCache(
    "asyncUserCache",
    Set.of("user:1001", "user:1002")
);`}</CodeBlock>

              <H4>特殊引用类型缓存</H4>
              <CodeBlock lang="java">{`// 弱引用值缓存 — 值无强引用时可被 GC 回收
Cache<String, User> weakCache = localCacheManager.getOrCreateWeakValuesCache("weakCache", Duration.ofMinutes(10), 1000);

// 软引用值缓存 — 内存不足时值可被 GC 回收
Cache<String, User> softCache = localCacheManager.getOrCreateSoftValuesCache("softCache", Duration.ofMinutes(10), 1000);

// 弱引用键缓存 — 键无强引用时可被 GC 回收
Cache<String, User> weakKeyCache = localCacheManager.getOrCreateWeakKeysCache("weakKeyCache", Duration.ofMinutes(10), 1000);

// 带统计功能的缓存
Cache<String, User> statsCache = localCacheManager.getOrCreateCacheWithStats("statsCache", Duration.ofMinutes(10), 1000);`}</CodeBlock>

              <H3>4.2 Spring Cache 注解方式</H3>
              <P>启用 <InlineCode>create-spring-cache-manager: true</InlineCode> 后，可直接使用 Spring Cache 注解。</P>
              <CodeBlock lang="java">{`@Service
public class UserService {

    @Cacheable(value = "userCache", key = "#id")
    public User findById(String id) {
        return userRepository.findById(id);
    }

    @CachePut(value = "userCache", key = "#user.id")
    public User update(User user) {
        return userRepository.save(user);
    }

    @CacheEvict(value = "userCache", key = "#id")
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    @CacheEvict(value = "userCache", allEntries = true)
    public void clearAll() {
        // 清空 userCache 所有条目
    }
}`}</CodeBlock>

              {/* ============== 5. 自动配置机制 ============== */}
              <H2 id="sec-autoconfig">5. 自动配置机制</H2>
              <P>本模块利用 Spring Boot 自动配置实现<Highlight>零配置启动</Highlight>：</P>
              <DocTable
                headers={["配置类", "条件", "说明"]}
                rows={[
                  ["CaffeineSimpleConfig", "无条件（@ConditionalOnMissingBean）", "自动注册 LocalCacheManager Bean"],
                  ["CaffeineCacheConfig", "create_spring_cache_manager=true", "创建 Spring CacheManager 并启用 @EnableCaching"],
                ]}
              />
              <NumberList items={[
                <><InlineCode>CaffeineSimpleConfig</InlineCode> 始终生效，确保 <InlineCode>LocalCacheManager</InlineCode> 可用</>,
                <><InlineCode>CaffeineCacheConfig</InlineCode> 仅在开启配置时生效，创建 <InlineCode>CaffeineCacheManager</InlineCode> 并标记为 <InlineCode>@Primary</InlineCode></>,
              ]} />

              {/* ============== 6. 缓存过期策略说明 ============== */}
              <H2 id="sec-expiry">6. 缓存过期策略</H2>
              <DocTable
                headers={["策略", "参数", "说明"]}
                rows={[
                  ["写后过期（expireAfterWrite）", "expireType=0（默认）", "写入后经过指定时间自动过期"],
                  ["读后过期（expireAfterAccess）", "expireType=1", "最后一次访问后经过指定时间过期，适合热点数据"],
                  ["写后刷新（refreshAfterWrite）", "LoadingCache 专用", "写入后经过指定时间，下次访问触发异步刷新，刷新期间返回旧值"],
                  ["不过期", "Duration.ZERO 或不设置", "仅受 maximumSize 控制，满时按 LRU/LFU 策略淘汰"],
                ]}
              />
              <TipBox>
                对于<Strong>热点数据</Strong>推荐使用 <InlineCode>expireAfterAccess</InlineCode>（读后过期），对于<Strong>配置类数据</Strong>推荐使用 <InlineCode>refreshAfterWrite</InlineCode>（写后刷新），在保证数据较新的同时避免请求阻塞。
              </TipBox>

              {/* ============== 7. API 快速参考 ============== */}
              <H2 id="sec-api">7. API 快速参考</H2>
              <H3>LocalCacheManager 方法列表</H3>
              <DocTable
                headers={["方法", "说明"]}
                rows={[
                  ["getOrCreateCache(name, expire, maxSize)", "创建/获取基础缓存"],
                  ["getOrCreateCache(name, expire, expireType, maxSize)", "创建/获取基础缓存（可选过期类型）"],
                  ["getOrCreateCache(name, maxSize)", "创建/获取不过期缓存"],
                  ["get(name, key)", "获取缓存值"],
                  ["get(name, key, mappingFunction)", "获取缓存值（未命中时加载）"],
                  ["put(name, key, value)", "放入缓存"],
                  ["evict(name, key)", "删除单个缓存项"],
                  ["getAll(name, keys)", "批量获取"],
                  ["putAll(name, map)", "批量放入"],
                  ["evictAll(name, keys)", "批量删除"],
                  ["clear(name)", "清空缓存"],
                  ["estimatedSize(name)", "获取预估大小"],
                  ["cleanUp(name)", "手动触发清理"],
                  ["removeCache(name)", "移除缓存实例"],
                  ["getOrCreateLoadingCache(...)", "创建自动加载缓存（多种重载）"],
                  ["getOrCreateLoadingCacheWithStats(...)", "创建带统计的自动加载缓存"],
                  ["getFromLoadingCache(name, key)", "从 LoadingCache 获取值"],
                  ["getAllFromLoadingCache(name, keys)", "从 LoadingCache 批量获取"],
                  ["refreshLoadingCache(name, key)", "刷新 LoadingCache 指定键"],
                  ["getOrCreateAsyncCache(...)", "创建异步缓存"],
                  ["getFromAsyncCache(name, key, fn)", "异步获取缓存值"],
                  ["putToAsyncCache(name, key, future)", "异步放入缓存值"],
                  ["getOrCreateAsyncLoadingCache(...)", "创建异步自动加载缓存（多种重载）"],
                  ["getFromAsyncLoadingCache(name, key)", "异步获取自动加载缓存值"],
                  ["getAllFromAsyncLoadingCache(name, keys)", "异步批量获取自动加载缓存值"],
                  ["getOrCreateCacheWithStats(...)", "创建带统计的缓存"],
                  ["getOrCreateWeakValuesCache(...)", "创建弱引用值缓存"],
                  ["getOrCreateSoftValuesCache(...)", "创建软引用值缓存"],
                  ["getOrCreateWeakKeysCache(...)", "创建弱引用键缓存"],
                ]}
              />

              {/* ============== 8. 最佳实践 ============== */}
              <H2 id="sec-practices">8. 最佳实践</H2>
              <NumberList items={[
                <><Strong>缓存命名规范</Strong>：建议使用 <InlineCode>模块:实体</InlineCode> 格式命名，如 <InlineCode>user:info</InlineCode>、<InlineCode>config:system</InlineCode>，避免缓存名称冲突。</>,
                <><Strong>合理设置过期时间</Strong>：根据数据更新频率设置过期时间，频繁变更的数据设置较短过期，配置类数据可适当延长。</>,
                <><Strong>控制缓存大小</Strong>：通过 <InlineCode>maximumSize</InlineCode> 限制缓存条目数，防止内存溢出。</>,
                <><Strong>优先使用 LoadingCache</Strong>：对需要自动加载的场景使用 LoadingCache，避免<Highlight>缓存穿透</Highlight>。</>,
                <><Strong>善用刷新策略</Strong>：对配置类数据使用 <InlineCode>refreshAfterWrite</InlineCode>，在保证数据较新的同时避免请求阻塞。</>,
                <><Strong>内存敏感场景</Strong>：使用弱引用/软引用缓存，让 GC 能在内存压力时自动回收缓存条目。</>,
                <><Strong>监控缓存命中率</Strong>：使用带统计功能的缓存（<InlineCode>WithStats</InlineCode> 系列方法）来观察缓存效果，及时调整策略。</>,
              ]} />
              <WarnBox>
                过大的 <InlineCode>maximumSize</InlineCode> 可能导致 JVM 内存压力，建议根据实际业务数据量和服务器内存合理规划，并配合 <InlineCode>WithStats</InlineCode> 监控缓存命中率进行调优。
              </WarnBox>

              {/* ============== 9. 包结构 ============== */}
              <H2 id="sec-packages">9. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.cache.caffeine
├── config
│   ├── CaffeineCacheConfig.java        # Spring Cache 管理器配置（条件激活）
│   ├── CaffeineDefinedInfo.java        # 缓存定义信息实体
│   └── CaffeineSimpleConfig.java       # LocalCacheManager 自动配置
├── manager
│   └── LocalCacheManager.java          # 核心缓存管理器
└── properties
    └── CaffeineCacheProperties.java    # 配置属性绑定类`}</CodeBlock>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-cache-caffeine — 高性能本地缓存，加速数据访问。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/db-clickhouse" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">ClickHouse</span>
                </Link>
                <Link href="/docs/reader/autoid-redis" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Redis 自增ID</span>
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
