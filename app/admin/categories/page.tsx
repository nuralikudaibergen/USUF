"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { useAdmin, type NavCategory } from "@/lib/admin-store"

type FormState = {
  id?: string
  slug: string
  label: string
  image: string
  href: string
}

const emptyForm: FormState = {
  slug: "",
  label: "",
  image: "/categories/men.png",
  href: "/",
}

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin()
  const [editing, setEditing] = useState<NavCategory | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const startCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setCreating(true)
  }

  const startEdit = (c: NavCategory) => {
    setCreating(false)
    setEditing(c)
    setForm({
      id: c.id,
      slug: c.slug,
      label: c.label,
      image: c.image,
      href: c.href,
    })
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      slug: form.slug.trim(),
      label: form.label.trim(),
      image: form.image.trim(),
      href: form.href.trim() || `/${form.slug.trim()}`,
    }
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
          <p className="mt-2 text-sm text-gold-soft/70">
            {categories.length}{" "}
            {categories.length === 1
              ? "категория"
              : categories.length < 5
                ? "категории"
                : "категорий"}{" "}
            в каталоге. Используются в шапке, на главной и в каталоге.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
        >
          <Plus className="size-4" /> Добавить категорию
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gold/20 bg-forest">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-gold/20 text-[10px] uppercase tracking-[0.2em] text-gold-soft/70">
            <tr>
              <th className="px-4 py-3 text-left">Превью</th>
              <th className="px-4 py-3 text-left">Название</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Ссылка</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-gold/10 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded border border-gold/20 bg-forest-deep">
                    <Image
                      src={c.image}
                      alt={c.label}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-gold">{c.label}</td>
                <td className="px-4 py-3 font-mono text-xs text-gold-soft">
                  {c.slug}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gold-soft">
                  {c.href}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => startEdit(c)}
                      className="rounded p-1.5 text-gold hover:bg-gold/10"
                      aria-label="Редактировать"
                    >
                      <Pencil className="size-4" />
                    </button>
                    {confirmDelete === c.id ? (
                      <>
                        <button
                          onClick={() => {
                            deleteCategory(c.id)
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
                        onClick={() => setConfirmDelete(c.id)}
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
            className="w-full max-w-lg rounded-2xl border border-gold/30 bg-forest p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                {editing ? "Редактировать категорию" : "Новая категория"}
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

            <div className="grid gap-3">
              <Field label="Название (как у клиента)" required>
                <input
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Мужская"
                  className="input"
                />
              </Field>
              <Field label="Slug (латиницей, без пробелов)" required>
                <input
                  required
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                  placeholder="men"
                  className="input font-mono"
                />
              </Field>
              <Field label="URL картинки" required>
                <input
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/categories/men.png"
                  className="input font-mono"
                />
              </Field>
              <Field label="Ссылка (href)">
                <input
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  placeholder="/men"
                  className="input font-mono"
                />
                <p className="mt-1 text-[10px] text-gold-soft/60">
                  Если пусто — будет использован /{`{slug}`}.
                </p>
              </Field>
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
