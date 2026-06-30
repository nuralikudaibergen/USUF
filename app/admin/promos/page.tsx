"use client"

import { type FormEvent, type ReactNode, useState } from "react"
import { Plus, Trash2, X } from "lucide-react"
import type { PromoCode } from "@/lib/brand-config"
import { useAdmin } from "@/lib/admin-store"

type PromoForm = PromoCode

const emptyForm: PromoForm = {
  code: "",
  type: "percent",
  value: 10,
  description: "",
}

export default function AdminPromosPage() {
  const { promos, addPromo, deletePromo } = useAdmin()
  const [form, setForm] = useState<PromoForm>(emptyForm)
  const [creating, setCreating] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const code = form.code.trim().toUpperCase()
    if (!code) return
    addPromo({
      code,
      type: form.type,
      value: Number(form.value) || 0,
      description:
        form.description.trim() ||
        `${form.value}${form.type === "percent" ? "%" : " ₸"} скидка`,
    })
    setForm(emptyForm)
    setCreating(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold">
            Промокоды
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            {promos.length} {promos.length === 1 ? "активный код" : "активных кодов"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep"
        >
          <Plus className="size-4" /> Новый промокод
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gold/20 bg-forest">
        <table className="w-full min-w-[680px] text-sm">
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
            {promos.map((promo) => (
              <tr key={promo.code} className="border-b border-gold/10 last:border-b-0">
                <td className="px-4 py-3 font-mono font-bold text-gold">{promo.code}</td>
                <td className="px-4 py-3 text-foreground/74">
                  {promo.type === "percent" ? "Процент" : "Сумма"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gold">
                  {promo.value}
                  {promo.type === "percent" ? "%" : " ₸"}
                </td>
                <td className="px-4 py-3 text-foreground/74">{promo.description}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => deletePromo(promo.code)}
                    className="cursor-pointer rounded p-1.5 text-gold-soft hover:bg-red-500/10 hover:text-red-300"
                    aria-label="Удалить"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-foreground/60">
                  Промокодов пока нет.
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
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-gold/30 bg-forest p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                Новый промокод
              </h2>
              <button type="button" onClick={() => setCreating(false)} className="cursor-pointer text-gold-soft hover:text-gold" aria-label="Закрыть">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Код">
                <input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="YUSUF10" className="input font-mono" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Тип">
                  <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as "percent" | "fixed" })} className="input">
                    <option value="percent" className="bg-forest text-foreground">Процент</option>
                    <option value="fixed" className="bg-forest text-foreground">Сумма ₸</option>
                  </select>
                </Field>
                <Field label="Значение">
                  <input type="number" required value={form.value} onChange={(event) => setForm({ ...form, value: Number(event.target.value) })} className="input" />
                </Field>
              </div>
              <Field label="Описание">
                <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="10% скидка на всё" className="input" />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setCreating(false)} className="rounded-md border border-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft hover:text-gold">
                Отмена
              </button>
              <button type="submit" className="rounded-md bg-gold px-5 py-2 font-heading text-xs font-extrabold uppercase tracking-[0.18em] text-forest-deep">
                Создать
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{inputStyles}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/80">
        {label}
      </label>
      {children}
    </div>
  )
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
