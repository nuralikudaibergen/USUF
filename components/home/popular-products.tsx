"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useAdmin } from "@/lib/admin-store"

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
    <section className="bg-forest py-14 md:py-20" id="popular">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center md:mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.32em] text-gold">
            Хиты сезона
          </span>
          <h2 className="mt-3 font-heading text-2xl font-black uppercase text-gold sm:text-3xl md:text-4xl">
            Популярные товары
          </h2>
          <div className="mx-auto mt-4 h-px w-20 bg-gold" />
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 md:gap-y-10">
          {top.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link
            href="/catalog"
            className="group inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/50 px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/10 sm:w-auto"
          >
            Весь каталог
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
