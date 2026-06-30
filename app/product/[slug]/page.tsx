"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductDetail } from "@/components/product-detail"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useAdmin } from "@/lib/admin-store"

export default function ProductPage() {
  const params = useParams<{ slug: string }>()
  const { products } = useAdmin()
  const slug = decodeURIComponent(params.slug)
  const product = products.find((item) => item.id === slug || item.slug === slug)

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="font-heading text-4xl font-black uppercase text-gold">
            Товар не найден
          </h1>
          <p className="mt-3 text-sm text-foreground/70">
            Возможно, товар был удалён в админ-панели.
          </p>
          <Link
            href="/catalog"
            className="mt-8 inline-flex rounded-full bg-gold px-7 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep"
          >
            Вернуться в каталог
          </Link>
        </main>
        <SiteFooter />
      </>
    )
  }

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-foreground/62">
          <Link href="/" className="hover:text-gold">
            Главная
          </Link>
          <span>/</span>
          <Link
            href={`/${product.category === "men" ? "men" : "women"}`}
            className="hover:text-gold"
          >
            {product.category === "men" ? "Мужская" : "Женская"}
          </Link>
          <span>/</span>
          <span className="font-medium text-gold">{product.name}</span>
        </nav>

        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-heading text-2xl font-bold uppercase tracking-[0.15em] text-gold">
              С этим покупают
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
