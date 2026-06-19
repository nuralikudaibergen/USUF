// YUSUF BRAND — config

export const brandConfig = {
  // Куда отправляются заказы через WhatsApp
  whatsappNumber: "77056211845", // в международном формате без + и пробелов
  // Базовый URL сайта (для ссылок в сообщении)
  siteUrl: "https://yusufbrand.kz",
  // Бренд
  name: "YUSUF BRAND",
  shortName: "YB",
  phoneDisplay: "+7 (705) 621-18-45",
  email: "Kudaibergennurali0@gmail.com",
  instagram:
    "https://www.instagram.com/yusuf_brand_kz?igsh=MTZucG1rYWNrankyMQ==",
  // Город магазина
  city: "Туркестан",
  // Адрес шоурума (для страницы «Контакты» и самовывоза)
  showroomAddress: "Туркестан, проспект Тәуке хан, 242/6",
  showroomMapUrl: "https://2gis.kz/turkestan/geo/70000001105993483",
}

// Промокоды (демо)
export type PromoCode = {
  code: string
  type: "percent" | "fixed"
  value: number
  description: string
}

export const promoCodes: PromoCode[] = [
  { code: "YUSUF10", type: "percent", value: 10, description: "10% скидка" },
  { code: "SALE20", type: "percent", value: 20, description: "20% скидка" },
  { code: "WELCOME", type: "fixed", value: 5000, description: "5 000 ₸ скидка" },
]

export function findPromo(code: string): PromoCode | undefined {
  return promoCodes.find(
    (p) => p.code.toUpperCase() === code.trim().toUpperCase(),
  )
}

export function applyPromo(subtotal: number, promo: PromoCode | null): number {
  if (!promo) return subtotal
  if (promo.type === "percent") return Math.round(subtotal * (1 - promo.value / 100))
  return Math.max(0, subtotal - promo.value)
}
