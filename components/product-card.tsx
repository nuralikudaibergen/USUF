"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Heart, ShoppingBag, Star } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { useCart } from "@/lib/cart-context"
import { formatPrice, type Product } from "@/lib/products"
import { useWishlist } from "@/lib/wishlist-context"

export function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const { has, toggle } = useWishlist()
  const { addItem } = useCart()
  const isFav = has(product.id)

  const images = product.images.length > 0 ? product.images : [product.image]
  const [imageIdx, setImageIdx] = useState(0)
  const [pickedSize, setPickedSize] = useState<string | null>(null)
  const [quickAdded, setQuickAdded] = useState(false)

  const handleQuickAdd = (size: string) => {
    addItem({
      productId: product.id,
      size,
      color: product.colors[0] ?? "-",
      quantity: 1,
    })
    setPickedSize(size)
    setQuickAdded(true)
    setTimeout(() => setQuickAdded(false), 1800)
  }

  return (
    <div className="group block">
      <Link href={`/product/${product.slug ?? product.id}`} className="block">
        <div
          className="gold-glow relative aspect-[3/4] overflow-hidden rounded-md border border-gold/20 bg-forest"
          onMouseEnter={() =>
            setImageIdx((i) => (images.length > 1 ? (i + 1) % images.length : i))
          }
        >
          <SafeImage
            src={images[imageIdx] || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-forest-deep/64 to-transparent" />

          <div className="absolute left-2 top-2 flex flex-col gap-1 sm:left-3 sm:top-3">
            {product.tag && (
              <span className="rounded-sm bg-gold px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-forest-deep sm:text-[10px]">
                {product.tag}
              </span>
            )}
            {product.isNew && (
              <span className="rounded-sm border border-gold bg-forest-deep/85 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-gold sm:text-[10px]">
                Новинка
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-sm bg-gold px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-forest-deep sm:text-[10px]">
                -{discount}%
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
            aria-pressed={isFav}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggle(product.id)
            }}
            className={`absolute right-2 top-2 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-gold/40 transition-all sm:right-3 sm:top-3 sm:size-10 ${
              isFav
                ? "bg-gold text-forest-deep"
                : "bg-forest-deep/82 text-gold opacity-100 hover:bg-gold hover:text-forest-deep sm:opacity-0 sm:group-hover:opacity-100"
            }`}
          >
            <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
          </button>

          <div
            className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-gradient-to-t from-forest-deep via-forest-deep/95 to-transparent p-3 pt-6 transition-transform duration-300 group-hover:translate-y-0"
            onClick={(e) => e.preventDefault()}
          >
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.slice(0, 6).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleQuickAdd(size)
                  }}
                  className={`min-w-10 cursor-pointer rounded border px-2 py-1 text-[11px] font-bold transition-colors ${
                    pickedSize === size
                      ? "border-gold bg-gold text-forest-deep"
                      : "border-gold/40 text-gold hover:border-gold hover:bg-gold/10"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {quickAdded && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-forest-deep/72">
              <div className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-forest-deep">
                <Check className="size-4" /> В корзине
              </div>
            </div>
          )}
        </div>
      </Link>

      <Link href={`/product/${product.slug ?? product.id}`} className="mt-3 block px-0.5 sm:px-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gold-soft/55 sm:text-[10px]">
          Артикул {product.sku}
        </p>
        <h3 className="mt-1 line-clamp-2 font-heading text-sm font-bold text-gold transition-colors group-hover:text-gold-soft sm:text-base">
          {product.name}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-foreground/72 sm:text-xs">
          <Star className="size-3 fill-gold text-gold" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-gold/35">·</span>
          <span>
            {product.colors.length} {product.colors.length === 1 ? "цвет" : "цветов"}
          </span>
          <span className="text-gold/35">·</span>
          <span>{product.type === "footwear" ? "Обувь" : "Одежда"}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <span className="font-heading text-base font-extrabold text-gold sm:text-lg">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gold-soft/50 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-soft/70 group-hover:text-gold sm:text-[11px] sm:tracking-[0.15em]">
            <ShoppingBag className="size-3" /> Быстрый заказ
          </span>
        </div>
      </Link>
    </div>
  )
}
