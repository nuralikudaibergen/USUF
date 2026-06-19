"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Tag } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useAdmin } from "@/lib/admin-store"

export function SalePageContent() {
  const { products } = useAdmin()
  const saleItems = products.filter((p) => p.oldPrice)

  return (
    <div className="bg-forest-deep">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/30">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(232,160,32,0.4) 0%, transparent 60%), linear-gradient(180deg, #0F2A1F 0%, #1B4332 100%)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center md:py-32">
          <div className="fade-up inline-flex items-center gap-2 rounded-full border border-gold/40 bg-forest/60 px-4 py-1.5">
            <Tag className="size-3.5 text-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
              Ограниченное время
            </span>
          </div>
          <h1
            className="fade-up mt-6 font-heading text-5xl font-black uppercase leading-[0.95] text-gold sm:text-7xl md:text-[112px]"
            style={{ animationDelay: "0.1s", letterSpacing: "0.02em" }}
          >
            <span className="block">Сезонная</span>
            <span className="block gold-shine">распродажа</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-xl text-base text-gold-soft/85 sm:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            Скидки до 40% на избранные вещи из мужской и женской коллекций.
            Количество ограничено.
          </p>
          <div
            className="fade-up mt-8 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="#items"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-9 py-4 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-forest shadow-[0_10px_40px_-10px_rgba(232,160,32,0.7)] transition-all hover:shadow-[0_15px_50px_-5px_rgba(232,160,32,0.9)]"
            >
              Смотреть товары
              <ArrowRight className="size-5" />
            </a>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
            >
              Весь каталог
            </Link>
          </div>
        </div>
      </section>

      {/* Sale items */}
      <section id="items" className="bg-forest-deep py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-black uppercase text-gold md:text-4xl">
              Товары со скидкой
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-gold" />
          </div>

          {saleItems.length === 0 ? (
            <p className="py-12 text-center text-gold-soft/70">
              Сейчас нет товаров со скидкой. Загляните позже.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {saleItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            <Link
              href="/men"
              className="group flex items-center justify-between rounded-md border border-gold/30 bg-forest p-8 transition-all hover:border-gold"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold-soft">
                  Раздел
                </span>
                <h3 className="mt-2 font-heading text-3xl font-black uppercase text-gold">
                  Мужская
                </h3>
              </div>
              <ArrowRight className="size-8 text-gold transition-transform group-hover:translate-x-2" />
            </Link>
            <Link
              href="/women"
              className="group flex items-center justify-between rounded-md border border-gold/30 bg-forest p-8 transition-all hover:border-gold"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold-soft">
                  Раздел
                </span>
                <h3 className="mt-2 font-heading text-3xl font-black uppercase text-gold">
                  Женская
                </h3>
              </div>
              <ArrowRight className="size-8 text-gold transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
