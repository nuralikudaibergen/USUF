"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useAdmin } from "@/lib/admin-store"
import type { Category } from "@/lib/products"

type CollectionConfig = {
  category: Category
  otherHref: string
  otherLabel: string
  eyebrow: string
  title: string
  tagline: string
  image: string
}

export function CollectionPage({
  category,
  otherHref,
  otherLabel,
  eyebrow,
  title,
  tagline,
  image,
}: CollectionConfig) {
  const { products } = useAdmin()
  const items = products.filter((product) => product.category === category)
  const featured = items.filter((product) => product.isFeatured)
  const rest = items.filter((product) => !product.isFeatured)

  return (
    <div className="bg-forest-deep">
      <section className="relative overflow-hidden border-b border-gold/20">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(255,146,19,0.18) 0%, transparent 60%), linear-gradient(180deg, #061E16 0%, #0B2B1F 100%)",
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
            <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/78">
              {tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.18em] text-forest-deep transition-all hover:shadow-[0_10px_30px_-10px_rgba(255,146,19,0.7)]"
              >
                Смотреть каталог
                <ArrowRight className="size-4" />
              </a>
              <Link
                href={otherHref}
                className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/10"
              >
                {otherLabel}
              </Link>
            </div>
          </div>
          <div className="gold-glow relative aspect-[4/5] overflow-hidden rounded-md border border-gold/30">
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

      {featured.length > 0 && (
        <ProductsSection title="Хиты сезона" surface="bg-forest" products={featured} />
      )}

      <ProductsSection
        title={rest.length > 0 ? "Все вещи" : "Товары скоро появятся"}
        products={rest}
        id="catalog"
      />
    </div>
  )
}

function ProductsSection({
  title,
  products,
  id,
  surface = "bg-forest-deep",
}: {
  title: string
  products: ReturnType<typeof useAdmin>["products"]
  id?: string
  surface?: string
}) {
  return (
    <section id={id} className={`${surface} border-b border-gold/20 py-16`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.15em] text-gold md:text-3xl">
            {title}
          </h2>
          <div className="ml-6 hidden h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent md:block" />
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/65">
            Добавьте товары в админ-панели, и они появятся здесь автоматически.
          </p>
        )}
      </div>
    </section>
  )
}
