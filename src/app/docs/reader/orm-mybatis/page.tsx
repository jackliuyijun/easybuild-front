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
  { title: "ORM 数据访问", items: [{ label: "Hibernate", href: "/docs/reader/orm-hibernate" },{ label: "MyBatis", active: true },{ label: "MyBatis-Flex", href: "/docs/reader/orm-flex" },{ label: "ShardingSphere", href: "/docs/reader/orm-sharding" }]},
  { title: "数据库", items: [{ label: "Redis", href: "/docs/reader/db-redis" },{ label: "MongoDB", href: "/docs/reader/db-mongo" },{ label: "ClickHouse", href: "/docs/reader/db-clickhouse" }]},
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
  { id: "sec-3", label: "实体基类" },
  { id: "sec-4", label: "自动填充机制" },
  { id: "sec-5", label: "Repository 层" },
  { id: "sec-6", label: "SearchCondition 查询条件" },
  { id: "sec-7", label: "实战示例" },
  { id: "sec-8", label: "DTO / PO 自动转换" },
  { id: "sec-9", label: "安全防护" },
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

export default function OrmMybatisDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">MyBatis</span>
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
                easyfk-orm-mybatis MyBatis
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>MyBatis 集成 — 灵活的 SQL 映射框架</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>orm-mybatis</InlineCode> 是 EasyFK 框架中基于 MyBatis-Plus 的 ORM 组件。该模块实现了框架统一的 <InlineCode>IBaseRepository</InlineCode> 接口，提供完整的 CRUD、分页查询、条件构建、逻辑删除、自动填充、DTO/PO 自动转换、数据库类型自动识别等能力，同时集成了 MyBatis-Plus 的 <InlineCode>ServiceImpl</InlineCode> 能力，是框架默认推荐的 ORM 实现。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>orm-mybatis</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:orm-mybatis'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`mybatis-plus-spring-boot3-starter` — MyBatis-Plus Spring Boot 3 集成", "`mybatis-plus-jsqlparser` (3.5.14) — SQL 解析器", "`spring-boot-starter-jdbc` — Spring JDBC 支持"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 数据源配置</H3>
              <CodeBlock lang="yaml">{`spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver`}</CodeBlock>

              <H3>3.2 自动配置</H3>
              <P>模块无需额外开关，引入依赖后自动生效，自动完成以下配置：</P>

                            <DocTable
                headers={["分页插件", "`PaginationInnerInterceptor`，自动识别数据库类型"]}
                rows={[
                  ["自动填充", "`AutoSetValueHandler`，插入/更新时自动填充时间字段"],
                  ["逻辑删除", "`@TableLogic` 注解驱动"],
                  ["Mapper 扫描", "自动扫描 `com.mcst.**.persistence.mapper` 包"],
                  ["数据库类型", "从 DataSource JDBC URL 自动识别（MySQL/Oracle/PostgreSQL 等）"],
                ]}
              />

              <H3>3.3 MyBatis-Plus 可选配置</H3>
              <CodeBlock lang="yaml">{`mybatis-plus:
  mapper-locations: classpath*:mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # 开发环境打印 SQL
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0`}</CodeBlock>

              {/* ============== 4. 实体基类 ============== */}
              <H2 id="sec-3">4. 实体基类</H2>

              <H3>4.1 BaseMyBatisPlusEntity（完整版）</H3>
              <P>包含创建时间、更新时间和逻辑删除字段，适用于大多数业务表。</P>
              <CodeBlock lang="java">{`@Data
@TableName("t_order")
@EqualsAndHashCode(callSuper = true)
public class OrderPO extends BaseMyBatisPlusEntity<OrderPO> {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;
    private BigDecimal amount;
    private Integer status;

    // 继承字段：insertTime、lastUpdateTime、deleted
}`}</CodeBlock>

                            <DocTable
                headers={["`insertTime`", "LocalDateTime", "`@TableField(fill = FieldFill.INSERT)`", "插入时自动填充"]}
                rows={[
                  ["`deleted`", "Integer", "`@TableLogic` + `@TableField(fill = FieldFill.INSERT, select = false)`", "逻辑删除，查询时不返回"],
                ]}
              />

              <H3>4.2 BaseMyBatisPlusSimpleEntity（简化版）</H3>
              <P>不包含逻辑删除字段，适用于日志表、记录表等。</P>
              <CodeBlock lang="java">{`@Data
@TableName("t_operation_log")
@EqualsAndHashCode(callSuper = true)
public class OperationLogPO extends BaseMyBatisPlusSimpleEntity<OperationLogPO> {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String operationType;
    private String content;

    // 继承字段：insertTime、lastUpdateTime
}`}</CodeBlock>

              {/* ============== 5. 自动填充机制 ============== */}
              <H2 id="sec-4">5. 自动填充机制</H2>
              <P><InlineCode>AutoSetValueHandler</InlineCode> 实现 MyBatis-Plus 的 <InlineCode>MetaObjectHandler</InlineCode> 接口：</P>

              <H3>插入时填充</H3>

                            <DocTable
                headers={["`createTime`", "`LocalDateTime.now()`", "创建时间"]}
                rows={[
                  ["`lastUpdateTime`", "`LocalDateTime.now()`", "最后更新时间"],
                  ["`modifyTime`", "`LocalDateTime.now()`", "修改时间"],
                  ["`updateTime`", "`LocalDateTime.now()`", "更新时间"],
                  ["`version`", "`1L`", "乐观锁版本号"],
                  ["`deleted`", "`0`", "逻辑删除标志（正常）"],
                ]}
              />

              <H3>更新时填充</H3>

                            <DocTable
                headers={["`modifyTime`", "`LocalDateTime.now()`", "修改时间"]}
                rows={[
                  ["`lastUpdateTime`", "`LocalDateTime.now()`", "最后更新时间"],
                ]}
              />
              <P>&gt; 使用 MyBatis-Plus 原生 <InlineCode>fillStrategy</InlineCode>，仅当字段值为 <InlineCode>null</InlineCode> 时填充。</P>

              {/* ============== 6. Repository 层 ============== */}
              <H2 id="sec-5">6. Repository 层</H2>

              <H3>6.1 定义 Mapper</H3>
              <CodeBlock lang="java">{`public interface OrderMapper extends BaseMapper<OrderPO> {
}`}</CodeBlock>

              <H3>6.2 定义 Repository</H3>
              <CodeBlock lang="java">{`@Repository
public class OrderRepository extends BaseMyBatisRepositoryImpl<OrderMapper, OrderDTO, OrderPO, Long> {
}`}</CodeBlock>
              <P>泛型参数说明：</P>

                            <DocTable
                headers={["`M`", "`OrderMapper`", "Mapper 接口（继承 `BaseMapper`）"]}
                rows={[
                  ["`P`", "`OrderPO`", "PO 实体类型（持久层）"],
                  ["`PK`", "`Long`", "主键类型"],
                ]}
              />
              <P>&gt; <InlineCode>BaseMyBatisRepositoryImpl</InlineCode> 同时继承了 <InlineCode>ServiceImpl&lt;M, P&gt;</InlineCode>，因此也拥有 MyBatis-Plus <InlineCode>IService</InlineCode> 的所有能力（如 <InlineCode>saveBatch</InlineCode>、<InlineCode>lambdaQuery</InlineCode> 等）。</P>

              <H3>6.3 IBaseRepository 完整 API</H3>
              <H4>查询方法</H4>

                            <DocTable
                headers={["`queryById(id, selectColumns...)`", "`T`", "按主键查询（可选字段筛选）"]}
                rows={[
                  ["`queryOneByCondition(condition)`", "`T`", "按条件查询单条"],
                  ["`queryByField(field, value, selectFields...)`", "`List&lt;T&gt;`", "按字段查询列表"],
                  ["`queryOneByField(field, value, selectFields...)`", "`T`", "按字段查询单条"],
                  ["`queryByPage(condition)`", "`PageResult&lt;T&gt;`", "分页查询"],
                  ["`exists(field, value)`", "`boolean`", "按字段判断是否存在"],
                  ["`exists(condition)`", "`boolean`", "按条件判断是否存在"],
                  ["`countByCondition(condition)`", "`long`", "按条件统计数量"],
                ]}
              />
              <H4>插入方法</H4>

                            <DocTable
                headers={["`insert(param)`", "`BaseResult&lt;?&gt;`", "插入单条记录"]}
                rows={[
                  ["`insertAndReturnId(param)`", "`PK`", "插入并返回主键"],
                ]}
              />
              <H4>更新方法</H4>

                            <DocTable
                headers={["`updateBySelective(param, nullProperties...)`", "`BaseResult&lt;?&gt;`", "选择性更新（非空字段）"]}
                rows={[
                  ["`saveOrUpdateBySelective(param, nullProperties...)`", "`BaseResult&lt;?&gt;`", "有主键且存在则更新，否则插入"],
                ]}
              />
              <H4>删除方法</H4>

                            <DocTable
                headers={["`deleteById(id)`", "`BaseResult&lt;?&gt;`", "按主键删除（支持单个/逗号分隔/集合）"]}
                rows={[]}
              />

              {/* ============== 7. SearchCondition 查询条件 ============== */}
              <H2 id="sec-6">7. SearchCondition 查询条件</H2>
              <P><InlineCode>SearchCondition</InlineCode> 是框架统一的查询条件构建器：</P>

              <H3>7.1 条件类型</H3>

                            <DocTable
                headers={["等值", "`setEqualsConditions(map)`", "`field = value`"]}
                rows={[
                  ["模糊", "`setLikeConditions(map)`", "`field LIKE '%value%'`"],
                  ["IN", "`setInConditions(map)`", "`field IN (v1, v2, ...)`"],
                  ["区间", "`setRangeConditions(list)`", "`field &gt; / &gt;= / &lt; / &lt;= / BETWEEN`"],
                  ["NULL", "`setNullFields(fields)`", "`field IS NULL`"],
                  ["自定义 SQL", "`setCustomConditionSql(sql)`", "原生 SQL 条件拼接（`apply`）"],
                ]}
              />

              <H3>7.2 排序、分组、字段选择</H3>

                            <DocTable
                headers={["`setAscFields(fields)`", "升序排序字段"]}
                rows={[
                  ["`setDescFirst(true)`", "降序优先"],
                  ["`setGroupFields(fields)`", "分组字段"],
                  ["`setSelectFields(fields)`", "查询字段"],
                  ["`setChange(true)`", "是否驼峰转下划线（默认 `true`）"],
                ]}
              />

              <H3>7.3 分页</H3>

                            <DocTable
                headers={["`setPageSearch(new PageSearch(page, limit))`", "设置分页参数"]}
                rows={[
                  ["`setTop(n)`", "查询前 N 条"],
                ]}
              />

              <H3>7.4 区间条件类型（RangeConditionType）</H3>

                            <DocTable
                headers={["`GreaterThan`", "`field &gt; value`"]}
                rows={[
                  ["`LessThan`", "`field &lt; value`"],
                  ["`LessThanOrEqual`", "`field &lt;= value`"],
                  ["`Equal`", "`field = value`"],
                  ["`Between`", "`field BETWEEN start AND end`"],
                ]}
              />

              {/* ============== 8. 实战示例 ============== */}
              <H2 id="sec-7">8. 实战示例</H2>

              <H3>8.1 按主键查询</H3>
              <CodeBlock lang="java">{`@Resource
private OrderRepository orderRepository;

// 查询全部字段
OrderDTO order = orderRepository.queryById(1L);

// 查询指定字段
OrderDTO order = orderRepository.queryById(1L, "orderNo", "amount", "status");`}</CodeBlock>

              <H3>8.2 条件查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();

// 等值条件
Map<String, Object> eqMap = new HashMap<>();
eqMap.put("status", 1);
eqMap.put("userId", 100L);
condition.setEqualsConditions(eqMap);

// 模糊查询
Map<String, String> likeMap = new HashMap<>();
likeMap.put("orderNo", "ORD2024");
condition.setLikeConditions(likeMap);

// 排序
condition.setDescFields(new String[]{"insertTime"});

List<OrderDTO> orders = orderRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>8.3 区间查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();

List<RangeCondition> ranges = new ArrayList<>();
ranges.add(new RangeCondition("amount", RangeConditionType.GreaterThan, 100, null));
ranges.add(new RangeCondition("insertTime", RangeConditionType.Between, "2024-01-01", "2024-12-31"));
condition.setRangeConditions(ranges);

List<OrderDTO> orders = orderRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>8.4 IN 查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();

Map<String, List<?>> inMap = new HashMap<>();
inMap.put("status", List.of(1, 2, 3));
condition.setInConditions(inMap);

List<OrderDTO> orders = orderRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>8.5 分页查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();
condition.setPageSearch(new PageSearch(1, 20));
condition.setDescFields(new String[]{"insertTime"});

PageResult<OrderDTO> pageResult = orderRepository.queryByPage(condition);
long total = pageResult.getTotal();
List<OrderDTO> rows = pageResult.getRows();`}</CodeBlock>

              <H3>8.6 插入与更新</H3>
              <CodeBlock lang="java">{`// 插入
OrderDTO order = new OrderDTO();
order.setOrderNo("ORD_001");
order.setAmount(new BigDecimal("99.99"));
order.setStatus(0);
orderRepository.insert(order);

// 插入并返回主键
Long id = orderRepository.insertAndReturnId(order);

// 批量插入（使用 MyBatis-Plus saveBatch）
List<OrderDTO> orders = List.of(order1, order2, order3);
orderRepository.insertBatch(orders);

// 选择性更新
OrderDTO updateDTO = new OrderDTO();
updateDTO.setId(1L);
updateDTO.setStatus(2);
orderRepository.updateBySelective(updateDTO);

// 选择性更新 + 指定置空字段
orderRepository.updateBySelective(updateDTO, "remark", "memo");

// 保存或更新
orderRepository.saveOrUpdateBySelective(order);`}</CodeBlock>

              <H3>8.7 删除</H3>
              <CodeBlock lang="java">{`// 单个删除
orderRepository.deleteById(1L);

// 批量删除（逗号分隔）
orderRepository.deleteById("1,2,3");

// 批量删除（集合）
orderRepository.deleteById(List.of(1L, 2L, 3L));

// 按条件删除
SearchCondition condition = new SearchCondition();
condition.setEqualsConditions(Map.of("status", 0));
orderRepository.deleteByCondition(condition);`}</CodeBlock>

              <H3>8.8 使用 MyBatis-Plus 原生能力</H3>
              <P>由于 <InlineCode>BaseMyBatisRepositoryImpl</InlineCode> 继承了 <InlineCode>ServiceImpl</InlineCode>，可直接使用 MyBatis-Plus 的全部能力：</P>
              <CodeBlock lang="java">{`// Lambda 查询
List<OrderPO> list = orderRepository.lambdaQuery()
    .eq(OrderPO::getStatus, 1)
    .ge(OrderPO::getAmount, 100)
    .orderByDesc(OrderPO::getInsertTime)
    .list();

// Lambda 更新
orderRepository.lambdaUpdate()
    .set(OrderPO::getStatus, 2)
    .eq(OrderPO::getId, 1L)
    .update();

// 批量保存（分批提交）
orderRepository.saveBatch(poList, 500);`}</CodeBlock>

              {/* ============== 9. DTO / PO 自动转换 ============== */}
              <H2 id="sec-8">9. DTO / PO 自动转换</H2>
              <P><InlineCode>BaseMyBatisRepositoryImpl</InlineCode> 内部自动完成 DTO 和 PO 之间的转换：</P>
              <BulletList items={["**查询**：PO → DTO（通过 `TransformUtil.transformObj`）", "**插入/更新**：DTO → PO（通过 `TransformUtil.transformObj`）", "**列表转换**：`TransformUtil.transformList`"]} />

              {/* ============== 10. 安全防护 ============== */}
              <H2 id="sec-9">10. 安全防护</H2>

              <H3>防全表操作</H3>
              <P><InlineCode>BlockAttackInnerInterceptor</InlineCode> 拦截器自动阻止以下危险操作：</P>
              <BulletList items={["全表更新（`UPDATE` 无 `WHERE` 条件）", "全表删除（`DELETE` 无 `WHERE` 条件）"]} />

              <H3>数据库类型自动识别</H3>
              <P><InlineCode>MybatisPlusConfigure</InlineCode> 通过 DataSource 的 JDBC URL 自动识别数据库类型，无需手动配置分页方言：</P>
              <BulletList items={["MySQL → `DbType.MYSQL`", "Oracle → `DbType.ORACLE`", "PostgreSQL → `DbType.POSTGRE_SQL`", "识别失败时默认使用 `DbType.MYSQL`"]} />

              {/* ============== 11. 包结构 ============== */}
              <H2 id="sec-10">11. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.service.mybatisplus
├── ApplicationStarter.java                    # 启动入口（集成 Mapper 扫描）
├── MybatisPlusServiceScanner.java             # Mapper 包扫描配置
├── annotation
│   └── Column.java                            # 字段注解
├── config
│   └── MybatisPlusConfigure.java              # 自动配置（分页/防攻击/填充/数据库类型识别）
├── handler
│   └── AutoSetValueHandler.java               # MetaObjectHandler 自动填充
├── impl
│   └── BaseMyBatisRepositoryImpl.java         # IBaseRepository + ServiceImpl 实现
├── persistence
│   ├── BaseMyBatisPlusEntity.java             # 实体基类（完整版：时间 + 逻辑删除）
│   └── BaseMyBatisPlusSimpleEntity.java       # 实体基类（简化版：仅时间）
└── util
    ├── EqualConditionUtil.java                # 等值条件构建
    ├── InConditionUtil.java                   # IN 条件构建
    ├── LikeConditionUtil.java                 # 模糊查询条件构建
    ├── MyBatisPlusWrapperUtil.java            # QueryWrapper 核心构建器
    ├── MybatisPlusUtil.java                   # 通用工具（ID 查询/删除/分页/保存更新）
    ├── NullConditionUtil.java                 # NULL 条件构建
    └── RangeConditionUtil.java                # 区间条件构建`}</CodeBlock>

              {/* ============== 12. 最佳实践 ============== */}
              <H2 id="sec-11">12. 最佳实践</H2>
              <P>1. <Strong>实体基类选择</Strong>：有逻辑删除需求用 <InlineCode>BaseMyBatisPlusEntity</InlineCode>，无需逻辑删除用 <InlineCode>BaseMyBatisPlusSimpleEntity</InlineCode>。</P>
              <P>2. <Strong>DTO 与 PO 分离</Strong>：PO 对应数据库表结构，DTO 对外暴露，Repository 自动完成转换。</P>
              <P>3. <Strong>字段命名</Strong>：Java 层使用驼峰命名，框架自动转换为下划线列名。</P>
              <P>4. <Strong>选择性更新</Strong>：<InlineCode>updateBySelective</InlineCode> 仅更新非空字段；需要置空时通过 <InlineCode>nullProperties</InlineCode> 参数指定。</P>
              <P>5. <Strong>分页默认值</Strong>：未设置分页参数时，默认查询第 1 页、每页 10 条。</P>
              <P>6. <Strong>默认排序</Strong>：未设置排序条件时，如果实体包含 <InlineCode>insertTime</InlineCode> 字段，自动按 <InlineCode>insert_time DESC</InlineCode> 排序。</P>
              <P>7. <Strong>条件优先级</Strong>：同一字段同时出现在多种条件中时，等值条件自动让位，避免冲突。</P>
              <P>8. <Strong>批量操作</Strong>：<InlineCode>insertBatch</InlineCode> 使用 MyBatis-Plus 的 <InlineCode>saveBatch</InlineCode>，支持分批提交。</P>
              <P>9. <Strong>与 orm-flex 迁移</Strong>：<InlineCode>IBaseRepository</InlineCode> 接口完全一致，迁移只需更换 Repository 基类和实体注解。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-orm-mybatis — 灵活高效的 SQL 映射数据访问层。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/orm-hibernate" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Hibernate</span>
                </Link>
                <Link href="/docs/reader/orm-flex" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">MyBatis-Flex</span>
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
