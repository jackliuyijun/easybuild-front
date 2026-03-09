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
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", active: true },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖关系" },
  { id: "sec-2", label: "包结构" },
  { id: "sec-3", label: "核心接口" },
  { id: "sec-4", label: "配置属性" },
  { id: "sec-5", label: "自动配置" },
  { id: "sec-6", label: "初始化流程" },
  { id: "sec-7", label: "ForySerializer 核心 API" },
  { id: "sec-8", label: "ForySerializerClassRegister" },
  { id: "sec-9", label: "快速接入" },
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

export default function ForyDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Fory 序列化</span>
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
                easyfk-fory Fory 序列化
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Fory 序列化 — 高性能对象序列化框架</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>serializer-fory</InlineCode> 是 EasyFK 框架的<Strong>高性能序列化模块</Strong>，基于 [Apache Fory](https://fury.apache.org/)（原 Fury）0.14.1 构建。提供 Java 内部序列化和跨语言（XLANG）序列化两种模式，通过 Spring Boot 自动配置实现类的自动扫描与注册，开箱即用。</P>
              <P>本模块由两个子模块组成：</P>
              <BulletList items={["**serializer-base**：序列化器的抽象层，定义 SPI 接口、配置属性和初始化流程", "**serializer-fory**：基于 Apache Fory 的具体实现"]} />

              {/* ============== 2. 依赖关系 ============== */}
              <H2 id="sec-1">2. 依赖关系</H2>

              <H3>2.1 serializer-base</H3>
              <CodeBlock lang="groovy">{`// 父级 build.gradle 声明了 easyfk-core 为所有子模块的编译期依赖
subprojects {
    dependencies {
        compileOnly project(':easyfk-core')
    }
}`}</CodeBlock>

              <H3>2.2 serializer-fory</H3>
              <CodeBlock lang="groovy">{`dependencies {
    api project(':easyfk-serializer:serializer-base')
    api 'org.apache.fory:fory-core:0.14.1'
}`}</CodeBlock>

                            <DocTable
                headers={["`easyfk-core`", "提供 `@SerializableClass` 注解和 `EmptyUtil` 工具"]}
                rows={[
                  ["`fory-core 0.14.1`", "Apache Fory 序列化框架核心库"],
                ]}
              />

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-2">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`easyfk-serializer/
├── serializer-base/                          # 抽象层
│   ├── build.gradle                          # （空，继承父级配置）
│   └── src/main/java/com/mcst/easyfk/serializer/base/
│       ├── SerializerClassRegister.java       # SPI 接口：类注册器
│       ├── properties/
│       │   └── SerializerProperties.java      # 配置属性
│       ├── config/
│       │   └── SerializerAutoConfiguration.java # 自动配置
│       └── init/
│           └── SerializerInitializer.java     # 初始化器：扫描+注册
│
└── serializer-fory/                          # Fory 实现层
    ├── build.gradle
    └── src/main/java/com/mcst/easyfk/serializer/fory/
        ├── ForySerializer.java                # 核心：Fory 序列化工具类
        ├── ForySerializerClassRegister.java   # SPI 实现：Fory 类注册器
        └── config/
            └── ForySerializerAutoConfiguration.java # Fory 自动配置`}</CodeBlock>

              {/* ============== 4. 核心接口 ============== */}
              <H2 id="sec-3">4. 核心接口</H2>

              <H3>4.1 SerializerClassRegister（SPI 接口）</H3>
              <CodeBlock lang="java">{`public interface SerializerClassRegister {
    default void registerClass(List<Class<?>> classes) {
    }
}`}</CodeBlock>
              <P>序列化类注册器的函数接口。实现此接口可将扫描到的类注册到具体的序列化器中。模块通过 Spring 容器自动发现所有实现者。</P>
              <P><Strong>方法说明：</Strong></P>

              

              <H3>4.2 @SerializableClass（标记注解）</H3>
              <P>定义在 <InlineCode>easyfk-core</InlineCode> 模块中：</P>
              <CodeBlock lang="java">{`@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SerializableClass {
}`}</CodeBlock>
              <P>标记需要预注册到序列化器的类。启动时 <InlineCode>SerializerInitializer</InlineCode> 会扫描带有此注解的类并交给注册器处理。</P>

              {/* ============== 5. 配置属性 ============== */}
              <H2 id="sec-4">5. 配置属性</H2>

              <H3>5.1 SerializerProperties</H3>
              <P>配置前缀：<InlineCode>easyfk.config.serializer</InlineCode></P>

                            <DocTable
                headers={["`pre-register`", "Boolean", "`true`", "是否在启动时预注册序列化类。关闭后使用时动态注册"]}
                rows={[
                  ["`scan-packages`", "List\&lt;String\&gt;", "`[]`", "额外需要扫描的包路径列表（默认必扫 `com.mcst`）"],
                ]}
              />

              <H3>5.2 配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    serializer:
      pre-register: true
      cross-language: false
      scan-packages:
        - com.example.dto
        - com.example.entity`}</CodeBlock>

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-5">6. 自动配置</H2>

              <H3>6.1 SerializerAutoConfiguration（serializer-base）</H3>
              <CodeBlock lang="java">{`@AutoConfiguration
@EnableConfigurationProperties(SerializerProperties.class)
@ConditionalOnProperty(prefix = "easyfk.config.serializer", name = "pre-register",
                       havingValue = "true", matchIfMissing = true)
public class SerializerAutoConfiguration {

    @Bean
    public SerializerInitializer serializerInitializer() {
        return new SerializerInitializer();
    }
}`}</CodeBlock>
              <P><Strong>生效条件：</Strong> <InlineCode>pre-register</InlineCode> 为 <InlineCode>true</InlineCode>（默认生效）</P>
              <P>注册 <InlineCode>SerializerInitializer</InlineCode> Bean，负责启动时扫描和注册类。</P>

              <H3>6.2 ForySerializerAutoConfiguration（serializer-fory）</H3>
              <CodeBlock lang="java">{`@AutoConfiguration
@ConditionalOnProperty(prefix = "easyfk.config.serializer", name = "pre-register",
                       havingValue = "true", matchIfMissing = true)
public class ForySerializerAutoConfiguration {

    @Bean
    public ForySerializerClassRegister forySerializerClassRegister() {
        return new ForySerializerClassRegister();
    }
}`}</CodeBlock>
              <P><Strong>生效条件：</Strong> <InlineCode>pre-register</InlineCode> 为 <InlineCode>true</InlineCode>（默认生效）</P>
              <P>注册 <InlineCode>ForySerializerClassRegister</InlineCode> Bean，使 <InlineCode>SerializerInitializer</InlineCode> 能够自动发现并调用。</P>

              <H3>6.3 Spring Boot 自动配置注册</H3>
              <P><Strong>serializer-base：</Strong></P>
              <CodeBlock lang="plaintext">{`# META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
com.mcst.easyfk.serializer.base.config.SerializerAutoConfiguration`}</CodeBlock>
              <P><Strong>serializer-fory：</Strong></P>
              <CodeBlock lang="plaintext">{`# META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
com.mcst.easyfk.serializer.fory.config.ForySerializerAutoConfiguration`}</CodeBlock>

              {/* ============== 7. 初始化流程 ============== */}
              <H2 id="sec-6">7. 初始化流程</H2>

              <H3>7.1 SerializerInitializer</H3>
              <P><InlineCode>SerializerInitializer</InlineCode> 实现 <InlineCode>InitializingBean</InlineCode>，在 Bean 初始化完成后自动执行：</P>
              <CodeBlock lang="plaintext">{`Spring 容器启动
    │
    ├─ SerializerAutoConfiguration 注册 SerializerInitializer
    ├─ ForySerializerAutoConfiguration 注册 ForySerializerClassRegister
    │
    └─ afterPropertiesSet() 触发
        │
        ├─ 检查 preRegister 开关
        │   └─ false → 跳过，日志提示
        │
        ├─ 发现所有 SerializerClassRegister Bean
        │   └─ 空 → 跳过
        │
        ├─ 构建 ClassPath 扫描器
        │   └─ 过滤器：@SerializableClass 注解
        │
        ├─ 合并扫描包路径
        │   ├─ 固定包："com.mcst"
        │   └─ 配置包：scanPackages
        │
        ├─ 扫描所有候选类
        │   └─ ClassPathScanningCandidateComponentProvider
        │       └─ AnnotationTypeFilter(SerializableClass.class)
        │
        └─ 调用所有注册器
            └─ serializerClassRegister.registerClass(classes)
                └─ ForySerializerClassRegister
                    └─ ForySerializer.register(clazz) × N`}</CodeBlock>

              {/* ============== 8. ForySerializer 核心 API ============== */}
              <H2 id="sec-7">8. ForySerializer 核心 API</H2>
              <P><InlineCode>ForySerializer</InlineCode> 是序列化操作的入口，提供静态方法调用。</P>

              <H3>8.1 Java 序列化</H3>
              <CodeBlock lang="java">{`// 序列化
byte[] data = ForySerializer.serialize(myObject);

// 反序列化
MyClass obj = ForySerializer.deserialize(data);`}</CodeBlock>

                            <DocTable
                headers={["`serialize(Object obj)`", "待序列化对象", "`byte[]`", "null 返回空数组"]}
                rows={[]}
              />

              <H3>8.2 跨语言序列化</H3>
              <P>需要先开启 <InlineCode>cross-language: true</InlineCode> 配置：</P>
              <CodeBlock lang="java">{`// 跨语言序列化
byte[] data = ForySerializer.serializeXLang(myObject);

// 跨语言反序列化
MyClass obj = ForySerializer.deserializeXLang(data);`}</CodeBlock>

                            <DocTable
                headers={["`serializeXLang(Object obj)`", "待序列化对象", "`byte[]`", "未开启跨语言时抛 UnsupportedOperationException"]}
                rows={[]}
              />

              <H3>8.3 手动注册类</H3>
              <CodeBlock lang="java">{`ForySerializer.register(MyClass.class);`}</CodeBlock>
              <BulletList items={["重复注册会被自动忽略（ConcurrentHashMap.newKeySet 去重）", "同时注册到 Java 实例和 XLANG 实例（若已启用）"]} />

              <H3>8.4 获取底层 Fory 实例</H3>
              <CodeBlock lang="java">{`ThreadSafeFory javaFory = ForySerializer.getJavaFory();
ThreadSafeFory xlangFory = ForySerializer.getXLangFory();`}</CodeBlock>
              <P>用于需要直接操作 Fory API 的高级场景。</P>

              {/* ============== 9. ForySerializerClassRegister ============== */}
              <H2 id="sec-8">9. ForySerializerClassRegister</H2>
              <P>SPI 接口的 Fory 实现：</P>
              <CodeBlock lang="java">{`public class ForySerializerClassRegister implements SerializerClassRegister {

    @Override
    public void registerClass(List<Class<?>> classes) {
        for (Class<?> clazz : classes) {
            ForySerializer.register(clazz);
        }
    }
}`}</CodeBlock>
              <P>作为桥梁，将 <InlineCode>SerializerInitializer</InlineCode> 扫描到的类列表注册到 <InlineCode>ForySerializer</InlineCode>。</P>

              {/* ============== 10. 快速接入 ============== */}
              <H2 id="sec-9">10. 快速接入</H2>

              <H3>10.1 添加依赖</H3>
              <CodeBlock lang="groovy">{`dependencies {
    implementation project(':easyfk-serializer:serializer-fory')
}`}</CodeBlock>

              <H3>10.2 标记序列化类</H3>
              <CodeBlock lang="java">{`import com.mcst.easyfk.core.annotation.SerializableClass;

@SerializableClass
public class UserDto {
    private String name;
    private int age;
    // getter/setter
}`}</CodeBlock>

              <H3>10.3 使用序列化</H3>
              <CodeBlock lang="java">{`// 序列化
UserDto user = new UserDto();
user.setName("张三");
user.setAge(25);
byte[] bytes = ForySerializer.serialize(user);

// 反序列化
UserDto restored = ForySerializer.deserialize(bytes);`}</CodeBlock>

              <H3>10.4 启用跨语言模式</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    serializer:
      cross-language: true`}</CodeBlock>
              <CodeBlock lang="java">{`byte[] xlangData = ForySerializer.serializeXLang(user);
// 发送 xlangData 到 Python / Go / JavaScript 等语言的 Fory 客户端`}</CodeBlock>

              <H3>10.5 动态注册模式</H3>
              <P>关闭预注册后，类在首次序列化时自动注册：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    serializer:
      pre-register: false`}</CodeBlock>
              <P>无需 <InlineCode>@SerializableClass</InlineCode> 注解，但首次序列化会有微小的注册开销。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-fory — 高性能序列化框架，加速数据传输与存储。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/disruptor" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Disruptor</span>
                </Link>
                <Link href="/docs/reader/chronicle-map" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Chronicle Map</span>
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
