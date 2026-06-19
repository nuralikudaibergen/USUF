import { Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react"

const promises = [
  {
    icon: Truck,
    title: "Доставка по Казахстану",
    text: "Курьер и Казпочта, бесплатно от 100 000 ₸",
  },
  {
    icon: RefreshCw,
    title: "Простой возврат",
    text: "14 дней, без лишних вопросов",
  },
  {
    icon: ShieldCheck,
    title: "Гарантия качества",
    text: "Премиальные ткани и пошив",
  },
  {
    icon: Sparkles,
    title: "Закрытый клуб YB",
    text: "Ранний доступ к новинкам",
  },
]

export function BrandPromise() {
  return (
    <section className="border-y border-gold/20 bg-forest">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
        {promises.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
              <p.icon className="size-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-gold">
                {p.title}
              </p>
              <p className="mt-0.5 text-xs text-gold-soft/70">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
