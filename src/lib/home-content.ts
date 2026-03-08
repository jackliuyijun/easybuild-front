import type { LucideIcon } from "lucide-react"
import {
  AppWindow,
  BookOpen,
  Bot,
  Boxes,
  Gauge,
  GitBranch,
  Layers3,
  LayoutDashboard,
  Package,
  Phone,
  Puzzle,
  Repeat2,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  User,
  Users,
  Zap,
} from "lucide-react"

import type { AccentTone } from "@/lib/site-theme"

export type NavLink = {
  label: string
  href: string
}

export type ToneItem = {
  title: string
  description: string
  tone: AccentTone
  icon: LucideIcon
}

export type TagCardItem = ToneItem & {
  tag: string
}

export type CompareRow = {
  scene: string
  traditional: string
  easybuild: string
}

export const navLinks: NavLink[] = [
  { label: "首页", href: "/" },
  { label: "易架构", href: "/easyfk" },
  { label: "业务模块", href: "/modules" },
  { label: "中后台", href: "#capabilities" },
  { label: "移动端", href: "#capabilities" },
  { label: "AI+", href: "#capabilities" },
  { label: "技术文档", href: "#footer" },
  { label: "合作咨询", href: "#get-started" },
]

export const heroPoints = [
  {
    label: "分钟级生成企业级项目",
    tone: "green" as const,
    icon: Zap,
  },
  {
    label: "40+ 可插拔生产级组件",
    tone: "yellow" as const,
    icon: Puzzle,
  },
  {
    label: "单体与微服务自由切换",
    tone: "red" as const,
    icon: Repeat2,
  },
]

export const productCards: TagCardItem[] = [
  {
    title: "易架构 EasyFK",
    description:
      "技术架构平台，40+ 可插拔组件、统一依赖治理、核心基础框架、全栈代码生成",
    tag: "技术怎么建",
    tone: "green",
    icon: Layers3,
  },
  {
    title: "通用业务模块",
    description:
      "18+ 个标准化业务模块，权限、用户、商品、订单、支付等高频业务开箱即用",
    tag: "业务怎么快",
    tone: "yellow",
    icon: Package,
  },
  {
    title: "中后台管理前端",
    description:
      "基于主流前端技术栈，后端驱动动态菜单，20+ 主题色一键切换，开箱即用",
    tag: "界面怎么出",
    tone: "green",
    icon: LayoutDashboard,
  },
  {
    title: "小程序脚手架",
    description: "小程序项目模板，快速搭建、规范统一，让小程序开发标准化、工程化",
    tag: "小程序怎么起",
    tone: "yellow",
    icon: Smartphone,
  },
  {
    title: "跨平台 APP (Flutter)",
    description:
      "基于 Flutter 的跨平台移动应用脚手架，一套代码覆盖 iOS / Android 双端",
    tag: "APP 怎么做",
    tone: "green",
    icon: TabletSmartphone,
  },
  {
    title: "AI + 易构整合开发",
    description:
      "AI 能力与易构深度整合，智能辅助编码、生成、调优，让 AI 成为编程搭档",
    tag: "效率怎么飞",
    tone: "red",
    icon: Sparkles,
  },
]

export const painColumns = [
  {
    title: "如果你是独立开发者",
    icon: User,
    items: [
      "每个新项目都要花好几天搭建基础设施",
      "写不完的 Entity / Mapper / Service / Controller",
      "Redis、MQ、分布式锁接入成本太高",
      "想上微服务，但架构太重",
      "依赖冲突排查一整天",
    ],
  },
  {
    title: "如果你是小团队",
    icon: Users,
    items: [
      "每个项目技术栈不统一",
      "基础代码风格混乱",
      "没有专职架构师",
      "微服务拆分成本太高",
      "技术选型一旦定了就很难换",
    ],
  },
]

export const capabilityCards: ToneItem[] = [
  {
    title: "技术底座",
    description:
      "统一依赖治理（告别版本冲突）\n40+ 可插拔组件（ORM / MQ / Redis / RPC）\n三大 ORM 随时切换\n三大 MQ 零改动切换\n单体 ↔ 微服务一键生成",
    tone: "green",
    icon: Boxes,
  },
  {
    title: "高频通用业务模块",
    description:
      "用户中心 / 权限管理（RBAC + 多租户）\n商品 / 订单 / 交易 / 支付\n会员等级体系 / 商户管理\nBanner / 分类 / 标签 / 字典\n\n这些不是 Demo。是可以直接跑生产的完整模块。",
    tone: "yellow",
    icon: Package,
  },
  {
    title: "前端工程脚手架",
    description:
      "中后台管理系统模板\n小程序工程模板\nFlutter 跨平台 App 模板\n\n后端生成代码，前端结构同步规范。\n全栈协同，从 Day 1 就是标准化工程。",
    tone: "red",
    icon: AppWindow,
  },
  {
    title: "AI + 易构",
    description:
      "易构提供标准化的技术底座与业务基建\nAI 编程基于规范底座生成更精准的代码\n底座 + AI = 开发效率指数级提升\n\n不是 AI 替你写代码，\n而是易构让 AI 写得又快又对。",
    tone: "yellow",
    icon: Bot,
  },
]

export const compareRows: CompareRow[] = [
  { scene: "搭建基础架构", traditional: "3-7 天", easybuild: "10 分钟" },
  { scene: "每张表生成代码", traditional: "1-2 小时", easybuild: "10 秒" },
  { scene: "接入 MQ", traditional: "3-5 天", easybuild: "1 行依赖" },
  { scene: "拆微服务", traditional: "重构级改造", easybuild: "重新生成即可" },
]

export const whyCards: ToneItem[] = [
  {
    title: "架构自由",
    description:
      "统一接口抽象。底层实现随时替换。\n业务代码不动。\n\n这不是封装，是架构解耦。\n\nMyBatis → Flex → Hibernate\nRabbitMQ → Kafka → RocketMQ\n\n切换只换依赖，业务代码一行不改。",
    tone: "red",
    icon: GitBranch,
  },
  {
    title: "架构可生长",
    description:
      "项目初期：单体\n业务增长：拆微服务\n流量爆发：分库分表\n数据爆炸：接入 ClickHouse\n高并发：引入 Disruptor\n\n易构的架构不是固定的。\n它是可演进的。",
    tone: "red",
    icon: Gauge,
  },
]

export const standardItems = [
  "统一响应结构",
  "统一异常模型",
  "统一权限体系",
  "统一线程模型",
  "统一日志结构",
  "统一消息模型",
]

export const impactCards: ToneItem[] = [
  {
    title: "对独立开发者",
    description:
      "从“写代码的人”变成“设计系统的人”\n一个人也能交付企业级系统\n有能力承接更复杂的项目",
    tone: "green",
    icon: Rocket,
  },
  {
    title: "对小微企业",
    description: "降低架构试错成本\n减少技术债\n项目更稳定，扩展更轻松",
    tone: "yellow",
    icon: ShieldCheck,
  },
  {
    title: "对 Java 全栈开发者",
    description:
      "后端架构标准化\n前端工程同步规范\n架构能力快速提升\n不再被基础设施拖累",
    tone: "green",
    icon: BookOpen,
  },
]

export const footerColumns = [
  {
    title: "产品",
    links: ["易架构 EasyFK", "通用业务模块", "中后台脚手架", "代码生成器"],
  },
  {
    title: "服务",
    links: ["技术支持", "定制开发", "培训服务", "商务合作"],
  },
  {
    title: "文档",
    links: ["技术文档", "快速入门", "API 参考"],
  },
]

export const footerMeta = {
  slogan: "为开发者而生的企业级全栈开发产品",
  lines: [
    "让架构更简单，让交付更从容",
    "从数据库到微服务，一键“易构”你的企业级应用",
    "重构开发体验，构建无限可能",
  ],
  version: "持续迭代 · 始终跟随最新技术栈",
  copyright: "© 2026 EasyBuild. All rights reserved.",
  primaryCta: {
    label: "立即体验",
    href: "#home",
    icon: Rocket,
  },
  secondaryCta: {
    label: "合作咨询",
    href: "#footer",
    icon: Phone,
  },
}
