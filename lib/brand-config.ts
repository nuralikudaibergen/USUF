function normalizeSiteUrl(value: string | undefined) {
  return (value || "https://usuf-mauve.vercel.app").replace(/\/+$/, "")
}

export const brandConfig = {
  whatsappNumber: "77056211845",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  name: "YUSUF BRAND",
  shortName: "YB",
  phoneDisplay: "+7 (705) 621-18-45",
  email: "Kudaibergennurali0@gmail.com",
  instagram:
    "https://www.instagram.com/yusuf_brand_kz?igsh=MTZucG1rYWNrankyMQ==",
  city: "Туркестан",
  showroomAddress: "Туркестан, проспект Тәуке хан, 242/6",
  showroomMapUrl: "https://2gis.kz/turkestan/geo/70000001105993483",
}

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
    (promo) => promo.code.toUpperCase() === code.trim().toUpperCase(),
  )
}

export function applyPromo(subtotal: number, promo: PromoCode | null): number {
  if (!promo) return subtotal
  if (promo.type === "percent") return Math.round(subtotal * (1 - promo.value / 100))
  return Math.max(0, subtotal - promo.value)
}
