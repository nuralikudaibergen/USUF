import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { YBLogo } from "@/components/yb-logo"

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-forest-deep"
    >
      {/* Background gradient + texture */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(232,160,32,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(232,160,32,0.12) 0%, transparent 50%), linear-gradient(180deg, #0F2A1F 0%, #1B4332 100%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,160,32,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Top + bottom golden hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Center content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
        {/* Top eyebrow */}
        <div className="fade-up flex items-center gap-2 rounded-full border border-gold/40 bg-forest/60 px-4 py-1.5 backdrop-blur">
          <Sparkles className="size-3.5 text-gold" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
            Весна · Лето 2026
          </span>
        </div>

        {/* Shield logo */}
        <div className="fade-up mt-10" style={{ animationDelay: "0.1s" }}>
          <YBLogo size="xl" withText={false} />
        </div>

        {/* Headline */}
        <h1
          className="fade-up mt-8 font-heading text-5xl font-black uppercase leading-[0.95] text-gold sm:text-7xl md:text-[112px]"
          style={{ animationDelay: "0.2s", letterSpacing: "0.02em" }}
        >
          <span className="block">Носи свою</span>
          <span className="block gold-shine">уверенность</span>
        </h1>

        {/* Tagline */}
        <p
          className="fade-up mt-6 max-w-xl text-base leading-relaxed text-gold-soft/85 sm:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          Премиальная мужская и женская одежда и обувь. Создано для тех, кто
          ведёт за собой, а не следует за другими.
        </p>

        {/* CTA */}
        <div
          className="fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-9 py-4 font-heading text-base font-extrabold uppercase tracking-[0.2em] text-forest shadow-[0_10px_40px_-10px_rgba(232,160,32,0.7)] transition-all hover:shadow-[0_15px_50px_-5px_rgba(232,160,32,0.9)]"
          >
            Смотреть коллекцию
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/sale"
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
          >
            Распродажа
          </Link>
        </div>

        {/* YUSUF BRAND wordmark */}
        <div
          className="fade-up mt-16 flex flex-col items-center"
          style={{ animationDelay: "0.5s" }}
        >
          <span
            className="font-heading text-4xl font-extrabold uppercase text-gold sm:text-5xl"
            style={{ letterSpacing: "0.18em" }}
          >
            YUSUF
          </span>
          <span className="mt-1 text-xs font-bold uppercase tracking-[0.5em] text-gold-soft">
            B R A N D
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-gold/60 p-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </section>
  )
}
