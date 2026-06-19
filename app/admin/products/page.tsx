"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useAdmin } from "@/lib/admin-store"
import type { Product } from "@/lib/products"
import { formatPrice } from "@/lib/products"

type FormState = {
  id?: string
  name: string
  slug: string
  sku: string
  category: "men" | "women"
  type: "apparel" | "footwear"
  price: string
  oldPrice: string
  image: string
  /** Дополнительные URL фото через запятую. Главная картинка = image, идёт первой. */
  imagesExtra: string
  colors: string
  sizes: string
  material: string
  description: string
  isNew: boolean
  isFeatured: boolean
  popularity: string
  rating: string
  tag: string
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  sku: "",
  category: "men",
  type: "apparel",
  price: "",
  oldPrice: "",
  image: "/products/men-shirt.png",
  imagesExtra: "",
  colors: "",
  sizes: "",
  material: "",
  description: "",
  isNew: false,
  isFeatured: false,
  popularity: "50",
  rating: "4.5",
  tag: "",
}

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults } = useAdmin()
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const startCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, sku: nextSku(products) })
    setCreating(true)
  }

  const startEdit = (p: Product) => {
    setCreating(false)
    setEditing(p)
    // Главная картинка = image, остальные — в imagesExtra.
    const extras = (p.images ?? []).filter((src) => src && src !== p.image)
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug ?? "",
      sku: p.sku,
      category: p.category,
      type: p.type,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      image: p.image,
      imagesExtra: extras.join(", "),
      colors: p.colors.join(", "),
      sizes: p.sizes.join(", "),
      material: p.material,
      description: p.description,
      isNew: !!p.isNew,
      isFeatured: !!p.isFeatured,
      popularity: String(p.popularity),
      rating: String(p.rating),
      tag: p.tag ?? "",
    })
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const price = Number(form.price) || 0
    const oldPrice = form.oldPrice ? Number(form.oldPrice) : undefined
    const colors = form.colors.split(",").map((s) => s.trim()).filter(Boolean)
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    // Собираем массив фото: главная идёт первой, остальные — дополнительные, без дублей.
    const extras = form.imagesExtra
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const images = Array.from(new Set([form.image, ...extras])).filter(Boolean)
    const payload: Omit<Product, "id"> & { id?: string } = {
      name: form.name,
      slug: form.slug.trim() || undefined,
      sku: form.sku,
      category: form.category,
      type: form.type,
      price,
      oldPrice,
      image: form.image,
      images,
      colors,
      sizes,
      material: form.material,
      description: form.description,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      popularity: Number(form.popularity) || 50,
      rating: Number(form.rating) || 4.5,
      tag: form.tag || undefined,
    }
    if (editing) updateProduct(editing.id, payload)
    else addProduct(payload)
    closeForm()
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
            Товары
          </h1>
          <p className="mt-2 text-sm text-gold-soft/70">
            {products.length} {products.length === 1 ? "позиция" : "позиций"} в каталоге
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm("Вернуть каталог к стартовым товарам? Локальные изменения будут потеряны.")) {
                resetToDefaults()
              }
            }}
            className="rounded-md border border-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft hover:text-gold"
          >
            Сброс
          </button>
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
          >
            <Plus className="size-4" /> Добавить товар
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gold/20 bg-forest">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-gold/20 text-[10px] uppercase tracking-[0.2em] text-gold-soft/70">
            <tr>
              <th className="px-4 py-3 text-left">Фото</th>
              <th className="px-4 py-3 text-left">Название / SKU</th>
              <th className="px-4 py-3 text-left">Категория</th>
              <th className="px-4 py-3 text-left">Тип</th>
              <th className="px-4 py-3 text-right">Цена</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gold/10 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-10 overflow-hidden rounded border border-gold/20">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-bold text-gold">{p.name}</p>
                  <p className="text-xs text-gold-soft/60">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-gold-soft">
                  {p.category === "men" ? "Мужская" : "Женская"}
                </td>
                <td className="px-4 py-3 text-gold-soft">
                  {p.type === "footwear" ? "Обувь" : "Одежда"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gold">
                  {formatPrice(p.price)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded p-1.5 text-gold hover:bg-gold/10"
                      aria-label="Редактировать"
                    >
                      <Pencil className="size-4" />
                    </button>
                    {confirmDelete === p.id ? (
                      <>
                        <button
                          onClick={() => {
                            deleteProduct(p.id)
                            setConfirmDelete(null)
                          }}
                          className="rounded bg-red-500/80 px-2 py-1 text-[10px] font-extrabold uppercase text-white"
                        >
                          Удалить
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="rounded p-1.5 text-gold-soft hover:text-gold"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        className="rounded p-1.5 text-gold-soft hover:bg-red-500/10 hover:text-red-300"
                        aria-label="Удалить"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-deep/90 px-4 py-12 backdrop-blur"
          onClick={closeForm}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-gold/30 bg-forest p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                {editing ? "Редактировать товар" : "Новый товар"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-gold-soft hover:text-gold"
                aria-label="Закрыть"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Название" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Артикул (SKU)" required>
                <input
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Slug (URL — латиницей, через дефис)">
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                  placeholder="palto-iz-shersti"
                  className="input font-mono"
                />
                <p className="mt-1 text-[10px] text-gold-soft/60">
                  Если пусто — будет использован id.
                </p>
              </Field>
              <Field label="Категория">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as "men" | "women" })
                  }
                  className="input"
                >
                  <option value="men" className="bg-forest text-gold">Мужская</option>
                  <option value="women" className="bg-forest text-gold">Женская</option>
                </select>
              </Field>
              <Field label="Тип">
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as "apparel" | "footwear" })
                  }
                  className="input"
                >
                  <option value="apparel" className="bg-forest text-gold">Одежда</option>
                  <option value="footwear" className="bg-forest text-gold">Обувь</option>
                </select>
              </Field>
              <Field label="Цена, ₸" required>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Старая цена, ₸">
                <input
                  type="number"
                  value={form.oldPrice}
                  onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="URL главной картинки" required>
                <input
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Доп. фото (URL через запятую)">
                <input
                  value={form.imagesExtra}
                  onChange={(e) => setForm({ ...form, imagesExtra: e.target.value })}
                  placeholder="/products/men-shirt.png, /products/men-tshirt.png"
                  className="input font-mono"
                />
                <p className="mt-1 text-[10px] text-gold-soft/60">
                  Главная картинка ({form.image || "—"}) всегда идёт первой.
                </p>
              </Field>
              <Field label="Тег (напр. «Бестселлер»)">
                <input
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Цвета (через запятую)" required>
                <input
                  required
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Размеры (через запятую)" required>
                <input
                  required
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Популярность (0–100)">
                <input
                  type="number"
                  value={form.popularity}
                  onChange={(e) => setForm({ ...form, popularity: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Рейтинг (0–5)">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="input"
                />
              </Field>
            </div>

            <div className="mt-3">
              <Field label="Состав и материал" required>
                <input
                  required
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  className="input"
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Описание" required>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input"
                />
              </Field>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gold-soft">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isNew}
                  onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  className="size-4 accent-gold"
                />
                Новинка
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="size-4 accent-gold"
                />
                Хит / Featured
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md border border-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft hover:text-gold"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="rounded-md bg-gold px-5 py-2 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
              >
                {editing ? "Сохранить" : "Создать"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(232, 160, 32, 0.3);
          background: rgba(15, 42, 31, 0.5);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: var(--gold, #e8a020);
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--gold, #e8a020);
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

function nextSku(products: { sku: string }[]): string {
  let maxN = 0
  for (const p of products) {
    const m = p.sku.match(/(\d+)$/)
    if (m) maxN = Math.max(maxN, Number(m[1]))
  }
  return `YB-N-${String(maxN + 1).padStart(3, "0")}`
}
