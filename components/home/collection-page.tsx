"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useAdmin } from "@/lib/admin-store"
import type { Category } from "@/lib/products"

type CollectionConfig = {
  category: Category
  href: string
  otherHref: string
  otherLabel: string
  eyebrow: string
  title: string
  tagline: string
  image: string
}

export function CollectionPage({
  category,
  href,
  otherHref,
  otherLabel,
  eyebrow,
  title,
  tagline,
  image,
}: CollectionConfig) {
  const { products } = useAdmin()
  const items = products.filter((p) => p.category === category)
  const featured = items.filter((p) => p.isFeatured)
  const rest = items.filter((p) => !p.isFeatured)

  return (
    <div className="bg-forest-deep">
      {/* Hero block */}
      <section className="relative overflow-hidden border-b border-gold/20">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(232,160,32,0.18) 0%, transparent 60%), linear-gradient(180deg, #0F2A1F 0%, #1B4332 100%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-gold">
              {eyebrow}
            </span>
            <h1 className="mt-4 font-heading text-5xl font-black uppercase leading-[0.95] text-gold md:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gold-soft/80">
              {tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-forest transition-all hover:shadow-[0_10px_30px_-10px_rgba(232,160,32,0.7)]"
              >
                Смотреть каталог
                <ArrowRight className="size-4" />
              </a>
              <Link
                href={otherHref}
                className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
              >
                {otherLabel}
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-gold/30 gold-glow">
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Featured items */}
      {featured.length > 0 && (
        <section className="border-b border-gold/20 bg-forest py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.15em] text-gold md:text-3xl">
                Хиты сезона
              </h2>
              <div className="hidden h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent md:block md:ml-6" />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All items */}
      {rest.length > 0 && (
        <section id="catalog" className="bg-forest-deep py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.15em] text-gold md:text-3xl">
                Все вещи
              </h2>
              <div className="hidden h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent md:block md:ml-6" />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {rest.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
