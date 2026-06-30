"use client"

import Image from "next/image"
import Link from "next/link"
import { type FormEvent, useEffect, useMemo, useState } from "react"
import { ArrowRight, Check, MapPin, MessageCircle, Phone, Send, User } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { applyPromo, findPromo } from "@/lib/brand-config"
import { useCart } from "@/lib/cart-context"
import { buildWhatsAppLink, buildWhatsAppMessage, type Customer } from "@/lib/whatsapp-order"
import { formatPrice } from "@/lib/products"
import { saveOrderToSupabase } from "@/lib/supabase-store"

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

  const orderItems = useMemo(
    () =>
      detailed.map(({ item, product }) => ({
        productId: product.id,
        slug: product.slug,
        image: product.image,
        name: product.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: product.price,
      })),
    [detailed],
  )

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("promo")
    const found = code ? findPromo(code) : undefined
    if (!found) return
    setPromoInput(found.code)
    setPromo(found.code)
  }, [])

  const message = useMemo(() => {
    if (!name || !phone || !city) return ""
    const customer: Customer = { name, phone, city, address: address || undefined }
    return buildWhatsAppMessage(orderItems, customer, total, promo ?? undefined)
  }, [name, phone, city, address, orderItems, total, promo])

  const waLink = message ? buildWhatsAppLink(message) : ""

  const applyPromoCode = () => {
    setPromoError("")
    const code = promoInput.trim()
    if (!code) {
      setPromoError("Введите промокод")
      return
    }
    const found = findPromo(code)
    if (!found) {
      setPromoError("Промокод не найден")
      return
    }
    setPromo(found.code)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) nextErrors.name = "Введите имя"
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Введите корректный номер"
    if (!city.trim()) nextErrors.city = "Введите город"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (waLink) {
      await saveOrderToSupabase({
        customer: { name, phone, city, address: address || undefined },
        items: orderItems,
        subtotal,
        discount,
        total,
        promoCode: promo ?? undefined,
        message,
      })
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
            Корзина пустая
          </h1>
          <p className="mt-2 text-foreground/70">
            Добавьте товары, прежде чем оформлять заказ через WhatsApp.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.18em] text-forest-deep"
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
            Оформление
          </span>
          <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight text-gold md:text-5xl">
            Заказ через WhatsApp
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-foreground/72">
            Заполните данные, и сайт отправит менеджеру готовый шаблон заказа с
            нумерованным списком товаров.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <section className="rounded-md border border-gold/30 bg-forest p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                <User className="size-5" /> Данные покупателя
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Имя" error={errors.name} required className="sm:col-span-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Нуралы"
                    className={`input ${errors.name ? "border-destructive" : "border-gold/30"}`}
                  />
                </Field>
                <Field label="Телефон" error={errors.phone} required icon={<Phone className="size-3.5" />}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+7 777 123 45 67"
                    className={`input ${errors.phone ? "border-destructive" : "border-gold/30"}`}
                  />
                </Field>
                <Field label="Город" error={errors.city} required>
                  <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Туркестан"
                    className={`input ${errors.city ? "border-destructive" : "border-gold/30"}`}
                  />
                </Field>
                <Field label="Адрес доставки" icon={<MapPin className="size-3.5" />} className="sm:col-span-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Улица, дом, квартира или ориентир"
                    className="input border-gold/30"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-md border border-gold/30 bg-forest p-6">
              <h2 className="font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                Промокод
              </h2>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="Введите промокод"
                  className="input flex-1 border-gold/30"
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
                    className="rounded-md border border-gold bg-gold px-5 py-3 text-xs font-extrabold uppercase tracking-[0.15em] text-forest-deep hover:opacity-90"
                  >
                    OK
                  </button>
                )}
              </div>
              {promoError && <p className="mt-2 text-xs font-medium text-destructive">{promoError}</p>}
              {promo && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gold">
                  <Check className="size-3.5" /> Промокод применён
                </p>
              )}
            </section>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-md border border-gold/30 bg-forest p-6">
              <h2 className="font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                Ваш заказ
              </h2>
              <ul className="mt-4 flex flex-col divide-y divide-gold/15">
                {detailed.map(({ item, product }, index) => (
                  <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 py-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded border border-gold/20 bg-forest-deep">
                      <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" sizes="56px" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-forest-deep">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-bold leading-tight text-gold">{product.name}</p>
                      <p className="text-xs text-foreground/65">
                        {item.color} · {item.size} · {item.quantity} шт.
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gold">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-gold/20 pt-4 text-sm">
                <Row label="Подытог" value={formatPrice(subtotal)} />
                {promo && <Row label={`Скидка (${promo})`} value={`-${formatPrice(discount)}`} />}
                <Row label="Доставка" value="обсудим в WhatsApp" muted />
                <div className="mt-1 flex justify-between border-t border-gold/20 pt-3 text-base">
                  <dt className="font-bold text-gold">Итого</dt>
                  <dd className="font-extrabold text-gold">{formatPrice(total)}</dd>
                </div>
              </dl>
            </div>

            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#25D366] py-4 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition-all hover:shadow-[0_15px_40px_-5px_rgba(37,211,102,0.9)]"
            >
              <MessageCircle className="size-5" />
              Отправить заказ
              <ArrowRight className="size-4" />
            </button>

            <p className="text-center text-[11px] leading-5 text-foreground/60">
              Нажмите кнопку, и откроется WhatsApp с уже заполненным сообщением.
            </p>
          </aside>
        </form>

        {message && (
          <details className="mt-10 rounded-md border border-gold/30 bg-forest p-6">
            <summary className="cursor-pointer font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-gold">
              Предпросмотр сообщения
            </summary>
            <pre className="mt-4 whitespace-pre-wrap rounded-md bg-forest-deep p-4 text-sm text-gold-soft">
              {message}
            </pre>
          </details>
        )}
      </main>
      <SiteFooter />

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.375rem;
          background: var(--forest-deep);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: var(--foreground);
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--gold);
        }
        :global(.input::placeholder) {
          color: rgba(255, 208, 122, 0.42);
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  error,
  required,
  children,
  icon,
  className = "",
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft">
        {icon}
        {label} {required && "*"}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-foreground/68">{label}</dt>
      <dd className={muted ? "text-xs text-foreground/62" : "font-semibold text-gold"}>{value}</dd>
    </div>
  )
}
