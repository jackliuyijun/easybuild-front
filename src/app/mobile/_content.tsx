"use client"

import { useState } from "react"
import { Settings, Globe, Moon, Terminal } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"

const techStackCards = [
  {
    letter: "W",
    color: "#00FF88",
    title: "极致原生体验",
    subtitle: "微信原生 (WeChat Native)",
    tags: ["WXML", "TS", "Skyline"],
    description: "深度集成微信 SDK，包体积最小，云开发能力开箱即用。",
  },
  {
    letter: "U",
    color: "#60A5FA",
    title: "国内跨端首选",
    subtitle: "UniApp (Cross-Platform)",
    tags: ["Vue 3", "Vite", "Pinia"],
    description: "一套代码发布至小程序、H5、App。内置 uView UI，开发效率翻倍。",
  },
  {
    letter: "F",
    color: "#A78BFA",
    title: "高性能渲染引擎",
    subtitle: "Flutter (Global App)",
    tags: ["Dart", "GetX", "Material 3"],
    description: "Google 跨平台方案，Skia 引擎自绘 UI，媲美原生 App 的 120Hz 流畅度。",
  },
]

const adapterFeatures = [
  "统一鉴权：无感 Token 刷新，401 自动跳转登录",
  "统一响应：自动解析 ResponseResult<T>，业务层直取 Data",
  "统一异常：网络超时、业务错误统一 Toast 提示",
  "类型同步：后端 DTO 自动生成 TS/Dart 类型定义",
]

const adapterTags = ["Interceptor", "TokenManager", "ErrorHandler"]

const bentoItems = [
  {
    icon: Settings,
    color: "#00FF88",
    title: "多环境切换",
    description: "Dev / Test / Prod 变量一键配置",
  },
  {
    icon: Globe,
    color: "#60A5FA",
    title: "i18n Ready",
    description: "预置多语言框架，轻松实现国际化",
  },
  {
    icon: Moon,
    color: "#A78BFA",
    title: "Dark Mode",
    description: "全端适配深色模式，护眼体验",
  },
  {
    icon: Terminal,
    color: "#FBBF24",
    title: "自动化脚本",
    description: "一键打包、上传、版本号自增",
  },
]

type CodeLine = { text: string; color: string; italic?: boolean; highlight?: boolean }

const tabData = [
  {
    key: "WeChat",
    file: "api.service.ts — EasyFK Mobile",
    code: [
      { text: "import { EasyClient } from '@easyark/core'", color: "#A78BFA" },
      { text: "import { useAuth } from '@easyark/auth'", color: "#A78BFA" },
      { text: " ", color: "#9CA3AF" },
      { text: "// 自动注入 Token，自动处理 401", color: "#6B7280", italic: true },
      { text: "const client = new EasyClient({", color: "#E5E7EB" },
      { text: "  baseURL: process.env.API_BASE,", color: "#E5E7EB" },
      { text: "  tokenProvider: useAuth().getToken,", color: "#E5E7EB" },
      { text: "})", color: "#E5E7EB" },
      { text: " ", color: "#9CA3AF" },
      { text: "// 获取用户信息 - 三端通用", color: "#6B7280", italic: true },
      { text: "export async function getUserProfile() {", color: "#E5E7EB" },
      { text: "  const res = await client.get('/api/user/profile')", color: "#00FF88", highlight: true },
      { text: "  return res.data  // ResponseResult<UserDTO>", color: "#E5E7EB" },
      { text: "}", color: "#E5E7EB" },
      { text: " ", color: "#9CA3AF" },
      { text: "// 获取订单列表 - 分页查询", color: "#6B7280", italic: true },
      { text: "export async function getOrders(page: number) {", color: "#E5E7EB" },
      { text: "  const res = await client.post('/api/order/list',", color: "#00FF88", highlight: true },
      { text: "    { page, size: 20 }", color: "#E5E7EB" },
      { text: "  )", color: "#E5E7EB" },
      { text: "  return res.data", color: "#E5E7EB" },
      { text: "}", color: "#E5E7EB" },
    ] as CodeLine[],
  },
  {
    key: "UniApp",
    file: "api.service.ts — UniApp Vue 3",
    code: [
      { text: "import { useRequest } from '@/composables/request'", color: "#A78BFA" },
      { text: "import { useUserStore } from '@/stores/user'", color: "#A78BFA" },
      { text: " ", color: "#9CA3AF" },
      { text: "// 基于 uni.request 封装，自动携带 Token", color: "#6B7280", italic: true },
      { text: "const { get, post } = useRequest({", color: "#E5E7EB" },
      { text: "  baseURL: import.meta.env.VITE_API_BASE,", color: "#E5E7EB" },
      { text: "  tokenProvider: () => useUserStore().token,", color: "#E5E7EB" },
      { text: "})", color: "#E5E7EB" },
      { text: " ", color: "#9CA3AF" },
      { text: "// 获取订单列表 - 支持下拉刷新", color: "#6B7280", italic: true },
      { text: "export function useOrders(page: Ref<number>) {", color: "#E5E7EB" },
      { text: "  return useAsyncData(() =>", color: "#E5E7EB" },
      { text: "    post('/api/order/list', { page: page.value })", color: "#00FF88", highlight: true },
      { text: "  )", color: "#E5E7EB" },
      { text: "}", color: "#E5E7EB" },
      { text: " ", color: "#9CA3AF" },
      { text: "// 获取商品详情 - 自动缓存", color: "#6B7280", italic: true },
      { text: "export function useProduct(id: string) {", color: "#E5E7EB" },
      { text: "  return useAsyncData(() =>", color: "#E5E7EB" },
      { text: "    get(`/api/product/${id}`)", color: "#00FF88", highlight: true },
      { text: "  , { cacheKey: `product-${id}` })", color: "#E5E7EB" },
      { text: "}", color: "#E5E7EB" },
    ] as CodeLine[],
  },
  {
    key: "Flutter",
    file: "api_service.dart — Flutter App",
    code: [
      { text: "import 'package:easyark/easyark.dart';", color: "#A78BFA" },
      { text: "import 'package:easyark/auth.dart';", color: "#A78BFA" },
      { text: " ", color: "#9CA3AF" },
      { text: "/// Dio 封装，自动刷新 Token，统一异常", color: "#6B7280", italic: true },
      { text: "class ApiService {", color: "#E5E7EB" },
      { text: "  final _client = EasyClient(", color: "#E5E7EB" },
      { text: "    baseUrl: Env.apiBase,", color: "#E5E7EB" },
      { text: "    tokenProvider: AuthManager.getToken,", color: "#E5E7EB" },
      { text: "  );", color: "#E5E7EB" },
      { text: " ", color: "#9CA3AF" },
      { text: "  /// 获取用户信息", color: "#6B7280", italic: true },
      { text: "  Future<UserDTO> getUserProfile() async {", color: "#E5E7EB" },
      { text: "    final res = await _client.get('/api/user/profile');", color: "#00FF88", highlight: true },
      { text: "    return UserDTO.fromJson(res.data);", color: "#E5E7EB" },
      { text: "  }", color: "#E5E7EB" },
      { text: " ", color: "#9CA3AF" },
      { text: "  /// 获取订单列表 - 分页", color: "#6B7280", italic: true },
      { text: "  Future<PageResult<Order>> getOrders(int page) async {", color: "#E5E7EB" },
      { text: "    final res = await _client.post('/api/order/list',", color: "#00FF88", highlight: true },
      { text: "      data: {'page': page, 'size': 20},", color: "#E5E7EB" },
      { text: "    );", color: "#E5E7EB" },
      { text: "    return PageResult.fromJson(res.data);", color: "#E5E7EB" },
      { text: "  }", color: "#E5E7EB" },
      { text: "}", color: "#E5E7EB" },
    ] as CodeLine[],
  },
] as const

export default function MobileContent() {
  const [activeTab, setActiveTab] = useState(0)
  const currentTab = tabData[activeTab]

  return (
    <div className="relative isolate min-h-screen bg-[#0B0C0E] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_28%)]" />
      <SiteHeader />
      <main className="relative">
        {/* ── Hero Section ── */}
        <section className="px-0 pb-[60px] pt-[120px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-10">
            <div className="flex flex-col items-center gap-10 text-center">
              {/* Title */}
              <h1 className="font-display text-[56px] font-bold tracking-[-2px] text-white md:text-[72px]">
                移动端开发，全栈就绪
              </h1>
              {/* Subtitle */}
              <p className="max-w-[700px] text-[18px] leading-[1.8] text-[#9CA3AF]">
                一套 EasyBuild 后端，驱动 微信原生、UniApp、Flutter 三大终端。
                <br />
                从底层接口适配到上层 UI 组件，基础设施已为您铺好。
              </p>
              {/* Buttons */}
              <div className="flex items-center gap-4">
                <a
                  href="#get-source"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#00FF88] px-8 py-3.5 text-[15px] font-semibold text-[#0B0C0E] transition-colors hover:bg-[#31ff9d]"
                >
                  立即获取源码
                  <span>→</span>
                </a>
                <a
                  href="#architecture"
                  className="inline-flex items-center rounded-lg border border-[#9CA3AF40] px-8 py-3.5 text-[15px] font-medium text-[#9CA3AF] transition-colors hover:border-white/30 hover:text-white"
                >
                  查看架构图
                </a>
              </div>
              {/* Hero Visual - Phone Mockups */}
              <div className="relative mx-auto mt-6 h-[480px] w-full max-w-[1100px]">
                {/* Connection Lines */}
                <div className="absolute left-[calc(50%-370px)] top-[240px] h-[2px] w-[200px] bg-gradient-to-r from-transparent via-[#00FF8880] to-[#00FF88]" />
                <div className="absolute left-[calc(50%)] top-[30px] h-[140px] w-[2px] bg-gradient-to-b from-transparent via-[#00FF8880] to-[#00FF88]" />
                <div className="absolute right-[calc(50%-370px)] top-[240px] h-[2px] w-[200px] bg-gradient-to-l from-transparent via-[#00FF8880] to-[#00FF88]" />
                {/* Glowing Dots */}
                <div className="absolute left-[calc(50%-360px)] top-[237px] size-[6px] rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
                <div className="absolute left-[calc(50%-1px)] top-[100px] size-[6px] rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
                <div className="absolute right-[calc(50%-363px)] top-[237px] size-[6px] rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />

                {/* Center Cube - EasyFK Core */}
                <div className="absolute left-1/2 top-[170px] flex h-[140px] w-[140px] -translate-x-1/2 flex-col items-center justify-center rounded-[20px] border-[1.5px] border-[#00FF8860] bg-[linear-gradient(225deg,#00FF8830_0%,#0B0C0E_100%)] shadow-[0_0_60px_#00FF8830,0_0_120px_#00FF8815]">
                  <span className="text-center font-mono text-[14px] font-bold leading-[1.4] text-[#00FF88]">
                    EasyFK
                    <br />
                    Core
                  </span>
                  <span className="mt-1 text-[10px] text-[#00FF8860]">◆</span>
                </div>

                {/* Phone: WeChat (Left) */}
                <div className="absolute left-[calc(50%-480px)] top-[60px] w-[180px] overflow-hidden rounded-[24px] border-[3px] border-[#2A2D32] bg-[#111215] shadow-[0_0_40px_#00FF8810]">
                  <div className="flex h-[32px] items-center justify-center bg-[#1A1D21] px-4">
                    <span className="text-[10px] font-medium text-[#9CA3AF]">WeChat Mini</span>
                  </div>
                  <div className="flex flex-col gap-3 bg-[#0D1117] p-3.5">
                    <p className="text-[13px] font-semibold text-white">微信小程序</p>
                    <div className="flex flex-col gap-2 rounded-[10px] bg-[#1A1D21] p-3">
                      <p className="text-[11px] font-semibold text-white">个人中心</p>
                      <p className="font-mono text-[10px] font-medium text-[#00FF88]">积分: 2,580</p>
                    </div>
                    <div className="size-9 rounded-full bg-gradient-to-b from-[#00FF8840] to-[#0B0C0E] ring-1 ring-[#00FF8830]" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-7 rounded-md bg-[#1A1D21]" />
                      <div className="h-7 rounded-md bg-[#1A1D21]" />
                      <div className="h-7 rounded-md bg-[#1A1D21]" />
                    </div>
                  </div>
                </div>
                <p className="absolute left-[calc(50%-443px)] top-[430px] text-center text-[12px] font-medium text-[#9CA3AF]">
                  微信原生
                </p>

                {/* Phone: Flutter (Center) */}
                <div className="absolute left-1/2 top-0 w-[220px] -translate-x-1/2 overflow-hidden rounded-[28px] border-[3px] border-[#3A3D42] bg-[#111215] shadow-[0_0_50px_#00FF8815,0_0_100px_#00FF8808]">
                  <div className="flex h-9 items-center justify-center bg-[#1A1D21]">
                    <div className="h-5 w-20 rounded-xl bg-black" />
                  </div>
                  <div className="flex flex-col gap-3 bg-[#0D1117] p-4">
                    <p className="text-[14px] font-semibold text-white">Flutter Dashboard</p>
                    <div className="flex gap-2">
                      <div className="flex flex-1 flex-col gap-1 rounded-[10px] bg-[#1A1D21] p-2.5">
                        <span className="text-[9px] text-[#9CA3AF]">用户数</span>
                        <span className="font-mono text-[14px] font-bold text-white">12.8K</span>
                      </div>
                      <div className="flex flex-1 flex-col gap-1 rounded-[10px] bg-[#1A1D21] p-2.5">
                        <span className="text-[9px] text-[#9CA3AF]">订单量</span>
                        <span className="font-mono text-[14px] font-bold text-[#00FF88]">3,240</span>
                      </div>
                    </div>
                    <div className="relative h-[100px] overflow-hidden rounded-[10px] bg-[#1A1D21]">
                      <p className="absolute left-2.5 top-2 text-[9px] font-medium text-[#9CA3AF]">收入趋势</p>
                      <div className="absolute bottom-0 left-4 flex items-end gap-[10px]">
                        {[50, 35, 65, 45, 70, 55].map((h, i) => (
                          <div
                            key={i}
                            className="w-3.5 rounded-t bg-gradient-to-t from-[#00FF8840] to-[#00FF88]"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="absolute left-1/2 top-[432px] -translate-x-1/2 text-center text-[12px] font-medium text-[#9CA3AF]">
                  Flutter
                </p>

                {/* Phone: UniApp (Right) */}
                <div className="absolute right-[calc(50%-480px)] top-[60px] w-[180px] overflow-hidden rounded-[20px] border-[3px] border-[#2A2D32] bg-[#111215] shadow-[0_0_40px_#00FF8810]">
                  <div className="flex h-[32px] items-center justify-center bg-[#1A1D21] px-4">
                    <span className="text-[10px] font-medium text-[#9CA3AF]">UniApp H5</span>
                  </div>
                  <div className="flex flex-col gap-2.5 bg-[#0D1117] p-3.5">
                    <p className="text-[13px] font-semibold text-white">订单列表</p>
                    {[
                      { color: "#60A5FA", border: "#60A5FA20", title: "Premium 会员卡", sub: "¥299.00 · 已完成" },
                      { color: "#FBBF24", border: "#FBBF2420", title: "年度套餐 Pro", sub: "¥1,299.00 · 待支付" },
                      { color: "#A78BFA", border: "#A78BFA20", title: "企业版授权", sub: "¥4,999.00 · 已完成" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center gap-2.5 rounded-[10px] bg-[#1A1D21] p-2.5">
                        <div
                          className="h-9 w-9 shrink-0 rounded-lg"
                          style={{
                            background: `linear-gradient(180deg, ${item.color}30 0%, #0D1117 100%)`,
                            border: `1px solid ${item.border}`,
                          }}
                        />
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <p className="truncate text-[11px] font-semibold text-white">{item.title}</p>
                          <p className="truncate text-[9px] text-[#9CA3AF]">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="absolute right-[calc(50%-462px)] top-[430px] text-center text-[12px] font-medium text-[#9CA3AF]">
                  UniApp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2 - Tech Stack ── */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-12">
              <p className="font-mono text-[12px] font-semibold tracking-[3px] text-[#00FF88]">
                THE STACK
              </p>
              <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white text-center">
                技术栈选择，选哪个都行
              </h2>
              <div className="grid w-full gap-6 lg:grid-cols-3">
                {techStackCards.map((card) => (
                  <div
                    key={card.letter}
                    className="flex flex-col gap-5 rounded-2xl border bg-white/[0.024] p-8 text-left"
                    style={{ borderColor: `${card.color}25` }}
                  >
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <span
                        className="font-display text-[22px] font-bold"
                        style={{ color: card.color }}
                      >
                        {card.letter}
                      </span>
                    </div>
                    <h3 className="font-display text-[22px] font-bold text-white">{card.title}</h3>
                    <p className="font-mono text-[12px] font-medium" style={{ color: card.color }}>
                      {card.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border px-2.5 py-1 font-mono text-[11px] font-medium"
                          style={{
                            color: card.color,
                            backgroundColor: `${card.color}12`,
                            borderColor: `${card.color}30`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[14px] leading-[1.7] text-[#9CA3AF]">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3 - Live Code & Preview ── */}
        <section className="px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <p className="font-mono text-[12px] font-semibold tracking-[3px] text-[#00FF88]">
                  LIVE CODE &amp; PREVIEW
                </p>
                <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                  一套代码，三端预览
                </h2>
              </div>
              {/* Tab Bar */}
              <div className="flex items-center gap-1 rounded-[22px] bg-[#1A1D21] p-1">
                {tabData.map((tab, idx) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={cn(
                      "flex items-center gap-2 rounded-[18px] px-5 py-2 text-[13px] font-medium transition-colors",
                      idx === activeTab
                        ? "bg-white font-semibold text-[#0B0C0E]"
                        : "text-[#9CA3AF] hover:text-white"
                    )}
                  >
                    <span
                      className={cn(
                        "size-[6px] rounded-full",
                        idx === activeTab ? "bg-[#00FF88]" : "bg-[#9CA3AF40]"
                      )}
                    />
                    {tab.key}
                  </button>
                ))}
              </div>
              {/* Code + Phone */}
              <div className="flex w-full gap-8">
                {/* Code Editor */}
                <div className="flex-1 overflow-hidden rounded-2xl border border-[#1F293780] bg-[#0D1117]">
                  <div className="flex h-10 items-center gap-2 border-b border-[#1F2937] bg-[#161B22] px-4">
                    <span className="size-3 rounded-full bg-[#FF5F57]" />
                    <span className="size-3 rounded-full bg-[#FEBC2E]" />
                    <span className="size-3 rounded-full bg-[#28C840]" />
                    <span className="ml-2 font-mono text-[11px] text-[#9CA3AF]">
                      {currentTab.file}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 px-6 py-5 text-left">
                    {currentTab.code.map((line, i) => {
                      const content = (
                        <code
                          className={cn(
                            "block whitespace-pre font-mono text-[12px]",
                            line.italic && "italic"
                          )}
                          style={{ color: line.color }}
                        >
                          {line.text}
                        </code>
                      )
                      if (line.highlight) {
                        return (
                          <div key={i} className="rounded bg-[#00FF8810] px-0 py-0.5">
                            {content}
                          </div>
                        )
                      }
                      return <div key={i}>{content}</div>
                    })}
                  </div>
                </div>
                {/* Phone Preview */}
                <div className="flex w-[320px] shrink-0 items-center justify-center">
                  <div className="w-[260px] overflow-hidden rounded-[32px] border-4 border-[#3A3D42] bg-[#1A1D21] shadow-[0_0_60px_#00FF8815,0_0_120px_#00FF8808]">
                    <div className="flex h-11 items-center justify-center bg-[#111215]">
                      <div className="h-6 w-[90px] rounded-[14px] bg-black" />
                    </div>
                    {/* WeChat - 个人中心 */}
                    {activeTab === 0 && (
                      <div className="flex flex-col gap-4 bg-[#0D1117] px-[18px] py-5">
                        <p className="text-[18px] font-bold text-white">个人中心</p>
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-gradient-to-b from-[#00FF8840] to-[#0D1117] ring-1 ring-[#00FF8830]" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-semibold text-white">张三</span>
                            <span className="text-[11px] text-[#9CA3AF]">VIP 会员</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-[14px] border border-[#00FF8825] bg-gradient-to-b from-[#00FF8818] to-transparent p-4">
                          <div className="flex flex-col">
                            <span className="text-[11px] text-[#9CA3AF]">我的积分</span>
                            <span className="font-mono text-[18px] font-bold text-[#00FF88]">2,580</span>
                          </div>
                          <span className="rounded-lg bg-[#00FF8815] px-3 py-1.5 text-[11px] font-medium text-[#00FF88]">
                            去兑换 →
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {["我的订单", "收货地址", "账户设置", "关于我们"].map((item) => (
                            <div
                              key={item}
                              className="flex items-center justify-between rounded-xl bg-[#111215] px-4 py-3"
                            >
                              <span className="text-[13px] text-[#E5E7EB]">{item}</span>
                              <span className="text-[12px] text-[#6B7280]">›</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* UniApp - 订单列表 */}
                    {activeTab === 1 && (
                      <div className="flex flex-col gap-3 bg-[#0D1117] px-[18px] py-5">
                        <p className="text-[18px] font-bold text-white">订单列表</p>
                        {[
                          { color: "#60A5FA", title: "Premium 会员卡", sub: "¥299.00 · 已完成", tag: "完成" },
                          { color: "#FBBF24", title: "年度套餐 Pro", sub: "¥1,299.00 · 待支付", tag: "待付" },
                          { color: "#A78BFA", title: "企业版授权", sub: "¥4,999.00 · 已完成", tag: "完成" },
                          { color: "#00FF88", title: "基础版月卡", sub: "¥49.00 · 已完成", tag: "完成" },
                        ].map((item) => (
                          <div key={item.title} className="flex items-center gap-3 rounded-xl bg-[#111215] p-3">
                            <div
                              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                              style={{ backgroundColor: `${item.color}18`, color: item.color }}
                            >
                              {item.tag}
                            </div>
                            <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                              <span className="truncate text-[12px] font-semibold text-white">{item.title}</span>
                              <span className="truncate text-[10px] text-[#9CA3AF]">{item.sub}</span>
                            </div>
                            <span className="text-[11px] text-[#6B7280]">›</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Flutter - Dashboard */}
                    {activeTab === 2 && (
                      <div className="flex flex-col gap-3 bg-[#0D1117] px-4 py-5">
                        <p className="text-[18px] font-bold text-white">Dashboard</p>
                        <div className="flex gap-2">
                          <div className="flex flex-1 flex-col gap-1 rounded-[10px] bg-[#111215] p-3">
                            <span className="text-[9px] text-[#9CA3AF]">用户数</span>
                            <span className="font-mono text-[16px] font-bold text-white">12.8K</span>
                          </div>
                          <div className="flex flex-1 flex-col gap-1 rounded-[10px] bg-[#111215] p-3">
                            <span className="text-[9px] text-[#9CA3AF]">订单量</span>
                            <span className="font-mono text-[16px] font-bold text-[#00FF88]">3,240</span>
                          </div>
                        </div>
                        <div className="relative h-[100px] overflow-hidden rounded-[10px] bg-[#111215]">
                          <p className="absolute left-3 top-2 text-[9px] font-medium text-[#9CA3AF]">收入趋势</p>
                          <div className="absolute bottom-0 left-3 flex items-end gap-[8px]">
                            {[50, 35, 65, 45, 70, 55, 40].map((h, i) => (
                              <div
                                key={i}
                                className="w-3 rounded-t bg-gradient-to-t from-[#A78BFA40] to-[#A78BFA]"
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {[
                            { label: "今日收入", value: "¥8,420", delta: "+12%" },
                            { label: "转化率", value: "3.8%", delta: "+0.5%" },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-xl bg-[#111215] px-3 py-2.5">
                              <span className="text-[11px] text-[#9CA3AF]">{item.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[12px] font-semibold text-white">{item.value}</span>
                                <span className="text-[10px] font-medium text-[#00FF88]">{item.delta}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4 - Adapter Layer ── */}
        <section className="bg-[linear-gradient(180deg,#0B0C0E_0%,#0D1117_50%,#0B0C0E_100%)] px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center">
              {/* Left Text */}
              <div className="flex flex-1 flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[12px] font-semibold tracking-[3px] text-[#00FF88]">
                    ADAPTER LAYER
                  </p>
                  <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                    后端统一，前端解耦
                  </h2>
                  <p className="text-[16px] leading-[1.7] text-[#9CA3AF]">
                    我们为您封装了 EasyFK-Mobile-Adapter 层，统一了三端的开发体验。
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {adapterFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#00FF8815]">
                        <span className="text-[12px] font-bold text-[#00FF88]">✓</span>
                      </div>
                      <span className="text-[14px] font-medium text-[#E5E7EB]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right Visual - Layer Diagram */}
              <div className="flex flex-1 flex-col items-center gap-4">
                {/* UI Layer */}
                <div className="flex w-full max-w-[440px] flex-col items-center gap-1.5 rounded-[14px] border border-[#9CA3AF25] bg-[#FFFFFF06] px-7 py-5">
                  <span className="font-display text-[16px] font-semibold text-white">UI View (Page)</span>
                  <span className="font-mono text-[11px] text-[#9CA3AF]">
                    WeChat Page &nbsp;|&nbsp; UniApp Page &nbsp;|&nbsp; Flutter Widget
                  </span>
                </div>
                {/* Arrow 1 */}
                <div className="flex flex-col items-center">
                  <div className="h-7 w-[2px] bg-gradient-to-b from-[#9CA3AF40] to-[#00FF8840]" />
                  <span className="text-[10px] text-[#00FF88]">▼</span>
                </div>
                {/* Adapter Layer */}
                <div className="flex w-full max-w-[440px] flex-col items-center gap-2 rounded-[14px] border-[1.5px] border-[#00FF8840] bg-[linear-gradient(90deg,#00FF8815_0%,#00FF8805_100%)] px-7 py-5 shadow-[0_0_40px_#00FF8815]">
                  <span className="font-display text-[18px] font-bold text-[#00FF88]">Adapter Layer</span>
                  <div className="flex flex-wrap gap-2">
                    {adapterTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-[#00FF8830] bg-[#00FF8812] px-2.5 py-1 font-mono text-[10px] font-medium text-[#00FF88]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Arrow 2 */}
                <div className="flex flex-col items-center">
                  <div className="h-7 w-[2px] bg-gradient-to-b from-[#00FF8840] to-[#9CA3AF40]" />
                  <span className="text-[10px] text-[#00FF88]">▼</span>
                </div>
                {/* Network Layer */}
                <div className="flex w-full max-w-[440px] flex-col items-center gap-1.5 rounded-[14px] border border-[#9CA3AF25] bg-[#FFFFFF06] px-7 py-5">
                  <span className="font-display text-[16px] font-semibold text-white">
                    Network (EasyFK API)
                  </span>
                  <span className="font-mono text-[11px] text-[#9CA3AF]">
                    HTTP &nbsp;|&nbsp; WebSocket &nbsp;|&nbsp; GraphQL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5 - Bento Grid ── */}
        <section className="px-0 py-20">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <p className="font-mono text-[12px] font-semibold tracking-[3px] text-[#00FF88]">
                  ENGINEERING
                </p>
                <h2 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                  工程化与配置
                </h2>
              </div>
              <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {bentoItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="flex flex-col gap-4 rounded-2xl border border-[#1F293780] bg-[#FFFFFF06] p-7"
                    >
                      <div
                        className="flex size-10 items-center justify-center rounded-[10px]"
                        style={{ backgroundColor: `${item.color}12` }}
                      >
                        <Icon className="size-5" style={{ color: item.color }} />
                      </div>
                      <h3 className="font-display text-[16px] font-semibold text-white">{item.title}</h3>
                      <p className="text-[13px] leading-[1.6] text-[#9CA3AF]">{item.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 6 - CTA ── */}
        <section id="get-source" className="px-0 py-[100px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 xl:px-20">
            <div className="flex flex-col items-center gap-8 text-center">
              <h2 className="font-display text-[40px] font-bold tracking-[-1px] text-white">
                后端已就位，移动端怎能落后？
              </h2>
              <p className="text-[16px] text-[#9CA3AF]">
                包含 Native + UniApp + Flutter 三套工程
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2.5 rounded-[10px] bg-[#00FF88] px-10 py-4 text-[16px] font-bold text-[#0B0C0E] shadow-[0_4px_30px_#00FF8830] transition-colors hover:bg-[#31ff9d]"
              >
                获取全套移动端源码
                <span className="text-[18px] font-bold">→</span>
              </a>
              <div className="flex items-center gap-5">
                {[
                  { color: "#00FF88", label: "WeChat Native" },
                  { color: "#60A5FA", label: "UniApp" },
                  { color: "#A78BFA", label: "Flutter" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[13px] font-medium text-[#9CA3AF]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
