"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Copy, Lightbulb, ArrowLeft, ArrowRight, Pencil, MessageSquare, Share2, Sparkles } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const tabs = ["后端", "业务", "前端", "移动端"]

const sidebarSections = [
  {
    items: [
      { label: "架构概览", active: true },
      { label: "技术栈说明" },
      { label: "目录结构" },
      { label: "环境配置" },
    ],
  },
  {
    title: "RBAC 权限体系",
    items: [{ label: "角色管理" }, { label: "菜单权限" }, { label: "数据权限" }],
  },
  {
    title: "动态路由",
    items: [{ label: "路由配置" }, { label: "菜单注册" }, { label: "菜单刷新策略" }],
  },
  {
    title: "组件体系",
    items: [{ label: "表格组件" }, { label: "表单组件" }, { label: "图表组件" }, { label: "上传组件" }],
  },
  {
    title: "API 对接",
    items: [{ label: "RESTful 规范" }, { label: "请求拦截器" }, { label: "异常处理" }],
  },
]

const outlineItems = [
  { label: "架构概览", active: true },
  { label: "核心分层结构" },
  { label: "模块注册机制" },
  { label: "依赖注入" },
  { label: "生命周期钩子" },
  { label: "最佳实践" },
]

const codeBlock1 = [
  [
    { text: " 1  ", color: "#525252" },
    { text: "import", color: "#A78BFA" },
    { text: " { Module } ", color: "#E5E5E5" },
    { text: "from", color: "#A78BFA" },
    { text: " '@easyBuild/core'", color: "#00FF88" },
  ],
  [
    { text: " 2  ", color: "#525252" },
    { text: "import", color: "#A78BFA" },
    { text: " { AuthGuard } ", color: "#E5E5E5" },
    { text: "from", color: "#A78BFA" },
    { text: " '@easyBuild/auth'", color: "#00FF88" },
  ],
  [{ text: " 3  ", color: "#525252" }],
  [
    { text: " 4  ", color: "#525252" },
    { text: "@Module", color: "#FBBF24" },
    { text: "({", color: "#E5E5E5" },
  ],
  [
    { text: " 5  ", color: "#525252" },
    { text: "  guards: [", color: "#60A5FA" },
    { text: "AuthGuard", color: "#E5E5E5" },
    { text: "],", color: "#60A5FA" },
  ],
  [
    { text: " 6  ", color: "#525252" },
    { text: "  routes: [", color: "#60A5FA" },
    { text: "'dynamic'", color: "#00FF88" },
    { text: "],", color: "#60A5FA" },
  ],
  [
    { text: " 7  ", color: "#525252" },
    { text: "})", color: "#E5E5E5" },
  ],
  [
    { text: " 8  ", color: "#525252" },
    { text: "export class", color: "#A78BFA" },
    { text: " AppModule", color: "#60A5FA" },
    { text: " {}", color: "#E5E5E5" },
  ],
]

const codeBlock2 = [
  { text: "src/modules/", color: "#E5E5E5" },
  { text: "├── user/               # 用户管理模块", color: "#60A5FA" },
  { text: "│   ├── views/         # 页面组件", color: "#9CA3AF" },
  { text: "│   ├── api.ts         # API 定义", color: "#00FF88" },
  { text: "│   └── store.ts       # 状态管理", color: "#A78BFA" },
  { text: "├── order/              # 订单管理模块", color: "#60A5FA" },
  { text: "└── product/            # 商品管理模块", color: "#60A5FA" },
]

export default function DocReaderPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
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
          <span>核心框架</span>
          <span>/</span>
          <span className="font-medium text-[#9CA3AF]">架构概览</span>
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
                  {si > 0 && <div className="my-1 h-px bg-[#1F2937]" />}
                  {section.title && (
                    <div className="flex h-9 items-center px-4">
                      <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#525252]">
                        {section.title}
                      </span>
                    </div>
                  )}
                  {section.items.map((item) => (
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
                  ))}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <ScrollArea className="flex-1 h-[calc(100vh-56px)]">
          <div className="mx-auto max-w-[800px] px-[60px] py-10">
            <div className="flex flex-col gap-8">
              {/* H1 */}
              <h1 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                架构概览
              </h1>
              {/* Meta */}
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>更新于 2025-03-01</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>阅读时间 ~8 min</span>
              </div>
              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />
              {/* Intro */}
              <p className="text-[15px] leading-[1.8] text-[#9CA3AF]">
                EasyBuild 采用经典的分层架构设计，将整个系统划分为表现层、业务逻辑层、数据访问层和基础设施层。这种分层方式确保了各层职责清晰、松耦合、易测试。
              </p>
              {/* H2 */}
              <div className="flex items-center gap-3">
                <h2 className="font-display text-[24px] font-bold text-white">核心分层结构</h2>
                <span className="text-[14px] text-[#00FF8860]">✨</span>
              </div>
              <p className="text-[15px] leading-[1.8] text-[#9CA3AF]">
                以下是 EasyBuild 框架的核心分层架构图，展示了各层之间的依赖关系和数据流向：
              </p>
              {/* Code Block 1 */}
              <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
                <div className="flex h-9 items-center justify-between border-b border-[#1F2937] px-4">
                  <span className="font-mono text-[11px] font-medium text-[#525252]">typescript</span>
                  <button type="button" className="flex items-center gap-1.5 text-[#525252] hover:text-[#9CA3AF]">
                    <Copy className="size-3.5" />
                    <span className="text-[11px]">复制</span>
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-5 py-4">
                  {codeBlock1.map((line, i) => (
                    <div key={i} className="flex">
                      {line.map((token, j) => (
                        <code
                          key={j}
                          className="whitespace-pre font-mono text-[13px]"
                          style={{ color: token.color }}
                        >
                          {token.text}
                        </code>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Tip Box */}
              <div className="flex gap-3 rounded-lg border-l-[3px] border-[#00FF8830] bg-[#00FF880A] px-5 py-4">
                <Lightbulb className="mt-0.5 size-[18px] shrink-0 text-[#00FF88]" />
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#00FF88]">TIP</span>
                  <p className="text-[13px] leading-[1.6] text-[#9CA3AF]">
                    建议在阅读本文档前，先熟悉 TypeScript 和 Vue 3 Composition API 的基本用法，这将帮助你更好地理解框架架构。
                  </p>
                </div>
              </div>
              {/* H2 - 2 */}
              <div className="flex items-center gap-3">
                <h2 className="font-display text-[24px] font-bold text-white">模块注册机制</h2>
                <span className="text-[14px] text-[#00FF8860]">✨</span>
              </div>
              <p className="text-[15px] leading-[1.8] text-[#9CA3AF]">
                EasyBuild 采用&ldquo;约定大于配置&rdquo;的设计理念。模块注册时，框架会自动扫描 modules/ 目录下的所有子目录，并根据约定的文件名称和结构自动注册路由、状态管理和 API 服务。这意味着新增一个业务模块只需创建对应的文件夹，无需手动修改任何全局配置。
              </p>
              {/* Code Block 2 */}
              <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
                <div className="flex h-9 items-center justify-between border-b border-[#1F2937] px-4">
                  <span className="font-mono text-[11px] font-medium text-[#525252]">plaintext</span>
                  <button type="button" className="flex items-center gap-1.5 text-[#525252] hover:text-[#9CA3AF]">
                    <Copy className="size-3.5" />
                    <span className="text-[11px]">复制</span>
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-5 py-4">
                  {codeBlock2.map((line, i) => (
                    <code
                      key={i}
                      className="whitespace-pre font-mono text-[12px]"
                      style={{ color: line.color }}
                    >
                      {line.text}
                    </code>
                  ))}
                </div>
              </div>
              {/* Separator */}
              <div className="h-px bg-[#1F2937]" />
              {/* Page Navigation */}
              <div className="flex gap-4">
                <a href="#" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>上一篇</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">技术栈说明</span>
                </a>
                <a href="#" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>下一篇</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">目录结构</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Right Sidebar */}
        <aside className="sticky top-14 h-[calc(100vh-56px)] w-[240px] shrink-0 border-l border-[#1F2937] bg-[#0A0B0D]">
          <ScrollArea className="h-full px-6 py-10">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#525252]">本页大纲</span>
              <div className="flex flex-col">
                {outlineItems.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex h-8 items-center border-l-2 px-3 text-[12px]",
                      item.active
                        ? "border-[#00FF88] font-medium text-[#00FF88]"
                        : "border-transparent text-[#737373]"
                    )}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 border-t border-[#1F2937] pt-4">
                <a href="#" className="flex items-center gap-2 text-[12px] text-[#525252] hover:text-[#9CA3AF]">
                  <Pencil className="size-3.5" />
                  在 GitHub 上编辑此页
                </a>
                <a href="#" className="flex items-center gap-2 text-[12px] text-[#525252] hover:text-[#9CA3AF]">
                  <MessageSquare className="size-3.5" />
                  提交反馈
                </a>
                <a href="#" className="flex items-center gap-2 text-[12px] text-[#525252] hover:text-[#9CA3AF]">
                  <Share2 className="size-3.5" />
                  分享此页
                </a>
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

      <SiteFooter />
    </div>
  )
}
