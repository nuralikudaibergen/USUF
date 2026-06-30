"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, useEffect, useState } from "react"
import { ArrowRight, MessageCircle, Phone, Shield } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useAuth } from "@/lib/auth-context"

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  const d = digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits
  const parts: string[] = []
  if (d.length > 0) parts.push("+7")
  if (d.length > 0) parts.push(" " + d.slice(0, 3))
  if (d.length > 3) parts.push(" " + d.slice(3, 6))
  if (d.length > 6) parts.push(" " + d.slice(6, 8))
  if (d.length > 8) parts.push(" " + d.slice(8, 10))
  return parts.join("")
}

export default function AuthPage() {
  const router = useRouter()
  const { user, login, hydrated } = useAuth()
  const [phone, setPhone] = useState("+7 ")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hydrated && user) router.replace("/account")
  }, [hydrated, user, router])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    const res = login(phone)
    if (!res.ok) {
      setError(res.error)
      return
    }
    router.replace("/account")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-gold/20 bg-forest-deep/60 p-8 shadow-[0_20px_60px_-30px_rgba(255,146,19,0.4)] backdrop-blur">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-forest">
                <Shield className="size-6 text-gold" />
              </div>
              <h1 className="mt-4 font-heading text-2xl font-extrabold uppercase tracking-[0.18em] text-gold">
                Вход в аккаунт
              </h1>
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                Введите только номер телефона. Код SMS больше не нужен.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-gold-soft/80">
                  Телефон
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold-soft/60" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    autoFocus
                    value={phone}
                    onChange={(event) => setPhone(formatPhone(event.target.value))}
                    placeholder="+7 700 000 00 00"
                    className="w-full rounded-lg border border-gold/30 bg-forest/60 py-3 pl-10 pr-3 text-base text-foreground outline-none transition-colors placeholder:text-gold-soft/35 focus:border-gold"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold py-3 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-forest-deep transition-all hover:shadow-[0_10px_30px_-10px_rgba(255,146,19,0.7)]"
              >
                Войти
                <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 border-t border-gold/10 pt-4 text-[11px] text-foreground/58">
              <MessageCircle className="size-3.5" />
              <span>
                После входа можно сохранять избранное и данные заказа.{" "}
                <Link href="/about" className="text-gold underline-offset-2 hover:underline">
                  О бренде
                </Link>
              </span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
