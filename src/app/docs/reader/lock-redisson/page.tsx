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
  { title: "分布式", items: [{ label: "Redisson 分布式锁", active: true }]},
  { title: "高性能组件", items: [{ label: "线程池", href: "/docs/reader/thread" },{ label: "Disruptor", href: "/docs/reader/disruptor" },{ label: "Fory 序列化", href: "/docs/reader/fory" },{ label: "Chronicle Map", href: "/docs/reader/chronicle-map" }]},
]

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "锁类型说明" },
  { id: "sec-4", label: "使用方式" },
  { id: "sec-5", label: "API 参考" },
  { id: "sec-6", label: "实战示例" },
  { id: "sec-7", label: "自动配置机制" },
  { id: "sec-8", label: "包结构" },
  { id: "sec-9", label: "最佳实践" },
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

export default function LockRedissonDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">Redisson 分布式锁</span>
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
                easyfk-lock-redisson Redisson 分布式锁
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>Redisson 分布式锁 — 高可用分布式互斥方案</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~15 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />


              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>lock-redisson</InlineCode> 是 EasyFK 框架中基于 Redisson 的分布式锁组件。该模块提供四种锁类型（可重入锁、公平锁、读锁、写锁）、四种 Redis 部署模式（单机、主从、哨兵、集群）、看门狗自动续期机制，以及模板化的加锁执行 API（单锁、批量锁、嵌套锁），适用于分布式环境下的并发控制、资源互斥、幂等防重等场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>lock-redisson</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:lock-redisson'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`redisson` — Redisson 分布式锁客户端"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 配置属性</H3>
              <P>所有配置项统一在 <InlineCode>easyfk.config.lock.redisson</InlineCode> 前缀下。</P>
              <H4>基础配置</H4>

                            <DocTable
                headers={["`host`", "String", "`127.0.0.1`", "Redis 服务器地址"]}
                rows={[
                  ["`password`", "String", "—", "连接密码"],
                  ["`database`", "int", "`0`", "数据库索引"],
                  ["`minimumIdleSize`", "int", "`10`", "最小空闲连接数"],
                  ["`pattern`", "RedisPattern", "`SINGLE`", "Redis 部署模式"],
                ]}
              />
              <H4>主从模式配置</H4>

                            <DocTable
                headers={["`masterAddresses`", "String", "主节点地址"]}
                rows={[]}
              />
              <H4>哨兵模式配置</H4>

                            <DocTable
                headers={["`sentinelAddresses`", "String[]", "哨兵节点地址列表"]}
                rows={[]}
              />
              <H4>集群模式配置</H4>

              

              <H3>3.2 配置示例</H3>
              <H4>单机模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        host: 192.168.1.100
        port: 6379
        password: your_password
        database: 0
        minimumIdleSize: 10
        pattern: SINGLE`}</CodeBlock>
              <H4>哨兵模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        password: your_password
        database: 0
        pattern: SENTINEL
        masterName: mymaster
        sentinelAddresses:
          - redis://192.168.1.100:26379
          - redis://192.168.1.101:26379
          - redis://192.168.1.102:26379`}</CodeBlock>
              <H4>集群模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        password: your_password
        pattern: CLUSTER
        nodeAddress:
          - redis://192.168.1.100:7000
          - redis://192.168.1.100:7001
          - redis://192.168.1.100:7002
          - redis://192.168.1.101:7000
          - redis://192.168.1.101:7001
          - redis://192.168.1.101:7002`}</CodeBlock>
              <H4>主从模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        password: your_password
        database: 0
        pattern: MASTERSLAVE
        masterAddresses: redis://192.168.1.100:6379
        slaveAddresses:
          - redis://192.168.1.101:6379
          - redis://192.168.1.102:6379`}</CodeBlock>

              {/* ============== 4. 锁类型说明 ============== */}
              <H2 id="sec-3">4. 锁类型说明</H2>
              <P>通过 <InlineCode>LockType</InlineCode> 枚举指定锁类型：</P>

                            <DocTable
                headers={["**可重入锁**", "`REENTRANT_LOCK`", "同一线程可多次获取同一把锁，不会死锁"]}
                rows={[
                  ["**读锁**", "`READ_LOCK`", "读写锁的读端，允许多个线程同时持有"],
                  ["**写锁**", "`WRITE_LOCK`", "读写锁的写端，互斥独占"],
                ]}
              />

              {/* ============== 5. 使用方式 ============== */}
              <H2 id="sec-4">5. 使用方式</H2>

              <H3>5.1 注入 RLockTemplate</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private RLockTemplate rLockTemplate;
}`}</CodeBlock>

              <H3>5.2 核心概念</H3>
              <BulletList items={["**waitTime**：等待获取锁的最长时间，超时返回 `null`", "**leaseTime**：锁的租约时间（持有时间）。设为 `-1` 表示启用**看门狗机制**，自动续期直到手动释放", "**看门狗机制**：Redisson 默认每 10 秒自动续期锁，防止业务未完成锁就过期"]} />

              {/* ============== 6. API 参考 ============== */}
              <H2 id="sec-5">6. API 参考</H2>

              <H3>6.1 RLockTemplate 方法一览</H3>
              <H4>基础锁操作</H4>

                            <DocTable
                headers={["`getLock(key, lockType)`", "锁 key, 锁类型", "`RLock`", "获取锁对象（不加锁）"]}
                rows={[
                  ["`unlock(lock)`", "锁对象", "void", "释放锁（自动检查当前线程持有）"],
                ]}
              />
              <H4>模板化加锁执行（推荐）</H4>

                            <DocTable
                headers={["`withTryLock(key, bizMethod)`", "无等待尝试加锁，公平锁，看门狗续期"]}
                rows={[
                  ["`withTryLock(key, waitTime, unit, bizMethod)`", "带等待时间，公平锁，看门狗续期"],
                  ["`withTryLock(key, waitTime, unit, lockType, bizMethod)`", "带等待时间，指定锁类型，看门狗续期"],
                  ["`withTryLock(key, waitTime, leaseTime, unit, bizMethod)`", "带等待和租约时间，公平锁"],
                  ["`withTryLock(key, waitTime, leaseTime, unit, lockType, bizMethod)`", "完整参数版，指定所有选项"],
                ]}
              />
              <H4>批量加锁</H4>

                            <DocTable
                headers={["`withTryLockMulti(keys, waitTime, unit, bizMethod)`", "批量加锁，公平锁，看门狗续期"]}
                rows={[]}
              />
              <H4>嵌套加锁</H4>

                            <DocTable
                headers={["`withNestedLock(outerKey, innerKeys, waitTime, unit, bizMethod)`", "嵌套锁，公平锁，看门狗续期"]}
                rows={[]}
              />
              <P>&gt; 所有 <InlineCode>withTryLock*</InlineCode> 方法：加锁成功执行业务并返回结果，加锁失败返回 <InlineCode>null</InlineCode>。<Strong>锁的释放完全自动</Strong>，无需手动 <InlineCode>unlock</InlineCode>。</P>

              {/* ============== 7. 实战示例 ============== */}
              <H2 id="sec-6">7. 实战示例</H2>

              <H3>7.1 最简用法：无等待加锁</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private RLockTemplate rLockTemplate;

    public BaseResult<?> createOrder(OrderDTO order) throws Exception {
        return rLockTemplate.withTryLock("order:create:" + order.getUserId(), () -> {
            // 加锁成功，执行创建订单逻辑
            return doCreateOrder(order);
        });
        // 返回 null 表示加锁失败（有其他线程正在处理）
    }
}`}</CodeBlock>

              <H3>7.2 带等待时间加锁</H3>
              <CodeBlock lang="java">{`public BaseResult<?> processPayment(String orderId) throws Exception {
    return rLockTemplate.withTryLock(
        "payment:" + orderId,
        5, TimeUnit.SECONDS,          // 最多等待 5 秒
        () -> {
            return doPayment(orderId);
        }
    );
}`}</CodeBlock>

              <H3>7.3 指定租约时间（禁用看门狗）</H3>
              <CodeBlock lang="java">{`public void syncData(String taskId) throws Exception {
    rLockTemplate.withTryLock(
        "sync:" + taskId,
        10, 60, TimeUnit.SECONDS,     // 等待 10 秒，锁最多持有 60 秒
        () -> {
            doSync(taskId);
            return null;
        }
    );
}`}</CodeBlock>

              <H3>7.4 指定锁类型</H3>
              <CodeBlock lang="java">{`// 使用可重入锁
public void process(String key) throws Exception {
    rLockTemplate.withTryLock(
        "task:" + key,
        5, TimeUnit.SECONDS,
        LockType.REENTRANT_LOCK,
        () -> {
            return doProcess(key);
        }
    );
}

// 使用读锁（允许并发读）
public ProductDTO getProduct(String productId) throws Exception {
    return rLockTemplate.withTryLock(
        "product:" + productId,
        LockType.READ_LOCK,
        () -> {
            return queryProduct(productId);
        }
    );
}

// 使用写锁（互斥写）
public void updateProduct(ProductDTO product) throws Exception {
    rLockTemplate.withTryLock(
        "product:" + product.getId(),
        5, TimeUnit.SECONDS,
        LockType.WRITE_LOCK,
        () -> {
            doUpdateProduct(product);
            return null;
        }
    );
}`}</CodeBlock>

              <H3>7.5 批量加锁：多资源并发控制</H3>
              <P>批量加锁自动按 key 字典序排序后依次加锁，<Strong>有效避免死锁</Strong>。任一锁获取失败则释放所有已获取的锁并返回 <InlineCode>null</InlineCode>。</P>
              <CodeBlock lang="java">{`public BaseResult<?> transferStock(List<String> productIds) throws Exception {
    // 对多个商品同时加锁
    List<String> lockKeys = productIds.stream()
        .map(id -> "stock:" + id)
        .collect(Collectors.toList());

    return rLockTemplate.withTryLockMulti(
        lockKeys,
        5, TimeUnit.SECONDS,
        () -> {
            // 所有商品锁获取成功，执行转移库存逻辑
            return doTransferStock(productIds);
        }
    );
}`}</CodeBlock>

              <H3>7.6 嵌套加锁：订单锁 + 商品锁</H3>
              <P>先获取外层锁（如订单幂等锁），再批量获取内层锁（如商品并发锁），适用于复合锁场景。</P>
              <CodeBlock lang="java">{`public BaseResult<?> submitOrder(String orderId, List<String> productIds) throws Exception {
    // 外层锁：订单幂等控制
    String outerKey = "order:" + orderId;
    // 内层锁：商品库存并发控制
    List<String> innerKeys = productIds.stream()
        .map(id -> "product:stock:" + id)
        .collect(Collectors.toList());

    return rLockTemplate.withNestedLock(
        outerKey, innerKeys,
        5, TimeUnit.SECONDS,
        () -> {
            // 订单锁 + 所有商品锁均获取成功
            return doSubmitOrder(orderId, productIds);
        }
    );
}`}</CodeBlock>

              <H3>7.7 手动控制锁（高级用法）</H3>
              <CodeBlock lang="java">{`public void manualLockExample(String key) throws InterruptedException {
    RLock lock = rLockTemplate.tryLock(
        key, 5, 30, TimeUnit.SECONDS, LockType.FAIR_LOCK
    );
    if (lock == null) {
        // 加锁失败
        return;
    }
    try {
        // 执行业务逻辑
        doBusiness();
    } finally {
        rLockTemplate.unlock(lock);
    }
}`}</CodeBlock>

              {/* ============== 8. 自动配置机制 ============== */}
              <H2 id="sec-7">8. 自动配置机制</H2>

              
              <BulletList items={["通过 Spring Boot `AutoConfiguration.imports` 声明自动配置入口", "使用 `@EnableConfigurationProperties` 自动绑定 `RedissonProperties`", "自动注册三个 Bean：", "`RedissonClient` — Redisson 客户端（`@ConditionalOnMissingBean`，可自定义覆盖）", "`RedissonLockManager` — 锁管理器", "`RLockTemplate` — 锁操作模板", '`RedissonClient` 使用 `destroyMethod = "shutdown"`，应用关闭时自动释放连接']} />

              {/* ============== 9. 包结构 ============== */}
              <H2 id="sec-8">9. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.lock.redisson
├── RLockTemplate.java                # 锁操作模板（核心 API）
├── config
│   └── RLockConfig.java              # Spring Boot 自动配置类
├── enums
│   ├── LockType.java                 # 锁类型枚举（可重入/公平/读/写）
│   └── RedisPattern.java             # Redis 部署模式枚举（单机/主从/哨兵/集群）
├── manager
│   └── RedissonLockManager.java      # 锁管理器（创建锁对象）
├── properties
│   └── RedissonProperties.java       # 配置属性类
└── util
    └── RedisLockUtil.java            # 静态工具类`}</CodeBlock>

              {/* ============== 10. 最佳实践 ============== */}
              <H2 id="sec-9">10. 最佳实践</H2>
              <P>1. <Strong>优先使用 <InlineCode>withTryLock</InlineCode> 模板方法</Strong>：自动管理锁的获取和释放，避免忘记 <InlineCode>unlock</InlineCode> 导致死锁。</P>
              <P>2. <Strong>合理设置等待时间</Strong>：根据业务耗时设置 <InlineCode>waitTime</InlineCode>，避免过长阻塞或过短失败。</P>
              <P>3. <Strong>善用看门狗机制</Strong>：<InlineCode>leaseTime</InlineCode> 设为 <InlineCode>-1</InlineCode>（默认）启用自动续期，适合业务耗时不确定的场景。固定耗时业务可设置明确的租约时间。</P>
              <P>4. <Strong>批量锁防死锁</Strong>：需要同时锁多个资源时使用 <InlineCode>withTryLockMulti</InlineCode>，框架自动按字典序排序加锁。</P>
              <P>5. <Strong>嵌套锁分层控制</Strong>：订单幂等 + 商品并发等复合场景使用 <InlineCode>withNestedLock</InlineCode>。</P>
              <P>6. <Strong>公平锁 vs 可重入锁</Strong>：需要按请求顺序获取锁选公平锁（默认），追求性能选可重入锁。</P>
              <P>7. <Strong>读写锁提升并发</Strong>：读多写少场景使用 <InlineCode>READ_LOCK</InlineCode> / <InlineCode>WRITE_LOCK</InlineCode>，允许并发读、互斥写。</P>
              <P>8. <Strong>锁粒度尽量细</Strong>：按业务资源 ID 加锁（如 <InlineCode>{'order:{orderId}'}</InlineCode>），避免用粗粒度锁降低并发能力。</P>
              <P>9. <Strong>处理加锁失败</Strong>：<InlineCode>withTryLock*</InlineCode> 方法加锁失败返回 <InlineCode>null</InlineCode>，业务层需判断并做相应处理（如返回&quot;请勿重复提交&quot;）。</P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-lock-redisson — 高可用分布式互斥锁方案。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/rpc-cloud" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">Spring Cloud</span>
                </Link>
                <Link href="/docs/reader/thread" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">线程池</span>
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
