import { ListOrdered, MessageCircle, Phone } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
        Заказы
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Новые заказы приходят в WhatsApp с товарами, размерами, цветами и контактами клиента.
      </p>

      <div className="mt-8 rounded-lg border border-gold/20 bg-forest p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-forest-deep/40">
          <ListOrdered className="size-7 text-gold" />
        </div>
        <h2 className="mt-5 font-heading text-xl font-extrabold uppercase tracking-[0.18em] text-gold">
          WhatsApp-заказы
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/78">
          Откройте рабочий WhatsApp, чтобы принять заказ, подтвердить наличие, оплату и доставку.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/${brandConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep"
          >
            <MessageCircle className="size-4" /> Открыть WhatsApp
          </a>
          <a
            href={`tel:${brandConfig.phoneDisplay}`}
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.18em] text-gold hover:bg-gold/10"
          >
            <Phone className="size-4" /> {brandConfig.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  )
}
