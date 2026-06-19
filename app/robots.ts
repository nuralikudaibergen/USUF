import type { MetadataRoute } from "next"
import { brandConfig } from "@/lib/brand-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/auth", "/checkout", "/whatsapp"],
      },
    ],
    sitemap: `${brandConfig.siteUrl}/sitemap.xml`,
  }
}
