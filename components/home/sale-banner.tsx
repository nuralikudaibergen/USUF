import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SaleBanner() {
  return (
    <section
      id="sale"
      className="relative overflow-hidden border-y border-gold/30 bg-forest"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 80% 50%, rgba(232,160,32,0.4) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center">
        <span className="font-heading text-xs font-bold uppercase tracking-[0.5em] text-gold-soft">
          Ограниченное время
        </span>
        <h2 className="mt-4 font-heading text-5xl font-black uppercase leading-[0.95] text-gold md:text-7xl">
          <span className="block">Сезонная</span>
          <span className="block gold-shine">распродажа · до 40%</span>
        </h2>
        <p className="mt-5 max-w-xl text-base text-gold-soft/80">
          Избранные вещи из мужской и женской коллекций по сниженным ценам.
          Количество ограничено.
        </p>
        <Link
          href="/sale"
          className="mt-8 inline-flex items-center gap-3 rounded-full border-2 border-gold bg-gold px-9 py-4 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-forest transition-all hover:bg-transparent hover:text-gold"
        >
          Купить со скидкой
          <ArrowRight className="size-5" />
        </Link>
      </div>
    </section>
  )
}
