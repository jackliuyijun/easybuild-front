import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "EasyBuild 易构 — 企业级 Java 快速开发平台"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B0C0E 0%, #111827 50%, #0B0C0E 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              background: "#00FF88",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 800,
              color: "#0B0C0E",
            }}
          >
            EB
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-2px",
            }}
          >
            EasyBuild 易构
          </span>
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#00FF88",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          企业级 Java 快速开发平台
        </div>
        <div
          style={{
            fontSize: "18px",
            color: "#9CA3AF",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          代码生成 · 微服务架构 · ORM · 缓存 · 消息队列 · 40+ 可插拔组件
        </div>
      </div>
    ),
    { ...size }
  )
}
