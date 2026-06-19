import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Bebas_Neue, Montserrat, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { AuthProvider } from "@/lib/auth-context"
import { AdminProvider } from "@/lib/admin-store"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { brandConfig } from "@/lib/brand-config"

const bebas = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
})

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
})

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(brandConfig.siteUrl),
  title: {
    default: "YUSUF BRAND — Премиальная мужская и женская одежда",
    template: "%s — YUSUF BRAND",
  },
  description:
    "YUSUF BRAND — смелый, уверенный, премиальный fashion. Мужская и женская одежда и обувь для современной эпохи. Казахстан, Туркестан.",
  keywords: [
    "YUSUF BRAND",
    "премиальная одежда",
    "казахстанский бренд",
    "мужская одежда Туркестан",
    "женская одежда Туркестан",
    "обувь премиум",
    "Yusuf",
  ],
  authors: [{ name: brandConfig.name }],
  creator: brandConfig.name,
  alternates: { canonical: brandConfig.siteUrl },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: brandConfig.siteUrl,
    siteName: brandConfig.name,
    title: "YUSUF BRAND — Премиальная мужская и женская одежда",
    description:
      "YUSUF BRAND — смелый, уверенный, премиальный fashion. Мужская и женская одежда и обувь для современной эпохи.",
    images: [
      {
        url: "/apple-icon.png",
        width: 512,
        height: 512,
        alt: brandConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YUSUF BRAND — Премиальная мужская и женская одежда",
    description:
      "YUSUF BRAND — смелый, уверенный, премиальный fashion. Мужская и женская одежда и обувь.",
    images: ["/apple-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${bebas.variable} ${montserrat.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AdminProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <WhatsAppFab />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </AdminProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
