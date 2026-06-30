"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react"
import { ImageZoom } from "@/components/image-zoom"
import { useCart } from "@/lib/cart-context"
import { formatPrice, type Product } from "@/lib/products"
import { useWishlist } from "@/lib/wishlist-context"

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const router = useRouter()
  const [color, setColor] = useState(product.colors[0] ?? "-")
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(false)
  const isFav = has(product.id)

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const gallery = product.images.length > 0 ? product.images : [product.image]

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
        <ImageZoom images={gallery} alt={product.name} />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          {product.tag && <Label>{product.tag}</Label>}
          {product.isNew && <Label muted>Новинка</Label>}
          {discount > 0 && (
            <span className="rounded-sm bg-red-500/90 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white">
              -{discount}%
            </span>
          )}
        </div>

        <h1 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight text-gold md:text-5xl">
          {product.name}
        </h1>

        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/58">
          Артикул: <span className="text-gold-soft">{product.sku}</span> ·{" "}
          {product.type === "footwear" ? "Обувь" : "Одежда"}
        </p>

        <div className="mt-3 flex items-center gap-1 text-sm text-foreground/72">
          <Star className="size-4 fill-gold text-gold" />
          <span className="font-semibold text-gold">{product.rating.toFixed(1)}</span>
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

        <p className="mt-5 text-sm leading-relaxed text-foreground/78">
          {product.description}
        </p>

        <div className="mt-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Цвет: <span className="font-normal text-gold-soft">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setColor(item)}
                className={`min-h-11 cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors ${
                  color === item
                    ? "border-gold bg-gold font-bold text-forest-deep"
                    : "border-gold/30 text-foreground/74 hover:border-gold"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Размер
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSize(item)
                  setError(false)
                }}
                className={`min-h-11 min-w-12 cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${
                  size === item
                    ? "border-gold bg-gold font-bold text-forest-deep"
                    : "border-gold/30 text-foreground/74 hover:border-gold"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-xs font-semibold text-red-300">
              Пожалуйста, выберите размер.
            </p>
          )}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Количество
          </p>
          <div className="inline-flex items-center rounded-md border border-gold/30">
            <button
              type="button"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              aria-label="Уменьшить"
              className="cursor-pointer px-3 py-2 text-gold hover:text-gold-soft"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-gold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((value) => value + 1)}
              aria-label="Увеличить"
              className="cursor-pointer px-3 py-2 text-gold hover:text-gold-soft"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleAdd(false)}
            className="flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-gold px-6 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-forest-deep transition-all hover:shadow-[0_10px_30px_-10px_rgba(255,146,19,0.7)]"
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
            className="min-h-12 cursor-pointer rounded-md border-2 border-gold px-6 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold/10"
          >
            Купить сейчас
          </button>
          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
            aria-pressed={isFav}
            className={`min-h-12 cursor-pointer rounded-md border px-4 py-3 transition-colors ${
              isFav
                ? "border-gold bg-gold text-forest-deep"
                : "border-gold/30 text-gold hover:border-gold"
            }`}
          >
            <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="mt-8 rounded-lg border border-gold/20 bg-forest-deep/40 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-soft/70">
            Состав и материал
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/82">
            {product.material}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Trust Icon={Truck}>Доставка по Казахстану</Trust>
          <Trust Icon={ShieldCheck}>Проверка качества</Trust>
          <Trust Icon={Sparkles}>Возврат 14 дней</Trust>
        </div>
      </div>
    </div>
  )
}

function Label({ children, muted }: { children: string; muted?: boolean }) {
  return (
    <span
      className={`rounded-sm px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${
        muted
          ? "border border-gold text-gold"
          : "bg-gold text-forest-deep"
      }`}
    >
      {children}
    </span>
  )
}

function Trust({ Icon, children }: { Icon: typeof Truck; children: string }) {
  return (
    <div className="flex items-start gap-2 text-xs text-foreground/72">
      <Icon className="mt-0.5 size-4 shrink-0 text-gold" />
      <span>{children}</span>
    </div>
  )
}
