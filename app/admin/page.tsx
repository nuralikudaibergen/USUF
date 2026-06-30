"use client"

import Link from "next/link"
import { LayoutGrid, ListOrdered, MessageCircle, Package, Tag } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"
import { useAdmin } from "@/lib/admin-store"

export default function AdminOverviewPage() {
  const { products, promos, categories } = useAdmin()

  const totalValue = products.reduce((sum, product) => sum + product.price, 0)
  const onSale = products.filter((product) => product.oldPrice).length
  const isNew = products.filter((product) => product.isNew).length
  const featured = products.filter((product) => product.isFeatured).length

  return (
    <div>
      <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
        Обзор магазина
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Управляйте товарами, фотографиями, категориями, промокодами и заказами.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Товаров" value={products.length} Icon={Package} />
        <Stat label="Категорий" value={categories.length} Icon={LayoutGrid} />
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
          <p className="mt-1 text-xs text-foreground/60">
            Сумма текущих цен всех товаров.
          </p>
        </div>

        <div className="rounded-lg border border-gold/20 bg-forest p-6">
          <h2 className="font-heading text-base font-bold uppercase tracking-[0.15em] text-gold">
            Активные промокоды
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm text-foreground/78">
            {promos.map((promo) => (
              <li key={promo.code} className="flex items-center justify-between gap-3">
                <span className="font-mono text-gold">{promo.code}</span>
                <span className="text-xs text-foreground/68">{promo.description}</span>
              </li>
            ))}
            {promos.length === 0 && (
              <li className="text-sm text-foreground/60">Промокодов пока нет.</li>
            )}
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
            <p className="mt-2 text-sm text-foreground/78">
              Клиент оформляет корзину, а готовый заказ отправляется в WhatsApp.
            </p>
            <a
              href={`https://wa.me/${brandConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep"
            >
              <MessageCircle className="size-4" /> Открыть WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <AdminLink href="/admin/products">Управлять товарами</AdminLink>
        <AdminLink href="/admin/categories">Управлять категориями</AdminLink>
        <AdminLink href="/admin/promos">Управлять промокодами</AdminLink>
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
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-gold-soft/70">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-extrabold text-gold">{value}</p>
    </div>
  )
}

function AdminLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-gold hover:bg-gold/10"
    >
      {children}
    </Link>
  )
}
