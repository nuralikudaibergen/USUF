"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Check, MapPin, User, Phone, Tag, Send, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/products"
import {
  buildWhatsAppLink,
  buildWhatsAppMessage,
  type Customer,
} from "@/lib/whatsapp-order"
import { applyPromo, findPromo } from "@/lib/brand-config"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function WhatsAppCheckoutPage() {
  const { detailed, subtotal, count } = useCart()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [promoInput, setPromoInput] = useState("")
  const [promo, setPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({})

  const discount = promo ? subtotal - applyPromo(subtotal, findPromo(promo)!) : 0
  const total = subtotal - discount

  const waLink = useMemo(() => {
    if (!name || !phone || !city) return ""
    const customer: Customer = { name, phone, city, address: address || undefined }
    const items = detailed.map(({ item, product }) => ({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: product.price,
    }))
    const msg = buildWhatsAppMessage(items, customer, total, promo ?? undefined)
    return buildWhatsAppLink(msg)
  }, [name, phone, city, address, detailed, total, promo])

  const applyPromoCode = () => {
    setPromoError("")
    const code = promoInput.trim()
    if (!code) {
      setPromoError("Введите промокод")
      return
    }
    const p = findPromo(code)
    if (!p) {
      setPromoError("Промокод не найден")
      return
    }
    setPromo(p.code)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) errs.name = "Введите имя"
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) errs.phone = "Введите корректный номер"
    if (!city.trim()) errs.city = "Введите город"
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (waLink) {
      window.open(waLink, "_blank", "noopener,noreferrer")
    }
  }

  if (count === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
            <MessageCircle className="h-10 w-10 text-gold" />
          </div>
          <h1 className="mt-6 font-heading text-2xl font-black uppercase tracking-tight text-gold md:text-3xl">
            Корзина пуста
          </h1>
          <p className="mt-2 text-gold-soft/80">
            Добавьте товары, прежде чем оформлять заказ через WhatsApp.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-forest"
          >
            В каталог
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
            Шаг 1 из 1
          </span>
          <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight text-gold md:text-5xl">
            Оформление через WhatsApp
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gold-soft/80">
            Заполните данные — мы сформируем готовое сообщение и откроем WhatsApp.
            Все детали (доставка, оплата Kaspi / наличные) обсудим там.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="grid gap-8 lg:grid-cols-[1fr_400px]"
        >
          {/* Левая колонка — форма */}
          <div className="space-y-6">
            <div className="rounded-md border border-gold/30 bg-forest p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                <User className="size-5" /> Ваши данные
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-gold-soft">
                    Имя *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Нуралы"
                    className={`w-full rounded-md border bg-forest-deep px-4 py-3 text-sm text-gold outline-none placeholder:text-gold/40 focus:border-gold ${
                      errors.name ? "border-destructive" : "border-gold/30"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs font-medium text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-gold-soft">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 777 123 45 67"
                    className={`w-full rounded-md border bg-forest-deep px-4 py-3 text-sm text-gold outline-none placeholder:text-gold/40 focus:border-gold ${
                      errors.phone ? "border-destructive" : "border-gold/30"
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-xs font-medium text-destructive">{errors.phone}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-gold-soft">
                    Город *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Туркестан"
                    className={`w-full rounded-md border bg-forest-deep px-4 py-3 text-sm text-gold outline-none placeholder:text-gold/40 focus:border-gold ${
                      errors.city ? "border-destructive" : "border-gold/30"
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-xs font-medium text-destructive">{errors.city}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft">
                    <MapPin className="size-3.5" /> Адрес доставки
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Улица, дом, квартира"
                    className="w-full rounded-md border border-gold/30 bg-forest-deep px-4 py-3 text-sm text-gold outline-none placeholder:text-gold/40 focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Промокод */}
            <div className="rounded-md border border-gold/30 bg-forest p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                <Tag className="size-5" /> Промокод
              </h2>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Введите промокод"
                  className="flex-1 rounded-md border border-gold/30 bg-forest-deep px-4 py-3 text-sm text-gold outline-none placeholder:text-gold/40 focus:border-gold"
                />
                {promo ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPromo(null)
                      setPromoInput("")
                      setPromoError("")
                    }}
                    className="rounded-md border border-gold/30 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft hover:text-gold"
                  >
                    Убрать
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="rounded-md border border-gold bg-gold px-5 py-3 text-xs font-extrabold uppercase tracking-[0.15em] text-forest hover:opacity-90"
                  >
                    Применить
                  </button>
                )}
              </div>
              {promoError && (
                <p className="mt-2 text-xs font-medium text-destructive">{promoError}</p>
              )}
              {promo && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gold">
                  <Check className="size-3.5" /> Промокод применён
                </p>
              )}
              <p className="mt-3 text-xs text-gold-soft/60">
                Попробуйте: <span className="font-mono font-bold text-gold">YUSUF10</span>, <span className="font-mono font-bold text-gold">SALE20</span>, <span className="font-mono font-bold text-gold">WELCOME</span>
              </p>
            </div>
          </div>

          {/* Правая колонка — итог + кнопка */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-md border border-gold/30 bg-forest p-6">
              <h2 className="font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                Ваш заказ
              </h2>
              <ul className="mt-4 flex flex-col divide-y divide-gold/15">
                {detailed.map(({ item, product }) => (
                  <li
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3 py-3"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded border border-gold/20 bg-forest-deep">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-forest">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-bold leading-tight text-gold">{product.name}</p>
                      <p className="text-xs text-gold-soft/70">
                        {item.color} · {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gold">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-gold/20 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gold-soft/70">Подытог</dt>
                  <dd className="font-semibold text-gold">{formatPrice(subtotal)}</dd>
                </div>
                {promo && (
                  <div className="flex justify-between text-gold-soft">
                    <dt>Скидка ({promo})</dt>
                    <dd className="font-semibold">−{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gold-soft/70">Доставка</dt>
                  <dd className="text-xs text-gold-soft/70">обсудим в WhatsApp</dd>
                </div>
                <div className="mt-1 flex justify-between border-t border-gold/20 pt-3 text-base">
                  <dt className="font-bold text-gold">Итого</dt>
                  <dd className="font-extrabold text-gold">{formatPrice(total)}</dd>
                </div>
              </dl>
            </div>

            <button
              type="submit"
              disabled={!waLink}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-4 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition-all hover:shadow-[0_15px_40px_-5px_rgba(37,211,102,0.9)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle className="size-5" />
              Отправить заказ
              <ArrowRight className="size-4" />
            </button>

            <p className="text-center text-[11px] text-gold-soft/60">
              Нажимая кнопку, вы откроете WhatsApp с уже заполненным сообщением.
              Доставка и оплата — Kaspi / наличные — обсуждаются с менеджером.
            </p>
          </aside>
        </form>

        {/* Превью сообщения */}
        {waLink && (
          <details className="mt-10 rounded-md border border-gold/30 bg-forest p-6">
            <summary className="cursor-pointer font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-gold">
              Превью сообщения (нажмите чтобы раскрыть)
            </summary>
            <pre className="mt-4 whitespace-pre-wrap rounded-md bg-forest-deep p-4 text-sm text-gold-soft">
{decodeURIComponent(waLink.split("text=")[1] || "")}
            </pre>
          </details>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
