"use client"

import { ListOrdered, MessageCircle, Phone } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
        Заказы
      </h1>
      <p className="mt-2 text-sm text-gold-soft/70">
        Все заказы приходят в WhatsApp — там же идёт общение с клиентом.
      </p>

      <div className="mt-8 rounded-2xl border border-gold/20 bg-forest p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-forest-deep/40">
          <ListOrdered className="size-7 text-gold" />
        </div>
        <h2 className="mt-5 font-heading text-xl font-extrabold uppercase tracking-[0.2em] text-gold">
          Заказы приходят в WhatsApp
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gold-soft/80">
          Чтобы просмотреть, подтвердить или отредактировать заказ — откройте мессенджер. Там же
          хранится история общения с клиентом.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/${brandConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
          >
            <MessageCircle className="size-4" /> Открыть WhatsApp
          </a>
          <a
            href={`tel:${brandConfig.phoneDisplay}`}
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-gold hover:bg-gold/10"
          >
            <Phone className="size-4" /> {brandConfig.phoneDisplay}
          </a>
        </div>

        <div className="mx-auto mt-8 max-w-md rounded-lg border border-gold/10 bg-forest-deep/30 p-4 text-left text-xs text-gold-soft/70">
          <p className="font-bold text-gold-soft">Как это работает</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>Клиент собирает корзину и переходит в WhatsApp Checkout.</li>
            <li>Вам приходит готовое сообщение со списком товаров, адресом и контактами.</li>
            <li>Вы подтверждаете заказ, договариваетесь об оплате и доставке.</li>
            <li>После оплаты отправляете заказ и присылаете трек-номер в чат.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
