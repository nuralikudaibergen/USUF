"use client"

import { type ChangeEvent, type FormEvent, type ReactNode, useState } from "react"
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { useAdmin } from "@/lib/admin-store"
import { formatPrice, type Product } from "@/lib/products"
import { canUseSupabase, uploadStoreImage } from "@/lib/supabase-store"

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
  colors: "Чёрный, Белый",
  sizes: "S, M, L, XL",
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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState("")

  const startCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, sku: nextSku(products) })
    setUploadError("")
    setCreating(true)
  }

  const startEdit = (product: Product) => {
    setCreating(false)
    setEditing(product)
    setUploadError("")
    const extras = (product.images ?? []).filter((src) => src && src !== product.image)
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug ?? "",
      sku: product.sku,
      category: product.category,
      type: product.type,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      image: product.image,
      imagesExtra: extras.join(", "),
      colors: product.colors.join(", "),
      sizes: product.sizes.join(", "),
      material: product.material,
      description: product.description,
      isNew: !!product.isNew,
      isFeatured: !!product.isFeatured,
      popularity: String(product.popularity),
      rating: String(product.rating),
      tag: product.tag ?? "",
    })
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    setUploadError("")
  }

  const handleMainPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const result = await readImageAsDataUrl(file)
    if (!result.ok) {
      setUploadError(result.error)
      return
    }
    setForm((prev) => ({ ...prev, image: result.value }))
  }

  const handleExtraPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    const uploaded: string[] = []
    for (const file of files) {
      const result = await readImageAsDataUrl(file)
      if (!result.ok) {
        setUploadError(result.error)
        return
      }
      uploaded.push(result.value)
    }
    setForm((prev) => {
      const existing = splitList(prev.imagesExtra)
      return { ...prev, imagesExtra: [...existing, ...uploaded].join(", ") }
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const price = Number(form.price)
    if (!form.name.trim() || !form.sku.trim() || !price) return

    const extras = splitList(form.imagesExtra)
    const images = Array.from(new Set([form.image.trim(), ...extras])).filter(Boolean)
    const payload: Omit<Product, "id"> & { id?: string } = {
      name: form.name.trim(),
      slug: normalizeSlug(form.slug) || undefined,
      sku: form.sku.trim(),
      category: form.category,
      type: form.type,
      price,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      image: form.image.trim(),
      images,
      colors: splitList(form.colors),
      sizes: splitList(form.sizes),
      material: form.material.trim(),
      description: form.description.trim(),
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      popularity: clamp(Number(form.popularity) || 50, 0, 100),
      rating: clamp(Number(form.rating) || 4.5, 0, 5),
      tag: form.tag.trim() || undefined,
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
          <p className="mt-2 text-sm text-foreground/70">
            {products.length} {productCount(products.length)} в каталоге.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Вернуть стартовые товары, категории и промокоды?")) {
                resetToDefaults()
              }
            }}
            className="rounded-md border border-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft hover:text-gold"
          >
            Сброс
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep"
          >
            <Plus className="size-4" /> Добавить товар
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gold/20 bg-forest">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-gold/20 text-[10px] uppercase tracking-[0.2em] text-gold-soft/70">
            <tr>
              <th className="px-4 py-3 text-left">Фото</th>
              <th className="px-4 py-3 text-left">Название / SKU</th>
              <th className="px-4 py-3 text-left">Раздел</th>
              <th className="px-4 py-3 text-left">Тип</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-right">Цена</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gold/10 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="relative h-14 w-11 overflow-hidden rounded border border-gold/20 bg-forest-deep">
                    <SafeImage src={product.image} alt={product.name} fill sizes="44px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-bold text-gold">{product.name}</p>
                  <p className="text-xs text-gold-soft/60">{product.sku}</p>
                </td>
                <td className="px-4 py-3 text-foreground/74">
                  {product.category === "men" ? "Мужская" : "Женская"}
                </td>
                <td className="px-4 py-3 text-foreground/74">
                  {product.type === "footwear" ? "Обувь" : "Одежда"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {product.isNew && <Badge>Новинка</Badge>}
                    {product.isFeatured && <Badge>Хит</Badge>}
                    {product.oldPrice && <Badge>Sale</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-gold">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="cursor-pointer rounded p-1.5 text-gold hover:bg-gold/10"
                      aria-label="Редактировать"
                    >
                      <Pencil className="size-4" />
                    </button>
                    {confirmDelete === product.id ? (
                      <>
                        <button
                          type="button"
                          disabled={deletingId === product.id}
                          onClick={async () => {
                            setDeletingId(product.id)
                            await deleteProduct(product.id)
                            setDeletingId(null)
                            setConfirmDelete(null)
                          }}
                          className="cursor-pointer rounded bg-red-500/80 px-2 py-1 text-[10px] font-extrabold uppercase text-white disabled:cursor-wait disabled:opacity-60"
                        >
                          {deletingId === product.id ? "Удаляется..." : "Удалить"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          className="cursor-pointer rounded p-1.5 text-gold-soft hover:text-gold"
                          aria-label="Отмена удаления"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(product.id)}
                        className="cursor-pointer rounded p-1.5 text-gold-soft hover:bg-red-500/10 hover:text-red-300"
                        aria-label="Удалить"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-foreground/60">
                  Пока нет товаров.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-deep/90 px-4 py-10 backdrop-blur"
          onClick={closeForm}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-4xl rounded-lg border border-gold/30 bg-forest p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                {editing ? "Редактировать товар" : "Новый товар"}
              </h2>
              <button type="button" onClick={closeForm} className="cursor-pointer text-gold-soft hover:text-gold" aria-label="Закрыть">
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
              <div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-gold/25 bg-forest-deep">
                  <SafeImage src={form.image || "/placeholder.svg"} alt="Превью товара" fill sizes="260px" className="object-cover" />
                </div>
                {uploadError && <p className="mt-2 text-xs text-red-300">{uploadError}</p>}
                <PhotoButton label="Загрузить главное фото" onChange={handleMainPhoto} />
                <PhotoButton label="Добавить фото в галерею" multiple onChange={handleExtraPhotos} />
              </div>

              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Название" hint="Например: Футболка YB Classic." required>
                    <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input" />
                  </Field>
                  <Field label="Артикул" hint="Можно оставить автоматически созданный код." required>
                    <input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} className="input" />
                  </Field>
                  <Field label="Адрес товара" hint="Необязательно. Например: futbolka-yb-classic.">
                    <input
                      value={form.slug}
                      onChange={(event) => setForm({ ...form, slug: normalizeSlug(event.target.value) })}
                      placeholder="palto-iz-shersti"
                      className="input font-mono"
                    />
                  </Field>
                  <Field label="Метка" hint="Например: Хит, New, Sale.">
                    <input value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} placeholder="Бестселлер" className="input" />
                  </Field>
                  <Field label="Раздел">
                    <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as "men" | "women" })} className="input">
                      <option value="men" className="bg-forest text-foreground">Мужская</option>
                      <option value="women" className="bg-forest text-foreground">Женская</option>
                    </select>
                  </Field>
                  <Field label="Тип товара">
                    <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as "apparel" | "footwear" })} className="input">
                      <option value="apparel" className="bg-forest text-foreground">Одежда</option>
                      <option value="footwear" className="bg-forest text-foreground">Обувь</option>
                    </select>
                  </Field>
                  <Field label="Цена, ₸" hint="Текущая цена продажи." required>
                    <input type="number" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="input" />
                  </Field>
                  <Field label="Старая цена, ₸" hint="Заполните, если нужна скидка.">
                    <input type="number" value={form.oldPrice} onChange={(event) => setForm({ ...form, oldPrice: event.target.value })} className="input" />
                  </Field>
                  <Field label="Цвета" hint="Через запятую: Чёрный, Белый, Зелёный." required>
                    <input required value={form.colors} onChange={(event) => setForm({ ...form, colors: event.target.value })} className="input" />
                  </Field>
                  <Field label="Размеры" hint="Через запятую: S, M, L, XL или 40, 41, 42." required>
                    <input required value={form.sizes} onChange={(event) => setForm({ ...form, sizes: event.target.value })} className="input" />
                  </Field>
                  <Field label="Популярность" hint="Число от 0 до 100.">
                    <input type="number" min="0" max="100" value={form.popularity} onChange={(event) => setForm({ ...form, popularity: event.target.value })} className="input" />
                  </Field>
                  <Field label="Рейтинг" hint="Число от 0 до 5.">
                    <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} className="input" />
                  </Field>
                  <Field label="Главное фото" hint="Можно загрузить кнопкой слева или вставить ссылку.">
                    <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="input font-mono" />
                  </Field>
                  <Field label="Галерея" hint="Дополнительные фото через запятую.">
                    <textarea rows={3} value={form.imagesExtra} onChange={(event) => setForm({ ...form, imagesExtra: event.target.value })} className="input font-mono" />
                  </Field>
                </div>

                <div className="mt-3">
                  <Field label="Состав и материал" hint="Например: 100% хлопок, плотность 240 г/м²." required>
                    <input required value={form.material} onChange={(event) => setForm({ ...form, material: event.target.value })} className="input" />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Описание" hint="Короткое описание для страницы товара." required>
                    <textarea required rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="input" />
                  </Field>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground/76">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={form.isNew} onChange={(event) => setForm({ ...form, isNew: event.target.checked })} className="size-4 accent-gold" />
                    Новинка
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} className="size-4 accent-gold" />
                    Хит
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeForm} className="rounded-md border border-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft hover:text-gold">
                Отмена
              </button>
              <button type="submit" className="rounded-md bg-gold px-5 py-2 font-heading text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep">
                {editing ? "Сохранить" : "Создать"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{inputStyles}</style>
    </div>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] leading-5 text-foreground/58">{hint}</p>}
    </div>
  )
}

function PhotoButton({
  label,
  multiple,
  onChange,
}: {
  label: string
  multiple?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gold/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/10">
      <ImagePlus className="size-4" />
      {label}
      <input type="file" accept="image/*" multiple={multiple} onChange={onChange} className="sr-only" />
    </label>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-gold/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-soft">
      {children}
    </span>
  )
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-")
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function nextSku(products: { sku: string }[]): string {
  let max = 0
  for (const product of products) {
    const match = product.sku.match(/(\d+)$/)
    if (match) max = Math.max(max, Number(match[1]))
  }
  return `YB-N-${String(max + 1).padStart(3, "0")}`
}

function productCount(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "товар"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "товара"
  return "товаров"
}

async function readImageAsDataUrl(file: File): Promise<{ ok: true; value: string } | { ok: false; error: string }> {
  if (file.type && !file.type.startsWith("image/")) return { ok: false, error: "Выберите файл изображения." }
  if (!isBrowserSupportedImage(file)) {
    return {
      ok: false,
      error: "Этот формат фото не подходит для сайта. Выберите JPG, PNG или WebP.",
    }
  }

  const uploadedUrl = await uploadStoreImage(file, "products")
  if (uploadedUrl) return { ok: true, value: uploadedUrl }
  if (canUseSupabase()) {
    return {
      ok: false,
      error: "Фото не загрузилось. Попробуйте ещё раз или выберите другой файл.",
    }
  }

  if (file.size > 900_000) return { ok: false, error: "Фото слишком большое. Выберите файл до 900 KB." }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ ok: true, value: String(reader.result) })
    reader.onerror = () => resolve({ ok: false, error: "Не удалось прочитать файл." })
    reader.readAsDataURL(file)
  })
}

function isBrowserSupportedImage(file: File) {
  const name = file.name.toLowerCase()
  if (name.endsWith(".heic") || name.endsWith(".heif")) return false
  if (file.type === "image/heic" || file.type === "image/heif") return false
  if (!file.type) return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].some((ext) => name.endsWith(ext))
  return ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(file.type)
}

const inputStyles = `
  :global(.input) {
    width: 100%;
    border-radius: 0.5rem;
    border: 2px solid rgba(255, 146, 19, 0.55);
    background: #fff7e8;
    padding: 0.7rem 0.85rem;
    font-size: 0.875rem;
    color: #061e16;
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(6, 30, 22, 0.06);
  }
  :global(.input:focus) {
    border-color: #ff9213;
    box-shadow: 0 0 0 3px rgba(255, 146, 19, 0.28);
  }
  :global(.input::placeholder) {
    color: rgba(6, 30, 22, 0.48);
  }
  :global(select.input) {
    color: #061e16;
  }
  :global(select.input option) {
    background: #fff7e8;
    color: #061e16;
  }
`
