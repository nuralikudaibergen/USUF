"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, Tag, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/products"
import { applyPromo, findPromo } from "@/lib/brand-config"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function CartPage() {
  const { detailed, updateQuantity, removeItem, subtotal, count } = useCart()

  const [promoInput, setPromoInput] = useState("")
  const [promo, setPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState("")

  const discount = promo ? subtotal - applyPromo(subtotal, findPromo(promo)!) : 0
  const total = subtotal - discount

  const applyCode = () => {
    setPromoError("")
    const p = findPromo(promoInput)
    if (!p) {
      setPromoError("Промокод не найден")
      return
    }
    setPromo(p.code)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">
        <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold md:text-4xl">
          Корзина
        </h1>

        {count === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-forest">
              <ShoppingBag className="h-9 w-9 text-gold" />
            </div>
            <p className="font-heading text-lg font-bold text-gold">Корзина пуста</p>
            <p className="max-w-sm text-sm text-gold-soft/70">
              Добавьте вещи в корзину, чтобы оформить заказ через WhatsApp.
            </p>
            <Link
              href="/catalog"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-forest"
            >
              В каталог
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="flex flex-col divide-y divide-gold/15">
              {detailed.map(({ item, product }) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 py-5"
                >
                  <Link
                    href={`/product/${product.slug ?? product.id}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md border border-gold/20 bg-forest"
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/product/${product.slug ?? product.id}`}
                          className="font-heading text-base font-bold text-gold transition-colors hover:text-gold-soft"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-sm text-gold-soft/70">
                          {item.color} · размер {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-gold-soft/60 transition-colors hover:text-gold"
                        aria-label={`Удалить ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="inline-flex items-center rounded-md border border-gold/30">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-gold-soft/70 hover:text-gold"
                          aria-label="Уменьшить"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-gold-soft/70 hover:text-gold"
                          aria-label="Увеличить"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-heading text-base font-extrabold text-gold">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit space-y-4 lg:sticky lg:top-24">
              <div className="rounded-lg border border-gold/30 bg-forest p-6">
                <h2 className="font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                  Итого
                </h2>
                <dl className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gold-soft/70">Подытог ({count} поз.)</dt>
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

              {/* Промокод */}
              <div className="rounded-lg border border-gold/30 bg-forest p-6">
                <h3 className="flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-gold">
                  <Tag className="size-4" /> Промокод
                </h3>
                <div className="mt-3 flex gap-2">
                  {promo ? (
                    <>
                      <div className="flex flex-1 items-center gap-2 rounded-md border border-gold/30 bg-forest-deep px-3 py-2.5 text-sm text-gold">
                        <Tag className="size-3.5 text-gold" />
                        <span className="font-bold">{promo}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPromo(null)
                          setPromoInput("")
                          setPromoError("")
                        }}
                        className="rounded-md border border-gold/30 px-3 text-gold-soft hover:text-gold"
                        aria-label="Удалить промокод"
                      >
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="YUSUF10"
                        className="flex-1 rounded-md border border-gold/30 bg-forest-deep px-3 py-2.5 text-sm text-gold outline-none placeholder:text-gold/40 focus:border-gold"
                      />
                      <button
                        type="button"
                        onClick={applyCode}
                        className="rounded-md border border-gold bg-gold px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.15em] text-forest hover:opacity-90"
                      >
                        Применить
                      </button>
                    </>
                  )}
                </div>
                {promoError && <p className="mt-2 text-xs font-medium text-destructive">{promoError}</p>}
              </div>

              {/* CTA — WhatsApp */}
              <Link
                href="/whatsapp"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-4 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition-all hover:shadow-[0_15px_40px_-5px_rgba(37,211,102,0.9)]"
              >
                <MessageCircle className="size-5" />
                Оформить через WhatsApp
              </Link>
              <Link
                href="/catalog"
                className="block w-full rounded-md border border-gold/40 py-3.5 text-center font-heading text-sm font-bold uppercase tracking-[0.15em] text-gold-soft transition-colors hover:border-gold hover:text-gold"
              >
                Продолжить покупки
              </Link>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
