import { brandConfig } from "@/lib/brand-config"
import { formatPrice } from "@/lib/products"

export type OrderItem = {
  productId: string
  slug?: string
  image?: string
  name: string
  size: string
  color: string
  quantity: number
  price: number
}

export type Customer = {
  name: string
  phone: string
  city: string
  address?: string
}

function currentSiteUrl() {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/+$/, "")
  }
  return brandConfig.siteUrl
}

export function productUrl(id: string, slug?: string) {
  const path = slug ?? id
  return `${currentSiteUrl()}/product/${path}`
}

export function photoUrl(src?: string) {
  if (!src || src.startsWith("data:")) return null
  if (src.startsWith("http://") || src.startsWith("https://")) return src
  if (src.startsWith("/")) return `${currentSiteUrl()}${src}`
  return src
}

export function buildWhatsAppMessage(
  items: OrderItem[],
  customer: Customer,
  total: number,
  promoCode?: string,
): string {
  const lines: string[] = []
  lines.push("Здравствуйте! Хочу оформить заказ YUSUF BRAND.")
  lines.push("")

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} · ${item.color} · размер ${item.size} · ${item.quantity} шт. — ${formatPrice(item.price * item.quantity)}`,
    )
    lines.push(`   Товар: ${productUrl(item.productId, item.slug)}`)

    const image = photoUrl(item.image)
    if (image) lines.push(`   Фото: ${image}`)
  })

  lines.push("")
  lines.push(`Итого: ${formatPrice(total)}`)

  if (promoCode) lines.push(`Промокод: ${promoCode}`)

  lines.push("")
  lines.push(`Имя: ${customer.name}`)
  lines.push(`Телефон: ${customer.phone}`)
  lines.push(`Город: ${customer.city}${customer.address ? `, ${customer.address}` : ""}`)
  lines.push("")
  lines.push("Жду подтверждения заказа.")

  return lines.join("\n")
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${brandConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
