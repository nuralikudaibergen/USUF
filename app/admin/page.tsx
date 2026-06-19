"use client"

import { Package, Tag, ListOrdered, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useAdmin } from "@/lib/admin-store"
import { brandConfig } from "@/lib/brand-config"

export default function AdminOverviewPage() {
  const { products, promos } = useAdmin()

  const totalValue = products.reduce((sum, p) => sum + p.price, 0)
  const onSale = products.filter((p) => p.oldPrice).length
  const isNew = products.filter((p) => p.isNew).length
  const featured = products.filter((p) => p.isFeatured).length

  return (
    <div>
      <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
        Обзор магазина
      </h1>
      <p className="mt-2 text-sm text-gold-soft/70">
        Управление товарами, промокодами и заказами. Все изменения сохраняются в вашем браузере.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Товаров" value={products.length} Icon={Package} />
        <Stat label="Со скидкой" value={onSale} Icon={Tag} />
        <Stat label="Новинок" value={isNew} Icon={Package} />
        <Stat label="Хитов" value={featured} Icon={Package} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gold/20 bg-forest p-6">
          <h2 className="font-heading text-base font-bold uppercase tracking-[0.15em] text-gold">
            Стоимость каталога
          </h2>
          <p className="mt-3 font-heading text-3xl font-extrabold text-gold">
            {totalValue.toLocaleString("ru-RU")} ₸
          </p>
          <p className="mt-1 text-xs text-gold-soft/60">
            Сумма розничных цен по всем товарам (без учёта скидок).
          </p>
        </div>

        <div className="rounded-lg border border-gold/20 bg-forest p-6">
          <h2 className="font-heading text-base font-bold uppercase tracking-[0.15em] text-gold">
            Промокоды
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm text-gold-soft/85">
            {promos.map((p) => (
              <li key={p.code} className="flex items-center justify-between">
                <span className="font-mono text-gold">{p.code}</span>
                <span className="text-xs text-gold-soft/70">{p.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-gold/20 bg-forest p-6">
        <div className="flex items-start gap-3">
          <ListOrdered className="mt-1 size-5 shrink-0 text-gold" />
          <div>
            <h2 className="font-heading text-base font-bold uppercase tracking-[0.15em] text-gold">
              Заказы
            </h2>
            <p className="mt-2 text-sm text-gold-soft/85">
              Все заказы приходят в WhatsApp. Откройте мессенджер, чтобы просмотреть переписку с
              клиентами и подтверждения.
            </p>
            <a
              href={`https://wa.me/${brandConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
            >
              <MessageCircle className="size-4" /> Открыть WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-gold hover:bg-gold/10"
        >
          Управлять товарами →
        </Link>
        <Link
          href="/admin/promos"
          className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-gold hover:bg-gold/10"
        >
          Управлять промокодами →
        </Link>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  Icon,
}: {
  label: string
  value: number | string
  Icon: typeof Package
}) {
  return (
    <div className="rounded-lg border border-gold/20 bg-forest p-5">
      <Icon className="size-5 text-gold" />
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-soft/70">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-extrabold text-gold">{value}</p>
    </div>
  )
}
