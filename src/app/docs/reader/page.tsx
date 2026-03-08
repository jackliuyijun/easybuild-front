"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, Copy, Lightbulb, ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Sparkles, AlertTriangle } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const tabs = ["后端", "业务", "前端", "移动端"]

const sidebarSections: { title?: string; items: { label: string; active?: boolean; href?: string }[] }[] = [
  {
    items: [
      { label: "代码生成器", active: true },
      { label: "BOM", href: "/docs/reader/bom" },
    ],
  },
]

const outlineItems = [
  { id: "sec-overview", label: "概述" },
  { id: "sec-env", label: "环境要求" },
  { id: "sec-usage", label: "使用方式" },
  { id: "sec-config", label: "配置文件详解" },
  { id: "sec-arch", label: "项目架构类型详解" },
  { id: "sec-codegen", label: "生成代码详解" },
  { id: "sec-commands", label: "生成命令与 API 参考" },
  { id: "sec-db", label: "数据库支持与类型映射" },
  { id: "sec-annotation", label: "Entity 自定义注解" },
  { id: "sec-overwrite", label: "文件覆盖策略" },
  { id: "sec-examples", label: "完整配置示例" },
  { id: "sec-scenarios", label: "典型使用场景" },
  { id: "sec-faq", label: "常见问题" },
  { id: "sec-appendix", label: "附录" },
]

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
      <div className="flex h-9 items-center justify-between border-b border-[#1F2937] px-4">
        <span className="font-mono text-[11px] font-medium text-[#525252]">{lang}</span>
        <button type="button" className="flex items-center gap-1.5 text-[#525252] hover:text-[#9CA3AF]">
          <Copy className="size-3.5" />
          <span className="text-[11px]">复制</span>
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

export default function DocReaderPage() {
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
      {/* Custom Doc Nav Bar */}
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
          <span className="font-medium text-[#9CA3AF]">代码生成器</span>
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
          {/* Tab Bar */}
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
                      <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#525252]">
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

              {/* H1 */}
              <h1 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                EasyFK Generator 代码生成器使用手册
              </h1>
              {/* Meta */}
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>版本 {'{最新版}'}</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>适用于外部开发团队</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~30 min</span>
              </div>
              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* ============== 1. 概述 ============== */}
              <H2 id="sec-overview">1. 概述</H2>
              <P>
                EasyFK Generator 是 <Strong>易架构（EasyFK）</Strong> 框架的核心代码生成工具，面向 Java / Spring Boot 技术栈的开发团队，提供 <Strong>配置驱动、数据库感知、全层覆盖</Strong> 的一站式代码生成能力。
              </P>
              <H4>核心能力</H4>
              <BulletList items={[
                <><Strong>项目骨架生成</Strong>：自动创建完整的 Maven / Gradle 多模块项目结构</>,
                <><Strong>全层代码生成</Strong>：Entity → Mapper → Repository → Service → API → Remote → Controller，一张表生成 8~15 个 Java 类</>,
                <><Strong>数据库感知</Strong>：直连数据库自动解析表结构、字段类型、注释等元数据</>,
                <><Strong>多架构支持</Strong>：单体（SINGLE）、微服务（MICROSERVICE）、多栈微服务（SMART）三种架构一键切换</>,
                <><Strong>多 ORM 支持</Strong>：MyBatis-Plus、MyBatis-Flex、Hibernate 三种 ORM 框架可选</>,
                <><Strong>多构建工具</Strong>：Maven、Gradle Groovy DSL、Gradle Kotlin DSL 三种构建方式</>,
                <><Strong>增量安全</Strong>：已有文件不覆盖，仅 DTO/Param 类随表结构刷新</>,
              ]} />
              <H4>两种使用方式</H4>
              <NumberList items={[
                <><Strong>CLI 命令行工具</Strong>（推荐）：脱离 IDE，一条命令完成全栈生成</>,
                <><Strong>Spring Boot Starter 集成</Strong>：通过单元测试驱动生成，适合已有 Spring Boot 项目</>,
              ]} />

              {/* ============== 2. 环境要求 ============== */}
              <H2 id="sec-env">2. 环境要求</H2>
              <DocTable
                headers={["项目", "要求"]}
                rows={[
                  ["JDK", "21 或更高版本"],
                  ["构建工具（Starter 方式）", "Maven 3.6+ 或 Gradle 7+"],
                  ["数据库（可选）", "使用 from-db-tables 时需要可连接的数据库实例"],
                ]}
              />

              {/* ============== 3. 使用方式 ============== */}
              <H2 id="sec-usage">3. 使用方式</H2>

              <H3>3.1 方式一：CLI 命令行工具（推荐）</H3>
              <P>CLI 工具独立运行，不依赖 Spring Boot 项目环境，适合从零创建新项目或在任意目录快速生成代码。</P>

              <H4>3.1.1 安装</H4>
              <NumberList items={[
                <>获取安装包 <InlineCode>efg-{'{最新版}'}.zip</InlineCode> 并解压</>,
                <>进入 <InlineCode>efg-{'{最新版}'}</InlineCode> 目录执行安装</>,
              ]} />
              <P><Strong>Windows：</Strong></P>
              <CodeBlock lang="bat">{`双击 install.bat`}</CodeBlock>
              <P><Strong>macOS / Linux：</Strong></P>
              <CodeBlock lang="bash">{`chmod +x install && ./install`}</CodeBlock>
              <P>重新打开终端，验证安装：</P>
              <CodeBlock lang="bash">{`efg -V`}</CodeBlock>
              <P>输出以下内容表示安装成功：</P>
              <CodeBlock lang="plaintext">{`easyfk-generator {最新版}`}</CodeBlock>

              <H4>3.1.2 卸载</H4>
              <P><Strong>Windows：</Strong> 双击 <InlineCode>uninstall.bat</InlineCode></P>
              <P><Strong>macOS / Linux：</Strong></P>
              <CodeBlock lang="bash">{`chmod +x uninstall && ./uninstall`}</CodeBlock>

              <H4>3.1.3 快速开始</H4>
              <CodeBlock lang="bash">{`# 1. 创建工作目录
mkdir my-project && cd my-project

# 2. 生成配置模板
efg init

# 3. 用编辑器打开 generator.yml，填入项目信息和数据库配置

# 4. 执行全量生成
efg`}</CodeBlock>

              <H3>3.2 方式二：Spring Boot Starter 集成</H3>
              <P>适合在已有 Spring Boot 项目中使用，通过单元测试驱动代码生成。</P>

              <H4>3.2.1 添加依赖</H4>
              <P><Strong>Gradle：</Strong></P>
              <CodeBlock lang="groovy">{`testImplementation 'com.mcst:easyfk-generator:{最新版}'`}</CodeBlock>
              <P><Strong>Maven：</Strong></P>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>easyfk-generator</artifactId>
    <version>{最新版}</version>
    <scope>test</scope>
</dependency>`}</CodeBlock>

              <H4>3.2.2 编写配置</H4>
              <P>在 <InlineCode>src/test/resources/</InlineCode> 下创建配置文件（如 <InlineCode>application-gen.yml</InlineCode>）：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: my-app
        base-package: com.example.myapp
        project-type: smart
      code:
        module-name: myapp
        model-list:
          - model-name: Product
            model-desc: 商品信息`}</CodeBlock>

              <H4>3.2.3 编写测试类</H4>
              <CodeBlock lang="java">{`@SpringBootTest
@ActiveProfiles("gen")  // 对应 application-gen.yml
public class GeneratorTest {

    @Resource
    private EasyfkGenerator easyfkGenerator;

    @Test
    public void generateAll() {
        easyfkGenerator.generateAll();
    }
}`}</CodeBlock>

              <H4>3.2.4 需要启动类</H4>
              <P>确保 <InlineCode>src/test/java</InlineCode> 下有 Spring Boot 启动类：</P>
              <CodeBlock lang="java">{`@SpringBootApplication
public class TestApp {
    public static void main(String[] args) {
        SpringApplication.run(TestApp.class, args);
    }
}`}</CodeBlock>
              <P>运行测试方法即可触发代码生成。</P>

              {/* ============== 4. 配置文件详解 ============== */}
              <H2 id="sec-config">4. 配置文件详解</H2>

              <H3>4.1 配置文件结构</H3>
              <P>无论是 CLI 的 <InlineCode>generator.yml</InlineCode> 还是 Spring Boot 的 <InlineCode>application.yml</InlineCode>，配置结构完全一致，均位于 <InlineCode>easyfk.config.generator</InlineCode> 节点下：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:    # 项目配置
        ...
      code:       # 代码配置
        ...`}</CodeBlock>

              <H3>4.2 项目配置（project）</H3>
              <P>配置前缀：<InlineCode>easyfk.config.generator.project</InlineCode></P>
              <DocTable
                headers={["配置项", "必填", "类型", "默认值", "说明"]}
                rows={[
                  ["project-dir", "是", "String", "-", "项目输出根目录。例：D:\\workspace\\projects"],
                  ["group-id", "是", "String", "-", "Maven groupId，例：com.example"],
                  ["project-name", "是", "String", "-", "项目名称，同时作为项目根目录名和各子模块名前缀。例：my-app"],
                  ["base-package", "是", "String", "-", "Java 包根路径。例：com.example.myapp"],
                  ["project-type", "否", "枚举", "smart", "项目架构类型：single / microservice / smart"],
                  ["rpc-type", "否", "枚举", "cloud", "RPC 类型，仅 microservice 时生效。cloud / dubbo"],
                  ["build-type", "否", "枚举", "maven", "构建工具：maven → pom.xml；gradle → build.gradle"],
                  ["gradle-type", "否", "枚举", "groovy", "Gradle DSL 类型，仅 build-type: gradle 时生效。groovy / kotlin"],
                  ["orm-type", "否", "枚举", "MYBATIS", "ORM 框架：MYBATIS / MYBATIS_FLEX / HIBERNATE"],
                  ["prd-type", "否", "枚举", "none", "PRD / Controller 层策略：none / single / separation"],
                  ["log-type", "否", "枚举", "LOGBACK", "日志框架：LOGBACK / LOG4J2"],
                  ["framework-version", "否", "String", "{最新版}", "EasyFK 框架版本号"],
                  ["project-version", "否", "String", "1.0.0-SNAPSHOT", "生成的项目版本号"],
                  ["create-prd-project", "否", "Boolean", "true", "是否生成 PRD（Controller）子项目"],
                  ["create-repository", "否", "Boolean", "false", "是否生成独立的 Repository 子项目"],
                  ["controller-auto-config", "否", "Boolean", "false", "是否为 Controller 层生成 AutoConfiguration 自动装配配置"],
                ]}
              />

              <H4>project-type 详细说明</H4>
              <DocTable
                headers={["值", "说明"]}
                rows={[
                  ["single", "单体项目，所有代码在一个工程中，无子模块拆分"],
                  ["microservice", "标准微服务架构，生成 API + Server + PRD 模块，支持选择一种 RPC 方式（Cloud 或 Dubbo）"],
                  ["smart", "多栈微服务，在 microservice 基础上同时生成 Spring Cloud 和 Dubbo 两套 RPC 远程调用通道"],
                ]}
              />

              <H3>4.3 代码配置（code）</H3>
              <P>配置前缀：<InlineCode>easyfk.config.generator.code</InlineCode></P>

              <H4>基本配置</H4>
              <DocTable
                headers={["配置项", "必填", "类型", "默认值", "说明"]}
                rows={[
                  ["module-name", "是", "String", "-", "模块名称，用于配置类名、远程调用 serviceId、Controller 路径前缀等。例：myapp"],
                  ["author", "否", "String", "liu yijun", "代码注释中的作者信息"],
                  ["orm-type", "否", "枚举", "MYBATIS", "ORM 类型：MYBATIS / MYBATIS_FLEX / HIBERNATE"],
                  ["spring-annotation", "否", "Boolean", "true", "是否在实现类上添加 Spring 注解（如 @Repository、@Service）。project-type 为 smart 时无效"],
                  ["create-controller", "否", "Boolean", "true", "是否生成 Controller 层代码（全局控制，可被 Model 级别覆盖）"],
                  ["extends-supper-class", "否", "Boolean", "true", "Entity 是否继承框架基类，基类提供 deleted、insertTime、lastUpdateTime 字段"],
                ]}
              />

              <H4>数据库连接配置</H4>
              <DocTable
                headers={["配置项", "必填", "类型", "默认值", "说明"]}
                rows={[
                  ["db-type", "否", "枚举", "MYSQL", "数据库类型，完整可选值见第 8.1 节"],
                  ["db-short-url", "条件必填", "String", "-", "数据库短连接地址，格式：host:port/database。仅使用 from-db-tables 时必填"],
                  ["db-user", "否", "String", "root", "数据库用户名"],
                  ["db-pwd", "条件必填", "String", "-", "数据库密码。仅使用 from-db-tables 时必填"],
                ]}
              />
              <TipBox>
                <Strong>连接字符串格式说明：</Strong> <InlineCode>db-short-url</InlineCode> 只需填写 <InlineCode>host:port/database</InlineCode> 部分，生成器会自动拼接完整的 JDBC URL。例如 MySQL 会自动拼接为 <InlineCode>jdbc:mysql://host:port/database?characterEncoding=UTF-8&useSSL=false&...</InlineCode>
              </TipBox>

              <H4>表配置</H4>
              <DocTable
                headers={["配置项", "必填", "类型", "默认值", "说明"]}
                rows={[
                  ["table-prefix", "否", "String", "-", "全局表名前缀，生成类名时自动去除。例：配置 base_，表 base_product → 类名 Product"],
                  ["from-db-tables", "否", "String", "-", "需要从数据库读取结构的表名列表，逗号分隔。例：product,order,user_info"],
                ]}
              />

              <H3>4.4 Model 定义配置</H3>
              <P>Model 定义在 <InlineCode>code.model-list</InlineCode> 节点下，是一个列表。每个 Model 对应数据库中的一张表，也对应生成的一组完整分层代码。</P>
              <CodeBlock lang="yaml">{`code:
  model-list:
    - model-name: Product
      model-desc: 商品信息
      # ... 更多配置
    - model-name: Order
      model-desc: 订单信息`}</CodeBlock>

              <H4>Model 配置项详解</H4>
              <DocTable
                headers={["配置项", "必填", "类型", "默认值", "说明"]}
                rows={[
                  ["model-name", "是", "String", "-", "模型名称，大驼峰命名。对应所有类名前缀。例：Product → ProductDto、ProductReq 等"],
                  ["model-desc", "否", "String", "-", "模型中文描述，用于代码注释、Swagger 文档描述等"],
                  ["table-name", "否", "String", "自动推导", "对应的数据库表名。不填则根据 model-name 自动推导（驼峰转下划线 + 表前缀）"],
                  ["id-type", "否", "String", "String", "主键字段的 Java 类型：String（UUID 策略）、Long（自增主键）"],
                  ["id-is-auto", "否", "Boolean", "false", "主键是否自增。true → IdType.AUTO；false → IdType.ASSIGN_UUID"],
                  ["super-class", "否", "String", "BaseMyBatisPlusEntity", "Entity 父类的完全限定类名，框架基类提供公共字段"],
                  ["only-repository", "否", "Boolean", "false", "是否只生成 Repository 层（Entity + Mapper + Repository + DTO）"],
                  ["create-controller", "否", "Boolean", "true", "是否为该 Model 生成 Controller，优先级高于全局配置"],
                  ["table-prefix", "否", "String", "继承全局", "该 Model 专属的表前缀"],
                  ["forbidden-filed", "否", "String", "-", "禁用字段名（如 forbidden、status），设置后 Controller 会生成启用/禁用接口"],
                  ["resource-group", "否", "String", "继承全局", "该 Model 的资源权限分组"],
                  ["resource-name", "否", "String", "继承全局", "该 Model 的资源权限名称"],
                  ["resource-id", "否", "String", "继承全局", "该 Model 的资源权限 ID"],
                  ["resource-path", "否", "String", "继承全局", "该 Model 的资源权限前端路由路径"],
                  ["resource-sort", "否", "Integer", "继承全局", "资源组排序值"],
                  ["model-resource-sort", "否", "Integer", "自动计算", "当前 Model 的资源排序值（根据 increment-star 递增）"],
                ]}
              />
              <TipBox>
                <Strong>from-db-tables 和 model-list 的关系：</Strong> 两者可以同时使用。<InlineCode>from-db-tables</InlineCode> 自动从数据库读取表结构生成 Model 信息。如果同一个 Model 在 <InlineCode>model-list</InlineCode> 中也有定义，则 <InlineCode>model-list</InlineCode> 中的配置作为覆盖项优先生效。这允许你通过数据库自动解析基本结构，同时手动微调特定 Model 的配置。
              </TipBox>

              <H3>4.5 资源权限配置</H3>
              <P>用于在 Controller 接口上自动生成 EasyFK 框架的资源权限注解（<InlineCode>@ResourceController</InlineCode>、<InlineCode>@AuthResource</InlineCode>），与框架权限体系对接。</P>
              <P>配置前缀：<InlineCode>easyfk.config.generator.code</InlineCode></P>
              <DocTable
                headers={["配置项", "必填", "类型", "默认值", "说明"]}
                rows={[
                  ["create-resource-annotation", "否", "Boolean", "false", "总开关：是否生成资源权限注解"],
                  ["resource-group", "否", "String", "-", "资源所属分组标识"],
                  ["resource-name", "否", "String", "-", "资源所属分组的显示名称"],
                  ["resource-id", "否", "String", "-", "资源分组 ID"],
                  ["resource-path", "否", "String", "-", "资源分组对应的前端路由路径"],
                  ["resource-sort", "否", "Integer", "10000", "资源分组的排序基础值"],
                  ["module-resource-sort", "否", "Integer", "10000", "各 Model 资源排序的起始值"],
                  ["increment-star", "否", "Integer", "100", "多个 Model 之间排序值的自增步长"],
                ]}
              />
              <P>启用后生成的 Controller 示例注解：</P>
              <CodeBlock lang="java">{`@ResourceController(group = "operationSetting", id = "operationSetting",
    name = "运营管理", sort = 81000, path = "/operation")
public class ProductController {

    @AuthResource(id = "productManage", name = "商品管理",
        pId = "operationSetting", pName = "运营管理",
        sort = 10100, path = "/operation/product",
        category = ResourceCategory.menu)
    public ResponseResult<List<ProductResp>> queryPage(...) { ... }
}`}</CodeBlock>

              {/* ============== 5. 项目架构类型详解 ============== */}
              <H2 id="sec-arch">5. 项目架构类型详解</H2>

              <H3>5.1 SINGLE 单体架构</H3>
              <P><Strong>适用场景：</Strong> 中小型项目、快速原型验证、内部工具系统</P>
              <P><Strong>配置：</Strong> <InlineCode>project-type: single</InlineCode></P>
              <P><Strong>生成的项目结构：</Strong></P>
              <CodeBlock lang="plaintext">{`my-app/
├── pom.xml (或 build.gradle)
├── src/main/java/com/example/myapp/
│   ├── ServerApp.java                          # 启动类
│   ├── controller/
│   │   └── ProductController.java              # Controller（直接调用 Service）
│   ├── api/
│   │   ├── dto/ProductDto.java                 # DTO
│   │   ├── param/ProductParam.java             # 查询参数
│   │   ├── request/
│   │   │   ├── ProductReq.java                 # 请求对象
│   │   │   └── ProductEditReq.java             # 编辑请求对象
│   │   └── response/ProductResp.java           # 响应对象
│   └── service/
│       ├── IProductService.java                # 服务接口
│       ├── impl/ProductServiceImpl.java        # 服务实现
│       ├── persistence/
│       │   ├── model/Product.java              # Entity
│       │   └── mapper/ProductMapper.java       # Mapper 接口
│       └── repository/
│           ├── IProductRepository.java         # 仓储接口
│           └── impl/ProductRepositoryImpl.java # 仓储实现
├── src/main/resources/
│   └── mappings/ProductMapper.xml              # Mapper XML
└── config/
    ├── application.yml
    ├── application-dev.yml
    ├── application-test.yml
    ├── application-prod.yml
    └── logback.xml (或 log4j2.xml)`}</CodeBlock>
              <H4>特点</H4>
              <BulletList items={[
                "所有代码在同一个工程中",
                "Controller 直接依赖 Service 层，无 Remote/API 中间层",
                <><InlineCode>{"{basePackage}.service"}</InlineCode> 代替 <InlineCode>{"{basePackage}.server"}</InlineCode></>,
                <>Service 接口路径使用 <InlineCode>{"{basePackage}.api"}</InlineCode></>,
              ]} />

              <H3>5.2 MICROSERVICE 微服务架构</H3>
              <P><Strong>适用场景：</Strong> 标准微服务拆分，使用单一 RPC 协议（Spring Cloud 或 Dubbo）</P>
              <P><Strong>配置：</Strong> <InlineCode>project-type: microservice</InlineCode>，<InlineCode>rpc-type: cloud</InlineCode> 或 <InlineCode>dubbo</InlineCode></P>
              <P><Strong>生成的项目结构（以 Spring Cloud 为例）：</Strong></P>
              <CodeBlock lang="plaintext">{`my-app/
├── pom.xml (或 build.gradle + settings.gradle)    # 父工程
│
├── my-app-api/                                     # API 定义模块
│   ├── pom.xml
│   └── src/main/java/com/example/myapp/api/
│       ├── IProductApi.java                        # API 接口（仅 SMART 架构生成）
│       ├── dto/ProductDto.java
│       ├── param/ProductParam.java
│       ├── request/
│       │   ├── ProductReq.java
│       │   └── ProductEditReq.java
│       └── response/ProductResp.java
│
├── my-app-server/                                  # 服务实现模块
│   ├── pom.xml
│   ├── src/main/java/com/example/myapp/
│   │   ├── ServerApp.java                          # 启动类
│   │   └── server/
│   │       ├── persistence/model/Product.java
│   │       ├── persistence/mapper/ProductMapper.java
│   │       ├── repository/
│   │       │   ├── IProductRepository.java
│   │       │   └── impl/ProductRepositoryImpl.java
│   │       ├── service/
│   │       │   ├── IProductService.java
│   │       │   └── impl/ProductServiceImpl.java
│   │       └── impl/
│   │           └── ProductRemoteImpl.java          # RPC 实现
│   ├── src/main/resources/mappings/ProductMapper.xml
│   └── config/
│       ├── application.yml / -dev.yml / -test.yml / -prod.yml
│       └── logback.xml
│
└── my-app-prd/                                     # PRD 层（Controller）
    ├── pom.xml
    └── src/main/java/com/example/myapp/
        ├── ClientApp.java                          # 启动类
        └── controller/
            └── ProductController.java              # Controller（通过 Remote 调用 Server）`}</CodeBlock>
              <P>当 <InlineCode>prd-type: separation</InlineCode> 时，PRD 层会分为两个子项目：</P>
              <CodeBlock lang="plaintext">{`my-app-prd/
├── my-app-prd-client/    # C 端 / 用户端 Controller
│   ├── ClientApp.java
│   └── controller/ProductController.java
└── my-app-prd-bms/       # B 端 / 管理后台 Controller
    ├── BmsApp.java
    └── controller/ProductBmsController.java`}</CodeBlock>

              <H3>5.3 SMART 多栈微服务架构</H3>
              <P><Strong>适用场景：</Strong> 大型平台项目，需要同时支持 Spring Cloud 和 Dubbo 两种 RPC 协议</P>
              <P><Strong>配置：</Strong> <InlineCode>project-type: smart</InlineCode></P>
              <P><Strong>生成的项目结构：</Strong></P>
              <CodeBlock lang="plaintext">{`my-app/
├── pom.xml
│
├── my-app-api/                                     # API 定义模块
│   └── com/example/myapp/api/
│       ├── IProductApi.java                        # 统一 API 接口
│       ├── dto/ProductDto.java
│       ├── param/ProductParam.java
│       ├── request/ProductReq.java / ProductEditReq.java
│       └── response/ProductResp.java
│
├── my-app-server/                                  # 服务实现模块
│   └── com/example/myapp/server/
│       ├── persistence/model/Product.java
│       ├── persistence/mapper/ProductMapper.java
│       ├── repository/IProductRepository.java + impl/
│       ├── service/IProductService.java + impl/
│       ├── impl/ProductApiServerImpl.java          # API 服务端实现
│       └── config/MyappServerConfig.java           # 自动装配配置
│
├── my-app-remote/                                  # 远程调用模块（父项目）
│   │
│   ├── my-app-cloud-api/                           # Spring Cloud 客户端
│   │   └── com/example/myapp/remote/
│   │       ├── IProductRemote.java                 # Feign 接口
│   │       ├── impl/ProductApiScImpl.java          # API 的 SC 实现
│   │       ├── properties/MyappApiProperties.java  # 配置属性
│   │       └── config/MyappApiConfig.java          # 自动装配
│   │
│   ├── my-app-cloud-provider/                      # Spring Cloud 服务提供者
│   │   └── com/example/myapp/remote/provider/
│   │       └── impl/ProductRemoteImpl.java         # Remote 实现
│   │
│   ├── my-app-dubbo-api/                           # Dubbo 客户端
│   │   └── com/example/myapp/remote/
│   │       ├── IProductRemote.java                 # Dubbo 接口
│   │       └── impl/ProductApiDubboImpl.java       # API 的 Dubbo 实现
│   │
│   └── my-app-dubbo-provider/                      # Dubbo 服务提供者
│       └── com/example/myapp/remote/provider/
│           └── impl/ProductRemoteImpl.java
│
└── my-app-prd/                                     # PRD / Controller 层
    ├── my-app-prd-client/
    │   └── controller/ProductController.java
    └── my-app-prd-bms/
        └── controller/ProductBmsController.java`}</CodeBlock>
              <H4>SMART 架构的关键特点</H4>
              <BulletList items={[
                <>定义了统一的 <InlineCode>IProductApi</InlineCode> 接口</>,
                <>Server 模块实现 <InlineCode>ProductApiServerImpl</InlineCode>（本地直接调用 Service）</>,
                <>Cloud API 模块实现 <InlineCode>ProductApiScImpl</InlineCode>（通过 Feign 远程调用）</>,
                <>Dubbo API 模块实现 <InlineCode>ProductApiDubboImpl</InlineCode>（通过 Dubbo 远程调用）</>,
                "Controller 层依赖 API 接口，运行时通过 Spring Boot AutoConfiguration 自动注入对应的实现",
                "切换调用方式只需更换依赖包，无需修改业务代码",
              ]} />

              {/* ============== 6. 生成代码详解 ============== */}
              <H2 id="sec-codegen">6. 生成代码详解</H2>
              <P>以下以 Model 名为 <InlineCode>Product</InlineCode>、模块名为 <InlineCode>myapp</InlineCode> 为例说明生成的各层代码。</P>

              <H3>6.1 Entity 实体类</H3>
              <P><Strong>文件：</Strong> <InlineCode>Product.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{server}/persistence/model/"}</InlineCode></P>
              <P>生成的 Entity 根据 <InlineCode>orm-type</InlineCode> 不同有细微差异，以下为 MyBatis（默认）：</P>
              <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("product")
@AutoMapper(target = ProductDto.class)
public class Product extends BaseMyBatisPlusEntity<Product> {

    @PrimaryKey
    @TableId(type = IdType.ASSIGN_UUID)  // 或 IdType.AUTO（当 id-is-auto: true）
    @Column(comment = "商品信息ID")
    private String productId;

    @Column(comment = "商品名称")
    private String productName;

    @Column(comment = "商品价格")
    private BigDecimal price;
}`}</CodeBlock>
              <H4>特点</H4>
              <BulletList items={[
                <>使用 <InlineCode>@AutoMapper</InlineCode> 注解实现 Entity 与 DTO 的自动转换（基于 MapStruct-Plus）</>,
                <>使用 <InlineCode>@Column(comment = "...")</InlineCode> 记录字段注释</>,
                <>使用 <InlineCode>@PrimaryKey</InlineCode> 标注主键字段</>,
                <>继承框架基类，自动获得 <InlineCode>deleted</InlineCode>、<InlineCode>insertTime</InlineCode>、<InlineCode>lastUpdateTime</InlineCode> 字段</>,
              ]} />

              <H3>6.2 Mapper 接口与 XML</H3>
              <P><Strong>Mapper 接口：</Strong> <InlineCode>ProductMapper.java</InlineCode></P>
              <CodeBlock lang="java">{`public interface ProductMapper extends BaseMapper<Product> {
}`}</CodeBlock>
              <P><Strong>Mapper XML：</Strong> <InlineCode>ProductMapper.xml</InlineCode> — 位于 <InlineCode>resources/mappings/</InlineCode> 目录，初始生成为空 XML 骨架，可手动扩展自定义 SQL。</P>

              <H3>6.3 DTO 数据传输对象</H3>
              <P><Strong>文件：</Strong> <InlineCode>ProductDto.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{api}/dto/"}</InlineCode></P>
              <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "商品信息数据对象")
@SuperBuilder
@NoArgsConstructor
public class ProductDto extends BaseDto {

    @PrimaryKey
    @Schema(description = "商品信息ID")
    private String productId;

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "商品价格")
    private BigDecimal price;
}`}</CodeBlock>
              <H4>特点</H4>
              <BulletList items={[
                <>继承 <InlineCode>BaseDto</InlineCode></>,
                <>每个字段都带有 <InlineCode>@Schema</InlineCode> 注解用于 Swagger 文档</>,
                <>支持 <InlineCode>@SingleUniqueField</InlineCode> 和 <InlineCode>@CombUniqueField</InlineCode> 注解（从 Entity 中解析）</>,
                <><Strong>DTO 文件使用强制刷新策略</Strong>，每次生成都会重新生成，以保持与表结构同步</>,
              ]} />

              <H3>6.4 Param 查询参数对象</H3>
              <P><Strong>文件：</Strong> <InlineCode>ProductParam.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{api}/param/"}</InlineCode></P>
              <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "商品信息数据参数对象")
@SuperBuilder
@NoArgsConstructor
public class ProductParam extends BasicParam {

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "商品价格")
    private BigDecimal price;

    // 当字段标注了 @BetweenConditionField 时，自动生成区间查询字段：
    // @Schema(description = "创建时间开始")
    // private LocalDateTime createTimeStart;
    // @Schema(description = "创建时间结束")
    // private LocalDateTime createTimeEnd;
}`}</CodeBlock>
              <H4>特点</H4>
              <BulletList items={[
                <>继承 <InlineCode>BasicParam</InlineCode>（包含分页、排序等通用查询参数）</>,
                <>标注了 <InlineCode>@BetweenConditionField</InlineCode> 的字段会自动生成 <InlineCode>xxxStart</InlineCode> 和 <InlineCode>xxxEnd</InlineCode> 区间查询字段</>,
                <><Strong>Param 文件使用强制刷新策略</Strong></>,
              ]} />

              <H3>6.5 Req 请求对象</H3>
              <P><Strong>文件：</Strong> <InlineCode>ProductReq.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{api}/request/"}</InlineCode></P>
              <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "商品信息数据请求对象")
@SuperBuilder
@NoArgsConstructor
public class ProductReq extends ProductParam {
}`}</CodeBlock>
              <P>继承自 <InlineCode>ProductParam</InlineCode>，作为 Service / API 层方法的输入参数类型。初始为空类，可按需扩展请求专用字段。</P>

              <H3>6.6 Resp 响应对象</H3>
              <P><Strong>文件：</Strong> <InlineCode>ProductResp.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{api}/response/"}</InlineCode></P>
              <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "商品信息数据响应对象")
@SuperBuilder
@NoArgsConstructor
public class ProductResp extends ProductDto {
}`}</CodeBlock>
              <P>继承自 <InlineCode>ProductDto</InlineCode>，作为 Service / API 层方法的返回类型。初始为空类，可按需扩展响应专用字段（如计算字段、关联信息等）。</P>

              <H3>6.7 EditReq 编辑请求对象</H3>
              <P><Strong>文件：</Strong> <InlineCode>ProductEditReq.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{api}/request/"}</InlineCode></P>
              <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "商品信息数据编辑对象")
@SuperBuilder
@NoArgsConstructor
public class ProductEditReq extends ProductDto {
}`}</CodeBlock>
              <P>继承自 <InlineCode>ProductDto</InlineCode>，用于 Controller 层新增/编辑接口的入参。</P>

              <H3>6.8 Repository 仓储层</H3>
              <P><Strong>接口：</Strong> <InlineCode>IProductRepository.java</InlineCode></P>
              <CodeBlock lang="java">{`public interface IProductRepository extends IBaseRepository<ProductDto, String> {
}`}</CodeBlock>
              <P><Strong>实现：</Strong> <InlineCode>ProductRepositoryImpl.java</InlineCode></P>
              <CodeBlock lang="java">{`@Repository  // 当 spring-annotation: true 时生成
public class ProductRepositoryImpl
    extends BaseMyBatisRepositoryImpl<ProductMapper, ProductDto, Product, String>
    implements IProductRepository {
}`}</CodeBlock>
              <P>Repository 层封装了数据访问逻辑，继承自框架基类提供标准 CRUD 操作。</P>

              <H3>6.9 Service 服务层</H3>
              <P><Strong>接口：</Strong> <InlineCode>IProductService.java</InlineCode></P>
              <CodeBlock lang="java">{`public interface IProductService extends IBaseService<ProductResp, String, ProductReq> {
}`}</CodeBlock>
              <P><Strong>实现：</Strong> <InlineCode>ProductServiceImpl.java</InlineCode> — Service 层已自动生成完整的 CRUD 实现方法：</P>
              <DocTable
                headers={["方法", "说明"]}
                rows={[
                  ["queryById(id)", "根据 ID 查询单条记录"],
                  ["queryOneByField(field, value)", "根据单个字段查询"],
                  ["queryList(searchRequest)", "条件查询列表"],
                  ["queryOne(searchRequest)", "条件查询单条"],
                  ["count(searchRequest)", "条件统计数量"],
                  ["exists(searchRequest)", "条件判断是否存在"],
                  ["queryByPage(searchRequest)", "分页查询"],
                  ["save(modifyRequest)", "新增或修改"],
                  ["delete(modifyRequest)", "删除"],
                  ["insertAndReturnId(req)", "新增并返回主键"],
                ]}
              />

              <H3>6.10 API 接口层</H3>
              <P><Strong>仅 SMART 架构生成。</Strong></P>
              <P><Strong>文件：</Strong> <InlineCode>IProductApi.java</InlineCode></P>
              <CodeBlock lang="java">{`public interface IProductApi extends IBaseApi<ProductResp, String, ProductReq> {
}`}</CodeBlock>
              <P>API 接口是 SMART 架构的核心抽象，定义了统一的业务操作契约。三种实现类分别通过不同方式调用 Service：</P>
              <BulletList items={[
                <><InlineCode>ProductApiServerImpl</InlineCode>：本地直接调用 Service</>,
                <><InlineCode>ProductApiScImpl</InlineCode>：通过 Spring Cloud Feign 远程调用</>,
                <><InlineCode>ProductApiDubboImpl</InlineCode>：通过 Dubbo 远程调用</>,
              ]} />

              <H3>6.11 Controller 控制器层</H3>
              <P>Controller 层根据 <InlineCode>project-type</InlineCode> 和 <InlineCode>prd-type</InlineCode> 的不同组合生成不同风格的代码：</P>
              <DocTable
                headers={["project-type", "prd-type", "生成的 Controller"]}
                rows={[
                  ["single", "single", "直接注入 IProductService，本地调用"],
                  ["microservice + cloud", "single", "注入 Remote 接口（Feign），远程调用"],
                  ["microservice + dubbo", "single", "注入 Remote 接口（Dubbo），远程调用"],
                  ["smart", "single", "注入 IProductApi，具体实现由自动装配决定"],
                  ["任意", "separation", "同时生成 ProductController（C端）和 ProductBmsController（B端）"],
                ]}
              />
              <P><Strong>Controller 生成的标准接口：</Strong></P>
              <DocTable
                headers={["接口", "HTTP 方法", "路径", "说明"]}
                rows={[
                  ["详情查询", "GET", "/api/{module}/{model}/detail", "根据 ID 查询详情"],
                  ["分页查询", "GET", "/api/{module}/{model}/queryPage", "分页条件查询"],
                  ["新增/编辑", "POST", "/api/{module}/{model}/addOrEdit", "新增或编辑记录"],
                  ["批量删除", "POST", "/api/{module}/{model}/delete", "根据 ID 列表批量删除"],
                  ["启用/禁用", "POST", "/api/{module}/{model}/disable", "仅当配置了 forbidden-filed 时生成"],
                ]}
              />

              <H3>6.12 SpringCloud Remote 远程调用层</H3>
              <P>在 MICROSERVICE（rpc-type: cloud）和 SMART 架构中生成。</P>
              <P><Strong>Feign 接口：</Strong> <InlineCode>IProductRemote.java</InlineCode></P>
              <CodeBlock lang="java">{`@FeignClient(value = "\${easyfk.config.remote.myapp.service-id:server}",
    path = "\${easyfk.config.remote.myapp.base-path:/remote}/myapp/product")
public interface IProductRemote extends IBaseRemote<ProductResp, String, ProductReq> {
}`}</CodeBlock>
              <P><Strong>实现类：</Strong> <InlineCode>ProductRemoteImpl.java</InlineCode> — 在 Server / Provider 侧实现 Remote 接口，接收远程调用并委托给 Service 层。</P>

              <H3>6.13 Dubbo Remote 远程调用层</H3>
              <P>在 MICROSERVICE（rpc-type: dubbo）和 SMART 架构中生成。</P>
              <P><Strong>接口：</Strong> <InlineCode>IProductRemote.java</InlineCode></P>
              <CodeBlock lang="java">{`public interface IProductRemote extends IDubboBaseRemote<ProductResp, String, ProductReq> {
}`}</CodeBlock>
              <P><Strong>实现类：</Strong> <InlineCode>ProductRemoteImpl.java</InlineCode> — Dubbo 服务提供者实现。</P>

              <H3>6.14 AutoConfiguration 自动装配</H3>
              <P>主要用于 SMART 架构，以及启用了 <InlineCode>controller-auto-config</InlineCode> 的微服务架构。</P>
              <P>生成器会自动为以下模块创建 Spring Boot AutoConfiguration：</P>
              <NumberList items={[
                <><Strong>Server 模块</Strong>：<InlineCode>{"{Module}ServerConfig.java"}</InlineCode> + <InlineCode>AutoConfiguration.imports</InlineCode> — 自动注册 Service、Repository、API 实现等 Bean</>,
                <><Strong>Remote Cloud API 模块</Strong>：<InlineCode>{"{Module}ApiConfig.java"}</InlineCode> + <InlineCode>AutoConfiguration.imports</InlineCode> — 自动注册 Feign 客户端相关 Bean</>,
                <><Strong>Remote Cloud Provider 模块</Strong>：<InlineCode>{"{Module}ProviderConfig.java"}</InlineCode> + <InlineCode>AutoConfiguration.imports</InlineCode> — 自动注册 Remote 实现 Bean</>,
                <><Strong>Remote Dubbo API/Provider 模块</Strong>：同上 Dubbo 版本</>,
                <><Strong>PRD Controller 模块</Strong>（当 <InlineCode>controller-auto-config: true</InlineCode>）：<InlineCode>{"{Module}ControllerConfig.java"}</InlineCode> / <InlineCode>{"{Module}ClientControllerConfig.java"}</InlineCode> / <InlineCode>{"{Module}BmsControllerConfig.java"}</InlineCode></>,
              ]} />

              <H3>6.15 启动类与配置文件</H3>
              <P>对于非 SINGLE 架构，Server 和 PRD 模块会各自生成：</P>
              <BulletList items={[
                <><Strong>启动类</Strong>：<InlineCode>ServerApp.java</InlineCode>、<InlineCode>ClientApp.java</InlineCode>、<InlineCode>BmsApp.java</InlineCode></>,
                <><Strong>配置文件</Strong>：<InlineCode>application.yml</InlineCode>（主配置）、<InlineCode>application-dev.yml</InlineCode>（开发环境）、<InlineCode>application-test.yml</InlineCode>（测试环境）、<InlineCode>application-prod.yml</InlineCode>（生产环境）</>,
                <><Strong>日志配置</Strong>：<InlineCode>logback.xml</InlineCode> 或 <InlineCode>log4j2.xml</InlineCode>（根据 <InlineCode>log-type</InlineCode> 配置）</>,
              ]} />

              {/* ============== 7. 生成命令与 API 参考 ============== */}
              <H2 id="sec-commands">7. 生成命令与 API 参考</H2>

              <H3>7.1 CLI 命令参考</H3>
              <H4>基本语法</H4>
              <CodeBlock lang="bash">{`efg [选项]
efg init [-o 文件名]`}</CodeBlock>

              <H4>生成命令</H4>
              <DocTable
                headers={["命令", "说明"]}
                rows={[
                  ["efg", "全量生成（项目骨架 + Entity + Mapper + 业务代码 + 自动装配配置）"],
                  ["efg -p", "仅生成项目骨架（目录结构 + 构建文件）"],
                  ["efg -m", "仅生成 Entity + Mapper（包含 Mapper XML）"],
                  ["efg -s", "仅生成业务代码（Repository / Service / API / Remote / Controller + DTO/Param 等）"],
                  ["efg -a", "仅生成自动装配配置（AutoConfiguration）"],
                  ["efg -d", "仅刷新 DTO 和 Param（数据库表结构变更后使用，不影响其他代码）"],
                ]}
              />

              <H4>组合使用</H4>
              <P>Flag 可以组合使用：</P>
              <DocTable
                headers={["命令", "说明"]}
                rows={[
                  ["efg -pm", "项目骨架 + Entity + Mapper（新项目初始化第一步）"],
                  ["efg -sa", "业务代码 + 自动装配配置（新增业务表后的第二步）"],
                  ["efg -pms", "项目骨架 + Entity + 全部业务代码"],
                ]}
              />

              <H4>其他选项</H4>
              <DocTable
                headers={["选项", "说明"]}
                rows={[
                  ["-c <文件>", "指定配置文件路径（默认读取当前目录下的 generator.yml）"],
                  ["-h, --help", "查看帮助信息"],
                  ["-V, --version", "查看版本号"],
                ]}
              />

              <H4>init 子命令</H4>
              <DocTable
                headers={["命令", "说明"]}
                rows={[
                  ["efg init", "在当前目录生成 generator.yml 配置模板"],
                  ["efg init -o my-config.yml", "指定输出文件名"],
                ]}
              />

              <H3>7.2 Java API 参考</H3>
              <P>通过 Spring 注入 <InlineCode>EasyfkGenerator</InlineCode> 使用：</P>
              <CodeBlock lang="java">{`@Resource
private EasyfkGenerator easyfkGenerator;`}</CodeBlock>
              <DocTable
                headers={["方法", "对应 CLI", "说明"]}
                rows={[
                  ["generateAll()", "efg", "全量生成（项目 + Model + 代码 + 自动装配）"],
                  ["generateProject()", "efg -p", "仅生成项目骨架"],
                  ["generateModel()", "efg -m", "仅生成 Entity + Mapper"],
                  ["generateProjectAndModel()", "efg -pm", "生成项目骨架 + Entity + Mapper"],
                  ["generateCode()", "efg -s", "生成业务代码"],
                  ["generateCodeAndConfig()", "efg -sa", "生成业务代码 + 自动装配配置"],
                  ["generateConfig()", "efg -a", "仅生成自动装配配置"],
                  ["updateDtoAndParam()", "efg -d", "仅刷新 DTO 和 Param"],
                ]}
              />

              {/* ============== 8. 数据库支持与类型映射 ============== */}
              <H2 id="sec-db">8. 数据库支持与类型映射</H2>

              <H3>8.1 支持的数据库</H3>
              <DocTable
                headers={["数据库类型（db-type 值）", "说明"]}
                rows={[
                  ["MYSQL", "MySQL（默认）"],
                  ["MARIADB", "MariaDB"],
                  ["POSTGRE_SQL", "PostgreSQL"],
                  ["ORACLE", "Oracle 11g 及以下"],
                  ["ORACLE_12C", "Oracle 12c+"],
                  ["SQL_SERVER", "SQL Server"],
                  ["SQL_SERVER2005", "SQL Server 2005"],
                  ["DB2", "IBM DB2"],
                  ["H2", "H2 内嵌数据库"],
                  ["HSQL", "HSQLDB"],
                  ["SQLITE", "SQLite"],
                  ["DM", "达梦数据库"],
                  ["KINGBASE_ES", "人大金仓 KingbaseES"],
                  ["GAUSS", "GaussDB"],
                  ["OCEAN_BASE", "OceanBase"],
                  ["CLICK_HOUSE", "ClickHouse"],
                  ["GBASE", "南大通用 GBase"],
                  ["OSCAR", "神通数据库"],
                  ["XU_GU", "虚谷数据库"],
                  ["PHOENIX", "Apache Phoenix（HBase）"],
                  ["FIREBIRD", "Firebird"],
                  ["SYBASE", "Sybase ASE"],
                  ["OTHER", "其他数据库"],
                ]}
              />

              <H3>8.2 字段类型映射规则</H3>
              <P>从数据库读取表结构时，字段类型会按以下规则自动映射为 Java 类型：</P>
              <DocTable
                headers={["数据库字段类型", "Java 类型"]}
                rows={[
                  ["DATETIME, TIMESTAMP, TIMESTAMPTZ, TIMESTAMP WITH TIME ZONE", "LocalDateTime"],
                  ["DATE", "LocalDate"],
                  ["TIME", "LocalTime"],
                  ["DECIMAL, NUMERIC", "BigDecimal"],
                  ["TINYINT, BOOLEAN, BOOL, BIT", "Boolean"],
                  ["INT, INT4, INTEGER, SMALLINT, INT2, SERIAL, SMALLSERIAL", "Integer"],
                  ["BIGINT, NUMBER, BIGSERIAL, IDENTITY, INT8", "Long"],
                  ["REAL, FLOAT4", "Float"],
                  ["DOUBLE, DOUBLE PRECISION, FLOAT, FLOAT8", "Double"],
                  ["BYTEA, BLOB, VARBINARY, BINARY", "byte[]"],
                  ["UUID", "UUID"],
                  ["VARCHAR, CHAR, TEXT, CLOB 及其他", "String"],
                ]}
              />
              <WarnBox>
                框架基类已包含 <InlineCode>deleted</InlineCode>、<InlineCode>insertTime</InlineCode>、<InlineCode>lastUpdateTime</InlineCode> 字段，从数据库读取时会自动排除这三个字段，不会重复生成。
              </WarnBox>

              {/* ============== 9. Entity 自定义注解 ============== */}
              <H2 id="sec-annotation">9. Entity 自定义注解说明</H2>
              <P>在已生成的 Entity 文件中，可以手动添加以下 EasyFK 框架提供的自定义注解。再次执行代码生成（<InlineCode>efg -s</InlineCode> 或 <InlineCode>efg -d</InlineCode>）时，生成器会自动解析这些注解并在 DTO、Param、Controller 层生成对应的逻辑。</P>

              <H3>@SingleUniqueField — 单字段唯一校验</H3>
              <CodeBlock lang="java">{`@SingleUniqueField(repetitionMsg = "商品名称已存在")
@Column(comment = "商品名称")
private String productName;`}</CodeBlock>
              <P><Strong>效果：</Strong> 生成的 DTO 中会带上 <InlineCode>@SingleUniqueField</InlineCode> 注解，框架在 save 操作时会自动进行唯一性校验。</P>

              <H3>@CombUniqueField — 组合唯一校验</H3>
              <CodeBlock lang="java">{`@CombUniqueField(repetitionMsg = "该分类下已存在同名商品", combinationField = "categoryId")
@Column(comment = "商品名称")
private String productName;`}</CodeBlock>
              <P><Strong>效果：</Strong> <InlineCode>productName</InlineCode> + <InlineCode>categoryId</InlineCode> 组合唯一校验，重复时返回指定提示信息。</P>

              <H3>@BetweenConditionField — 区间查询字段</H3>
              <CodeBlock lang="java">{`@BetweenConditionField
@Column(comment = "创建时间")
private LocalDateTime createTime;`}</CodeBlock>
              <P><Strong>效果：</Strong> 生成的 Param 类中会自动额外生成 <InlineCode>createTimeStart</InlineCode> 和 <InlineCode>createTimeEnd</InlineCode> 两个区间查询字段。</P>

              <H3>@ForbiddenField — 禁用字段</H3>
              <CodeBlock lang="java">{`@ForbiddenField(value = "forbidden")`}</CodeBlock>
              <P>此注解标注在 Entity 类级别（非字段级别），标识该 Model 具有启用/禁用功能。</P>
              <P><Strong>效果：</Strong> Controller 层会额外生成 <InlineCode>disable</InlineCode> 接口（启用/禁用），通过修改指定字段值实现。</P>

              {/* ============== 10. 文件覆盖策略 ============== */}
              <H2 id="sec-overwrite">10. 文件覆盖策略</H2>
              <P>生成器使用两种文件创建策略来保护开发者的手动修改：</P>
              <DocTable
                headers={["策略", "涉及文件", "行为"]}
                rows={[
                  ["不存在才创建 (createOnNotExistFile)", "Mapper 接口、Mapper XML、Repository、Service、API、Controller、Remote、Req、Resp、EditReq、启动类、配置文件", "文件已存在则跳过，绝不覆盖"],
                  ["删除后重建 (delAndCreateFile)", "Entity、DTO、Param、AutoConfiguration 配置类", "每次生成都会删除旧文件并重新生成，确保与数据库结构同步"],
                ]}
              />
              <H4>实际含义</H4>
              <BulletList items={[
                <><Strong>安全的文件（可放心手动修改）：</Strong> Service 实现、Repository 实现、Controller、Mapper XML 等。这些文件一旦生成就不会被覆盖，你可以自由添加自定义业务逻辑。</>,
                <><Strong>会被刷新的文件（不建议手动修改）：</Strong> Entity、DTO、Param。这些文件会随表结构变化而重新生成。如果需要在这些类中添加自定义字段，建议在 Entity 中添加后使用 <InlineCode>efg -d</InlineCode> 刷新 DTO/Param。</>,
                <><Strong>AutoConfiguration 文件：</Strong> 每次执行 <InlineCode>efg -a</InlineCode> 或 <InlineCode>efg</InlineCode> 时都会重建，因为需要扫描当前已有的实现类来生成完整的配置。</>,
              ]} />

              {/* ============== 11. 完整配置示例 ============== */}
              <H2 id="sec-examples">11. 完整配置示例</H2>

              <H3>11.1 单体项目（最小配置）</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: my-app
        base-package: com.example.myapp
        project-type: single
      code:
        module-name: myapp
        model-list:
          - model-name: Product
            model-desc: 商品信息
          - model-name: Order
            model-desc: 订单信息`}</CodeBlock>

              <H3>11.2 微服务项目（Spring Cloud）</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: order-service
        base-package: com.example.order
        project-type: microservice
        rpc-type: cloud
        prd-type: single
        build-type: gradle
        framework-version: {最新版}
      code:
        module-name: order
        author: 开发者
        db-type: MYSQL
        db-short-url: localhost:3306/order_db
        db-user: root
        db-pwd: 123456
        from-db-tables: t_order,t_order_item
        table-prefix: t_`}</CodeBlock>

              <H3>11.3 微服务项目（Dubbo）</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: user-service
        base-package: com.example.user
        project-type: microservice
        rpc-type: dubbo
        prd-type: separation
        build-type: maven
        framework-version: {最新版}
      code:
        module-name: user
        db-type: POSTGRE_SQL
        db-short-url: localhost:5432/user_db
        db-user: postgres
        db-pwd: 123456
        from-db-tables: user_info,user_address
        model-list:
          - model-name: UserInfo
            model-desc: 用户信息
            forbidden-filed: status
          - model-name: UserAddress
            model-desc: 收货地址`}</CodeBlock>

              <H3>11.4 多栈微服务项目（SMART）</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.mcst
        project-name: trading
        base-package: com.mcst.trading
        project-type: smart
        prd-type: separation
        build-type: gradle
        gradle-type: groovy
        orm-type: MYBATIS
        log-type: LOGBACK
        framework-version: {最新版}
        project-version: 1.0.0-SNAPSHOT
        create-prd-project: true
        controller-auto-config: true
      code:
        module-name: trading
        author: 开发团队
        orm-type: MYBATIS
        spring-annotation: true
        create-controller: true
        db-type: MYSQL
        db-short-url: 192.168.1.100:3306/trading_db
        db-user: root
        db-pwd: secure_password
        table-prefix: t_
        from-db-tables: t_product,t_order,t_order_item,t_payment
        model-list:
          - model-name: Product
            model-desc: 商品
          - model-name: Order
            model-desc: 订单
          - model-name: OrderItem
            model-desc: 订单明细
            only-repository: true
          - model-name: Payment
            model-desc: 支付记录
            create-controller: false`}</CodeBlock>

              <H3>11.5 从数据库自动解析表结构</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: my-app
        base-package: com.example.myapp
        project-type: single
      code:
        module-name: myapp
        db-type: MYSQL
        db-short-url: localhost:3306/my_database
        db-user: root
        db-pwd: 123456
        table-prefix: base_
        from-db-tables: base_product,base_category,base_brand`}</CodeBlock>
              <H4>工作原理</H4>
              <NumberList items={[
                "生成器通过 JDBC 连接数据库",
                "使用 DatabaseMetaData 获取表结构（字段名、类型、注释、主键等）",
                <>自动去除表前缀（<InlineCode>base_product</InlineCode> → <InlineCode>Product</InlineCode>）</>,
                <>将下划线字段名转为驼峰命名（<InlineCode>product_name</InlineCode> → <InlineCode>productName</InlineCode>）</>,
                "按类型映射规则转换 Java 类型",
                <>读取字段注释作为 <InlineCode>@Schema</InlineCode> 和 <InlineCode>@Column</InlineCode> 的描述</>,
              ]} />

              <H3>11.6 带资源权限注解的配置</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.mcst
        project-name: user
        base-package: com.mcst.user
        project-type: smart
        prd-type: separation
        build-type: gradle
        create-prd-project: true
      code:
        module-name: user
        db-short-url: localhost:3306/user_db
        db-pwd: 123456
        create-resource-annotation: true
        resource-group: userManagement
        resource-id: userManagement
        resource-name: 用户管理
        resource-path: /user
        resource-sort: 80000
        module-resource-sort: 10000
        increment-star: 100
        model-list:
          - model-name: UserInfo
            model-desc: 会员
          - model-name: UserAddress
            model-desc: 收货地址
          - model-name: UserAccount
            model-desc: 账号`}</CodeBlock>
              <H4>排序值自动计算</H4>
              <BulletList items={[
                <>UserInfo: <InlineCode>modelResourceSort = 10000 + 100 = 10100</InlineCode></>,
                <>UserAddress: <InlineCode>modelResourceSort = 10000 + 200 = 10200</InlineCode></>,
                <>UserAccount: <InlineCode>modelResourceSort = 10000 + 300 = 10300</InlineCode></>,
              ]} />

              {/* ============== 12. 典型使用场景 ============== */}
              <H2 id="sec-scenarios">12. 典型使用场景</H2>

              <H3>场景一：从零创建新项目</H3>
              <CodeBlock lang="bash">{`mkdir my-project && cd my-project
efg init                    # 生成配置模板
# 编辑 generator.yml，填入所有配置
efg                         # 全量生成`}</CodeBlock>

              <H3>场景二：已有项目新增业务表</H3>
              <NumberList items={[
                "在数据库中创建新表",
                <>修改 <InlineCode>generator.yml</InlineCode>，在 <InlineCode>from-db-tables</InlineCode> 中添加新表名（或在 <InlineCode>model-list</InlineCode> 中新增 Model 定义）</>,
                "分步执行：",
              ]} />
              <CodeBlock lang="bash">{`efg -m                      # 生成新表的 Entity + Mapper
efg -s                      # 生成对应的业务代码
efg -a                      # 刷新自动装配配置（SMART 架构需要）`}</CodeBlock>
              <P>或一步到位：</P>
              <CodeBlock lang="bash">{`efg                         # 全量生成（已有文件不会被覆盖）`}</CodeBlock>

              <H3>场景三：数据库表结构变更（新增/修改字段）</H3>
              <CodeBlock lang="bash">{`efg -m                      # 重新生成 Entity（会覆盖）
efg -d                      # 刷新 DTO 和 Param（会覆盖）`}</CodeBlock>
              <TipBox>
                其他文件（Service、Controller 等）不会被重新生成，需要手动在对应文件中添加新字段的逻辑。
              </TipBox>

              <H3>场景四：使用不同配置文件管理多环境</H3>
              <CodeBlock lang="bash">{`efg -c dev-generator.yml            # 开发环境配置
efg -c prod-generator.yml -m        # 生产环境，仅生成 Model`}</CodeBlock>

              <H3>场景五：仅生成项目骨架（不涉及业务代码）</H3>
              <CodeBlock lang="bash">{`efg -p                      # 生成目录结构和构建文件，可以先搭建好项目结构再逐步添加业务`}</CodeBlock>

              <H3>场景六：Spring Boot Starter 方式分步生成</H3>
              <CodeBlock lang="java">{`@Test
public void step1_generateProjectAndModel() {
    easyfkGenerator.generateProjectAndModel();  // 第一步：项目骨架 + Entity
}

@Test
public void step2_generateCode() {
    easyfkGenerator.generateCode();             // 第二步：业务代码
}

@Test
public void step3_generateConfig() {
    easyfkGenerator.generateConfig();           // 第三步：自动装配
}

@Test
public void refreshDtoAndParam() {
    easyfkGenerator.updateDtoAndParam();        // 表结构变更后刷新
}`}</CodeBlock>

              {/* ============== 13. 常见问题 ============== */}
              <H2 id="sec-faq">13. 常见问题（FAQ）</H2>

              <H3>Q1: 提示&ldquo;找不到 java&rdquo;</H3>
              <P>请安装 JDK 21 或更高版本。安装后确认 <InlineCode>java -version</InlineCode> 输出的版本 &gt;= 21。</P>

              <H3>Q2: 生成的代码会覆盖我手动修改的文件吗？</H3>
              <P>不会（大部分情况下）。参见第 10 节文件覆盖策略：</P>
              <BulletList items={[
                <><Strong>不会覆盖的文件：</Strong> Mapper 接口、Mapper XML、Repository、Service、API、Controller、Remote、Req、Resp、EditReq、启动类、配置文件</>,
                <><Strong>会覆盖的文件：</Strong> Entity、DTO、Param、AutoConfiguration 配置类</>,
              ]} />

              <H3>Q3: from-db-tables 和 model-list 有什么区别？</H3>
              <DocTable
                headers={["特性", "from-db-tables", "model-list"]}
                rows={[
                  ["字段信息来源", "自动从数据库读取", "手动定义或配合 from-db-tables 使用"],
                  ["是否需要数据库连接", "是", "否"],
                  ["字段类型/注释", "自动解析", "无法定义字段（仅定义 Model 级配置）"],
                  ["适用场景", "表已经在数据库中存在", "设计阶段、无法连接数据库、或需要覆盖默认值"],
                ]}
              />
              <P>两者可同时使用。相同 Model 在两处都有定义时，<InlineCode>model-list</InlineCode> 中的配置优先。</P>

              <H3>Q4: 支持哪些数据库？</H3>
              <P>支持 22 种数据库，完整列表见第 8.1 节。</P>

              <H3>Q5: 配置文件格式和 Spring Boot 的 application.yml 一样吗？</H3>
              <P>完全一致。CLI 的 <InlineCode>generator.yml</InlineCode> 和 Spring Boot 的 <InlineCode>application.yml</InlineCode> 使用相同的配置节点结构。如果你已有 Spring Boot 项目中的生成器配置，可以直接复制到 <InlineCode>generator.yml</InlineCode> 中使用。</P>

              <H3>Q6: 如何只为部分 Model 生成 Controller？</H3>
              <P>在 <InlineCode>model-list</InlineCode> 中为特定 Model 设置 <InlineCode>create-controller: false</InlineCode>：</P>
              <CodeBlock lang="yaml">{`model-list:
  - model-name: OrderItem
    model-desc: 订单明细
    create-controller: false    # 该 Model 不生成 Controller`}</CodeBlock>

              <H3>Q7: 如何只生成 Repository 层（不需要 Service / Controller）？</H3>
              <P>在 <InlineCode>model-list</InlineCode> 中设置 <InlineCode>only-repository: true</InlineCode>：</P>
              <CodeBlock lang="yaml">{`model-list:
  - model-name: UserAddress
    model-desc: 用户地址
    only-repository: true       # 只生成 Entity + Mapper + Repository + DTO`}</CodeBlock>

              <H3>Q8: BaseMyBatisPlusEntity 和 BaseMyBatisPlusSimpleEntity 有什么区别？</H3>
              <DocTable
                headers={["父类", "包含的公共字段"]}
                rows={[
                  ["BaseMyBatisPlusEntity（默认）", "deleted、insertTime、lastUpdateTime"],
                  ["BaseMyBatisPlusSimpleEntity", "无公共字段（适用于关联表等简单场景）"],
                ]}
              />
              <P>通过 <InlineCode>model-list</InlineCode> 中的 <InlineCode>super-class</InlineCode> 配置切换：</P>
              <CodeBlock lang="yaml">{`model-list:
  - model-name: UserRole
    super-class: BaseMyBatisPlusSimpleEntity`}</CodeBlock>

              <H3>Q9: 如何处理表名和类名的映射？</H3>
              <P>生成器按以下规则自动处理：</P>
              <NumberList items={[
                <>去除 <InlineCode>table-prefix</InlineCode>（如 <InlineCode>base_product</InlineCode> → <InlineCode>product</InlineCode>）</>,
                <>下划线转驼峰（<InlineCode>product_info</InlineCode> → <InlineCode>productInfo</InlineCode>）</>,
                <>首字母大写（<InlineCode>productInfo</InlineCode> → <InlineCode>ProductInfo</InlineCode>）</>,
              ]} />
              <P>也可在 <InlineCode>model-list</InlineCode> 中通过 <InlineCode>table-name</InlineCode> 显式指定表名：</P>
              <CodeBlock lang="yaml">{`model-list:
  - model-name: ProductInfo    # 类名
    table-name: t_prd_info     # 显式指定表名，不走自动推导`}</CodeBlock>

              <H3>Q10: SMART 架构中如何切换 RPC 调用方式？</H3>
              <P>SMART 架构同时生成了 Spring Cloud 和 Dubbo 两套实现。切换 RPC 方式只需在运行时的依赖中选择不同的模块：</P>
              <BulletList items={[
                <>引入 <InlineCode>xxx-cloud-api</InlineCode> 依赖 → 使用 Spring Cloud Feign 远程调用</>,
                <>引入 <InlineCode>xxx-dubbo-api</InlineCode> 依赖 → 使用 Dubbo 远程调用</>,
                <>引入 <InlineCode>xxx-server</InlineCode> 依赖 → 本地直接调用（用于单体部署场景）</>,
              ]} />
              <P>无需修改任何业务代码。</P>

              {/* ============== 14. 附录 ============== */}
              <H2 id="sec-appendix">14. 附录</H2>

              <H3>14.1 枚举值速查表</H3>
              <DocTable
                headers={["配置项", "可选值", "说明"]}
                rows={[
                  ["project-type", "single, microservice, smart", "项目架构类型"],
                  ["rpc-type", "cloud, dubbo", "RPC 协议类型"],
                  ["build-type", "maven, gradle", "构建工具"],
                  ["gradle-type", "groovy, kotlin", "Gradle DSL 类型"],
                  ["orm-type", "MYBATIS, MYBATIS_FLEX, HIBERNATE", "ORM 框架"],
                  ["prd-type", "none, single, separation", "PRD 层策略"],
                  ["log-type", "LOGBACK, LOG4J2", "日志框架"],
                  ["db-type", "MYSQL, POSTGRE_SQL, ORACLE, ORACLE_12C, MARIADB, SQL_SERVER, DM, KINGBASE_ES, GAUSS, OCEAN_BASE, CLICK_HOUSE, H2, HSQL, SQLITE, DB2, GBASE, OSCAR, XU_GU, PHOENIX, FIREBIRD, SYBASE, SQL_SERVER2005, OTHER", "数据库类型"],
                ]}
              />

              <H3>14.2 生成文件清单</H3>
              <P>以下是一个 Model（如 <InlineCode>Product</InlineCode>）在不同架构下可能生成的全部文件：</P>
              <DocTable
                headers={["文件", "SINGLE", "MICRO", "SMART", "覆盖策略"]}
                rows={[
                  ["Product.java（Entity）", "✅", "✅", "✅", "强制刷新"],
                  ["ProductMapper.java", "✅", "✅", "✅", "不覆盖"],
                  ["ProductMapper.xml", "✅", "✅", "✅", "不覆盖"],
                  ["ProductDto.java", "✅", "✅", "✅", "强制刷新"],
                  ["ProductParam.java", "✅", "✅", "✅", "强制刷新"],
                  ["ProductReq.java", "✅", "✅", "✅", "不覆盖"],
                  ["ProductResp.java", "✅", "✅", "✅", "不覆盖"],
                  ["ProductEditReq.java", "✅", "✅", "✅", "不覆盖"],
                  ["IProductRepository.java", "✅", "✅", "✅", "不覆盖"],
                  ["ProductRepositoryImpl.java", "✅", "✅", "✅", "不覆盖"],
                  ["IProductService.java", "✅", "✅", "✅", "不覆盖"],
                  ["ProductServiceImpl.java", "✅", "✅", "✅", "不覆盖"],
                  ["IProductApi.java", "❌", "❌", "✅", "不覆盖"],
                  ["ProductApiServerImpl.java", "❌", "❌", "✅", "不覆盖"],
                  ["IProductRemote.java（Cloud）", "❌", "✅★", "✅", "不覆盖"],
                  ["ProductRemoteImpl.java（Cloud）", "❌", "✅★", "✅", "不覆盖"],
                  ["ProductApiScImpl.java", "❌", "❌", "✅", "不覆盖"],
                  ["IProductRemote.java（Dubbo）", "❌", "✅★", "✅", "不覆盖"],
                  ["ProductRemoteImpl.java（Dubbo）", "❌", "✅★", "✅", "不覆盖"],
                  ["ProductApiDubboImpl.java", "❌", "❌", "✅", "不覆盖"],
                  ["ProductController.java", "✅", "✅", "✅", "不覆盖"],
                  ["ProductBmsController.java", "❌", "✅★★", "✅★★", "不覆盖"],
                ]}
              />
              <TipBox>
                <p>★ MICROSERVICE 架构下根据 <InlineCode>rpc-type</InlineCode> 只生成 Cloud 或 Dubbo 其中一套</p>
                <p className="mt-1">★★ 仅当 <InlineCode>prd-type: separation</InlineCode> 时生成</p>
              </TipBox>

              {/* Footer note */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  EasyFK Generator v{'{最新版}'} — 让架构设计直接变成可运行的代码。
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />

              {/* Page Navigation */}
              <div className="flex gap-4">
                <div className="flex-1" />
                <Link href="/docs/reader/bom" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">BOM</span>
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
