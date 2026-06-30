import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SaleBanner() {
  return (
    <section id="sale" className="relative overflow-hidden border-y border-gold/25 bg-forest">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(255,146,19,0.16),transparent_58%)]"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div>
          <span className="font-heading text-xs font-bold uppercase tracking-[0.32em] text-gold-soft">
            Ограниченное время
          </span>
          <h2 className="mt-3 font-heading text-4xl font-black uppercase leading-[0.95] text-gold sm:text-5xl md:text-7xl">
            Сезонная
            <span className="block gold-shine">распродажа до 40%</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/76 sm:text-base sm:leading-7">
            Избранные вещи из мужской и женской коллекций по сниженным ценам.
          </p>
        </div>
        <Link
          href="/sale"
          className="group inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-gold bg-gold px-7 py-4 font-heading text-sm font-extrabold uppercase tracking-[0.16em] text-forest-deep transition-all hover:bg-transparent hover:text-gold sm:w-auto"
        >
          Купить со скидкой
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
