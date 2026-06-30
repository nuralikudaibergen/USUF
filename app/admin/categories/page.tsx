"use client"

import { type ChangeEvent, type FormEvent, type ReactNode, useState } from "react"
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { type NavCategory, useAdmin } from "@/lib/admin-store"
import { canUseSupabase, uploadStoreImage } from "@/lib/supabase-store"

type FormState = {
  slug: string
  label: string
  image: string
  href: string
}

const emptyForm: FormState = {
  slug: "",
  label: "",
  image: "/categories/men.png",
  href: "",
}

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin()
  const [editing, setEditing] = useState<NavCategory | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState("")

  const startCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setUploadError("")
    setCreating(true)
  }

  const startEdit = (category: NavCategory) => {
    setCreating(false)
    setEditing(category)
    setUploadError("")
    setForm({
      slug: category.slug,
      label: category.label,
      image: category.image,
      href: category.href,
    })
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    setUploadError("")
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const result = await readImageAsDataUrl(file)
    if (!result.ok) {
      setUploadError(result.error)
      return
    }
    setForm((prev) => ({ ...prev, image: result.value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const slug = normalizeSlug(form.slug)
    const payload = {
      slug,
      label: form.label.trim(),
      image: form.image.trim(),
      href: form.href.trim() || `/${slug}`,
    }
    if (!payload.slug || !payload.label || !payload.image) return
    if (editing) updateCategory(editing.id, payload)
    else addCategory(payload)
    closeForm()
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
            Категории
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            {categories.length} {categoryCount(categories.length)} для меню и главной страницы.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep"
        >
          <Plus className="size-4" /> Добавить категорию
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gold/20 bg-forest">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="border-b border-gold/20 text-[10px] uppercase tracking-[0.2em] text-gold-soft/70">
            <tr>
              <th className="px-4 py-3 text-left">Фото</th>
              <th className="px-4 py-3 text-left">Название</th>
              <th className="px-4 py-3 text-left">Адрес</th>
              <th className="px-4 py-3 text-left">Ссылка</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gold/10 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="relative h-14 w-20 overflow-hidden rounded border border-gold/20 bg-forest-deep">
                    <SafeImage src={category.image} alt={category.label} fill sizes="80px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-gold">{category.label}</td>
                <td className="px-4 py-3 font-mono text-xs text-foreground/72">{category.slug}</td>
                <td className="px-4 py-3 font-mono text-xs text-foreground/72">{category.href}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" onClick={() => startEdit(category)} className="cursor-pointer rounded p-1.5 text-gold hover:bg-gold/10" aria-label="Редактировать">
                      <Pencil className="size-4" />
                    </button>
                    {confirmDelete === category.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            deleteCategory(category.id)
                            setConfirmDelete(null)
                          }}
                          className="cursor-pointer rounded bg-red-500/80 px-2 py-1 text-[10px] font-extrabold uppercase text-white"
                        >
                          Удалить
                        </button>
                        <button type="button" onClick={() => setConfirmDelete(null)} className="cursor-pointer rounded p-1.5 text-gold-soft hover:text-gold" aria-label="Отмена удаления">
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setConfirmDelete(category.id)} className="cursor-pointer rounded p-1.5 text-gold-soft hover:bg-red-500/10 hover:text-red-300" aria-label="Удалить">
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
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-deep/90 px-4 py-10 backdrop-blur"
          onClick={closeForm}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl rounded-lg border border-gold/30 bg-forest p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                {editing ? "Редактировать категорию" : "Новая категория"}
              </h2>
              <button type="button" onClick={closeForm} className="cursor-pointer text-gold-soft hover:text-gold" aria-label="Закрыть">
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
              <div>
                <div className="relative aspect-[16/11] overflow-hidden rounded-md border border-gold/25 bg-forest-deep">
                  <SafeImage src={form.image || "/placeholder.svg"} alt="Превью категории" fill sizes="220px" className="object-cover" />
                </div>
                {uploadError && <p className="mt-2 text-xs text-red-300">{uploadError}</p>}
                <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gold/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/10">
                  <ImagePlus className="size-4" />
                  Загрузить фото
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                </label>
              </div>

              <div className="grid gap-3">
                <Field label="Название" required>
                  <input required value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder="Мужская" className="input" />
                </Field>
                <Field label="Адрес" required>
                  <input required value={form.slug} onChange={(event) => setForm({ ...form, slug: normalizeSlug(event.target.value) })} placeholder="men" className="input font-mono" />
                </Field>
                <Field label="Ссылка">
                  <input value={form.href} onChange={(event) => setForm({ ...form, href: event.target.value })} placeholder="/men" className="input font-mono" />
                </Field>
                <Field label="Фото">
                  <textarea rows={3} value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="input font-mono" />
                </Field>
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

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-")
}

function categoryCount(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "категория"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "категории"
  return "категорий"
}

async function readImageAsDataUrl(file: File): Promise<{ ok: true; value: string } | { ok: false; error: string }> {
  if (file.type && !file.type.startsWith("image/")) return { ok: false, error: "Выберите файл изображения." }
  if (!isBrowserSupportedImage(file)) {
    return {
      ok: false,
      error: "Этот формат фото не подходит для сайта. Выберите JPG, PNG или WebP.",
    }
  }

  const uploadedUrl = await uploadStoreImage(file, "categories")
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
