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
  { title: "ORM 数据访问", items: [{ label: "Hibernate", href: "/docs/reader/orm-hibernate" },{ label: "MyBatis", href: "/docs/reader/orm-mybatis" },{ label: "MyBatis-Flex", href: "/docs/reader/orm-flex" },{ label: "ShardingSphere", active: true }]},
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
  { id: "sec-2", label: "工作原理" },
  { id: "sec-3", label: "配置说明" },
  { id: "sec-4", label: "常用分片算法" },
  { id: "sec-5", label: "主键生成策略" },
  { id: "sec-6", label: "与 ORM 组件配合使用" },
  { id: "sec-7", label: "常用属性配置" },
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

export default function OrmShardingDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">ShardingSphere</span>
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
                easyfk-orm-sharding ShardingSphere
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>ShardingSphere — 分库分表与读写分离</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>orm-sharding</InlineCode> 是 EasyFK 框架中基于 Apache ShardingSphere JDBC 的分库分表组件。该模块作为依赖传递层，将 ShardingSphere JDBC Spring Boot Starter 集成到框架体系中，配合 <InlineCode>orm-mybatis</InlineCode> 或 <InlineCode>orm-flex</InlineCode> 使用，为应用提供<Strong>透明化的分库分表、读写分离、数据加密和分布式事务</Strong>能力，业务代码无需任何改动。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>orm-sharding</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:orm-sharding'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`shardingsphere-jdbc-core-spring-boot-starter` — Apache ShardingSphere JDBC 核心"]} />
              <P>&gt; <Strong>注意</Strong>：<InlineCode>orm-sharding</InlineCode> 通常与 <InlineCode>orm-mybatis</InlineCode> 或 <InlineCode>orm-flex</InlineCode> 配合使用，需同时引入 ORM 组件。</P>

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-2">3. 工作原理</H2>
              <P>ShardingSphere JDBC 作为 JDBC 增强驱动，工作在应用层与数据库之间：</P>
              <CodeBlock lang="plaintext">{`应用代码 → MyBatis-Plus / MyBatis-Flex → ShardingSphere JDBC → 实际数据源`}</CodeBlock>
              <BulletList items={["对上层应用完全透明，无需修改 SQL 或业务代码", "通过 YAML 配置即可实现分库分表、读写分离等能力", "与框架的 `BaseMyBatisRepositoryImpl` / `BaseFlexRepositoryImpl` 无缝兼容"]} />

              {/* ============== 4. 配置说明 ============== */}
              <H2 id="sec-3">4. 配置说明</H2>

              <H3>4.1 分库分表配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    mode:
      type: Standalone
      repository:
        type: JDBC
    datasource:
      names: ds0,ds1
      ds0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.100:3306/db_order_0
        username: root
        password: root
      ds1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.101:3306/db_order_1
        username: root
        password: root
    rules:
      sharding:
        tables:
          t_order:
            actual-data-nodes: ds$->{0..1}.t_order_$->{0..3}
            database-strategy:
              standard:
                sharding-column: user_id
                sharding-algorithm-name: db-hash-mod
            table-strategy:
              standard:
                sharding-column: order_id
                sharding-algorithm-name: table-hash-mod
            key-generate-strategy:
              column: order_id
              key-generator-name: snowflake
        sharding-algorithms:
          db-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 2
          table-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 4
        key-generators:
          snowflake:
            type: SNOWFLAKE
    props:
      sql-show: true  # 开发环境显示路由后的 SQL`}</CodeBlock>

              <H3>4.2 读写分离配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    datasource:
      names: master,slave0,slave1
      master:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.100:3306/mydb
        username: root
        password: root
      slave0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.101:3306/mydb
        username: root
        password: root
      slave1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.102:3306/mydb
        username: root
        password: root
    rules:
      readwrite-splitting:
        data-sources:
          readwrite_ds:
            write-data-source-name: master
            read-data-source-names:
              - slave0
              - slave1
            load-balancer-name: round-robin
        load-balancers:
          round-robin:
            type: ROUND_ROBIN`}</CodeBlock>

              <H3>4.3 分库分表 + 读写分离组合配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    datasource:
      names: master0,master1,slave0_0,slave0_1,slave1_0,slave1_1
      # ... 数据源配置省略
    rules:
      sharding:
        tables:
          t_order:
            actual-data-nodes: readwrite_ds_$->{0..1}.t_order_$->{0..3}
            database-strategy:
              standard:
                sharding-column: user_id
                sharding-algorithm-name: db-hash-mod
            table-strategy:
              standard:
                sharding-column: order_id
                sharding-algorithm-name: table-hash-mod
        sharding-algorithms:
          db-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 2
          table-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 4
      readwrite-splitting:
        data-sources:
          readwrite_ds_0:
            write-data-source-name: master0
            read-data-source-names: [slave0_0, slave0_1]
            load-balancer-name: round-robin
          readwrite_ds_1:
            write-data-source-name: master1
            read-data-source-names: [slave1_0, slave1_1]
            load-balancer-name: round-robin
        load-balancers:
          round-robin:
            type: ROUND_ROBIN`}</CodeBlock>

              <H3>4.4 数据加密配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    rules:
      encrypt:
        tables:
          t_user:
            columns:
              phone:
                cipher-column: phone_cipher
                encryptor-name: aes-encryptor
              id_card:
                cipher-column: id_card_cipher
                encryptor-name: aes-encryptor
        encryptors:
          aes-encryptor:
            type: AES
            props:
              aes-key-value: my-secret-key-1234`}</CodeBlock>

              {/* ============== 5. 常用分片算法 ============== */}
              <H2 id="sec-4">5. 常用分片算法</H2>

                            <DocTable
                headers={["`HASH_MOD`", "哈希取模", "均匀分布，推荐"]}
                rows={[
                  ["`VOLUME_RANGE`", "基于容量的范围分片", "按数据量分片"],
                  ["`BOUNDARY_RANGE`", "基于边界的范围分片", "按 ID 范围分片"],
                  ["`AUTO_INTERVAL`", "自动间隔分片", "按时间分片"],
                  ["`INLINE`", "行表达式", "灵活自定义"],
                ]}
              />

              <H3>行表达式示例</H3>
              <CodeBlock lang="yaml">{`sharding-algorithms:
  inline-order:
    type: INLINE
    props:
      algorithm-expression: t_order_$->{order_id % 4}`}</CodeBlock>

              {/* ============== 6. 主键生成策略 ============== */}
              <H2 id="sec-5">6. 主键生成策略</H2>

                            <DocTable
                headers={["`SNOWFLAKE`", "雪花算法（推荐），分布式唯一 ID"]}
                rows={[
                  ["`NANOID`", "NanoID"],
                ]}
              />
              <CodeBlock lang="yaml">{`key-generators:
  snowflake:
    type: SNOWFLAKE
    props:
      worker-id: 1`}</CodeBlock>

              {/* ============== 7. 与 ORM 组件配合使用 ============== */}
              <H2 id="sec-6">7. 与 ORM 组件配合使用</H2>

              <H3>7.1 与 orm-mybatis 配合</H3>
              <CodeBlock lang="java">{`// 实体类无需任何修改
@Data
@TableName("t_order")
@EqualsAndHashCode(callSuper = true)
public class OrderPO extends BaseMyBatisPlusEntity<OrderPO> {
    @TableId(type = IdType.ASSIGN_ID)  // 使用 ShardingSphere 分配 ID
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
}

// Repository 无需任何修改
@Repository
public class OrderRepository extends BaseMyBatisRepositoryImpl<OrderMapper, OrderDTO, OrderPO, Long> {
}

// 使用方式完全不变
OrderDTO order = orderRepository.queryById(1L);
orderRepository.insert(orderDTO);
// ShardingSphere 自动路由到正确的库和表`}</CodeBlock>

              <H3>7.2 与 orm-flex 配合</H3>
              <CodeBlock lang="java">{`@Data
@Table("t_order")
@EqualsAndHashCode(callSuper = true)
public class OrderPO extends BaseFlexEntity<OrderPO> {
    @Id(keyType = KeyType.None)  // 由 ShardingSphere 生成 ID
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
}

@Repository
public class OrderRepository extends BaseFlexRepositoryImpl<OrderMapper, OrderDTO, OrderPO, Long> {
}`}</CodeBlock>

              {/* ============== 8. 常用属性配置 ============== */}
              <H2 id="sec-7">8. 常用属性配置</H2>

                            <DocTable
                headers={["`sql-show`", "`false`", "是否打印路由后的 SQL（开发环境推荐开启）"]}
                rows={[
                  ["`max-connections-size-per-query`", "`1`", "每个查询最大连接数"],
                  ["`check-table-metadata-enabled`", "`false`", "是否检查表元数据一致性"],
                  ["`kernel-executor-size`", "`infinite`", "内核执行器线程数"],
                ]}
              />
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    props:
      sql-show: true
      max-connections-size-per-query: 2
      check-table-metadata-enabled: true`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-8">9. 最佳实践</H2>
              <P>1. <Strong>分片键选择</Strong>：选择高基数、查询频率高的字段作为分片键（如 <InlineCode>user_id</InlineCode>、<InlineCode>order_id</InlineCode>），避免使用更新频繁的字段。</P>
              <P>2. <Strong>分片算法</Strong>：推荐使用 <InlineCode>HASH_MOD</InlineCode>，数据分布均匀；范围查询多时可考虑 <InlineCode>BOUNDARY_RANGE</InlineCode>。</P>
              <P>3. <Strong>主键策略</Strong>：分库分表场景推荐使用 <InlineCode>SNOWFLAKE</InlineCode> 雪花算法生成全局唯一 ID。</P>
              <P>4. <Strong>避免跨片查询</Strong>：查询条件尽量包含分片键，避免全库扫描。</P>
              <P>5. <Strong>绑定表</Strong>：有关联关系的表使用相同的分片策略和分片键，避免跨片 JOIN。</P>
              <P>6. <Strong>读写分离</Strong>：生产环境建议配合读写分离，分散读压力。</P>
              <P>7. <Strong>开发调试</Strong>：开发环境开启 <InlineCode>sql-show: true</InlineCode>，查看实际路由的 SQL。</P>
              <P>8. <Strong>ID 类型</Strong>：使用 ShardingSphere 主键生成时，MyBatis-Plus 的 <InlineCode>@TableId</InlineCode> 设为 <InlineCode>IdType.ASSIGN_ID</InlineCode> 或 <InlineCode>IdType.INPUT</InlineCode>。</P>
              <P>9. <Strong>事务注意</Strong>：跨库事务需要分布式事务支持，ShardingSphere 支持 XA 和 BASE 两种模式。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-orm-sharding — 分库分表与读写分离，构建弹性数据架构。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/orm-flex" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">MyBatis-Flex</span>
                </Link>
                <Link href="/docs/reader/db-redis" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Redis</span>
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
