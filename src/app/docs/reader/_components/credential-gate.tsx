"use client"

import { useState } from "react"
import { QrCode, MessageSquare, Users, User } from "lucide-react"
import { QrCodeZoom } from "@/components/qr-code-zoom"

const TABS = [
  {
    id: "lark",
    label: "飞书群",
    icon: <Users className="size-4" />,
    src: "/images/飞书群二维码2.png",
    alt: "作者飞书群二维码",
    text: "扫码加入作者飞书群，在群公告中查看 Maven / Gradle 仓库配置信息（仓库地址、用户名、密码）"
  },
  {
    id: "official",
    label: "公众号",
    icon: <MessageSquare className="size-4" />,
    src: "/images/easybuild公众号二维码.jpg",
    alt: "EasyBuild 公众号二维码",
    text: "关注公众号，回复【技术交流】关键词获取 Maven / Gradle 仓库配置信息（仓库地址、用户名、密码）"
  },
  {
    id: "author",
    label: "作者微信",
    icon: <User className="size-4" />,
    src: "/images/10004.png",
    alt: "作者微信二维码",
    text: "扫码添加作者微信（备注：EasyBuild），手动获取 Maven / Gradle 仓库配置信息（仓库地址、用户名、密码）"
  }
]

export function CredentialGate() {
  const [activeId, setActiveId] = useState("lark")
  const activeTab = TABS.find(t => t.id === activeId) || TABS[0]

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
      <div className="flex h-9 items-center border-b border-[#1F2937] px-4">
        <span className="font-mono text-[11px] font-medium text-[#525252]">仓库凭证获取方式</span>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-[#1F2937] bg-[#0d1117]/50 p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-[12px] font-medium transition-all duration-200 ${activeId === tab.id
              ? "bg-[#00FF88]/10 text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.1)]"
              : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E5E5E5]"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 px-6 py-8">
        <div className="flex items-center gap-2 text-[#00FF88]">
          <QrCode className="size-5" />
          <span className="font-display text-[16px] font-bold">获取仓库配置</span>
        </div>
        <p className="max-w-md text-center text-[13px] leading-[1.8] text-[#9CA3AF] min-h-[48px]">
          {activeTab.text}
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1F2937] bg-white p-2 transition-all duration-300">
          <QrCodeZoom
            key={activeTab.id}
            src={activeTab.src}
            alt={activeTab.alt}
            size={180}
          />
        </div>
        <p className="text-[11px] text-[#525252]">点击二维码可放大查看</p>
      </div>
    </div>
  )
}
