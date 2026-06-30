"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { SafeImage } from "@/components/safe-image"

export function ImageZoom({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const safe = images.length > 0 ? images : ["/placeholder.svg"]
  const [idx, setIdx] = useState(0)
  const [zoom, setZoom] = useState(false) // mouse-tracking zoom on main
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + safe.length) % safe.length)
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % safe.length)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightbox, safe.length])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return (
    <div className="grid gap-3 md:grid-cols-[80px_1fr]">
      {/* Thumbnails */}
      <div className="order-2 flex flex-row gap-2 overflow-x-auto md:order-1 md:flex-col md:gap-2 md:overflow-y-auto">
        {safe.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIdx(i)}
            className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
              idx === i
                ? "border-gold"
                : "border-gold/20 hover:border-gold/50"
            }`}
            aria-label={`Фото ${i + 1}`}
          >
            <SafeImage
              src={src}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image with hover zoom + click lightbox */}
      <div className="order-1 md:order-2">
        <div
          className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-md border border-gold/20 bg-forest gold-glow"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMove}
          onClick={() => setLightbox(true)}
        >
          <SafeImage
            src={safe[idx]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-200"
            style={
              zoom
                ? {
                    transform: "scale(1.8)",
                    transformOrigin: `${pos.x}% ${pos.y}%`,
                  }
                : undefined
            }
          />
          <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-forest-deep/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gold opacity-0 group-hover:opacity-100">
            <ZoomIn className="size-3" /> Увеличить
          </div>

          {safe.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIdx((i) => (i - 1 + safe.length) % safe.length)
                }}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-forest-deep/70 p-2 text-gold opacity-0 transition-opacity hover:bg-gold hover:text-forest group-hover:opacity-100"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIdx((i) => (i + 1) % safe.length)
                }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-forest-deep/70 p-2 text-gold opacity-0 transition-opacity hover:bg-gold hover:text-forest group-hover:opacity-100"
                aria-label="Следующее фото"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-6 top-6 z-10 rounded-full bg-forest-deep/80 p-2 text-gold hover:bg-gold hover:text-forest"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </button>
          {safe.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIdx((i) => (i - 1 + safe.length) % safe.length)
                }}
                className="absolute left-6 z-10 rounded-full bg-forest-deep/80 p-3 text-gold hover:bg-gold hover:text-forest"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIdx((i) => (i + 1) % safe.length)
                }}
                className="absolute right-6 z-10 rounded-full bg-forest-deep/80 p-3 text-gold hover:bg-gold hover:text-forest"
                aria-label="Следующее фото"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={safe[idx]}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {safe.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-gold-soft/80">
                {idx + 1} / {safe.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
