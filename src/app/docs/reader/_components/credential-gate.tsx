"use client"

import { QrCode } from "lucide-react"
import { QrCodeZoom } from "@/components/qr-code-zoom"

export function CredentialGate() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
      <div className="flex h-9 items-center border-b border-[#1F2937] px-4">
        <span className="font-mono text-[11px] font-medium text-[#525252]">仓库凭证</span>
      </div>
      <div className="flex flex-col items-center gap-5 px-6 py-8">
        <div className="flex items-center gap-2 text-[#00FF88]">
          <QrCode className="size-5" />
          <span className="font-display text-[16px] font-bold">获取仓库配置</span>
        </div>
        <p className="max-w-md text-center text-[13px] leading-[1.8] text-[#9CA3AF]">
          扫码关注 <span className="font-semibold text-[#E5E5E5]">EasyBuild 公众号</span>，回复关键词获取 Maven / Gradle 仓库配置信息（仓库地址、用户名、密码）
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1F2937] bg-white p-2">
          <QrCodeZoom src="/images/easybuild公众号二维码.jpg" alt="扫码关注 EasyBuild 公众号" size={180} />
        </div>
        <p className="text-[11px] text-[#525252]">点击二维码可放大查看</p>
      </div>
    </div>
  )
}
