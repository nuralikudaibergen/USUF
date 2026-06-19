import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetail } from "@/components/product-detail"
import { ProductCard } from "@/components/product-card"
import { getProduct, products, categories } from "@/lib/products"
import { brandConfig } from "@/lib/brand-config"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug ?? p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "Товар не найден — YUSUF BRAND" }
  return {
    title: `${product.name} — YUSUF BRAND`,
    description: product.description,
    alternates: { canonical: `${brandConfig.siteUrl}/product/${product.slug ?? product.id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
      url: `${brandConfig.siteUrl}/product/${product.slug ?? product.id}`,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)

  // Обратная совместимость: если пришёл id (без slug) — редиректим на slug-URL.
  if (product && product.id === slug && product.slug && product.slug !== slug) {
    redirect(`/product/${product.slug}`)
  }

  if (!product) notFound()

  const category = categories.find((c) => c.slug === product.category)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  // JSON-LD для поисковых систем и Google Shopping.
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.image, ...product.images].filter(Boolean),
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: brandConfig.name },
    offers: {
      "@type": "Offer",
      url: `${brandConfig.siteUrl}/product/${product.slug ?? product.id}`,
      priceCurrency: "KZT",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gold-soft/70">
          <Link href="/" className="hover:text-gold">
            Главная
          </Link>
          <span>/</span>
          <Link
            href={`/${product.category === "men" ? "men" : "women"}`}
            className="hover:text-gold"
          >
            {category?.label}
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
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
