import type { MetadataRoute } from "next"
import { products } from "@/lib/products"
import { brandConfig } from "@/lib/brand-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brandConfig.siteUrl

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/men",
    "/women",
    "/shoes",
    "/sale",
    "/catalog",
    "/about",
    "/contacts",
    "/delivery",
    "/faq",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/product/${p.slug ?? p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
