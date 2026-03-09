"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, Copy, Check, Lightbulb, ArrowLeft, ArrowDown, ArrowUp, Sparkles } from "lucide-react"

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
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", active: true }]},
]

const outlineItems = [
  { id: "sec-overview", label: "模块概述" },
  { id: "sec-dep", label: "依赖引入" },
  { id: "sec-principle", label: "工作原理" },
  { id: "sec-autoconfig", label: "自动配置" },
  { id: "sec-config", label: "配置说明" },
  { id: "sec-usage", label: "使用指南" },
  { id: "sec-capacity", label: "容量规划" },
  { id: "sec-persistence", label: "持久化与恢复" },
  { id: "sec-best", label: "最佳实践" },
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
  return <span className="font-semibold text-[#FBBF24]">{children}</span>
}

export default function ChronicleMapDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Chronicle Map</span>
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
                easyfk-chronicle-map Chronicle Map
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Chronicle Map — 堆外高性能键值存储</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~10 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />

              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>chronicle-map</InlineCode> 是 EasyFK 框架中基于 Chronicle Map 的高性能堆外键值存储组件。Chronicle Map 是一个开源的嵌入式键值存储引擎，数据存储在堆外内存（Off-Heap），不受 JVM GC 影响，同时支持<Strong>文件持久化</Strong>，进程重启后数据可自动恢复。
              </P>
              <P>
                该模块提供了完整的自动配置、类型安全的 Map 管理器和便捷的操作模板，开发者只需通过 YAML 配置即可创建和使用高性能键值存储，适用于本地缓存、会话存储、配置中心、计数器等场景。
              </P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-dep">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>chronicle-map</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:chronicle-map'
}`}</CodeBlock>

              <TipBox>
                版本号由框架统一 BOM 管理，无需手动指定。
              </TipBox>

              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={[
                <><InlineCode key="cm">net.openhft:chronicle-map</InlineCode> — Chronicle Map 核心库</>,
              ]} />

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-principle">3. 工作原理</H2>
              <P>Chronicle Map 基于内存映射文件（Memory-Mapped File）技术，将数据存储在堆外内存中：</P>
              <CodeBlock lang="plaintext">{`┌─────────────────────────────────────────────────┐
│                  应用业务层                       │
│  ChronicleMapTemplate.put / get / remove         │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  ChronicleMapManager（Map 管理器）                │
│  · 类型安全校验 · 读写锁优化 · 懒加载创建        │
│  · 类型验证缓存 · 类型化包装器缓存               │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  Chronicle Map（堆外键值存储引擎）                │
│  · 堆外内存（Off-Heap）· 零 GC 影响             │
│  · 内存映射文件 · 持久化 / 恢复                  │
│  · 多线程并发安全 · 亚微秒级读写                 │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  文件系统（可选持久化）                           │
│  ./chronicle-maps/mapName.dat                    │
└─────────────────────────────────────────────────┘`}</CodeBlock>
              <BulletList items={[
                <><Strong>堆外存储</Strong>：数据不在 JVM 堆内，不会触发 GC，适合大容量缓存</>,
                <><Strong>内存映射文件</Strong>：通过 <InlineCode>mmap</InlineCode> 将文件映射到内存，读写性能接近内存操作</>,
                <><Strong>持久化支持</Strong>：数据可持久化到文件，进程重启后通过 <InlineCode>recoverPersistedTo</InlineCode> 自动恢复</>,
                <><Strong>多线程安全</Strong>：Chronicle Map 内部保证线程安全，无需外部加锁</>,
              ]} />

              {/* ============== 4. 自动配置 ============== */}
              <H2 id="sec-autoconfig">4. 自动配置</H2>
              <P>模块通过 Spring Boot 自动配置机制注册以下 Bean：</P>
              <DocTable
                headers={["Bean", "类型", "条件", "说明"]}
                rows={[
                  ["ChronicleMapManager", "Manager", "@ConditionalOnMissingBean + @Lazy", "Map 管理器，懒加载初始化"],
                  ["ChronicleMapTemplate", "Template", "@ConditionalOnMissingBean", "操作模板，依赖 Manager"],
                ]}
              />
              <TipBox>
                <Strong>懒加载</Strong>：<InlineCode>ChronicleMapManager</InlineCode> 使用 <InlineCode>@Lazy</InlineCode> 注解，只在首次使用时初始化，避免启动时不必要的资源消耗。
              </TipBox>
              <H4>自动配置流程</H4>
              <NumberList items={[
                <>读取 <InlineCode>easyfk.config.chronicle.map</InlineCode> 前缀的配置属性</>,
                <>创建 <InlineCode>ChronicleMapManager</InlineCode> 实例</>,
                <>遍历 <InlineCode>maps</InlineCode> 配置列表，为每个预定义的 Map 创建 Chronicle Map 实例并注册</>,
                <>创建 <InlineCode>ChronicleMapTemplate</InlineCode> 实例</>,
              ]} />

              {/* ============== 5. 配置说明 ============== */}
              <H2 id="sec-config">5. 配置说明</H2>

              <H3>5.1 全局配置属性</H3>
              <P>配置前缀：<InlineCode>easyfk.config.chronicle.map</InlineCode></P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["default-path", "String", "./chronicle-maps", "默认存储目录"],
                  ["default-max-entries", "long", "100000", "默认最大条目数"],
                  ["default-average-key-size", "double", "64.0", "默认平均键大小（字节）"],
                  ["default-average-value-size", "double", "1024.0", "默认平均值大小（字节）"],
                  ["default-file-extension", "String", ".dat", "默认持久化文件扩展名"],
                  ["persistence-enabled", "boolean", "true", "是否启用持久化"],
                  ["recover-on-startup", "boolean", "true", "启动时是否恢复数据"],
                  ["compression-enabled", "boolean", "false", "是否启用压缩"],
                  ["apply-average-sizes", "boolean", "true", "是否应用平均大小参数"],
                  ["fixed-size-optimization-enabled", "boolean", "true", "是否启用固定尺寸类型优化"],
                ]}
              />

              <H3>5.2 预定义 Map 配置</H3>
              <P>通过 <InlineCode>maps</InlineCode> 列表预定义需要在启动时创建的 Chronicle Map：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        default-path: ./chronicle-maps
        default-max-entries: 100000
        default-average-key-size: 64
        default-average-value-size: 1024
        persistence-enabled: true
        maps:
          - map-name: userCache
            max-entries: 50000
            average-key-size: 32
            average-value-size: 512
            persistence-enabled: true
            key-type: java.lang.String
            value-type: java.lang.Object
          - map-name: sessionStore
            max-entries: 10000
            average-key-size: 64
            average-value-size: 2048
            persistence-enabled: true
          - map-name: counterMap
            max-entries: 1000
            key-type: java.lang.String
            value-type: java.lang.Long
            persistence-enabled: false`}</CodeBlock>

              <H3>5.3 单个 Map 配置项</H3>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["map-name", "String", "必填", "Map 名称，全局唯一标识"],
                  ["file-path", "String", "自动生成", "持久化文件路径，未配置时按 defaultPath/mapName.ext 生成"],
                  ["max-entries", "Long", "使用全局默认", "最大条目数"],
                  ["average-key-size", "Double", "使用全局默认", "平均键大小（字节）"],
                  ["average-value-size", "Double", "使用全局默认", "平均值大小（字节）"],
                  ["persistence-enabled", "boolean", "true", "是否启用持久化"],
                  ["compression-enabled", "boolean", "false", "是否启用压缩"],
                  ["key-type", "Class", "String.class", "键的 Java 类型"],
                  ["value-type", "Class", "Object.class", "值的 Java 类型"],
                  ["file-extension", "String", "使用全局默认", "文件扩展名"],
                  ["apply-average-sizes", "Boolean", "使用全局默认", "是否应用平均大小参数"],
                  ["fixed-size-optimization-enabled", "Boolean", "使用全局默认", "是否启用固定尺寸类型优化"],
                ]}
              />
              <TipBox>
                <Strong>固定尺寸类型优化</Strong>：当 key 或 value 类型为 <InlineCode>Long</InlineCode>、<InlineCode>Integer</InlineCode>、<InlineCode>Double</InlineCode> 等基本类型包装类时，Chronicle Map 已知其精确大小，无需设置 <InlineCode>averageKeySize</InlineCode> / <InlineCode>averageValueSize</InlineCode>，启用该优化可自动跳过。
              </TipBox>

              {/* ============== 6. 使用指南 ============== */}
              <H2 id="sec-usage">6. 使用指南</H2>

              <H3>6.1 使用 ChronicleMapTemplate（推荐）</H3>
              <P><InlineCode>ChronicleMapTemplate</InlineCode> 提供简洁的 API，适合大部分使用场景：</P>
              <CodeBlock lang="java">{`@Service
public class UserCacheService {

    @Autowired
    private ChronicleMapTemplate chronicleMapTemplate;

    private static final String MAP_NAME = "userCache";

    // 存储
    public void cacheUser(String userId, UserDTO user) {
        chronicleMapTemplate.put(MAP_NAME, userId, user);
    }

    // 获取
    public UserDTO getUser(String userId) {
        return (UserDTO) chronicleMapTemplate.get(MAP_NAME, userId);
    }

    // 获取（带默认值）
    public UserDTO getUserOrDefault(String userId, UserDTO defaultUser) {
        return (UserDTO) chronicleMapTemplate.getOrDefault(MAP_NAME, userId, defaultUser);
    }

    // 不存在时才存储
    public void cacheIfAbsent(String userId, UserDTO user) {
        chronicleMapTemplate.putIfAbsent(MAP_NAME, userId, user);
    }

    // 删除
    public void removeUser(String userId) {
        chronicleMapTemplate.remove(MAP_NAME, userId);
    }

    // 检查是否存在
    public boolean exists(String userId) {
        return chronicleMapTemplate.containsKey(MAP_NAME, userId);
    }

    // 获取缓存大小
    public long cacheSize() {
        return chronicleMapTemplate.size(MAP_NAME);
    }
}`}</CodeBlock>

              <H3>6.2 批量操作</H3>
              <CodeBlock lang="java">{`// 批量存储
Map<String, Object> batch = new HashMap<>();
batch.put("user:1001", user1);
batch.put("user:1002", user2);
batch.put("user:1003", user3);
chronicleMapTemplate.putAll("userCache", batch);

// 获取所有键
Set<String> keys = chronicleMapTemplate.keySet("userCache");

// 获取所有值
Collection<Object> values = chronicleMapTemplate.values("userCache");

// 获取所有键值对
Set<Map.Entry<String, Object>> entries = chronicleMapTemplate.entrySet("userCache");

// 清空
chronicleMapTemplate.clear("userCache");`}</CodeBlock>

              <H3>6.3 计算操作</H3>
              <CodeBlock lang="java">{`// 如果键不存在，计算并存储
Object value = chronicleMapTemplate.computeIfAbsent("configCache", "db.url",
    key -> loadConfigFromDB(key));

// 如果键存在，重新计算
chronicleMapTemplate.computeIfPresent("counterMap", "loginCount",
    (key, oldValue) -> (Long) oldValue + 1);`}</CodeBlock>

              <H3>6.4 强类型操作</H3>
              <P>对于已知类型的 Map，使用强类型 API 避免类型转换：</P>
              <CodeBlock lang="java">{`@Service
public class CounterService {

    @Autowired
    private ChronicleMapTemplate chronicleMapTemplate;

    private static final String MAP_NAME = "counterMap";

    // 强类型存储
    public void setCounter(String name, Long value) {
        chronicleMapTemplate.put(MAP_NAME, String.class, Long.class, name, value);
    }

    // 强类型获取
    public Long getCounter(String name) {
        return chronicleMapTemplate.get(MAP_NAME, String.class, Long.class, name);
    }

    // 强类型批量存储
    public void setCounters(Map<String, Long> counters) {
        chronicleMapTemplate.putAll(MAP_NAME, String.class, Long.class, counters);
    }

    // 强类型原子计算
    public Long incrementCounter(String name) {
        return chronicleMapTemplate.computeIfPresent(MAP_NAME, String.class, Long.class,
            name, (k, v) -> v + 1);
    }
}`}</CodeBlock>

              <H3>6.5 使用 ChronicleMapManager（高级）</H3>
              <P>需要更精细控制时，可直接使用 <InlineCode>ChronicleMapManager</InlineCode>：</P>
              <CodeBlock lang="java">{`@Service
public class DynamicMapService {

    @Autowired
    private ChronicleMapManager chronicleMapManager;

    // 动态创建 Map
    public void createMap(String mapName) {
        chronicleMapManager.getOrCreateMap(mapName, String.class, String.class);
    }

    // 带自定义配置创建
    public void createCustomMap(String mapName) {
        chronicleMapManager.getOrCreateMap(mapName,
            50000,   // maxEntries
            32.0,    // avgKeySize
            256.0,   // avgValueSize
            "./data/" + mapName + ".dat"  // filePath
        );
    }

    // 检查 Map 是否存在
    public boolean mapExists(String mapName) {
        return chronicleMapManager.containsMap(mapName);
    }

    // 获取所有 Map 名称
    public Set<String> listMaps() {
        return chronicleMapManager.getMapNames();
    }

    // 获取统计信息
    public String getStats(String mapName) {
        return chronicleMapManager.getMapStats(mapName);
    }

    // 移除并关闭 Map
    public void removeMap(String mapName) {
        chronicleMapManager.removeMap(mapName);
    }

    // 关闭所有 Map（应用关闭时）
    public void shutdown() {
        chronicleMapManager.closeAll();
    }
}`}</CodeBlock>

              <H3>6.6 Map 管理操作</H3>
              <CodeBlock lang="java">{`// 检查 Map 是否存在
boolean exists = chronicleMapTemplate.mapExists("userCache");

// 获取所有 Map 名称
Set<String> mapNames = chronicleMapTemplate.getAllMapNames();

// 获取统计信息
String stats = chronicleMapTemplate.getStats("userCache");`}</CodeBlock>

              {/* ============== 7. 容量规划 ============== */}
              <H2 id="sec-capacity">7. 容量规划</H2>
              <P>Chronicle Map 需要在创建时预估数据规模，合理的容量规划对性能至关重要：</P>

              <H3>7.1 maxEntries（最大条目数）</H3>
              <BulletList items={[
                "设置预期的最大键值对数量",
                <><Highlight>建议按预期峰值的 1.5 ~ 2 倍配置</Highlight>，留有余量</>,
                "超过 maxEntries 后仍可写入，但性能会下降",
              ]} />

              <H3>7.2 averageKeySize / averageValueSize（平均大小）</H3>
              <BulletList items={[
                <>对于 <InlineCode>String</InlineCode> 类型的 key，按平均字符串长度估算字节数</>,
                "对于序列化对象的 value，按序列化后的平均字节数估算",
                "估算偏小会导致频繁 resize，估算偏大会浪费内存",
              ]} />

              <H3>7.3 示例</H3>
              <DocTable
                headers={["场景", "maxEntries", "avgKeySize", "avgValueSize"]}
                rows={[
                  ["用户信息缓存", "100,000", "32", "512"],
                  ["会话存储", "10,000", "64", "2048"],
                  ["配置中心", "1,000", "64", "256"],
                  ["计数器", "10,000", "32", "8（Long）"],
                  ["限流令牌桶", "50,000", "64", "128"],
                ]}
              />

              {/* ============== 8. 持久化与恢复 ============== */}
              <H2 id="sec-persistence">8. 持久化与恢复</H2>

              <H3>8.1 持久化模式</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        persistence-enabled: true    # 全局启用持久化
        default-path: ./chronicle-maps`}</CodeBlock>
              <BulletList items={[
                "启用持久化后，数据自动写入磁盘文件",
                <>进程重启时通过 <InlineCode>recoverPersistedTo</InlineCode> 自动恢复数据</>,
                <>数据文件默认存储在 <InlineCode>./chronicle-maps/</InlineCode> 目录下</>,
              ]} />

              <H3>8.2 纯内存模式</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        persistence-enabled: false   # 纯内存模式`}</CodeBlock>
              <BulletList items={[
                "纯内存模式下不创建持久化文件",
                "进程重启后数据丢失",
                "适合临时缓存、计数器等不需要持久化的场景",
              ]} />

              <H3>8.3 混合模式</H3>
              <P>可以为不同的 Map 分别设置持久化策略：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        persistence-enabled: true
        maps:
          - map-name: importantData
            persistence-enabled: true    # 重要数据持久化
          - map-name: tempCache
            persistence-enabled: false   # 临时缓存不持久化`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-best">9. 最佳实践</H2>
              <NumberList items={[
                <><Strong>容量预估</Strong>：创建 Map 时合理估算 <InlineCode>maxEntries</InlineCode>、<InlineCode>averageKeySize</InlineCode>、<InlineCode>averageValueSize</InlineCode>，避免频繁 resize 或内存浪费。</>,
                <><Strong>类型安全</Strong>：使用强类型 API（传入 <InlineCode>keyType</InlineCode> / <InlineCode>valueType</InlineCode>），避免运行时类型转换错误。</>,
                <><Strong>预定义 Map</Strong>：常用的 Map 通过 YAML 配置预定义，应用启动时自动创建，避免首次访问时的创建延迟。</>,
                <><Strong>持久化策略</Strong>：重要数据启用持久化，临时缓存使用纯内存模式，按需选择。</>,
                <><Strong>Serializable</Strong>：存储的对象需实现 <InlineCode>Serializable</InlineCode> 接口，确保可序列化。</>,
                <><Strong>资源清理</Strong>：应用关闭时调用 <InlineCode>ChronicleMapManager.closeAll()</InlineCode> 关闭所有 Map，释放堆外内存。</>,
                <><Strong>固定尺寸优化</Strong>：对于 <InlineCode>Long</InlineCode>、<InlineCode>Integer</InlineCode> 等基本类型，启用 <InlineCode>fixed-size-optimization-enabled</InlineCode> 可跳过不必要的平均大小设置。</>,
                <><Strong>避免超大 Value</Strong>：Chronicle Map 适合存储中小型数据，超大对象（&gt;1MB）建议使用文件存储或对象存储。</>,
                <><Strong>监控统计</Strong>：通过 <InlineCode>getStats()</InlineCode> 定期监控 Map 的大小和健康状态。</>,
                <><Strong>动态创建</Strong>：运行时通过 <InlineCode>ChronicleMapManager.getOrCreateMap()</InlineCode> 动态创建 Map，自动处理持久化文件和类型注册。</>,
              ]} />

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-chronicle-map — 堆外高性能键值存储，突破 JVM 内存限制。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/fory" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
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
