"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Star,
  Check,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { formatPrice, type Product } from "@/lib/products"
import { ImageZoom } from "@/components/image-zoom"

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const router = useRouter()
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(false)
  const isFav = has(product.id)

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const handleAdd = (buyNow = false) => {
    if (!size) {
      setError(true)
      return
    }
    addItem({ productId: product.id, size, color, quantity: qty })
    setAdded(true)
    if (buyNow) {
      router.push("/cart")
      return
    }
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <ImageZoom images={product.images} alt={product.name} />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          {product.tag && (
            <span className="rounded-sm bg-gold px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-forest">
              {product.tag}
            </span>
          )}
          {product.isNew && (
            <span className="rounded-sm border border-gold px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gold">
              Новинка
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-sm bg-red-500/90 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white">
              -{discount}%
            </span>
          )}
        </div>

        <h1 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight text-gold md:text-5xl">
          {product.name}
        </h1>

        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-soft/60">
          Артикул: <span className="text-gold-soft">{product.sku}</span> ·{" "}
          {product.type === "footwear" ? "Обувь" : "Одежда"}
        </p>

        <div className="mt-3 flex items-center gap-1 text-sm text-gold-soft/80">
          <Star className="size-4 fill-gold text-gold" />
          <span className="font-semibold text-gold">
            {product.rating.toFixed(1)}
          </span>
          <span>· рейтинг покупателей</span>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-heading text-3xl font-extrabold text-gold">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-base text-gold-soft/50 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-gold-soft/80">
          {product.description}
        </p>

        {/* Color */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Цвет: <span className="font-normal text-gold-soft">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                  color === c
                    ? "border-gold bg-gold font-bold text-forest"
                    : "border-gold/30 text-gold-soft hover:border-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Размер
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s)
                  setError(false)
                }}
                className={`min-w-12 rounded-md border px-3 py-2 text-sm transition-colors ${
                  size === s
                    ? "border-gold bg-gold font-bold text-forest"
                    : "border-gold/30 text-gold-soft hover:border-gold"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-xs font-semibold text-red-400">
              Пожалуйста, выберите размер.
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Количество
          </p>
          <div className="inline-flex items-center rounded-md border border-gold/30">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Уменьшить"
              className="px-3 py-2 text-gold hover:text-gold-soft"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-gold">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Увеличить"
              className="px-3 py-2 text-gold hover:text-gold-soft"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleAdd(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gold px-6 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-forest transition-all hover:shadow-[0_10px_30px_-10px_rgba(232,160,32,0.7)]"
          >
            {added ? (
              <>
                <Check className="size-4" /> Добавлено
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" /> В корзину
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleAdd(true)}
            className="rounded-md border-2 border-gold px-6 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold/10"
          >
            Купить сейчас
          </button>
          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
            aria-pressed={isFav}
            className={`rounded-md border px-4 py-3 transition-colors ${
              isFav
                ? "border-gold bg-gold text-forest"
                : "border-gold/30 text-gold hover:border-gold"
            }`}
          >
            <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Состав */}
        <div className="mt-8 rounded-lg border border-gold/20 bg-forest-deep/40 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-soft/70">
            Состав и материал
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gold-soft/90">
            {product.material}
          </p>
        </div>

        {/* Trust signals */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2 text-xs text-gold-soft/80">
            <Truck className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>Бесплатная доставка от 75 000 ₸</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gold-soft/80">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>Гарантия подлинности</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gold-soft/80">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>Возврат 14 дней</span>
          </div>
        </div>
      </div>
    </div>
  )
}
