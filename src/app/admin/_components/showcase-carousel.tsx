"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const slides = [
  { src: "/images/login1002.png", alt: "登录页" },
  { src: "/images/index1001.png", alt: "首页总览" },
  { src: "/images/goods1001.png", alt: "商品编辑" },
  { src: "/images/order1001.png", alt: "订单管理" },
  { src: "/images/employee1001.png", alt: "员工管理" },
  { src: "/images/role1002.png", alt: "权限分配" },
]

export function ShowcaseCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api],
  )

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => { api.off("select", onSelect) }
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, duration: 25 }}
      plugins={[autoplayRef.current]}
      className="w-full"
    >
      <div className="group relative overflow-hidden rounded-2xl border border-[#1F293780] bg-[#0D1117]">
        <CarouselContent className="-ml-0">
          {slides.map((slide, i) => (
            <CarouselItem key={slide.src} className="pl-0">
              <div className="relative aspect-[1920/869]">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-[#00FF8840] hover:bg-black/60 hover:text-[#00FF88] md:opacity-0 md:group-hover:opacity-100"
          aria-label="上一张"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-[#00FF8840] hover:bg-black/60 hover:text-[#00FF88] md:opacity-0 md:group-hover:opacity-100"
          aria-label="下一张"
        >
          <ChevronRightIcon className="size-5" />
        </button>

        <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-[#00FF88]"
                  : "w-3 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`切换到第 ${i + 1} 张`}
            />
          ))}
        </div>
      </div>
    </Carousel>
  )
}
