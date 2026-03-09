import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #0B0C0E 0%, #161B22 100%)",
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            background: "#00FF88",
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#0B0C0E",
              lineHeight: 1,
            }}
          >
            E
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
