"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface QrCodeZoomProps {
  src: string
  alt: string
  size?: number
  zoomSize?: number
  className?: string
}

export function QrCodeZoom({ src, alt, size = 200, zoomSize = 360, className }: QrCodeZoomProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setShowModal(true)} className={`cursor-pointer transition-opacity hover:opacity-80 ${className ?? ""}`}>
        <Image src={src} alt={alt} width={size} height={size} className="rounded-lg" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowModal(false)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setShowModal(false)} className="absolute -right-3 -top-3 flex size-7 items-center justify-center rounded-full bg-[#1F2937] text-[#9CA3AF] transition-colors hover:bg-[#374151] hover:text-white">
              <X className="size-4" />
            </button>
            <div className="overflow-hidden rounded-xl bg-white p-3">
              <Image src={src} alt={alt} width={zoomSize} height={zoomSize} className="rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
