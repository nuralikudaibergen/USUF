"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

type Filter = "all" | "men" | "women" | "shoes"

export function SearchPage({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery)
  const [filter, setFilter] = useState<Filter>("all")

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return []
    return products.filter((p) => {
      const inText =
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query)
      if (!inText) return false
      if (filter === "shoes") return p.type === "footwear"
      if (filter === "all") return true
      return p.category === filter
    })
  }, [q, filter])

  return (
    <section className="bg-forest-deep py-16">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gold-soft/70">
          <Link href="/" className="hover:text-gold">
            Главная
          </Link>
          <span>/</span>
          <span className="font-medium text-gold">Поиск</span>
        </nav>

        <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold md:text-4xl">
          Поиск по каталогу
        </h1>
        <p className="mt-2 text-sm text-gold-soft/70">
          Введите название, описание или артикул — например: «пальто», «кожа», «YB-M-001».
        </p>

        <form
          action="/search"
          method="get"
          className="mt-6 flex items-center gap-2 rounded-lg border border-gold/30 bg-forest p-2"
        >
          <Search className="ml-2 size-5 text-gold" />
          <input
            type="search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Что вы ищете?"
            className="flex-1 bg-transparent px-2 py-2 text-sm text-gold outline-none placeholder:text-gold/40"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="rounded-md p-2 text-gold hover:text-gold-soft"
              aria-label="Очистить"
            >
              <X className="size-4" />
            </button>
          )}
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              { key: "all", label: "Все" },
              { key: "men", label: "Мужская" },
              { key: "women", label: "Женская" },
              { key: "shoes", label: "Обувь" },
            ] as { key: Filter; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${
                filter === f.key
                  ? "border-gold bg-gold text-forest"
                  : "border-gold/30 text-gold-soft hover:border-gold"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {q.trim() === "" ? (
            <p className="rounded-lg border border-dashed border-gold/20 p-8 text-center text-sm text-gold-soft/60">
              Введите запрос, чтобы увидеть результаты.
            </p>
          ) : results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gold/30 p-12 text-center">
              <p className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                Ничего не найдено
              </p>
              <p className="mt-2 text-sm text-gold-soft/70">
                По запросу «{q}» ничего не нашлось. Попробуйте другие ключевые слова.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-gold-soft/80">
                Найдено: {results.length}{" "}
                {results.length === 1 ? "товар" : "товаров"}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
