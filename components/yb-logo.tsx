import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Size = "sm" | "md" | "lg" | "xl"

const sizeMap: Record<Size, { mark: number; name: string; sub: string; gap: string }> = {
  sm: { mark: 34, name: "text-sm", sub: "text-[8px] tracking-[0.22em]", gap: "gap-2" },
  md: { mark: 46, name: "text-xl", sub: "text-[10px] tracking-[0.26em]", gap: "gap-2.5" },
  lg: { mark: 66, name: "text-3xl", sub: "text-xs tracking-[0.3em]", gap: "gap-3" },
  xl: { mark: 156, name: "text-5xl md:text-6xl", sub: "text-sm tracking-[0.35em]", gap: "gap-4" },
}

export function YBLogo({
  size = "md",
  withText = true,
  className,
  href = "/",
  stacked = false,
  linked = true,
  photo = false,
}: {
  size?: Size
  withText?: boolean
  className?: string
  href?: string
  stacked?: boolean
  linked?: boolean
  photo?: boolean
}) {
  const s = sizeMap[size]
  const content = (
    <span
      className={cn(
        "group inline-flex items-center text-gold",
        stacked ? "flex-col gap-3" : s.gap,
        className,
      )}
    >
      {photo ? <PhotoMark size={s.mark} /> : <Shield size={s.mark} />}
      {withText && (
        <span className={cn("flex flex-col leading-none", stacked && "items-center")}>
          <span
            className={cn("font-heading font-extrabold uppercase text-gold", s.name)}
            style={{ letterSpacing: "0.08em" }}
          >
            YUSUF
          </span>
          <span className={cn("font-heading font-semibold uppercase text-gold-soft", s.sub)}>
            BRAND
          </span>
        </span>
      )}
    </span>
  )

  if (!linked) return content

  return (
    <Link href={href} className="inline-flex transition-opacity hover:opacity-90" aria-label="YUSUF BRAND - главная">
      {content}
    </Link>
  )
}

function PhotoMark({ size }: { size: number }) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-md border border-gold/50 bg-forest-deep shadow-[0_0_0_1px_rgba(255,146,19,0.22),0_14px_40px_-20px_rgba(255,146,19,0.7)]"
      style={{ width: size, height: size }}
    >
      <Image
        src="/yusuf-brand-logo.jpeg"
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={size > 100}
      />
    </span>
  )
}

function Shield({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="yb-shield-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB13D" />
          <stop offset="100%" stopColor="#FF7F0A" />
        </linearGradient>
      </defs>
      <path
        d="M32 1.5 L61 11 L61 38 C61 54 49 65 32 70.5 C15 65 3 54 3 38 L3 11 Z"
        fill="#08291D"
        stroke="url(#yb-shield-stroke)"
        strokeWidth="5"
      />
      <path
        d="M32 8 L55 15.5 L55 37.5 C55 50.5 45.5 60 32 64.5 C18.5 60 9 50.5 9 37.5 L9 15.5 Z"
        fill="none"
        stroke="rgba(255,146,19,0.55)"
        strokeWidth="1.5"
      />
      <text
        x="32"
        y="34"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Bebas Neue', 'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="27"
        fill="#FF9213"
        style={{ letterSpacing: "0.02em" }}
      >
        YB
      </text>
    </svg>
  )
}
