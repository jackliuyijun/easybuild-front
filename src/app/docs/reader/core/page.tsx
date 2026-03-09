"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, Copy, Check, Lightbulb, ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Sparkles, AlertTriangle } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const tabs = ["后端", "业务", "前端", "移动端"]

const sidebarSections: { title?: string; items: { label: string; active?: boolean; href?: string }[] }[] = [
  { title: "基础模块", items: [{ label: "基础核心", active: true },{ label: "BOM", href: "/docs/reader/bom" },{ label: "认证鉴权", href: "/docs/reader/auth" },{ label: "网关", href: "/docs/reader/gateway" }]},
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
  { id: "sec-annotations", label: "注解体系" },
  { id: "sec-dto", label: "数据模型" },
  { id: "sec-builders", label: "构建器" },
  { id: "sec-context", label: "线程上下文" },
  { id: "sec-exception", label: "异常体系" },
  { id: "sec-functional", label: "函数式编程" },
  { id: "sec-utils", label: "工具类" },
  { id: "sec-constants", label: "常量定义" },
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

export default function CoreDocPage() {
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
          <span className="font-medium text-[#9CA3AF]">基础核心</span>
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
                easyfk-core 核心模块
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>基础核心模块 — 全局工具与底层支撑</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~20 min</span>
              </div>
              <div className="h-px bg-[#1F2937]" />

              {/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>easyfk-core</InlineCode> 是 EasyFK 框架的<Strong>核心基础模块</Strong>，为所有上层模块提供统一的数据模型、注解体系、构建器、上下文管理、异常处理、函数式编程工具和通用工具类。该模块是整个框架的底层基石，不依赖任何其他 EasyFK 模块。
              </P>
              <TipBox>
                <InlineCode>easyfk-core</InlineCode> 是所有 EasyFK 模块的<Strong>最底层依赖</Strong>，任何上层模块（web、orm、cache 等）均会自动传递引入此模块。
              </TipBox>

              {/* ============== 2. 模块依赖 ============== */}
              <H2 id="sec-deps">2. 模块依赖</H2>
              <DocTable
                headers={["依赖", "方式", "说明"]}
                rows={[
                  ["spring-boot-starter", "api", "Spring Boot 核心"],
                  ["spring-boot-starter-test", "api", "测试支持"],
                  ["spring-boot-configuration-processor", "api", "配置处理器"],
                  ["spring-boot-starter-aop", "api", "AOP 支持"],
                  ["spring-boot-starter-validation", "api", "参数校验"],
                  ["jackson-databind/core/annotations", "api", "JSON 序列化（Jackson）"],
                  ["fastjson2", "api", "JSON 序列化（FastJSON2）"],
                  ["hutool-all", "api", "Hutool 工具集"],
                  ["swagger-annotations (v3)", "api", "OpenAPI 文档注解"],
                  ["slf4j-api", "api", "日志门面"],
                  ["mapstruct-plus-spring-boot-starter", "api", "高性能对象映射"],
                ]}
              />

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-packages">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.core
├── annotation/               # 注解定义（12个）
├── builders/                 # 构建器（6个）
├── constants/                # 常量定义（4个）
├── context/                  # 线程上下文（3个）
├── dto/                      # 数据传输对象
│   ├── login/                  - 登录相关 DTO
│   ├── page/                   - 分页相关 DTO
│   ├── request/                - 请求相关 DTO
│   ├── response/               - 响应相关 DTO
│   └── validation/             - 校验结果 DTO
├── exception/                # 异常定义
├── function/                 # 函数式接口
└── utils/                    # 工具类
    ├── common/                 - 通用工具
    ├── date/                   - 日期工具
    ├── expression/             - 表达式工具
    └── returns/                - 返回值工具`}</CodeBlock>

              {/* ============== 4. 注解体系 ============== */}
              <H2 id="sec-annotations">4. 注解体系</H2>

              <H3>4.1 数据标识类注解</H3>
              <DocTable
                headers={["注解", "目标", "说明"]}
                rows={[
                  ["@PrimaryKey", "字段", "主键字段标识"],
                  ["@PrimaryField", "字段", "主要字段标识"],
                  ["@SerializableClass", "类", "标记需要强制注册到序列化组件的类"],
                ]}
              />

              <H3>4.2 查询条件类注解</H3>
              <DocTable
                headers={["注解", "目标", "说明", "属性"]}
                rows={[
                  ["@BetweenField", "字段", "标记为 BETWEEN 查询条件字段", "-"],
                  ["@BetweenStart", "字段", "BETWEEN 范围起始字段", "field - 取值字段名"],
                  ["@BetweenEnd", "字段", "BETWEEN 范围截止字段", "field - 取值字段名"],
                  ["@AssistConditionField", "字段", "SQL 辅助查询条件（分页、排序等）", "-"],
                ]}
              />

              <H3>4.3 唯一性校验类注解</H3>
              <DocTable
                headers={["注解", "目标", "说明", "属性"]}
                rows={[
                  ["@SingleUniqueField", "字段", "单字段唯一校验", "repetitionMsg - 重复提示语"],
                  ["@CombUniqueField", "字段", "组合字段唯一校验", "combinationField - 组合字段名, repetitionMsg - 重复提示语"],
                ]}
              />

              <H3>4.4 业务功能类注解</H3>
              <DocTable
                headers={["注解", "目标", "说明", "属性"]}
                rows={[
                  ["@SignField", "字段", "需要参与签名计算的字段", "-"],
                  ["@ForbiddenField", "字段", "禁止操作的字段", "value"],
                  ["@EnumValueAnnotation", "字段", "枚举值自动填充", "enumClass, field, methodName"],
                  ["@DataFilterField", "字段", "SaaS 数据过滤条件", "mapOperatorFiled, type(0单选/1多选)"],
                ]}
              />

              {/* ============== 5. 数据模型（DTO） ============== */}
              <H2 id="sec-dto">5. 数据模型（DTO）</H2>

              <H3>5.1 响应模型</H3>

              <H4>{'BaseResult<T>'} —— 内部调用结果</H4>
              <CodeBlock lang="java">{`BaseResult<T>
├── success: Boolean      // 是否成功
├── data: T               // 数据
├── msg: String           // 消息
└── code: String          // 状态码`}</CodeBlock>

              <H4>{'ResponseResult<T>'} —— 统一 API 响应</H4>
              <CodeBlock lang="java">{`ResponseResult<T>
├── code: String          // OK/ERROR/UN_LOGIN/UN_AUTH/PARAM_ERROR/BUSYNESS
├── count: Long           // 总条数（分页用）
├── msg: String           // 提示消息
├── data: T               // 数据
└── traceId: String       // 链路追踪 ID`}</CodeBlock>

              <H3>5.2 请求模型</H3>

              <H4>BasicParam —— 基础查询参数</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["top", "Integer", "TOP N 查询"],
                  ["page", "Integer", "当前页数"],
                  ["limit", "Integer", "查询条数"],
                  ["totalCount", "Boolean", "是否查询总数"],
                  ["ascFields", "String", "升序排序字段"],
                  ["descFields", "String", "降序排序字段"],
                  ["searchKeyWord", "String", "搜索关键字"],
                  ["start / stop", "String", "时序数据库范围"],
                ]}
              />

              <H4>{'SearchRequest<T>'} —— 查询请求封装</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["parmaObj", "T", "查询条件对象"],
                  ["pageSearch", "PageSearch", "分页参数"],
                  ["selectFields", "String[]", "选择查询的字段"],
                  ["nullFields", "String[]", "为空的字段条件"],
                  ["inParams", "Map<String, List<?>>", "IN 条件"],
                  ["likeFields", "String[]", "模糊查询字段"],
                  ["notFields", "String[]", "不等于字段"],
                  ["gThanFields / lThanFields", "String[]", "大于/小于字段"],
                  ["gThanOrEqualFields / lThanOrEqualFields", "String[]", "大于等于/小于等于字段"],
                  ["multipleFields", "String[]", "多选字段"],
                ]}
              />

              <H4>{'ModifyRequest<T>'} —— 操作请求封装</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["idList", "List<?>", "ID 列表"],
                  ["parmaObj", "T", "操作参数对象"],
                  ["paramList", "List<T>", "列表参数"],
                  ["enableNullFields", "String[]", "可以为空的字段"],
                ]}
              />

              <H4>{'BatchBasicReq<PK>'} —— 批量操作基础请求</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["ids", "PK", "对象 ID，多个用逗号分隔"],
                ]}
              />

              <H3>5.3 分页模型</H3>

              <H4>PageSearch —— 分页查询参数</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["page", "Integer", "当前页数"],
                  ["limit", "Integer", "每页条数"],
                  ["totalCount", "Boolean", "是否查询总数"],
                ]}
              />

              <H4>{'PageResult<T>'} —— 分页结果</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["total", "Long", "总记录数"],
                  ["rows", "List<T>", "当前页数据"],
                ]}
              />

              <H3>5.4 登录模型</H3>

              <H4>LoginUser —— 登录用户基本信息</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["name", "String", "名称"],
                  ["userType", "String", "用户类型（platform/customer/agent/merchant）"],
                  ["dataCachedKey", "String", "数据缓存 Key"],
                  ["authCachedKey", "String", "权限缓存 Key"],
                ]}
              />

              <H4>UserData —— 当前登录用户完整信息</H4>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["userId", "String", "用户 ID"],
                  ["accountId", "String", "账户 ID"],
                  ["name / phone / nickname / avatar", "String", "基本信息"],
                  ["type", "String", "用户类型"],
                  ["groupId / groupName", "String", "分组信息"],
                  ["departmentId / departmentName", "String", "部门信息"],
                  ["agentId / agentName", "String", "代理商信息"],
                  ["merchantId / merchantName", "String", "商户信息"],
                  ["orgId / orgName", "String", "组织信息"],
                  ["extendData", "Map<String, Object>", "扩展数据"],
                  ["bizType", "Set<String>", "业务类型集合"],
                  ["dataCachedKey / authCachedKey", "String", "缓存 Key"],
                ]}
              />

              {/* ============== 6. 构建器（Builders） ============== */}
              <H2 id="sec-builders">6. 构建器（Builders）</H2>

              <H3>6.1 BRBuilder —— BaseResult 构建器</H3>
              <CodeBlock lang="java">{`// 链式构建
BRBuilder.<String>builder(true).data("token").msg("成功").build();

// 快捷方法
BRBuilder.successResult();
BRBuilder.successResult(data);
BRBuilder.failResult();
BRBuilder.failResult("错误消息", "ERROR_CODE");`}</CodeBlock>

              <H3>6.2 RRBuilder —— ResponseResult 构建器</H3>
              <CodeBlock lang="java">{`// 成功响应
RRBuilder.buildSuccessBody();
RRBuilder.buildSuccessBody(data);
RRBuilder.buildSuccessPageBody(count, dataList);
RRBuilder.buildSuccessListBody(dataList);

// 失败响应
RRBuilder.buildFailedBody("错误消息");
RRBuilder.buildFailedBody("ERROR_CODE", "错误消息");

// BaseResult 转 ResponseResult
RRBuilder.buildBodyByBaseResult(baseResult);

// 分页结果转响应
RRBuilder.buildBodyByPageResult(pageResult);

// 异常转响应
RRBuilder.buildFailByException(exception);`}</CodeBlock>

              <H3>6.3 PRBuilder —— PageResult 构建器</H3>
              <CodeBlock lang="java">{`PRBuilder.result(total, rows);
PRBuilder.<User>builder().total(100L).rows(userList).build();`}</CodeBlock>

              <H3>6.4 SRPBuilder —— SearchRequest 构建器</H3>
              <CodeBlock lang="java">{`// 从 BasicParam 自动构建（自动提取分页参数）
SRPBuilder.buildRequest(queryParam);

// 链式构建（类型安全的 Lambda 字段引用）
SRPBuilder.<UserDto>builder()
    .example(queryParam)
    .page(new PageSearch(1, 20))
    .likeFields(UserDto::getName, UserDto::getPhone)
    .in(UserDto::getStatus, Arrays.asList(0, 1))
    .nullFields(UserDto::getDeletedAt)
    .notFields(UserDto::getType)
    .selectFields(UserDto::getName, UserDto::getPhone)
    .build();`}</CodeBlock>

              <H3>6.5 MRPBuilder —— ModifyRequest 构建器</H3>
              <CodeBlock lang="java">{`// 单对象操作
MRPBuilder.buildRequest(userDto);
MRPBuilder.buildRequest(reqObj, UserDto.class);  // 自动类型转换

// 批量操作
MRPBuilder.buildRequest(userDtoList);

// 链式构建
MRPBuilder.<UserDto>builder()
    .param(userDto)
    .ids("id1", "id2", "id3")
    .enableNullFields(UserDto::getAvatar, UserDto::getNickname)
    .build();`}</CodeBlock>

              <H3>6.6 OBJBuilder —— 通用对象构建器</H3>
              <CodeBlock lang="java">{`// 通过 Lambda 引用设置字段值
UserDto user = OBJBuilder.builder(UserDto.class)
    .setFieldValue(UserDto::getName, "张三")
    .setFieldValue(UserDto::getPhone, "13800138000")
    .build();`}</CodeBlock>

              {/* ============== 7. 线程上下文（Context） ============== */}
              <H2 id="sec-context">7. 线程上下文（Context）</H2>

              <H3>7.1 UserDataContext —— 用户数据上下文</H3>
              <CodeBlock lang="java">{`UserDataContext.setUserData(userData);     // 设置当前线程用户数据
UserData data = UserDataContext.getUserData(); // 获取当前线程用户数据
UserDataContext.remove();                  // 清理`}</CodeBlock>

              <H3>7.2 RequestHeaderContext —— 请求头上下文</H3>
              <CodeBlock lang="java">{`RequestHeaderContext.setRequestHeaders(headers);
RequestHeaders h = RequestHeaderContext.getRequestHeaders();
RequestHeaderContext.remove();`}</CodeBlock>

              <H3>7.3 TraceIdContext —— 链路追踪上下文</H3>
              <P>使用 <InlineCode>InheritableThreadLocal</InlineCode>，支持父子线程传递。</P>
              <CodeBlock lang="java">{`TraceIdContext.setTraceId("trace-001");
String traceId = TraceIdContext.getTraceId();
boolean has = TraceIdContext.hasTraceId();
String safe = TraceIdContext.getTraceIdOrDefault("N/A");
String required = TraceIdContext.getRequiredTraceId(); // 不存在时抛异常

// 安全执行（自动清理）
TraceIdContext.executeWithCleanup(() -> {
    // 业务逻辑
});

TraceIdContext.remove();`}</CodeBlock>
              <TipBox>
                <InlineCode>TraceIdContext</InlineCode> 使用 <InlineCode>InheritableThreadLocal</InlineCode>，在创建子线程时会自动继承父线程的 traceId，无需手动传递。
              </TipBox>

              {/* ============== 8. 异常体系 ============== */}
              <H2 id="sec-exception">8. 异常体系</H2>

              <H3>8.1 BusinessException —— 统一业务异常</H3>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["errorCode", "String", "系统级错误码"],
                  ["errorMsg", "String", "系统级错误信息"],
                  ["i18nCode", "String", "国际化错误码"],
                  ["msgPath", "String", "国际化配置文件路径"],
                  ["args", "Object[]", "错误信息参数"],
                ]}
              />
              <P><Strong>特点：</Strong><InlineCode>fillInStackTrace()</InlineCode> 返回 <InlineCode>this</InlineCode>，不填充堆栈轨迹，<Highlight>提高性能</Highlight>。</P>
              <CodeBlock lang="java">{`// 使用枚举
throw new BusinessException(MyErrorEnum.USER_NOT_FOUND);
// 使用 code + message
throw new BusinessException("USER_001", "用户不存在");
// 仅 message
throw new BusinessException("操作失败");`}</CodeBlock>

              <H3>8.2 BaseErrorEnum —— 错误枚举接口</H3>
              <P>业务模块实现此接口定义错误码枚举：</P>
              <CodeBlock lang="java">{`public enum MyErrorEnum implements BaseErrorEnum {
    USER_NOT_FOUND("USER_001", "用户不存在");
    // ...
}`}</CodeBlock>

              <H3>8.3 ValidateException —— 校验异常</H3>
              <P>简单的运行时校验异常。</P>

              {/* ============== 9. 函数式编程 ============== */}
              <H2 id="sec-functional">9. 函数式编程</H2>

              <H3>{'9.1 EFunction<T, R>'} —— 可序列化函数接口</H3>
              <P>继承 <InlineCode>{'Function<T, R>'}</InlineCode> 和 <InlineCode>Serializable</InlineCode>，支持 Lambda 表达式转字段名。</P>
              <CodeBlock lang="java">{`// 类型安全的字段引用
EFunction<UserDto, String> nameRef = UserDto::getName;
String fieldName = FunctionColumnToStringUtil.columnToString(nameRef); // "name"`}</CodeBlock>

              <H3>9.2 FunctionExecutor —— 函数执行器</H3>
              <DocTable
                headers={["方法", "说明"]}
                rows={[
                  ["isTrueOrFalse(bool, trueFun, falseFun)", "条件分支处理"],
                  ["presentOrElse(obj, consumer, emptyFun)", "空值/非空值分支"],
                  ["emptyThrowFun(obj, msg, consumer)", "为空抛异常，不为空执行"],
                  ["notEmptyFun(obj, consumer)", "值不为空时执行"],
                  ["actionFun(function, obj, supplier)", "执行函数，空时返回默认值"],
                  ["isTrueFun(bool, runnable)", "条件为 true 时执行"],
                  ["predicate(obj, predicate, consumer)", "断言条件执行"],
                ]}
              />

              <H3>{'9.3 ThrowingSupplier<T, E>'} —— 可抛异常的 Supplier</H3>
              <CodeBlock lang="java">{`ThrowingSupplier<String, IOException> supplier = () -> readFile();`}</CodeBlock>

              {/* ============== 10. 工具类 ============== */}
              <H2 id="sec-utils">10. 工具类</H2>

              <H3>10.1 EmptyUtil —— 空值判断工具</H3>
              <CodeBlock lang="java">{`EmptyUtil.isEmpty(value);          // 支持 String/List/Map/Array/Object
EmptyUtil.isNotEmpty(value);
EmptyUtil.allFieldIsEmpty(obj);    // 判断对象所有字段是否为空
EmptyUtil.emptyThrowException(value, "不能为空"); // 为空抛 BusinessException
EmptyUtil.isNotEmptyChars(str);    // 排除 "null" 和 "undefined"`}</CodeBlock>

              <H3>10.2 TransformUtil —— 对象转换工具</H3>
              <P>优先使用 MapStruct，失败时自动降级到 BeanUtils 拷贝。</P>
              <CodeBlock lang="java">{`UserResp resp = TransformUtil.transformObj(dto, UserResp.class);
List<UserResp> list = TransformUtil.transformList(dtoList, UserResp.class);
PageResult<UserResp> page = TransformUtil.transformPageResult(pageResult, UserResp.class);
Map<String, Object> map = TransformUtil.transformToMap(obj);
UserDto dto = TransformUtil.transformFromMap(map, UserDto.class);`}</CodeBlock>

              <H3>10.3 MapStructConvertUtil —— MapStruct 转换工具</H3>
              <CodeBlock lang="java">{`UserResp resp = MapStructConvertUtil.convert(dto, UserResp.class);
List<UserResp> list = MapStructConvertUtil.convertList(dtoList, UserResp.class);

// 拷贝值（Lambda 指定强制置空字段）
MapStructConvertUtil.copyValue(source, target, UserDto::getAvatar);

// 自定义回调
MapStructConvertUtil.copyValue(source, target, (s, t) -> {
    if (s.getStatus() == null) t.setStatus(0);
});`}</CodeBlock>
              <TipBox>
                <InlineCode>MapStructConvertUtil</InlineCode> 基于 <Highlight>高性能</Highlight> 的 MapStruct 编译期代码生成，相比运行时反射拷贝具有显著的性能优势。
              </TipBox>

              <H3>10.4 ReflectUtil —— 反射工具类</H3>
              <P>提供<Highlight>高性能</Highlight>、缓存<Highlight>优化</Highlight>的反射操作：</P>
              <CodeBlock lang="java">{`Field[] fields = ReflectUtil.getAllFields(clazz);           // 获取所有字段（含父类）
Object value = ReflectUtil.getValueByFieldName(obj, "name");// 获取字段值
ReflectUtil.setValueByFieldName(obj, "name", "张三");       // 设置字段值
Field[] annotated = ReflectUtil.getFieldsByAnnotation(clazz, PrimaryKey.class);
T instance = ReflectUtil.createInstanceAndSetValue(clazz, valueMap);`}</CodeBlock>

              <H3>10.5 StringUtil —— 字符串工具</H3>
              <CodeBlock lang="java">{`StringUtil.underlineToCamel("user_name");   // "userName"
StringUtil.camelToUnderline("userName");     // "user_name"
StringUtil.upperFirstChar("name");          // "Name"
StringUtil.lowerFirstChar("Name");          // "name"
StringUtil.isChinese("中文");               // true`}</CodeBlock>

              <H3>10.6 SplitUtil —— 字符串分割工具</H3>
              <CodeBlock lang="java">{`List<String> list = SplitUtil.split("a,b，c d/e");  // ["a","b","c","d","e"]
List<Integer> ids = SplitUtil.splitAndConvert("1,2,3", Integer.class);`}</CodeBlock>

              <H3>10.7 OrderNoUtil —— 订单号生成工具</H3>
              <CodeBlock lang="java">{`OrderNoUtil.get18OrderNumber("PO");   // "PO202602281430001230"
OrderNoUtil.get22OrderNumber("SO");   // 22位订单号
OrderNoUtil.get27OrderNumber("TX");   // 27位订单号`}</CodeBlock>

              <H3>10.8 EnumUtils —— 枚举工具</H3>
              <CodeBlock lang="java">{`MyEnum e = EnumUtils.getEnumByValue(MyEnum.class, "value1");
String name = EnumUtils.getNameByValue(MyEnum.class, "value1");
MyEnum e2 = EnumUtils.getEnumByCode(MyEnum.class, "code1");`}</CodeBlock>

              <H3>10.9 LocalDateUtil —— 日期时间工具</H3>
              <CodeBlock lang="java">{`LocalDateUtil.getLocalDateTimeString();          // "2026-02-28 14:30:00"
LocalDateUtil.string2LocalDateTime("2026-02-28 14:30:00");
LocalDateUtil.localDateTime2Date(localDateTime);
LocalDateUtil.date2LocalDateTime(date);
LocalDateUtil.between("2026-01-01 00:00:00", "2026-12-31 23:59:59");
LocalDateUtil.firstDayOfMonth(LocalDate.now());
LocalDateUtil.getIntervalDays(date1, date2);`}</CodeBlock>

              <H3>10.10 I18NUtil —— 国际化工具</H3>
              <CodeBlock lang="java">{`I18NUtil.getMessage("user.not.found");
I18NUtil.getMessage("user.welcome", new Object[]{"张三"});
I18NUtil.getMessage("error.code", "custom/messages");
Locale locale = I18NUtil.getLocale();  // 从请求头自动获取`}</CodeBlock>

              <H3>10.11 ExpressionUtil —— SpEL 表达式工具</H3>
              <CodeBlock lang="java">{`String result = ExpressionUtil.parse("#userId", method, args);
Integer value = ExpressionUtil.parse("#order.amount", method, args, Integer.class);`}</CodeBlock>

              <H3>10.12 其他工具</H3>
              <DocTable
                headers={["工具类", "说明"]}
                rows={[
                  ["FunctionColumnToStringUtil", "Lambda 方法引用转字段名"],
                  ["Exception2ResultUtil", "BusinessException 转 ResponseResult/BaseResult"],
                  ["ReturnErrorUtil", "根据返回类型构建错误结果"],
                  ["MyBeanUtils", "Bean 拷贝（已建议迁移至 MapStructConvertUtil）"],
                  ["DisableUtil", "禁用操作对象列表构建"],
                ]}
              />
              <WarnBox>
                <InlineCode>MyBeanUtils</InlineCode> 已标记为过时，建议迁移至 <InlineCode>MapStructConvertUtil</InlineCode>，以获得更好的<Highlight>高性能</Highlight>编译期对象映射能力。
              </WarnBox>

              {/* ============== 11. 常量定义 ============== */}
              <H2 id="sec-constants">11. 常量定义</H2>

              <H3>11.1 ReturnCodeConstant —— 响应状态码</H3>
              <DocTable
                headers={["常量", "值", "说明"]}
                rows={[
                  ["SUCCESS", '"OK"', "处理成功"],
                  ["ERROR", '"ERROR"', "处理失败"],
                  ["UN_LOGIN", '"UN_LOGIN"', "未登录"],
                  ["UN_AUTH", '"UN_AUTH"', "无权限"],
                  ["PARAM_ERROR", '"PARAM_ERROR"', "参数错误"],
                  ["BUSYNESS", '"BUSYNESS"', "系统繁忙"],
                ]}
              />

              <H3>11.2 RequestHeaderConstant —— 请求头常量</H3>
              <DocTable
                headers={["常量", "值", "说明"]}
                rows={[
                  ["CHAIN_NAME", '"Chain-Data"', "网关链路数据"],
                  ["REQUEST_NONCE", '"Request-Nonce"', "防重放随机数"],
                  ["REQUEST_TOKEN", '"Request-Token"', "请求令牌"],
                  ["ACCESS_TOKEN", '"Access-Token"', "访问令牌"],
                  ["TIMESTAMP", '"Timestamp"', "时间戳"],
                  ["PARAM_SIGN", '"Param-Sign"', "参数签名"],
                  ["RESET_SIGN", '"Reset-Sign"', "重放签名"],
                  ["DEVICE_NO", '"Device-No"', "设备号"],
                  ["CLIENT_TYPE", '"Client-Type"', "客户端类型"],
                  ["LANGUAGE", '"Language"', "语言"],
                  ["TRACE_ID", '"TRACE_ID"', "链路追踪 ID"],
                ]}
              />

              <H3>11.3 CharacterConstant —— 字符常量</H3>
              <P>包含下划线、斜杠、逗号、点号等常用分隔符，静态资源后缀列表，数据库类型标识等。</P>

              <H3>11.4 FileType —— 文件类型枚举</H3>
              <P><InlineCode>IMAGE</InlineCode> / <InlineCode>FILE</InlineCode> / <InlineCode>VIDEO</InlineCode></P>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-core — 全局基础设施，为上层模块提供统一的工具与约定。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <Link href="/docs/reader/bom" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">BOM</span>
                </Link>
                <Link href="/docs/reader/auth" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">认证鉴权</span>
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
