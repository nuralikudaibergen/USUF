"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

type Filter = "all" | "men" | "women" | "shoes"
type SortKey =
  | "featured"
  | "new"
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "rating"

export function CatalogGrid({
  products,
  initialFilter = "all",
}: {
  products: Product[]
  initialFilter?: Filter
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter)
  const [sort, setSort] = useState<SortKey>("featured")
  const [onlySale, setOnlySale] = useState(false)
  const [onlyNew, setOnlyNew] = useState(false)
  const [activeSizes, setActiveSizes] = useState<string[]>([])
  const [activeColors, setActiveColors] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState<number | null>(null)

  const allSizes = useMemo(() => {
    const set = new Set<string>()
    products
      .filter((p) => {
        if (filter === "shoes") return p.type === "footwear"
        if (filter === "all") return true
        return p.category === filter
      })
      .forEach((p) => p.sizes.forEach((s) => set.add(s)))
    return Array.from(set).slice(0, 12)
  }, [products, filter])

  const allColors = useMemo(() => {
    const set = new Set<string>()
    products
      .filter((p) => {
        if (filter === "shoes") return p.type === "footwear"
        if (filter === "all") return true
        return p.category === filter
      })
      .forEach((p) => p.colors.forEach((c) => set.add(c)))
    return Array.from(set).slice(0, 18)
  }, [products, filter])

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.price)),
    [products],
  )

  const filtered = useMemo(() => {
    let list = [...products]
    if (filter === "shoes") list = list.filter((p) => p.type === "footwear")
    else if (filter !== "all") list = list.filter((p) => p.category === filter)
    if (onlySale) list = list.filter((p) => p.oldPrice)
    if (onlyNew) list = list.filter((p) => p.isNew)
    if (activeSizes.length)
      list = list.filter((p) => p.sizes.some((s) => activeSizes.includes(s)))
    if (activeColors.length)
      list = list.filter((p) => p.colors.some((c) => activeColors.includes(c)))
    if (priceMax !== null) list = list.filter((p) => p.price <= priceMax)

    switch (sort) {
      case "new":
        list.sort(
          (a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false),
        )
        break
      case "popularity":
        list.sort((a, b) => b.popularity - a.popularity)
        break
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "rating":
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort(
          (a, b) =>
            Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false),
        )
    }
    return list
  }, [
    products,
    filter,
    onlySale,
    onlyNew,
    activeSizes,
    activeColors,
    priceMax,
    sort,
  ])

  const toggleSize = (size: string) =>
    setActiveSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  const toggleColor = (color: string) =>
    setActiveColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    )

  const reset = () => {
    setFilter(initialFilter)
    setOnlySale(false)
    setOnlyNew(false)
    setActiveSizes([])
    setActiveColors([])
    setPriceMax(null)
    setSort("featured")
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "men", label: "Мужская" },
    { key: "women", label: "Женская" },
    { key: "shoes", label: "Обувь" },
  ]

  return (
    <section className="bg-forest-deep py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
            Полный ассортимент
          </span>
          <h2 className="mt-3 font-heading text-4xl font-black uppercase text-gold md:text-5xl">
            Каталог коллекции
          </h2>
          <div className="mx-auto mt-5 h-px w-24 bg-gold" />
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-7 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.2em] transition-all ${
                filter === f.key
                  ? "border-gold bg-gold text-forest"
                  : "border-gold/30 text-gold hover:border-gold hover:bg-gold/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <aside className="space-y-7 rounded-md border border-gold/20 bg-forest p-6">
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
                <SlidersHorizontal className="size-4" /> Фильтры
              </h3>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gold-soft">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => setOnlySale(e.target.checked)}
                  className="size-4 accent-gold"
                />
                Со скидкой
              </label>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gold-soft">
                <input
                  type="checkbox"
                  checked={onlyNew}
                  onChange={(e) => setOnlyNew(e.target.checked)}
                  className="size-4 accent-gold"
                />
                Новинки
              </label>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
                Цена, до
              </h4>
              <input
                type="range"
                min={10000}
                max={maxPrice}
                step={5000}
                value={priceMax ?? maxPrice}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setPriceMax(v >= maxPrice ? null : v)
                }}
                className="w-full accent-gold"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-gold-soft/70">
                <span>10 000 ₸</span>
                <span className="font-bold text-gold">
                  {priceMax ? priceMax.toLocaleString("ru-RU") + " ₸" : "Любая"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
                Размер
              </h4>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`rounded-sm border px-3 py-1 text-xs font-semibold transition-colors ${
                      activeSizes.includes(size)
                        ? "border-gold bg-gold text-forest"
                        : "border-gold/30 text-gold-soft hover:border-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
                Цвет
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {allColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className={`rounded-sm border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      activeColors.includes(color)
                        ? "border-gold bg-gold text-forest"
                        : "border-gold/30 text-gold-soft hover:border-gold"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-soft hover:text-gold"
            >
              <X className="size-3" /> Сбросить
            </button>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold">
                {filtered.length} {filteredCount(filtered.length)}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-gold/30 bg-forest px-3 py-2 text-sm font-semibold text-gold outline-none focus:border-gold"
              >
                <option value="featured" className="bg-forest text-gold">По умолчанию</option>
                <option value="new" className="bg-forest text-gold">Новинки</option>
                <option value="popularity" className="bg-forest text-gold">Популярность</option>
                <option value="price-asc" className="bg-forest text-gold">Цена: по возрастанию</option>
                <option value="price-desc" className="bg-forest text-gold">Цена: по убыванию</option>
                <option value="rating" className="bg-forest text-gold">По рейтингу</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-sm text-gold-soft/70">
                По выбранным фильтрам ничего не найдено.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function filteredCount(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return "товар"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "товара"
  return "товаров"
}
