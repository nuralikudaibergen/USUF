"use client"

import { useState } from "react"
import { Plus, Trash2, X } from "lucide-react"
import { useAdmin } from "@/lib/admin-store"
import type { PromoCode } from "@/lib/brand-config"

export default function AdminPromosPage() {
  const { promos, addPromo, deletePromo } = useAdmin()
  const [form, setForm] = useState<Omit<PromoCode, "code"> & { code: string }>({
    code: "",
    type: "percent",
    value: 10,
    description: "",
  })
  const [creating, setCreating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) return
    addPromo({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      description: form.description.trim() || `${form.value}${form.type === "percent" ? "%" : " ₸"} скидка`,
    })
    setForm({ code: "", type: "percent", value: 10, description: "" })
    setCreating(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
            Промокоды
          </h1>
          <p className="mt-2 text-sm text-gold-soft/70">
            {promos.length} {promos.length === 1 ? "активный" : "активных"}
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
        >
          <Plus className="size-4" /> Новый промокод
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gold/20 bg-forest">
        <table className="w-full text-sm">
          <thead className="border-b border-gold/20 text-[10px] uppercase tracking-[0.2em] text-gold-soft/70">
            <tr>
              <th className="px-4 py-3 text-left">Код</th>
              <th className="px-4 py-3 text-left">Тип</th>
              <th className="px-4 py-3 text-right">Значение</th>
              <th className="px-4 py-3 text-left">Описание</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.code} className="border-b border-gold/10 last:border-b-0">
                <td className="px-4 py-3 font-mono font-bold text-gold">{p.code}</td>
                <td className="px-4 py-3 text-gold-soft">
                  {p.type === "percent" ? "Процент" : "Фикс"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gold">
                  {p.value}
                  {p.type === "percent" ? "%" : " ₸"}
                </td>
                <td className="px-4 py-3 text-gold-soft">{p.description}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deletePromo(p.code)}
                    className="rounded p-1.5 text-gold-soft hover:bg-red-500/10 hover:text-red-300"
                    aria-label="Удалить"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gold-soft/60">
                  Промокодов пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-deep/90 px-4 py-16 backdrop-blur"
          onClick={() => setCreating(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-gold/30 bg-forest p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                Новый промокод
              </h2>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="text-gold-soft hover:text-gold"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
                  Код
                </label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="YUSUF10"
                  className="w-full rounded-lg border border-gold/30 bg-forest-deep/40 px-3 py-2 font-mono text-sm text-gold outline-none focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
                    Тип
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as "percent" | "fixed" })
                    }
                    className="w-full rounded-lg border border-gold/30 bg-forest px-3 py-2 text-sm text-gold outline-none focus:border-gold"
                  >
                    <option value="percent" className="bg-forest text-gold">Процент</option>
                    <option value="fixed" className="bg-forest text-gold">Фикс ₸</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
                    Значение
                  </label>
                  <input
                    type="number"
                    required
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gold/30 bg-forest-deep/40 px-3 py-2 text-sm text-gold outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
                  Описание
                </label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="10% скидка на всё"
                  className="w-full rounded-lg border border-gold/30 bg-forest-deep/40 px-3 py-2 text-sm text-gold outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="rounded-md border border-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft hover:text-gold"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="rounded-md bg-gold px-5 py-2 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
