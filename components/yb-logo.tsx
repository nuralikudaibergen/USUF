import Link from "next/link"
import { cn } from "@/lib/utils"

type Size = "sm" | "md" | "lg" | "xl"

const sizeMap: Record<Size, { shield: number; yb: string; name: string; sub: string; gap: string }> = {
  sm: { shield: 32, yb: "text-[10px]", name: "text-sm", sub: "text-[8px] tracking-[0.2em]", gap: "gap-1.5" },
  md: { shield: 44, yb: "text-xs", name: "text-xl", sub: "text-[10px] tracking-[0.25em]", gap: "gap-2" },
  lg: { shield: 64, yb: "text-sm", name: "text-3xl", sub: "text-xs tracking-[0.3em]", gap: "gap-3" },
  xl: { shield: 96, yb: "text-base", name: "text-5xl md:text-6xl", sub: "text-sm tracking-[0.35em]", gap: "gap-4" },
}

export function YBLogo({
  size = "md",
  withText = true,
  className,
  href = "/",
  stacked = false,
}: {
  size?: Size
  withText?: boolean
  className?: string
  href?: string
  stacked?: boolean
}) {
  const s = sizeMap[size]
  const shieldSize = s.shield

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center text-gold transition-opacity hover:opacity-90",
        stacked ? "flex-col gap-3" : s.gap,
        className,
      )}
      aria-label="YUSUF BRAND — Home"
    >
      <Shield size={shieldSize} />
      {withText && (
        <div className={cn("flex flex-col leading-none", stacked && "items-center")}>
          <span
            className={cn(
              "font-heading font-extrabold text-gold",
              s.name,
            )}
            style={{ letterSpacing: "0.04em" }}
          >
            YUSUF
          </span>
          <span
            className={cn(
              "font-heading font-semibold text-gold-soft",
              s.sub,
            )}
          >
            BRAND
          </span>
        </div>
      )}
    </Link>
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
        <linearGradient id="yb-shield-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4C25C" />
          <stop offset="100%" stopColor="#E8A020" />
        </linearGradient>
        <linearGradient id="yb-shield-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4C25C" />
          <stop offset="100%" stopColor="#C58410" />
        </linearGradient>
      </defs>
      <path
        d="M32 1.5 L61 11 L61 38 C61 54 49 65 32 70.5 C15 65 3 54 3 38 L3 11 Z"
        fill="url(#yb-shield-fill)"
        stroke="url(#yb-shield-stroke)"
        strokeWidth="2"
      />
      {/* inner crest line */}
      <path
        d="M32 8 L55 15.5 L55 37.5 C55 50.5 45.5 60 32 64.5 C18.5 60 9 50.5 9 37.5 L9 15.5 Z"
        fill="none"
        stroke="rgba(27,67,50,0.4)"
        strokeWidth="1"
      />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Bebas Neue', 'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#1B4332"
        style={{ letterSpacing: "0.04em" }}
      >
        YB
      </text>
      <text
        x="32"
        y="47"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Bebas Neue', 'Montserrat', sans-serif"
        fontWeight="700"
        fontSize="6"
        fill="#1B4332"
        style={{ letterSpacing: "0.18em" }}
      >
        EST. 2024
      </text>
    </svg>
  )
}
