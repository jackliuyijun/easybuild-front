import type { Metadata } from "next"
import MobileContent from "./_content"

export const metadata: Metadata = {
  title: "移动端开发 — 微信原生 / UniApp / Flutter 全端就绪",
  description:
    "一套 EasyBuild 后端驱动微信原生、UniApp、Flutter 三大移动终端，统一鉴权、统一响应、统一异常处理，开箱即用。",
}

export default function MobilePage() {
  return <MobileContent />
}
