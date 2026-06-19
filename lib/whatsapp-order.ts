import { formatPrice, type Product } from "@/lib/products"
import { brandConfig } from "@/lib/brand-config"

export type OrderItem = {
  productId: string
  slug?: string
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

export function productUrl(id: string, slug?: string) {
  // Человекочитаемый slug в URL; если slug нет — fallback на id.
  const path = slug ?? id
  return `${brandConfig.siteUrl}/product/${path}`
}

export function buildWhatsAppMessage(
  items: OrderItem[],
  customer: Customer,
  total: number,
  promoCode?: string,
): string {
  const lines: string[] = []
  lines.push("Здравствуйте! Хочу сделать заказ 🛍️")
  lines.push("")

  items.forEach((it, idx) => {
    const line = `${idx + 1}. ${it.name} ${it.color} (${it.size}) — ${formatPrice(it.price * it.quantity)}`
    lines.push(line)
    lines.push(`   🔗 ${productUrl(it.productId, it.slug)}`)
  })

  lines.push("")
  lines.push(`💰 Итого: ${formatPrice(total)}`)

  if (promoCode) {
    lines.push(`🎟️ Промокод: ${promoCode}`)
  }

  lines.push("")
  lines.push(`👤 Имя: ${customer.name}`)
  lines.push(`📞 Телефон: ${customer.phone}`)
  lines.push(`📍 Город: ${customer.city}` + (customer.address ? `, ${customer.address}` : ""))
  lines.push("")
  lines.push("Жду подтверждения!")

  return lines.join("\n")
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${brandConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
