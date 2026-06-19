"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useAdmin } from "@/lib/admin-store"

/**
 * Секция «Популярные товары» для главной страницы.
 * Берёт топ-6 товаров из AdminStore (админ-товары + seed): сначала featured, потом по popularity ↓.
 * Если товаров пока нет (каталог пуст) — секция не рендерится.
 */
export function PopularProducts() {
  const { products } = useAdmin()

  const top = [...products]
    .sort((a, b) => {
      const fa = Number(a.isFeatured ?? false)
      const fb = Number(b.isFeatured ?? false)
      if (fa !== fb) return fb - fa
      return b.popularity - a.popularity
    })
    .slice(0, 6)

  if (top.length === 0) return null

  return (
    <section className="bg-forest py-20" id="popular">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
            Хиты сезона
          </span>
          <h2 className="mt-3 font-heading text-3xl font-black uppercase text-gold md:text-4xl">
            Популярные товары
          </h2>
          <div className="mx-auto mt-5 h-px w-24 bg-gold" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          {top.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2 rounded-full border border-gold/50 px-8 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
          >
            Весь каталог
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
