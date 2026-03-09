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
  { title: "数据库", items: [{ label: "Redis", href: "/docs/reader/db-redis" },{ label: "MongoDB", active: true },{ label: "ClickHouse", href: "/docs/reader/db-clickhouse" }]},
  { title: "缓存与ID", items: [{ label: "Caffeine 缓存", href: "/docs/reader/cache-caffeine" },{ label: "Redis 自增ID", href: "/docs/reader/autoid-redis" }]},
  { title: "消息队列", items: [{ label: "RocketMQ", href: "/docs/reader/mq-rocket" },{ label: "RabbitMQ", href: "/docs/reader/mq-rabbit" },{ label: "Kafka", href: "/docs/reader/mq-kafka" }]},
  { title: "RPC 远程调用", items: [{ label: "Dubbo", href: "/docs/reader/rpc-dubbo" },{ label: "Spring Cloud", href: "/docs/reader/rpc-cloud" }]},
  { title: "分布式", items: [{ label: "Redisson 分布式锁", href: "/docs/reader/lock-redisson" }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "架构层次" },
  { id: "sec-4", label: "实体层" },
  { id: "sec-5", label: "DAO 层" },
  { id: "sec-6", label: "Repository 层" },
  { id: "sec-7", label: "查询条件构建" },
  { id: "sec-8", label: "实战示例" },
  { id: "sec-9", label: "自动配置机制" },
  { id: "sec-10", label: "包结构" },
  { id: "sec-11", label: "最佳实践" },
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

export default function DbMongoDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">MongoDB</span>
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
                easyfk-db-mongo MongoDB
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>MongoDB — 文档型 NoSQL 数据库</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>db-mongo</InlineCode> 是 EasyFK 框架中面向 MongoDB 文档数据库的数据访问组件。该模块基于 Spring Data MongoDB，采用 Entity → DAO → Repository 分层架构，提供智能 ID 管理、自动审计、泛型 CRUD、灵活条件查询构建以及 DTO/实体自动转换能力，适用于内容管理、用户画像、日志存储、电商商品等文档型数据场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>db-mongo</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:db-mongo'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`spring-boot-starter-data-mongodb` — Spring Data MongoDB 数据访问支持", "`easyfk-core` — EasyFK 框架核心工具类和 DTO", "`easyfk-repository` — EasyFK 通用 Repository 接口定义", "`service-base` — EasyFK 服务基础模块"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 MongoDB 连接配置</H3>
              <P>在 <InlineCode>application.yml</InlineCode> 中配置 MongoDB 连接信息：</P>
              <CodeBlock lang="yaml">{`spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/easyfk`}</CodeBlock>
              <P>或分别配置各项参数：</P>
              <CodeBlock lang="yaml">{`spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: easyfk
      username: your_username
      password: your_password`}</CodeBlock>

              <H3>3.2 连接池配置</H3>
              <P>通过 URI 参数配置连接池：</P>
              <CodeBlock lang="yaml">{`spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/easyfk?maxPoolSize=50&minPoolSize=10&maxIdleTimeMS=60000`}</CodeBlock>

              <H3>3.3 自动配置</H3>
              <P>模块通过 <InlineCode>MongoAutoConfig</InlineCode> 自动完成以下配置：</P>

                            <DocTable
                headers={["MongoDB 审计", "自动启用 `@EnableMongoAuditing`，支持 `@CreatedDate` 和 `@LastModifiedDate`"]}
                rows={[
                  ["激活条件", "当 classpath 中存在 `MongoTemplate` 时自动激活"],
                ]}
              />

              {/* ============== 4. 架构层次 ============== */}
              <H2 id="sec-3">4. 架构层次</H2>
              <P>模块采用三层架构，职责清晰：</P>
              <CodeBlock lang="plaintext">{`┌────────────────────────────────────────────────┐
│                  Service 层                     │
│          注入 Repository，调用业务方法            │
└──────────────────────┬─────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────┐
│         Repository 层 (BaseMongoRepositoryImpl) │
│     DTO ↔ Entity 自动转换 · 实现 IBaseRepository │
└──────────────────────┬─────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────┐
│           DAO 层 (BaseSpringMongoDAO)           │
│         CRUD 操作 · MongoTemplate 封装          │
└──────────────────────┬─────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────┐
│          Entity 层 (BaseMongoEntity)            │
│       智能 ID · 自动审计 · 序列化支持             │
└────────────────────────────────────────────────┘`}</CodeBlock>

              {/* ============== 5. 实体层 ============== */}
              <H2 id="sec-4">5. 实体层</H2>

              <H3>5.1 BaseMongoEntity 基类</H3>
              <P>所有 MongoDB 实体类需继承 <InlineCode>BaseMongoEntity</InlineCode>，自动获得以下能力：</P>

                            <DocTable
                headers={["`objectId`", "`ObjectId`", "`@Id`", "MongoDB 主键（`_id`），持久化存储"]}
                rows={[
                  ["`createdAt`", "`LocalDateTime`", "`@CreatedDate`", "创建时间，插入时自动设置"],
                  ["`updatedAt`", "`LocalDateTime`", "`@LastModifiedDate`", "更新时间，插入和更新时自动设置"],
                ]}
              />
              <P><Strong>智能 ID 转换机制：</Strong></P>
              <BulletList items={["调用 `setId(String)` 时，同时设置 `objectId` 和 `id`", "调用 `getId()` 时，若 `id` 为空但 `objectId` 存在，自动从 `objectId` 转换", "调用 `setObjectId(ObjectId)` 时，同时更新 `id`"]} />

              <H3>5.2 定义实体类</H3>
              <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Document(collection = "products")
public class Product extends BaseMongoEntity {

    @Indexed(unique = true)
    private String productCode;

    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private String status;
}`}</CodeBlock>
              <P>&gt; 无需声明 <InlineCode>id</InlineCode>、<InlineCode>objectId</InlineCode>、<InlineCode>createdAt</InlineCode>、<InlineCode>updatedAt</InlineCode> 字段，均从基类继承。建议使用 <InlineCode>@Document</InlineCode> 指定集合名，<InlineCode>@Indexed</InlineCode> 标记索引字段。</P>

              {/* ============== 6. DAO 层 ============== */}
              <H2 id="sec-5">6. DAO 层</H2>

              <H3>6.1 创建 DAO</H3>
              <P>继承 <InlineCode>BaseSpringMongoDAO&lt;T&gt;</InlineCode>，即可获得全部 CRUD 能力：</P>
              <CodeBlock lang="java">{`@Repository
public class ProductDAO extends BaseSpringMongoDAO<Product> {

    // 可在此添加自定义查询方法
}`}</CodeBlock>

              <H3>6.2 API 参考</H3>
              <H4>插入操作</H4>

                            <DocTable
                headers={["`insert(entity)`", "实体对象", "void", "插入单条记录"]}
                rows={[
                  ["`insertAndReturnId(entity)`", "实体对象", "`String`", "插入并返回字符串形式 ID"],
                  ["`saveOrUpdate(entity)`", "实体对象", "void", "存在则更新，不存在则插入"],
                ]}
              />
              <H4>删除操作</H4>

                            <DocTable
                headers={["`deleteById(id)`", "主键", "`DeleteResult`", "按 ID 删除"]}
                rows={[
                  ["`deleteByQuery(query)`", "`Query`", "`DeleteResult`", "按 Query 对象删除"],
                  ["`delete(entity)`", "实体对象", "`DeleteResult`", "按实体删除"],
                ]}
              />
              <H4>查询操作</H4>

                            <DocTable
                headers={["`findById(id, selectColumns...)`", "主键, 可选字段", "`T`", "按 ID 查询（支持字段选择）"]}
                rows={[
                  ["`findOne(valueMap)`", "`Map&lt;String, Object&gt;`", "`T`", "按多字段匹配查询一条"],
                  ["`findOne(query)`", "`Query`", "`T`", "按 Query 对象查询一条"],
                  ["`findOneByEntity(example)`", "示例实体", "`T`", "按示例实体查询一条（非空字段匹配）"],
                  ["`findByField(field, value)`", "字段名, 值", "`List&lt;T&gt;`", "按单字段查询列表"],
                  ["`findByField(valueMap)`", "`Map&lt;String, Object&gt;`", "`List&lt;T&gt;`", "按多字段匹配查询列表"],
                  ["`findByEntity(example)`", "示例实体", "`List&lt;T&gt;`", "按示例实体查询列表"],
                  ["`findByCondition(condition)`", "`SearchCondition`", "`List&lt;T&gt;`", "按条件查询列表"],
                  ["`findOneByCondition(condition)`", "`SearchCondition`", "`T`", "按条件查询单条"],
                  ["`findByPage(condition)`", "`SearchCondition`", "`PageResult&lt;T&gt;`", "分页查询（含总数）"],
                  ["`findAll()`", "—", "`List&lt;T&gt;`", "查询全部记录"],
                ]}
              />
              <H4>更新操作</H4>

                            <DocTable
                headers={["`updateEntity(entity)`", "实体对象", "`UpdateResult`", "**全量更新**：null 字段会被 unset"]}
                rows={[
                  ["`updateEntityByCondition(entity, condition)`", "实体对象, 查询条件", "`UpdateResult`", "**条件批量更新**：批量写入非空字段"],
                  ["`updateFirst(entity, condition)`", "实体对象, 查询条件", "`UpdateResult`", "条件更新第一条匹配记录"],
                  ["`atomicIncrement(condition, field, value)`", "查询条件, 字段名, 增量值", "`T`", "原子递增字段值，返回更新后实体"],
                ]}
              />
              <P>&gt; <Strong>更新语义说明：</Strong></P>
              <P>&gt; - <InlineCode>updateEntity</InlineCode>：全量覆盖，未赋值字段会被 <InlineCode>unset</InlineCode>，适合完全同步实体的场景</P>
              <P>&gt; - <InlineCode>updateEntitySelective</InlineCode>：增量更新，只 <InlineCode>set</InlineCode> 非空字段；若需要清空字段，在 <InlineCode>nullProperties</InlineCode> 中显式声明</P>
              <P>&gt; - <InlineCode>updateEntityByCondition</InlineCode>：条件增量更新，批量写入非空字段，自动刷新 <InlineCode>updatedAt</InlineCode></P>
              <P>&gt; - 所有更新操作会自动设置 <InlineCode>updatedAt</InlineCode> 为当前时间</P>
              <H4>统计操作</H4>

                            <DocTable
                headers={["`count()`", "—", "`long`", "统计全部记录数"]}
                rows={[
                  ["`count(query)`", "`Query`", "`long`", "按 Query 统计"],
                  ["`count(condition)`", "`SearchCondition`", "`long`", "按条件统计"],
                  ["`countByEntity(entity)`", "示例实体", "`long`", "按示例实体统计"],
                  ["`countByCondition(condition)`", "`SearchCondition`", "`long`", "按条件统计"],
                  ["`exists(field, value)`", "字段名, 值", "`boolean`", "判断字段值是否存在"],
                  ["`exists(condition)`", "`SearchCondition`", "`boolean`", "按条件判断是否存在"],
                  ["`exists(query)`", "`Query`", "`boolean`", "按 Query 判断是否存在"],
                  ["`exists(example)`", "示例实体", "`boolean`", "按示例实体判断是否存在"],
                ]}
              />

              {/* ============== 7. Repository 层 ============== */}
              <H2 id="sec-6">7. Repository 层</H2>

              <H3>7.1 创建 Repository</H3>
              <P><InlineCode>BaseMongoRepositoryImpl</InlineCode> 负责 DTO 与 Entity 之间的自动转换，面向 Service 层提供统一接口：</P>
              <CodeBlock lang="java">{`@Repository
public class ProductRepository
        extends BaseMongoRepositoryImpl<ProductDAO, ProductDTO, Product, String> {

    // 可在此添加自定义业务查询方法
}`}</CodeBlock>
              <P><Strong>泛型参数说明：</Strong></P>

                            <DocTable
                headers={["`D`", "DAO 类型", "`ProductDAO`"]}
                rows={[
                  ["`P`", "Entity 类型（数据层使用）", "`Product`"],
                  ["`PK`", "主键类型", "`String`"],
                ]}
              />

              <H3>7.2 API 参考</H3>

                            <DocTable
                headers={["`queryById(id, selectColumns...)`", "主键, 可选字段", "`T` (DTO)", "按 ID 查询"]}
                rows={[
                  ["`queryOneByCondition(condition)`", "`SearchCondition`", "`T`", "条件查询单条"],
                  ["`queryOneByField(field, value, selectFields...)`", "字段名, 值, 可选字段", "`T`", "按字段查询单条"],
                  ["`queryByField(field, value, selectFields...)`", "字段名, 值, 可选字段", "`List&lt;T&gt;`", "按字段查询列表"],
                  ["`queryByPage(condition)`", "`SearchCondition`", "`PageResult&lt;T&gt;`", "分页查询"],
                  ["`insert(param)`", "DTO 对象", "`BaseResult&lt;?&gt;`", "插入"],
                  ["`insertAndReturnId(param)`", "DTO 对象", "`PK`", "插入并返回 ID"],
                  ["`insertBatch(data)`", "DTO 列表", "`BaseResult&lt;?&gt;`", "批量插入"],
                  ["`deleteById(id)`", "主键", "`BaseResult&lt;?&gt;`", "按 ID 删除"],
                  ["`deleteByCondition(condition)`", "`SearchCondition`", "`BaseResult&lt;?&gt;`", "条件删除"],
                  ["`updateBySelective(param, nullProps...)`", "DTO 对象, 需清空字段名", "`BaseResult&lt;?&gt;`", "增量更新"],
                  ["`updateEntityByCondition(param, condition)`", "DTO 对象, 查询条件", "`BaseResult&lt;?&gt;`", "条件批量更新"],
                  ["`saveOrUpdateBySelective(param, nullProps...)`", "DTO 对象, 需清空字段名", "`BaseResult&lt;?&gt;`", "有 ID 则更新，无 ID 则插入"],
                  ["`exists(field, value)`", "字段名, 值", "`boolean`", "存在性检查"],
                  ["`exists(condition)`", "`SearchCondition`", "`boolean`", "条件存在性检查"],
                  ["`countByCondition(condition)`", "`SearchCondition`", "`long`", "条件统计"],
                ]}
              />

              {/* ============== 8. 查询条件构建 ============== */}
              <H2 id="sec-7">8. 查询条件构建</H2>

              <H3>8.1 使用 SCBuilder</H3>
              <P>通过 <InlineCode>SCBuilder</InlineCode> 构建 <InlineCode>SearchCondition</InlineCode>，<InlineCode>MongoConditionBuilder</InlineCode> 会自动转换为 MongoDB <InlineCode>Query</InlineCode>：</P>
              <CodeBlock lang="java">{`SearchCondition condition = SCBuilder.builder()
    .equalsConditions("category", "electronics")
    .likeConditions("name", ".*iPhone.*")
    .rangeConditions(new RangeCondition("price", 500.0, null, RangeConditionType.GreaterThan))
    .descFields("createdAt")
    .pageSearch(new PageSearch(1, 20))
    .build();`}</CodeBlock>

              <H3>8.2 支持的查询条件类型</H3>

                            <DocTable
                headers={["精确匹配", "`equalsConditions(key, value)`", "字段等于指定值"]}
                rows={[
                  ["模糊匹配", "`likeConditions(key, pattern)`", "正则表达式匹配"],
                  ["IN 查询", "`inConditions(key, values)`", "字段值在列表中"],
                  ["范围查询", "`rangeConditions(RangeCondition...)`", "大于/大于等于/小于/小于等于/Between"],
                  ["升序排序", "`ascFields(fields...)`", "升序排序字段"],
                  ["降序排序", "`descFields(fields...)`", "降序排序字段"],
                  ["分页", "`pageSearch(PageSearch)`", "分页参数"],
                  ["字段选择", "`selectFields(fields...)`", "只查询指定字段"],
                  ["限制数量", "`top(count)`", "限制返回记录数"],
                ]}
              />

              <H3>8.3 RangeCondition 范围条件类型</H3>

                            <DocTable
                headers={["`GreaterThan`", "大于 (`&gt;`)", '`new RangeCondition("price", 100.0, null, RangeConditionType.GreaterThan)`']}
                rows={[
                  ["`LessThan`", "小于 (`&lt;`)", '`new RangeCondition("age", 18, null, RangeConditionType.LessThan)`'],
                  ["`LessThanOrEqual`", "小于等于 (`&lt;=`)", '`new RangeCondition("discount", 90, null, RangeConditionType.LessThanOrEqual)`'],
                  ["`Equal`", "等于 (`=`)", '`new RangeCondition("level", 5, null, RangeConditionType.Equal)`'],
                  ["`Between`", "介于之间 (`&gt;= AND &lt;=`)", '`new RangeCondition("price", 100.0, 1000.0, RangeConditionType.Between)`'],
                ]}
              />
              <P>&gt; <InlineCode>Between</InlineCode> 类型：只提供 <InlineCode>startValue</InlineCode> 等价于 <InlineCode>&gt;=</InlineCode>，只提供 <InlineCode>endValue</InlineCode> 等价于 <InlineCode>&lt;=</InlineCode>。</P>

              <H3>8.4 默认排序</H3>
              <P>如果实体类包含 <InlineCode>createdAt</InlineCode> 字段且未指定排序条件，查询会自动按 <InlineCode>createdAt</InlineCode> 降序排列。</P>

              {/* ============== 9. 实战示例 ============== */}
              <H2 id="sec-8">9. 实战示例</H2>

              <H3>9.1 DTO 定义</H3>
              <CodeBlock lang="java">{`@Data
public class ProductDTO implements Serializable {
    private String id;
    private String productCode;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}`}</CodeBlock>

              <H3>9.2 单条插入与返回 ID</H3>
              <CodeBlock lang="java">{`ProductDTO dto = new ProductDTO();
dto.setProductCode("PROD-001");
dto.setName("iPhone 15");
dto.setPrice(new BigDecimal("7999.00"));
dto.setStock(100);

String id = productRepository.insertAndReturnId(dto);`}</CodeBlock>

              <H3>9.3 批量插入</H3>
              <CodeBlock lang="java">{`List<ProductDTO> products = new ArrayList<>();
for (int i = 0; i < 5000; i++) {
    ProductDTO dto = new ProductDTO();
    dto.setName("Product " + i);
    dto.setPrice(BigDecimal.valueOf(100 + i));
    products.add(dto);
}
// 自动分批，每批 1000 条
productRepository.insertBatch(products);`}</CodeBlock>

              <H3>9.4 条件查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = SCBuilder.builder()
    .equalsConditions("category", "electronics")
    .equalsConditions("status", "ACTIVE")
    .rangeConditions(new RangeCondition("price", 100.0, 1000.0, RangeConditionType.Between))
    .descFields("createdAt")
    .build();

List<ProductDTO> products = productRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>9.5 分页查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = SCBuilder.builder()
    .equalsConditions("category", "electronics")
    .descFields("createdAt")
    .pageSearch(new PageSearch(1, 20))
    .build();

PageResult<ProductDTO> page = productRepository.queryByPage(condition);
// page.getRows()  — 当前页数据
// page.getTotal() — 总记录数`}</CodeBlock>

              <H3>9.6 模糊查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = SCBuilder.builder()
    .likeConditions("name", ".*iPhone.*")
    .build();

List<ProductDTO> products = productRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>9.7 字段选择查询</H3>
              <CodeBlock lang="java">{`// 方式一：Repository 层直接指定
ProductDTO product = productRepository.queryById(id, "name", "price", "stock");

// 方式二：通过 SearchCondition 指定
SearchCondition condition = SCBuilder.builder()
    .equalsConditions("category", "electronics")
    .selectFields("name", "price", "stock")
    .build();
List<ProductDTO> products = productRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>9.8 增量更新</H3>
              <CodeBlock lang="java">{`ProductDTO update = new ProductDTO();
update.setId(productId);
update.setPrice(new BigDecimal("6999.00"));
update.setStock(50);

// 仅更新 price 和 stock 字段
productRepository.updateBySelective(update);

// 更新 price 和 stock，同时清空 description 和 remark 字段
productRepository.updateBySelective(update, "description", "remark");`}</CodeBlock>

              <H3>9.9 条件批量更新</H3>
              <CodeBlock lang="java">{`ProductDTO template = new ProductDTO();
template.setStatus("INACTIVE");

SearchCondition condition = SCBuilder.builder()
    .rangeConditions(new RangeCondition("stock", null, 0, RangeConditionType.LessThanOrEqual))
    .build();

productRepository.updateEntityByCondition(template, condition);`}</CodeBlock>

              <H3>9.10 保存或更新</H3>
              <CodeBlock lang="java">{`ProductDTO dto = new ProductDTO();
dto.setId(existingId);       // 有 ID → 更新
dto.setName("Updated Name");
productRepository.saveOrUpdateBySelective(dto);

ProductDTO newDto = new ProductDTO();  // 无 ID → 插入
newDto.setName("New Product");
productRepository.saveOrUpdateBySelective(newDto);`}</CodeBlock>

              <H3>9.11 原子递增</H3>
              <CodeBlock lang="java">{`SearchCondition condition = SCBuilder.builder()
    .equalsConditions("productCode", "PROD-001")
    .build();

// stock 字段原子减 1，返回更新后的实体
Product updated = productDAO.atomicIncrement(condition, "stock", -1);`}</CodeBlock>

              <H3>9.12 基于示例的查询</H3>
              <CodeBlock lang="java">{`Product example = new Product();
example.setCategory("electronics");
example.setStatus("ACTIVE");

// 查询所有 category=electronics 且 status=ACTIVE 的记录
List<Product> products = productDAO.findByEntity(example);

// 检查是否存在
boolean exists = productDAO.exists(example);`}</CodeBlock>

              <H3>9.13 条件删除</H3>
              <CodeBlock lang="java">{`// 按 ID 删除
productRepository.deleteById(productId);

// 按条件删除
SearchCondition condition = SCBuilder.builder()
    .equalsConditions("status", "DISCONTINUED")
    .build();
productRepository.deleteByCondition(condition);`}</CodeBlock>

              <H3>9.14 Service 层完整示例</H3>
              <CodeBlock lang="java">{`@Service
public class ProductService {

    @Resource
    private ProductRepository productRepository;

    public BaseResult<?> createProduct(ProductDTO dto) {
        return productRepository.insert(dto);
    }

    public PageResult<ProductDTO> searchProducts(String keyword, String category,
                                                  BigDecimal minPrice, BigDecimal maxPrice,
                                                  int page, int size) {
        SCBuilder builder = SCBuilder.builder();
        if (EmptyUtil.isNotEmpty(keyword)) {
            builder.likeConditions("name", ".*" + keyword + ".*");
        }
        if (EmptyUtil.isNotEmpty(category)) {
            builder.equalsConditions("category", category);
        }
        if (minPrice != null || maxPrice != null) {
            builder.rangeConditions(
                new RangeCondition("price", minPrice, maxPrice, RangeConditionType.Between));
        }
        SearchCondition condition = builder
            .equalsConditions("status", "ACTIVE")
            .descFields("createdAt")
            .pageSearch(new PageSearch(page, size))
            .build();

        return productRepository.queryByPage(condition);
    }
}`}</CodeBlock>

              {/* ============== 10. 自动配置机制 ============== */}
              <H2 id="sec-9">10. 自动配置机制</H2>

              
              <BulletList items={["通过 Spring Boot `AutoConfiguration.imports` 声明自动配置入口", "当 classpath 中存在 `MongoTemplate` 时自动激活", "自动启用 `@EnableMongoAuditing`，无需手动配置", "配置 `DateTimeProvider`，审计时间使用 `LocalDateTime.now()`", "可通过自定义 `mongoAuditingDateTimeProvider` Bean 覆盖默认时间提供器"]} />

              {/* ============== 11. 包结构 ============== */}
              <H2 id="sec-10">11. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.db.mongo
├── config
│   └── MongoAutoConfig.java              # Spring Boot 自动配置类
├── dao
│   └── BaseSpringMongoDAO.java           # 通用 DAO 基类
├── entities
│   └── BaseMongoEntity.java              # 实体基类（ID 管理 + 审计字段）
├── repository
│   └── BaseMongoRepositoryImpl.java      # 通用 Repository 实现（DTO/Entity 转换）
└── util
    └── MongoConditionBuilder.java        # 查询条件构建器（SearchCondition → Query）`}</CodeBlock>

              {/* ============== 12. 最佳实践 ============== */}
              <H2 id="sec-11">12. 最佳实践</H2>
              <P>1. <Strong>实体类设计</Strong>：继承 <InlineCode>BaseMongoEntity</InlineCode> 即可，无需声明 ID 和审计字段。使用 <InlineCode>@Document</InlineCode> 指定集合名，<InlineCode>@Indexed</InlineCode> 标记索引字段。</P>
              <P>2. <Strong>分层使用</Strong>：Service 层注入 Repository（操作 DTO），仅在需要底层操作时直接注入 DAO。</P>
              <P>3. <Strong>增量更新优先</Strong>：使用 <InlineCode>updateEntitySelective</InlineCode> / <InlineCode>updateBySelective</InlineCode> 而非 <InlineCode>updateEntity</InlineCode>，避免意外清空字段。</P>
              <P>4. <Strong>字段选择查询</Strong>：不需要完整对象时，使用 <InlineCode>selectFields</InlineCode> 减少网络传输和内存占用。</P>
              <P>5. <Strong>批量操作</Strong>：大量数据写入使用 <InlineCode>insertBatch()</InlineCode>（自动分批），批量修改使用 <InlineCode>updateEntityByCondition()</InlineCode>。</P>
              <P>6. <Strong>分页查询</Strong>：大数据集避免 <InlineCode>findAll()</InlineCode>，使用 <InlineCode>findByPage()</InlineCode> / <InlineCode>queryByPage()</InlineCode> 分页查询。</P>
              <P>7. <Strong>索引优化</Strong>：为常用查询字段添加 <InlineCode>@Indexed</InlineCode>，为复合查询使用 <InlineCode>@CompoundIndex</InlineCode>。</P>
              <P>8. <Strong>模糊查询转义</Strong>：<InlineCode>likeConditions</InlineCode> 使用正则表达式，注意转义特殊字符（如 <InlineCode>.</InlineCode>、<InlineCode>*</InlineCode>、<InlineCode>(</InlineCode>）。</P>
              <P>9. <Strong>事务支持</Strong>：MongoDB 4.0+ 副本集环境下，可使用 Spring <InlineCode>@Transactional</InlineCode> 实现多文档事务。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-db-mongo — 文档型 NoSQL 数据库集成方案。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/db-redis" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Redis</span>
                </Link>
                <Link href="/docs/reader/db-clickhouse" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">ClickHouse</span>
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
