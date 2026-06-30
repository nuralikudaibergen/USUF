"use client"

import { type ReactNode, useMemo, useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

type Filter = "all" | "men" | "women" | "shoes"
type SortKey = "featured" | "new" | "popularity" | "price-asc" | "price-desc" | "rating"

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

  const scopedProducts = useMemo(
    () =>
      products.filter((product) => {
        if (filter === "shoes") return product.type === "footwear"
        if (filter === "all") return true
        return product.category === filter
      }),
    [products, filter],
  )

  const allSizes = useMemo(() => {
    const set = new Set<string>()
    scopedProducts.forEach((product) => product.sizes.forEach((size) => set.add(size)))
    return Array.from(set).slice(0, 12)
  }, [scopedProducts])

  const allColors = useMemo(() => {
    const set = new Set<string>()
    scopedProducts.forEach((product) => product.colors.forEach((color) => set.add(color)))
    return Array.from(set).slice(0, 18)
  }, [scopedProducts])

  const maxPrice = useMemo(
    () => Math.max(10000, ...products.map((product) => product.price)),
    [products],
  )

  const filtered = useMemo(() => {
    let list = [...scopedProducts]
    if (onlySale) list = list.filter((product) => product.oldPrice)
    if (onlyNew) list = list.filter((product) => product.isNew)
    if (activeSizes.length)
      list = list.filter((product) => product.sizes.some((size) => activeSizes.includes(size)))
    if (activeColors.length)
      list = list.filter((product) => product.colors.some((color) => activeColors.includes(color)))
    if (priceMax !== null) list = list.filter((product) => product.price <= priceMax)

    switch (sort) {
      case "new":
        list.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false))
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
        list.sort((a, b) => Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false))
    }
    return list
  }, [activeColors, activeSizes, onlyNew, onlySale, priceMax, scopedProducts, sort])

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
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`min-h-11 cursor-pointer rounded-full border px-7 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.18em] transition-all ${
                filter === item.key
                  ? "border-gold bg-gold text-forest-deep"
                  : "border-gold/30 text-gold hover:border-gold hover:bg-gold/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          <aside className="space-y-7 rounded-md border border-gold/20 bg-forest p-6">
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-[0.18em] text-gold">
                <SlidersHorizontal className="size-4" /> Фильтры
              </h3>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-foreground/76">
                <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} className="size-4 accent-gold" />
                Со скидкой
              </label>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-foreground/76">
                <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} className="size-4 accent-gold" />
                Новинки
              </label>
            </div>

            <FilterGroup title="Цена, до">
              <input
                type="range"
                min={10000}
                max={maxPrice}
                step={5000}
                value={priceMax ?? maxPrice}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setPriceMax(value >= maxPrice ? null : value)
                }}
                className="w-full accent-gold"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-foreground/62">
                <span>10 000 ₸</span>
                <span className="font-bold text-gold">
                  {priceMax ? `${priceMax.toLocaleString("ru-RU")} ₸` : "Любая"}
                </span>
              </div>
            </FilterGroup>

            <FilterGroup title="Размер">
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <ToggleChip
                    key={size}
                    active={activeSizes.includes(size)}
                    onClick={() =>
                      setActiveSizes((prev) =>
                        prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size],
                      )
                    }
                  >
                    {size}
                  </ToggleChip>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Цвет">
              <div className="flex flex-wrap gap-1.5">
                {allColors.map((color) => (
                  <ToggleChip
                    key={color}
                    active={activeColors.includes(color)}
                    onClick={() =>
                      setActiveColors((prev) =>
                        prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color],
                      )
                    }
                  >
                    {color}
                  </ToggleChip>
                ))}
              </div>
            </FilterGroup>

            <button
              type="button"
              onClick={reset}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-soft hover:text-gold"
            >
              <X className="size-3" /> Сбросить
            </button>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-gold">
                {filtered.length} {filteredCount(filtered.length)}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-gold/30 bg-forest px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-gold"
              >
                <option value="featured" className="bg-forest text-foreground">По умолчанию</option>
                <option value="new" className="bg-forest text-foreground">Новинки</option>
                <option value="popularity" className="bg-forest text-foreground">Популярность</option>
                <option value="price-asc" className="bg-forest text-foreground">Цена: по возрастанию</option>
                <option value="price-desc" className="bg-forest text-foreground">Цена: по убыванию</option>
                <option value="rating" className="bg-forest text-foreground">По рейтингу</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-sm text-foreground/68">
                По выбранным фильтрам ничего не найдено.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-gold">
        {title}
      </h4>
      {children}
    </div>
  )
}

function ToggleChip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-8 cursor-pointer rounded-sm border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "border-gold bg-gold text-forest-deep"
          : "border-gold/30 text-foreground/72 hover:border-gold"
      }`}
    >
      {children}
    </button>
  )
}

function filteredCount(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "товар"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "товара"
  return "товаров"
}
