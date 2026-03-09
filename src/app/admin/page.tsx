import type { Metadata } from "next"
import Link from "next/link"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "中后台管理系统 — Next.js 15 + React 19 企业级后台",
  description:
    "基于 Next.js 15、React 19、Shadcn/ui 构建的企业级中后台管理系统，40+ UI 组件、20+ 主题色、RBAC 权限体系，5 分钟完成 CRUD 联调。",
}

const stats = [
  { value: "40+", label: "UI组件", color: "#28C840" },
  { value: "20+", label: "主题色", color: "#FEBC2E" },
  { value: "RBAC", label: "权限体系", color: "#FF5F57" },
  { value: "5min", label: "CRUD联调", color: "#60A5FA" },
]

const valueCards = [
  { icon: "⌁", title: "业务无关", desc: "更换一套后端接口，它就是另一个全新的管理平台。无论零售电商、仓储物流、内容运营、企业 OA，都可基于此快速搭建。", borderColor: "#00FF8820", iconColor: "#00FF88" },
  { icon: "⚒", title: "按需组装", desc: "内置多种通用业务模块（权限管理、基础数据、内容运营、系统配置等），均可根据实际业务自由选择、裁剪或扩展。", borderColor: "#60A5FA20", iconColor: "#60A5FA" },
  { icon: "⚡", title: "即插即用", desc: "新增一个业务模块，只需创建页面文件 + 后端注册菜单资源，前端侧边栏自动出现新菜单，无需修改任何路由配置文件。", borderColor: "#FBBF2420", iconColor: "#FBBF24" },
]

const techRows = [
  { domain: "应用框架", tech: "Next.js 15 + React 19", advantage: "SSR/SSG 支持、文件系统路由、自动代码分割" },
  { domain: "类型系统", tech: "TypeScript 5", advantage: "全链路类型安全，从 API 到组件一气呵成" },
  { domain: "UI 体系", tech: "Shadcn/ui + Radix UI + Tailwind CSS", advantage: "无障碍合规、主题灵活、零运行时 CSS 开销" },
  { domain: "状态管理", tech: "Zustand + TanStack React Query", advantage: "极简 Store + 智能服务端缓存，告别样板代码" },
  { domain: "表单引擎", tech: "React Hook Form + Zod", advantage: "高性能非受控表单 + 声明式校验" },
  { domain: "数据表格", tech: "TanStack React Table", advantage: "虚拟化、排序、筛选、固定列，一个组件全搞定" },
  { domain: "HTTP 通信", tech: "Axios（统一封装）", advantage: "拦截器链式处理，Token 自动注入，异常统一兜底" },
  { domain: "富文本编辑", tech: "TinyMCE / Tiptap / Novel", advantage: "三套编辑器可选，满足从轻量到专业的不同场景" },
  { domain: "主题引擎", tech: "next-themes + CSS Variables", advantage: "深浅模式一键切换、20+ 预置主题色即时生效" },
]

const archLayers = [
  { name: "Middleware 层", desc: "路由守卫 · 权限拦截 · 请求预处理", color: "#FF5F57", bg: "#FF5F570D", border: "#FF5F5730" },
  { name: "Layout 层", desc: "侧边栏 · 顶栏 · 面包屑 · 主题引擎 · 通知中心", color: "#FEBC2E", bg: "#FEBC2E0D", border: "#FEBC2E30" },
  { name: "业务模块层（由后端动态驱动）", desc: "后端下发菜单 → 前端自动渲染 → 模块自由组合  [模块A] [模块B] [模块C] [...]", color: "#28C840", bg: "#28C8400D", border: "#28C84030" },
  { name: "通用能力层", desc: "CustomTable · CustomForm · FileUpload · Notifications · ConfirmDialog · CascadeSelector", color: "#60A5FA", bg: "#60A5FA0D", border: "#60A5FA30" },
  { name: "基础 UI 层 (Shadcn/ui)", desc: "40+ 无障碍基础组件 · 统一设计语言 · 主题变量驱动", color: "#A78BFA", bg: "#A78BFA0D", border: "#A78BFA30" },
  { name: "数据通信层", desc: "Axios 封装 · Token 自动管理 · 统一错误处理 · API 模块化", color: "#F472B6", bg: "#F472B60D", border: "#F472B630" },
  { name: "状态管理层", desc: "Zustand (App/Sidebar/Menu Slices) · React Query 缓存", color: "#00FF88", bg: "#00FF880D", border: "#00FF8830" },
]

const menuSteps = [
  { num: "01", color: "#00FF88", title: "用户登录成功", desc: "前端自动向后端请求菜单资源接口" },
  { num: "02", color: "#60A5FA", title: "后端返回菜单树", desc: "根据用户角色和权限，返回可见菜单资源树" },
  { num: "03", color: "#FBBF24", title: "自动转换路由", desc: "菜单数据转换为路由配置，动态渲染侧边栏导航" },
  { num: "04", color: "#F87171", title: "智能缓存 30min", desc: "避免重复请求，页面切换零延迟" },
]

const menuMeans = [
  { title: "不同角色不同菜单", desc: "管理员看到全部模块，运营只看运营相关，完全由后端权限控制", color: "#00FF88" },
  { title: "模块自由组合", desc: "上线新模块或下线旧模块，只需修改后端配置", color: "#60A5FA" },
  { title: "新增模块无需改路由", desc: "创建页面文件，注册菜单资源，侧边栏自动出现新菜单项", color: "#FBBF24" },
  { title: "跨行业通用", desc: "A做零售 B做仓储 C做OA，后端配置不同菜单树即可", color: "#F87171" },
]

const enterpriseRow1 = [
  { title: "动态菜单 & 权限", desc: "菜单由后端动态下发，与 RBAC 权限体系深度联动，前端零配置", color: "#00FF88", border: "#00FF8818" },
  { title: "多主题 & 暗黑模式", desc: "20+ 精心调校的主题色，深浅模式一键切换，支持跟随系统自动适配", color: "#60A5FA", border: "#60A5FA18" },
  { title: "统一 CRUD 模式", desc: "搜索+表格+分页+增删改查，统一交互范式，学习成本趋近于零", color: "#FBBF24", border: "#FBBF2418" },
]

const enterpriseRow2 = [
  { title: "类型安全全链路", desc: "从 API 响应 → Store 状态 → 组件 Props，TypeScript 全覆盖", color: "#A78BFA", border: "#A78BFA18" },
  { title: "多环境部署", desc: "开发/测试/生产三套环境一键切换，环境变量隔离", color: "#F87171", border: "#F8717118" },
  { title: "国际化 & 响应式", desc: "i18n 支持中/英文切换，移动优先设计，适配多种屏幕尺寸", color: "#22D3EE", border: "#22D3EE18" },
]

const devFeatures = [
  { color: "#00FF88", text: "声明式表单 — JSON 配置定义字段 + Zod 声明校验规则" },
  { color: "#60A5FA", text: "配置化表格 — 列定义+数据源即可渲染完整表格" },
  { color: "#FBBF24", text: "统一通知 — showMessage/showError/showWarning 一行代码调用" },
  { color: "#F87171", text: "API 模块化 — 按业务域拆分，URL 集中配置，新增接口只需两步" },
  { color: "#A78BFA", text: "安全机制内置 — 密码加密传输、JWT 自动解析、请求自动鉴权" },
  { color: "#22D3EE", text: "菜单智能缓存 — 本地缓存 30 分钟，提升页面切换流畅度" },
]

const futureTech = [
  { title: "React 19", desc: "享受最新的并发特性与性能优化", color: "#00FF88", bg: "#00FF880D", border: "#00FF8830" },
  { title: "Next.js 15 App Router", desc: "文件系统路由、服务端组件、流式渲染一步到位", color: "#60A5FA", bg: "#60A5FA0D", border: "#60A5FA30" },
  { title: "Radix UI 无障碍合规", desc: "所有交互组件符合 WAI-ARIA 标准", color: "#A78BFA", bg: "#A78BFA0D", border: "#A78BFA30" },
  { title: "Tailwind CSS 原子化", desc: "零运行时样式开销，构建产物极致精简", color: "#FBBF24", bg: "#FBBF240D", border: "#FBBF2430" },
]

const compRows = [
  [
    { name: "CustomForm", color: "#00FF88", border: "#00FF8825", sub: "声明式表单引擎", desc: "JSON 配置驱动 · Zod Schema 校验 · 16 种字段类型\nGrid/Vertical/Horizontal 布局 · 字段联动\n远程搜索 · 数据转换 · 表单引用" },
    { name: "CustomTable", color: "#60A5FA", border: "#60A5FA25", sub: "配置化数据表格", desc: "列配置驱动 · 自定义渲染 · 固定列 Left/Right\n行选择单选/全选 · 分页集成 · 7 种行事件\n斜纹/悬停效果 · 加载空态 · 表头操作区" },
  ],
  [
    { name: "CustomDialog", color: "#FBBF24", border: "#FBBF2425", sub: "通用弹窗容器", desc: "sm~7xl 预设宽度 · 最大化切换\n三区结构 · 加载/提交状态 · 防误关" },
    { name: "ConfirmDialog", color: "#F87171", border: "#F8717125", sub: "确认弹窗", desc: "danger/warning/success 三种语义\n颜色图标自动匹配 · 异步 onConfirm" },
    { name: "FileUpload", color: "#A78BFA", border: "#A78BFA25", sub: "文件上传组件", desc: "image/video/file 三种媒体 · 拖拽上传\n多图模式 · 拖拽排序 · 实时预览/进度" },
  ],
  [
    { name: "MultiSelect", color: "#22D3EE", border: "#22D3EE25", sub: "增强选择器", desc: "单选/多选统一 · Badge 标签\n远程搜索防抖 · 空态/加载态" },
    { name: "DateRangePicker", color: "#FB923C", border: "#FB923C25", sub: "日期范围选择器", desc: "双日历联动 · 精确到秒\n中文本地化 · 输入格式自动校验" },
    { name: "Notifications", color: "#34D399", border: "#34D39925", sub: "统一通知系统", desc: "showMessage/Error/Warning/Loading\n四种语义 · 9 种图标 · 一行代码触发" },
  ],
  [
    { name: "CascadeSelector", color: "#F472B6", border: "#F472B625", sub: "级联选择组件", desc: "多级数据级联选择，树形结构逐级展开。弹窗式交互模式，适合数据量较大的场景。" },
    { name: "40+ Shadcn/ui", color: "#FFFFFF", border: "#FFFFFF15", sub: "基础 UI 组件库", desc: "Button · Input · Select · Dialog · Table · Card · Badge · Avatar · Tooltip · Popover · Calendar · Form · Progress · Skeleton · ScrollArea · Breadcrumb · Sidebar · Toast ... 源码完全在项目中，可随时定制。" },
  ],
]

const apiThreeLayers = [
  { title: "请求层", color: "#00FF88", bg: "#00FF880D", border: "#00FF8830", desc: "Axios 拦截器自动注入 Token 请求头，后端无需关心前端如何传递认证信息。" },
  { title: "响应层", color: "#60A5FA", bg: "#60A5FA0D", border: "#60A5FA30", desc: "后端统一返回\n{ code: \"OK\", data: {...},\n  msg: \"操作成功\", count: 100 }" },
  { title: "异常层", color: "#F87171", bg: "#F871710D", border: "#F8717130", desc: "UN_LOGIN → 跳转登录页\n业务错误 → Toast 提示\n网络超时 → 友好异常提示" },
]

const apiRouteRows = [
  { op: "分页查询", path: "/{domain}/{module}/queryPage", note: "支持搜索条件 + 分页参数" },
  { op: "新增/编辑", path: "/{domain}/{module}/addOrEdit", note: "有 ID 则编辑，无 ID 则新增" },
  { op: "启用/禁用", path: "/{domain}/{module}/disable", note: "统一的状态切换接口" },
  { op: "删除", path: "/{domain}/{module}/delete", note: "单条/批量删除" },
  { op: "下拉列表", path: "/{domain}/{module}/selectList", note: "用于关联选择的精简数据" },
]

const authFlowCards = [
  { title: "登录认证", desc: "前端加密密码 → 后端返回 JWT Token → 前端自动解析并持久化", color: "#00FF88", border: "#00FF8818" },
  { title: "请求鉴权", desc: "每次请求自动携带 Token 头，后端校验即可", color: "#60A5FA", border: "#60A5FA18" },
  { title: "菜单权限", desc: "后端下发当前用户可见菜单，前端动态渲染", color: "#FBBF24", border: "#FBBF2418" },
  { title: "角色授权", desc: "后端提供资源树 + 角色关联，前端提供树形勾选界面", color: "#A78BFA", border: "#A78BFA18" },
]

const compareRows = [
  { dim: "框架版本", old: "Vue 2（已停止维护）", neo: "React 19 + Next.js 15" },
  { dim: "样式方案", old: "全局 CSS + 覆盖样式", neo: "Tailwind 原子化 CSS，零冲突" },
  { dim: "菜单机制", old: "前端写死路由表", neo: "后端动态下发，模块自由组合" },
  { dim: "组件质量", old: "依赖第三方 UI 库更新节奏", neo: "Shadcn/ui 代码归你所有，随时定制" },
  { dim: "主题能力", old: "有限的 CSS 变量覆盖", neo: "20+ 预置主题色 + 深浅模式 + 即时预览" },
  { dim: "渲染性能", old: "客户端渲染", neo: "可选 SSR/SSG/CSR，按需优化" },
]

const coreAdvantages = [
  { title: "极速启动", desc: "yarn dev 一条命令\n3 秒启动开发环境", color: "#00FF88", bg: "#00FF880D", border: "#00FF8830" },
  { title: "极低学习成本", desc: "统一 CRUD 模式\n新人半天上手", color: "#60A5FA", bg: "#60A5FA0D", border: "#60A5FA30" },
  { title: "极强可定制", desc: "Shadcn/ui 源码在手\n任何 UI 需求都能满足", color: "#FBBF24", bg: "#FBBF240D", border: "#FBBF2430" },
  { title: "极佳开发体验", desc: "TS 智能提示\n热更新、错误边界", color: "#A78BFA", bg: "#A78BFA0D", border: "#A78BFA30" },
  { title: "极简后端对接", desc: "标准化接口规范\n前端零配置接入", color: "#F87171", bg: "#F871710D", border: "#F8717130" },
  { title: "极致灵活性", desc: "菜单动态生成\n一套代码多种业务", color: "#22D3EE", bg: "#22D3EE0D", border: "#22D3EE30" },
]

const scenarioCards1 = [
  { title: "零售/电商后台", desc: "商品+订单+会员+运营+基础数据", color: "#00FF88", border: "#00FF8818" },
  { title: "仓储/物流管理", desc: "设备+商户+基础数据", color: "#60A5FA", border: "#60A5FA18" },
  { title: "企业 OA 后台", desc: "权限（部门/角色/员工）+系统配置", color: "#FBBF24", border: "#FBBF2418" },
]

const scenarioCards2 = [
  { title: "内容运营平台", desc: "Banner+字典+基础数据", color: "#F87171", border: "#F8717118" },
  { title: "SaaS 多租户平台", desc: "租户管理+全部模块", color: "#A78BFA", border: "#A78BFA18" },
  { title: "教育/医疗/金融...", desc: "按需自选，后端配菜单前端自动生成", color: "#22D3EE", border: "#22D3EE18" },
]

const gradientBg = "bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)]"

function SectionHeader({ tag, tagColor = "#00FF88", title, titleSize = 40, desc, descSize = 18 }: { tag: string; tagColor?: string; title: string; titleSize?: number; desc?: string; descSize?: number }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-mono text-[12px] font-semibold tracking-[2px]" style={{ color: tagColor }}>{tag}</p>
      <h2 className="font-display font-bold tracking-[-1px] text-white" style={{ fontSize: titleSize }}>{title}</h2>
      {desc && <p className="text-[#9CA3AF]" style={{ fontSize: descSize }}>{desc}</p>}
    </div>
  )
}

function SmallCard({ title, desc, color, border }: { title: string; desc: string; color: string; border: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white/[0.024] p-6" style={{ border: `1px solid ${border}` }}>
      <h4 className="text-[14px] font-semibold" style={{ color }}>{title}</h4>
      <p className="whitespace-pre-line text-[12px] leading-[1.6] text-[#9CA3AF]">{desc}</p>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(254,188,46,0.08),transparent_20%),linear-gradient(180deg,#0b0c0e_0%,#0b0c0e_100%)]" />
      <SiteHeader />

      <main className="relative">
        {/* Hero */}
        <section className="px-0 pb-[100px] pt-[120px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12 text-center">
              <div className="flex flex-col items-center gap-5">
                <h1 className="font-display text-[56px] font-bold tracking-[-2px] text-white md:text-[72px]">
                  新一代中后台管理系统
                </h1>
                <p className="font-display text-[24px] font-semibold text-[#00FF88] md:text-[28px]">
                  可复用 · 可扩展 · 可快速交付
                </p>
              </div>
              <p className="max-w-[800px] text-[18px] leading-[1.8] text-[#9CA3AF]">
                一款清爽、美观、开箱即用的现代化中后台前端框架，为全栈工程师、前端及
                <br />
                后端工程师量身打造。业务无关的企业级中后台前端脚手架。
              </p>
              <div className="flex items-center gap-12">
                {stats.map((s) => (
                  <div key={s.value} className="flex flex-col items-center gap-1">
                    <span className="font-display text-[48px] font-bold" style={{ color: s.color }}>{s.value}</span>
                    <span className="text-[14px] font-medium text-[#9CA3AF]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className={`${gradientBg} px-0 py-16`}>
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="CORE VALUES" title="脚手架的三大核心价值" desc="所有菜单、页面、权限均由后端动态下发，前端不硬编码任何业务逻辑" />
              <div className="grid w-full grid-cols-3 gap-6">
                {valueCards.map((c) => (
                  <div key={c.title} className="flex flex-col gap-4 rounded-2xl bg-white/[0.024] p-8" style={{ border: `1px solid ${c.borderColor}` }}>
                    <span className="text-[36px]" style={{ color: c.iconColor }}>{c.icon}</span>
                    <h3 className="font-display text-[24px] font-bold text-white">{c.title}</h3>
                    <p className="text-[14px] leading-[1.7] text-[#9CA3AF]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-[#0B0C0E] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="TECH STACK" title="技术架构概览" desc={"坚持\u201C选最新的、用最稳的\u201D原则，所有技术选型均为当前社区最活跃、生态最健全的方案"} />
              <div className="w-full overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0D1117]">
                <div className="flex bg-[#161B22] px-6 py-4">
                  <span className="w-[200px] font-mono text-[13px] font-semibold text-[#00FF88]">领域</span>
                  <span className="w-[360px] font-mono text-[13px] font-semibold text-[#00FF88]">技术方案</span>
                  <span className="flex-1 font-mono text-[13px] font-semibold text-[#00FF88]">核心优势</span>
                </div>
                {techRows.map((r, i) => (
                  <div key={r.domain} className={`flex px-6 py-3.5 ${i < techRows.length - 1 ? "border-b border-[#1F2937]" : ""}`}>
                    <span className="w-[200px] text-[13px] font-semibold text-white">{r.domain}</span>
                    <span className="w-[360px] font-mono text-[13px] font-medium text-[#60A5FA]">{r.tech}</span>
                    <span className="flex-1 text-[13px] text-[#9CA3AF]">{r.advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className={`${gradientBg} px-0 py-16`}>
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="SIX-LAYER ARCHITECTURE" title="六层解耦架构" desc="从底层状态到顶层路由，每一层职责分明、独立可替换" />
              <div className="flex w-full flex-col gap-2 rounded-2xl border border-[#1F293750] bg-[#0D1117] p-8">
                <div className="flex w-full justify-center py-2">
                  <span className="font-display text-[16px] font-bold text-white">Next.js App Router</span>
                </div>
                {archLayers.map((l) => (
                  <div key={l.name} className="flex flex-col gap-1 rounded-lg px-6 py-4" style={{ background: l.bg, border: `1px solid ${l.border}` }}>
                    <span className="font-mono text-[14px] font-semibold" style={{ color: l.color }}>{l.name}</span>
                    <span className="text-[13px] text-[#9CA3AF]">{l.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Highlights — Dynamic Menu */}
        <section className="bg-[#0B0C0E] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="CORE HIGHLIGHTS" title="核心亮点 — 动态菜单与业务模块的灵活组装" desc={"前端不决定\u201C有什么菜单\u201D，后端说了算 —— 这是本脚手架最核心的设计理念"} />
              <div className="flex w-full flex-col gap-6 rounded-2xl border border-[#00FF8820] bg-[#0D1117] p-8">
                <h3 className="font-mono text-[16px] font-semibold text-[#00FF88]">动态菜单工作机制</h3>
                <div className="grid grid-cols-4 gap-4">
                  {menuSteps.map((s) => (
                    <div key={s.num} className="flex flex-col gap-2 rounded-xl bg-white/[0.024] p-5">
                      <span className="font-mono text-[28px] font-bold" style={{ color: s.color }}>{s.num}</span>
                      <span className="text-[14px] font-semibold text-white">{s.title}</span>
                      <span className="text-[12px] leading-[1.6] text-[#9CA3AF]">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid w-full grid-cols-4 gap-4">
                {menuMeans.map((m) => (
                  <div key={m.title} className="flex flex-col gap-2.5 rounded-xl border border-white/[0.063] bg-white/[0.024] p-6">
                    <h4 className="text-[14px] font-semibold" style={{ color: m.color }}>{m.title}</h4>
                    <p className="text-[12px] leading-[1.6] text-[#9CA3AF]">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Capabilities */}
        <section className={`${gradientBg} px-0 py-16`}>
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="ENTERPRISE READY" title="开箱即用的企业级能力" />
              <div className="grid w-full grid-cols-3 gap-4">
                {enterpriseRow1.map((c) => (<SmallCard key={c.title} {...c} />))}
              </div>
              <div className="grid w-full grid-cols-3 gap-4">
                {enterpriseRow2.map((c) => (<SmallCard key={c.title} {...c} />))}
              </div>
            </div>
          </div>
        </section>

        {/* Dev Experience & Future Tech */}
        <section className="bg-[#0B0C0E] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="DEV EXPERIENCE" title="高效开发体验 & 面向未来的技术底座" />
              <div className="flex w-full gap-6">
                <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-[#1F293750] bg-[#0D1117] p-8">
                  <h3 className="font-mono text-[16px] font-semibold text-[#00FF88]">高效开发特性</h3>
                  {devFeatures.map((f) => (
                    <div key={f.text} className="flex gap-3 py-3">
                      <span className="text-[13px]" style={{ color: f.color }}>▸</span>
                      <span className="text-[13px] text-[#9CA3AF]">{f.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex w-[420px] shrink-0 flex-col gap-5">
                  {futureTech.map((t) => (
                    <div key={t.title} className="flex flex-col gap-2 rounded-xl p-6" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                      <span className="font-mono text-[18px] font-bold" style={{ color: t.color }}>{t.title}</span>
                      <span className="text-[13px] leading-[1.5] text-[#9CA3AF]">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component System */}
        <section className={`${gradientBg} px-0 py-16`}>
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="COMPONENT SYSTEM" title="自定义组件体系" desc="90% 的页面开发不用写基础代码，封装中后台最常见的交互模式" />
              {compRows.map((row, ri) => (
                <div key={ri} className="grid w-full gap-4" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>
                  {row.map((c) => (
                    <div key={c.name} className="flex flex-col gap-3 rounded-2xl bg-[#0D1117] p-7" style={{ border: `1px solid ${c.border}` }}>
                      <span className="font-mono text-[18px] font-bold" style={{ color: c.color }}>{c.name}</span>
                      <span className="text-[14px] font-semibold text-white">{c.sub}</span>
                      <p className="whitespace-pre-line text-[12px] leading-[1.7] text-[#9CA3AF]">{c.desc}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Integration */}
        <section className="bg-[#0B0C0E] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="API INTEGRATION" title="与后端对接规范设计" desc="统一的请求-响应-异常三层处理机制，后端照着文档实现，前端零配置接入" />
              <div className="grid w-full grid-cols-3 gap-5">
                {apiThreeLayers.map((l) => (
                  <div key={l.title} className="flex flex-col gap-3 rounded-2xl p-7" style={{ background: l.bg, border: `1px solid ${l.border}` }}>
                    <span className="font-mono text-[18px] font-bold" style={{ color: l.color }}>{l.title}</span>
                    <p className="whitespace-pre-line text-[13px] leading-[1.7] text-[#9CA3AF]">{l.desc}</p>
                  </div>
                ))}
              </div>
              <div className="w-full overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0D1117]">
                <div className="flex bg-[#161B22] px-6 py-3.5">
                  <span className="w-[160px] font-mono text-[13px] font-semibold text-[#00FF88]">操作</span>
                  <span className="w-[380px] font-mono text-[13px] font-semibold text-[#00FF88]">接口路径模式</span>
                  <span className="flex-1 font-mono text-[13px] font-semibold text-[#00FF88]">说明</span>
                </div>
                {apiRouteRows.map((r, i) => (
                  <div key={r.op} className={`flex px-6 py-3 ${i < apiRouteRows.length - 1 ? "border-b border-[#1F2937]" : ""}`}>
                    <span className="w-[160px] text-[13px] font-medium text-white">{r.op}</span>
                    <span className="w-[380px] font-mono text-[12px] text-[#60A5FA]">{r.path}</span>
                    <span className="flex-1 text-[12px] text-[#9CA3AF]">{r.note}</span>
                  </div>
                ))}
              </div>
              <div className="grid w-full grid-cols-4 gap-4">
                {authFlowCards.map((c) => (<SmallCard key={c.title} title={c.title} desc={c.desc} color={c.color} border={c.border} />))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-[#0B0C0E] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="WHY CHOOSE US" title="为什么选择 Easy Admin？" />
              <div className="w-full overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0D1117]">
                <div className="flex bg-[#161B22] px-6 py-4">
                  <span className="w-[200px] font-mono text-[13px] font-semibold text-[#00FF88]">维度</span>
                  <span className="w-[400px] font-mono text-[13px] font-semibold text-[#9CA3AF]">传统 Vue2 + ElementUI</span>
                  <span className="flex-1 font-mono text-[13px] font-semibold text-[#00FF88]">Easy Admin 脚手架</span>
                </div>
                {compareRows.map((r, i) => (
                  <div key={r.dim} className={`flex px-6 py-3 ${i < compareRows.length - 1 ? "border-b border-[#1F2937]" : ""}`}>
                    <span className="w-[200px] text-[13px] font-medium text-white">{r.dim}</span>
                    <span className="w-[400px] text-[12px] text-[#F87171]">{r.old}</span>
                    <span className="flex-1 text-[12px] font-semibold text-[#00FF88]">{r.neo}</span>
                  </div>
                ))}
              </div>
              <div className="grid w-full grid-cols-6 gap-3">
                {coreAdvantages.map((a) => (
                  <div key={a.title} className="flex flex-col gap-1.5 rounded-xl p-5" style={{ background: a.bg, border: `1px solid ${a.border}` }}>
                    <span className="text-[14px] font-bold" style={{ color: a.color }}>{a.title}</span>
                    <p className="whitespace-pre-line text-[11px] leading-[1.5] text-[#9CA3AF]">{a.desc}</p>
                  </div>
                ))}
              </div>
              <SectionHeader tag="SCENARIOS" title="适用场景" titleSize={32} />
              <div className="grid w-full grid-cols-3 gap-4">
                {scenarioCards1.map((c) => (<SmallCard key={c.title} {...c} />))}
              </div>
              <div className="grid w-full grid-cols-3 gap-4">
                {scenarioCards2.map((c) => (<SmallCard key={c.title} {...c} />))}
              </div>
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section className={`${gradientBg} px-0 py-16`}>
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <SectionHeader tag="SHOWCASE" title="效果展示" desc="实际项目效果预览，眼见为实" />
              <div className="flex h-[480px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-[#1F293780] bg-[#0D1117]">
                <span className="font-display text-[28px] font-bold text-[#374151]">效果图占位区域</span>
                <span className="text-[16px] text-[#4B5563]">此区域将放置实际项目的 UI 效果截图</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className={`${gradientBg} px-0 py-16`}>
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-10">
              <SectionHeader tag="QUICK START" title="快速上手" desc="环境要求：Node.js ≥ 18，Yarn ≥ 4.7.0" descSize={16} />
              <div className="w-full max-w-[800px] overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0D1117]">
                <div className="flex items-center gap-2 bg-[#161B22] px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="size-3 rounded-full bg-[#FF5F57]" />
                    <span className="size-3 rounded-full bg-[#FEBC2E]" />
                    <span className="size-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="font-mono text-[12px] text-[#9CA3AF]">terminal</span>
                </div>
                <div className="flex flex-col gap-3 p-6 px-7">
                  <span className="font-mono text-[13px] text-[#6B7280]"># 安装依赖</span>
                  <span className="font-mono text-[14px] font-semibold text-[#00FF88]">$ yarn install</span>
                  <span className="font-mono text-[13px] text-[#6B7280]"># 启动开发环境</span>
                  <span className="font-mono text-[14px] font-semibold text-[#00FF88]">$ yarn dev</span>
                  <span className="font-mono text-[13px] text-[#6B7280]"># 构建生产版本</span>
                  <span className="font-mono text-[14px] font-semibold text-[#00FF88]">$ yarn build:prod</span>
                  <span className="font-mono text-[13px] text-[#6B7280]"># 启动生产服务</span>
                  <span className="font-mono text-[14px] font-semibold text-[#00FF88]">$ yarn start:prod</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`${gradientBg} px-0 py-20`}>
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-8 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">SUMMARY</p>
              <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                开箱即用，业务自由组装，开局即巅峰
              </h2>
              <p className="max-w-[800px] text-[18px] leading-[1.6] text-[#9CA3AF]">
                一套标准 · 一套组件 · 一套流程 · 一种灵活 · 一种效率
                <br />
                新模块开发从&ldquo;一周&rdquo;缩短到&ldquo;一天&rdquo;，让团队把时间花在真正的业务创新上
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="#" className="inline-flex items-center justify-center rounded-lg bg-[#00FF88] px-8 py-3.5 text-[16px] font-semibold text-[#0B0C0E] transition-colors hover:bg-[#3aff9f]">
                  查看技术文档
                </Link>
                <Link href="#" className="inline-flex items-center justify-center rounded-lg border border-[#374151] px-8 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-white/[0.06]">
                  合作咨询
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
