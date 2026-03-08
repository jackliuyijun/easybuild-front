import Link from "next/link"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const stats = [
  { value: "18+", label: "业务模块", color: "#28C840" },
  { value: "RBAC", label: "权限体系", color: "#FEBC2E" },
  { value: "SaaS", label: "多租户支持", color: "#FF5F57" },
  { value: "DDD", label: "领域驱动", color: "#28C840" },
]

const moduleRows = [
  [
    { emoji: "🛡️", tag: "Auth", tagColor: "#00FF88", borderColor: "#00FF8818", iconBg: "#00FF8825", title: "权限与组织管理", desc: "完整的RBAC权限体系，员工、角色、权限资源管理，JWT认证" },
    { emoji: "👥", tag: "User", tagColor: "#60A5FA", borderColor: "#60A5FA18", iconBg: "#60A5FA25", title: "会员管理", desc: "C端用户全生命周期管理，微信生态原生集成，资产体系" },
    { emoji: "👑", tag: "VIP", tagColor: "#FBBF24", borderColor: "#FBBF2418", iconBg: "#FBBF2425", title: "会员等级", desc: "会员等级与付费套餐管理，智能差异化定价，自动续期" },
  ],
  [
    { emoji: "🛍️", tag: "Goods", tagColor: "#A78BFA", borderColor: "#A78BFA18", iconBg: "#A78BFA25", title: "商品管理", desc: "SPU/SKU模型，分布式库存安全，购物车，多规格支持" },
    { emoji: "⚡", tag: "Trading", tagColor: "#F87171", borderColor: "#F8717118", iconBg: "#F8717125", title: "交易模块", desc: "纯编排层设计，资源预占与回滚，防重复下单" },
    { emoji: "📝", tag: "Order", tagColor: "#22D3EE", borderColor: "#22D3EE18", iconBg: "#22D3EE25", title: "订单管理", desc: "订单全生命周期，四种配送方式，完整售后流程" },
  ],
  [
    { emoji: "💎", tag: "Payment", tagColor: "#34D399", borderColor: "#34D39918", iconBg: "#34D39925", title: "支付模块", desc: "统一支付入口，微信支付四种方式，预支付缓存+异步回调" },
    { emoji: "🏬", tag: "Merchant", tagColor: "#FB923C", borderColor: "#FB923C18", iconBg: "#FB923C25", title: "商户管理", desc: "商户档案、LBS地理信息、独立部署服务" },
    { emoji: "📌", tag: "Pickup", tagColor: "#F472B6", borderColor: "#F472B618", iconBg: "#F472B625", title: "提货点管理", desc: "线下提货网络，多对多商户关联，LBS位置查询" },
  ],
  [
    { emoji: "🔲", tag: "Container", tagColor: "#818CF8", borderColor: "#818CF818", iconBg: "#818CF825", title: "货柜管理", desc: "智能货柜信息管理，商户绑定，与订单模块协同" },
    { emoji: "🎯", tag: "Banner", tagColor: "#FB7185", borderColor: "#FB718518", iconBg: "#FB718525", title: "轮播广告", desc: "广告位运营管理，多维投放，四种跳转方式" },
    { emoji: "✨", tag: "Brand", tagColor: "#2DD4BF", borderColor: "#2DD4BF18", iconBg: "#2DD4BF25", title: "品牌管理", desc: "品牌基础数据管理，唯一约束，模糊搜索" },
  ],
  [
    { emoji: "🗂️", tag: "Category", tagColor: "#C084FC", borderColor: "#C084FC18", iconBg: "#C084FC25", title: "分类管理", desc: "多级树形分类体系，分组归属，编码与名称唯一约束" },
    { emoji: "🧩", tag: "Group", tagColor: "#A3E635", borderColor: "#A3E63518", iconBg: "#A3E63525", title: "分组管理", desc: "通用分组配置，编码与名称唯一约束，灵活分组维度" },
    { emoji: "🏷️", tag: "Tag", tagColor: "#FDBA74", borderColor: "#FDBA7418", iconBg: "#FDBA7425", title: "标签管理", desc: "业务标签管理，多租户数据隔离，模糊搜索" },
  ],
  [
    { emoji: "📚", tag: "Dict", tagColor: "#67E8F9", borderColor: "#67E8F918", iconBg: "#67E8F925", title: "字典管理", desc: "系统级字典数据管理，键值对选项，避免硬编码" },
    { emoji: "🎬", tag: "Media", tagColor: "#E879F9", borderColor: "#E879F918", iconBg: "#E879F925", title: "媒体资源", desc: "统一多媒体资源管理，图片/视频，灵活关联任意业务对象" },
    { emoji: "🔧", tag: "Common-POJO", tagColor: "#94A3B8", borderColor: "#94A3B818", iconBg: "#94A3B825", title: "公共对象", desc: "跨模块共享的枚举、常量与值对象，统一业务语义" },
  ],
]

const moduleDetails = [
  {
    title: "Auth — 权限与组织管理模块",
    titleColor: "#FF5F57",
    bgColor: "#FF5F570D",
    borderColor: "#FF5F5730",
    subtitle: "解决\u201C谁能登录、谁能看到什么、谁能操作什么\u201D的问题",
    features: `• 员工管理：账号创建、编辑、启用/禁用，支持关联部门与角色
• 部门管理：组织架构的灵活配置，支持部门层级划分
• 角色管理：角色的增删改查，支持角色分配权限资源
• 权限资源：基于 RBAC 模型，支持菜单级、按钮级细粒度控制
• 登录认证：账号密码、钉钉登录、JWT 令牌机制
• 安全策略：密码 30 天过期策略，强制定期修改`,
    designPoints: [
      "权限分级：资源分三级——无需验证、仅需登录、需要权限",
      "声明式权限：通过 @AuthResource 注解直接声明权限",
      "多租户数据隔离：内置按代理商、商户维度自动过滤",
      "远程能力暴露：其他模块可通过 Feign/Dubbo 调用",
    ],
    highlight: "任何需要后台管理权限控制的系统均可直接引入本模块，开箱即用的 RBAC 权限体系，省去权限系统的重复开发。",
  },
  {
    title: "User — 会员管理模块",
    titleColor: "#FEBC2E",
    bgColor: "#FEBC2E0D",
    borderColor: "#FEBC2E30",
    subtitle: "C端用户（会员）的全生命周期管理能力",
    features: `• 多方式登录：微信小程序登录、H5授权登录、手机号登录
• 会员信息：基础信息与详细档案分层管理
• 收货地址：增删改查，支持省市区与经纬度
• 会员资产：积分、余额、经验值三大资产体系
• 资产日志：每笔变动自动记录，确保可追溯
• 后台管理：BMS端支持分页查询、编辑、启用/禁用`,
    designPoints: [
      "微信生态原生集成：内置小程序 SDK 与公众号 SDK",
      "资产安全：基于 Redisson 分布式锁保障并发安全",
      "信息分层：UserInfo、UserDetail、UserAccount 独立存储",
    ],
    highlight: "深度对接微信生态，开箱即用的小程序登录与公众号授权；完整的会员资产体系，可直接支撑积分商城、余额充值等业务。",
  },
  {
    title: "VIP — 会员等级模块",
    titleColor: "#28C840",
    bgColor: "#28C8400D",
    borderColor: "#28C84030",
    subtitle: "提供会员等级与付费套餐的管理能力",
    features: `• VIP 等级：自定义会员等级（等级编码、名称、权益介绍）
• 套餐管理：每个等级可配置多个套餐，支持原价、首购价、活动价
• VIP 订单：VIP 购买与续费的订单记录
• 自动续期：支付成功后自动延长有效期，支持永久会员`,
    designPoints: [
      "智能定价：新用户显示首购价，老用户显示活动价或原价",
      "幂等保护：订单写入前检查订单号是否已存在",
      "与User模块协同：支付成功后自动更新VIP状态",
    ],
    highlight: "灵活的差异化定价策略，有效提升新用户首购转化率与老用户续费率；VIP有效期智能累加，续费时在当前到期时间基础上叠加。",
  },
  {
    title: "Goods — 商品管理模块",
    titleColor: "#FF5F57",
    bgColor: "#FF5F570D",
    borderColor: "#FF5F5730",
    subtitle: "提供商品信息管理与库存管控能力",
    features: `• 商品信息：支持 SPU/SKU 模型，基础信息、规格参数、详情描述独立编辑
• 上下架：一键控制商品的销售状态
• 库存管理：单规格/多规格库存，锁定、扣减、释放、归还四种操作
• 购物车：加购、改数量、移除、清空、选择商品
• SPU 配置：按分类维度配置商品规格模板
• 媒体关联：与 Media 模块集成，管理商品轮播图、封面图`,
    designPoints: [
      "分布式库存安全：基于Redisson公平锁，双重锁机制",
      "库存操作幂等：相同订单+相同动作不会重复执行",
      "多规格支持：单一价格/库存或按SKU分别管理",
    ],
    highlight: "高并发安全的库存管理方案，适合秒杀、抢购等场景；购物车开箱即用，可直接对接交易模块完成下单流程。",
  },
  {
    title: "Trading - 交易模块",
    titleColor: "#FEBC2E",
    bgColor: "#FEBC2E0D",
    borderColor: "#FEBC2E30",
    subtitle: "交易聚合层，协调多个业务模块完成下单与支付流程",
    features: `- 商城交易：单商品下单、多商品下单、购物车结算
- 预结算：实时计算商品价格、运费、优惠券抵扣
- 确认下单：锁定库存 > 冻结积分 > 锁定优惠券 > 创建订单
- 快捷交易：积分充值、余额充值、VIP开通/续费
- 超时关单：RocketMQ延时消息自动取消并释放资源
- 支付回调：统一接收支付通知，按类型分发处理`,
    designPoints: [
      "资源预占与回滚：严格顺序锁定 + 逆序释放",
      "防重复下单：tradeToken + Redis缓存，5分钟内不可重复",
      "编排式设计：不拥有数据库表，仅作流程编排层",
      "多配送方式：自动判断快递/自提/货柜配送",
    ],
    highlight: "纯编排层设计，不绑定任何数据存储，可灵活对接不同的订单和商品实现；完整的资源预占回滚机制，是电商下单流程的最佳实践。",
  },
  {
    title: "Order - 订单管理模块",
    titleColor: "#28C840",
    bgColor: "#28C8400D",
    borderColor: "#28C84030",
    subtitle: "管理订单从创建到售后的完整生命周期",
    features: `- 订单状态流转：待支付 > 已取消 / 待发货 > 待收货 > 已收货
- 四种配送方式：快递配送、到店自提、送货上门、货柜自取
- 发货管理：支持物流发货与自配送，关联物流单号
- 自提管理：提货码生成，对接线下提货点
- 货柜配送：对接智能货柜，记录货柜 ID 与格子号
- 退款售后：申请 > 审核 > 退货物流 > 确认收货 > 退款
- 用户订单：订单列表、详情、全量详情（含商品明细、金额、支付）`,
    designPoints: [
      "订单数据拆分：主信息、商品明细、金额、支付、发货、退款独立建模",
      "多配送模型：快递、自提、货柜各有独立数据模型",
      "商户缓存：Caffeine本地缓存高频访问商户信息",
      "事务保障：关键操作均有事务保护与幂等判断",
    ],
    highlight: "四种配送方式灵活组合，适配便利店自提、社区配送、智能货柜等多种零售场景；完善的退款售后流程，覆盖仅退款与退货退款两种模式。",
  },
  {
    title: "Payment - 支付模块",
    titleColor: "#FF5F57",
    bgColor: "#FF5F570D",
    borderColor: "#FF5F5730",
    subtitle: "提供统一的支付能力，对接第三方支付渠道",
    features: `- 微信支付：JSAPI、APP、H5、NATIVE扫码四种支付方式
- 多业务支付：商城下单、积分充值、余额充值、会员续费
- 支付回调：接收微信支付通知，异步更新状态
- 退款：按订单号与金额发起微信退款
- 支付记录：完整的支付/退款流水记录与查询`,
    designPoints: [
      "预支付缓存：预支付信息写入Redis，支付后自动清理",
      "异步回调：@Async异步通知Trading模块，不阻塞返回",
      "统一路由：按payDetailType自动路由到对应实现",
    ],
    highlight: "统一支付入口设计，新增支付渠道无需改动上层业务代码；预支付缓存 + 异步回调，兼顾用户支付体验与系统可靠性。",
  },
]

const archFeatures = [
  { num: "01", title: "标准化分层结构", color: "#00FF88", desc: "每个模块均由 4 层子模块组成：api（接口契约）、server（业务核心）、remote（远程暴露）、prd（应用接入）。内部采用 Repository > Server > Remote > Controller 四层代码组织。" },
  { num: "02", title: "三种架构模式自由切换", color: "#60A5FA", desc: "单体架构（本地调用）、微服务架构（Feign）、分布式架构（Dubbo RPC）。通过 @ConditionalOnMissingBean 自动选择实现，一套代码适配三种架构。" },
  { num: "03", title: "双端接口分离", color: "#FBBF24", desc: "prd 下分为 client（C端）和 bms（后台管理端）两个独立子模块，接口独立设计、可独立部署。" },
  { num: "04", title: "SaaS 多租户支持", color: "#A78BFA", desc: "内置 agentId、merchantId 字段，通过统一数据过滤工具自动按租户维度隔离数据。" },
  { num: "05", title: "声明式权限控制", color: "#F87171", desc: "BMS 端接口通过 @AuthResource 和 @ResourceController 注解声明菜单与操作权限，与 Auth 模块配合实现完整 RBAC。" },
  { num: "06", title: "DDD 领域驱动模型", color: "#22D3EE", desc: "采用统一的请求参数封装体系：DTO（数据传输）、Param（查询参数）、Request（写操作入参）、Response（结构化返回）。" },
  { num: "07", title: "多种 ORM 框架自由选择", color: "#FB923C", desc: "支持 MyBatis-Plus、MyBatis-Flex、Hibernate 三种主流 ORM，框架切换仅需调整持久化层，业务层不受影响。" },
  { num: "08", title: "通用基础 CRUD 引擎", color: "#F472B6", desc: "内置基础增删改查、唯一字段校验、组合唯一校验、SaaS 数据过滤，大幅减少重复代码。" },
  { num: "09", title: "自定义二次开发", color: "#818CF8", desc: "支持继承扩展、配置覆盖、接口扩展、插件机制（SPI/事件监听）。模块即是成品也是半成品，保留充分定制空间。" },
  { num: "10", title: "AI 驱动开发", color: "#00FF88", desc: "规范化代码结构、模板化开发模式、清晰接口契约、低耦合模块设计。结合 AI 编程能力，新模块开发效率提升数倍。" },
]

export default function ModulesPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(254,188,46,0.08),transparent_20%),linear-gradient(180deg,#0b0c0e_0%,#0b0c0e_100%)]" />
      <SiteHeader />

      <main className="relative">
        {/* Hero Section */}
        <section className="px-0 pb-[100px] pt-[120px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-10 text-center">
              <div className="flex flex-col items-center gap-5">
                <h1 className="font-display text-[56px] font-bold tracking-[-2px] text-white md:text-[72px]">
                  高频通用业务模块
                </h1>
                <p className="font-display text-[24px] font-semibold text-[#00FF88] md:text-[28px]">
                  独立·自包含·可组合
                </p>
              </div>
              <p className="max-w-[800px] text-[18px] leading-[1.8] text-[#9CA3AF]">
                每个模块是一个完整、自包含的项目，可根据实际业务需求自由选择、灵活组合。
                <br />
                模块间通过标准化接口通信，既能独立运行，也能按需集成。
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

        {/* Module Overview Section */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">MODULE OVERVIEW</p>
                <h2 className="font-display text-[40px] font-bold tracking-[-1px] text-white">
                  18+ 个高频通用业务模块一览
                </h2>
                <p className="text-[18px] text-[#9CA3AF]">
                  涵盖权限认证、会员体系、商品交易、支付管理、商户运营、基础数据等全场景能力
                </p>
              </div>

              <div className="flex w-full flex-col gap-3">
                {moduleRows.map((row, ri) => (
                  <div key={ri} className="grid grid-cols-3 gap-3">
                    {row.map((card) => (
                      <div
                        key={card.tag}
                        className="flex flex-col gap-1.5 rounded-xl bg-white/[0.024] p-4"
                        style={{ border: `1px solid ${card.borderColor}` }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex size-8 items-center justify-center rounded-lg text-[16px]"
                            style={{ background: card.iconBg }}
                          >
                            {card.emoji}
                          </div>
                          <span className="font-mono text-[14px] font-semibold" style={{ color: card.tagColor }}>
                            {card.tag}
                          </span>
                          <span className="font-display text-[18px] font-semibold text-white">{card.title}</span>
                        </div>
                        <p className="text-[13px] leading-[1.6] text-[#9CA3AF]">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <p className="text-[16px] font-semibold italic text-[#FB923C]">
                更多高频业务模块正在迭代，敬请期待...
              </p>
            </div>
          </div>
        </section>

        {/* Core Modules Detail Section */}
        <section className="bg-[#0B0C0E] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">CORE MODULES</p>
                <h2 className="font-display text-[40px] font-bold tracking-[-1px] text-white">
                  核心模块详解
                </h2>
                <p className="text-[18px] text-[#9CA3AF]">
                  每个核心模块的功能说明、设计特点与亮点一览
                </p>
              </div>

              {moduleDetails.map((mod) => (
                <div key={mod.title} className="flex w-full gap-6">
                  {/* Left panel */}
                  <div
                    className="flex flex-1 flex-col gap-5 rounded-xl p-8"
                    style={{ background: mod.bgColor, border: `1px solid ${mod.borderColor}` }}
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-[24px] font-bold" style={{ color: mod.titleColor }}>
                        {mod.title}
                      </h3>
                      <p className="text-[15px] leading-[1.6] text-[#9CA3AF]">{mod.subtitle}</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <h4 className="font-display text-[16px] font-semibold text-white">功能说明</h4>
                      <p className="whitespace-pre-line text-[15px] leading-[1.8] text-[#9CA3AF]">{mod.features}</p>
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="flex w-[420px] shrink-0 flex-col gap-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.063] bg-white/[0.024] p-6">
                      <h4 className="font-display text-[16px] font-semibold text-white">设计特点</h4>
                      <div className="flex flex-col gap-1">
                        {mod.designPoints.map((dp) => (
                          <div
                            key={dp}
                            className="border-l-2 border-l-[#00FF8840] py-2 pl-4 text-[13px] leading-[1.6] text-[#9CA3AF]"
                          >
                            {dp}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 rounded-xl border border-[#00FF8830] bg-[#00FF880D] p-6">
                      <h4 className="font-display text-[16px] font-semibold text-[#00FF88]">✨ 亮点</h4>
                      <p className="text-[14px] leading-[1.7] text-white">{mod.highlight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-16">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">ARCHITECTURE</p>
                <h2 className="font-display text-[40px] font-bold tracking-[-1px] text-white">
                  模块通用架构特点
                </h2>
                <p className="text-[18px] text-[#9CA3AF]">
                  所有模块在架构设计上遵循统一规范，具备以下 10 大共同特点
                </p>
              </div>

              <div className="w-full overflow-hidden rounded-2xl bg-[#0D1117]">
                {/* Terminal top bar */}
                <div className="flex items-center gap-2 bg-[#161B22] px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#FF5F57]">●</span>
                    <span className="text-[10px] text-[#FEBC2E]">●</span>
                    <span className="text-[10px] text-[#28C840]">●</span>
                  </div>
                  <span className="flex-1 text-center font-mono text-[13px] text-[#9CA3AF]">业务模块架构特点.md</span>
                  <span className="font-mono text-[12px] font-semibold text-[#00FF88]">★ 10</span>
                </div>

                {/* Terminal content */}
                <div className="flex flex-col gap-2.5 p-6 px-7">
                  {archFeatures.map((f) => (
                    <div key={f.num} className="flex flex-col gap-1">
                      <p className="font-mono text-[15px] font-semibold" style={{ color: f.color }}>
                        {f.num}  {f.title}
                      </p>
                      <p className={`text-[13px] leading-[1.7] ${f.num === "10" ? "text-white" : "text-[#9CA3AF]"}`}>
                        {f.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-8 text-center">
              <p className="font-mono text-[12px] font-semibold tracking-[2px] text-[#00FF88]">GET STARTED</p>
              <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                所有模块，一个生态
              </h2>
              <p className="max-w-[800px] text-[18px] leading-[1.6] text-[#9CA3AF]">
                从权限认证到支付交易，从商品管理到订单履约，从基础数据到运营工具。
                <br />
                每个模块独立自包含、可自由组合，为你的业务提供开箱即用的企业级能力。
              </p>
              <div className="flex gap-4 pt-4">
                <Link
                  href="#"
                  className="inline-flex items-center justify-center rounded-lg bg-[#00FF88] px-8 py-3.5 text-[16px] font-semibold text-[#0B0C0E] transition-colors hover:bg-[#3aff9f]"
                >
                  查看技术文档
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center rounded-lg border border-[#374151] px-8 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-white/[0.06]"
                >
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
