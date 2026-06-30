import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section
      id="home"
      className="brand-surface relative flex min-h-[560px] w-full items-center overflow-hidden sm:min-h-[620px] lg:min-h-[calc(100svh-76px)]"
    >
      <div aria-hidden className="brand-noise absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:py-16 lg:py-20">
        <div className="max-w-4xl">
          <div className="fade-up inline-flex items-center rounded-full border border-gold/35 bg-forest/60 px-4 py-2 backdrop-blur">
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-soft">
              Новая коллекция 2026
            </span>
          </div>

          <h1
            className="fade-up mt-7 font-heading text-[clamp(3.7rem,18vw,7rem)] font-black uppercase leading-[0.88] text-gold lg:text-[128px]"
            style={{ animationDelay: "0.1s", letterSpacing: "0.03em" }}
          >
            <span className="block">YUSUF</span>
            <span className="block gold-shine">BRAND</span>
          </h1>

          <p
            className="fade-up mt-5 max-w-2xl text-base leading-7 text-foreground/82 sm:text-lg sm:leading-8"
            style={{ animationDelay: "0.2s" }}
          >
            Одежда и обувь для уверенного повседневного образа: чистые силуэты,
            глубокий зелёный тон бренда и фирменный оранжевый акцент.
          </p>

          <div
            className="fade-up mt-8 grid gap-3 sm:flex sm:flex-wrap"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/catalog"
              className="group inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-full bg-gold px-7 py-4 font-heading text-sm font-extrabold uppercase tracking-[0.16em] text-forest-deep shadow-[0_16px_50px_-18px_rgba(255,146,19,0.9)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_rgba(255,146,19,1)]"
            >
              Смотреть каталог
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sale"
              className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-gold/50 px-7 py-4 font-heading text-sm font-bold uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/10"
            >
              Распродажа
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
