import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Bebas_Neue, Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { AdminProvider } from "@/lib/admin-store"
import { AuthProvider } from "@/lib/auth-context"
import { brandConfig } from "@/lib/brand-config"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { WhatsAppFab } from "@/components/whatsapp-fab"

const bebas = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
})

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
})

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  metadataBase: new URL(brandConfig.siteUrl),
  title: {
    default: "YUSUF BRAND - одежда и обувь",
    template: "%s - YUSUF BRAND",
  },
  description:
    "YUSUF BRAND - интернет-магазин одежды и обуви. Мужская и женская коллекции, обувь, сезонные предложения и заказ через WhatsApp.",
  keywords: [
    "YUSUF BRAND",
    "одежда",
    "обувь",
    "мужская одежда",
    "женская одежда",
    "казахстанский бренд",
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
    title: "YUSUF BRAND - одежда и обувь",
    description:
      "Интернет-магазин одежды и обуви: мужская и женская коллекции, обувь и сезонные предложения.",
    images: [
      {
        url: "/yusuf-brand-logo.jpeg",
        width: 963,
        height: 963,
        alt: brandConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YUSUF BRAND - одежда и обувь",
    description: "Мужская и женская коллекции, обувь и заказ через WhatsApp.",
    images: ["/yusuf-brand-logo.jpeg"],
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
