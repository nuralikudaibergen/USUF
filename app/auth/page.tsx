"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, MessageCircle, Phone, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

type Step = "phone" | "code"

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
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("+7 ")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hydrated && user) {
      router.replace("/account")
    }
  }, [hydrated, user, router])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const cleanPhone = phone.replace(/\D/g, "")
    if (cleanPhone.length < 10) {
      setError("Введите номер из 10 цифр после +7")
      return
    }
    setStep("code")
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = login(phone, code)
    setLoading(false)
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
          <div className="rounded-2xl border border-gold/20 bg-forest-deep/60 p-8 shadow-[0_20px_60px_-30px_rgba(232,160,32,0.4)] backdrop-blur">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-forest">
                <Shield className="size-6 text-gold" />
              </div>
              <h1 className="mt-4 font-heading text-2xl font-extrabold uppercase tracking-[0.2em] text-gold">
                {step === "phone" ? "Вход в аккаунт" : "Подтверждение"}
              </h1>
              <p className="mt-2 text-sm text-gold-soft/70">
                {step === "phone"
                  ? "Введите номер телефона. Мы отправим SMS-код."
                  : `Код отправлен на ${phone}`}
              </p>
            </div>

            {step === "phone" ? (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gold-soft/80">
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
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="+7 700 000 00 00"
                      className="w-full rounded-lg border border-gold/30 bg-forest/60 py-3 pl-10 pr-3 text-base text-gold outline-none transition-colors placeholder:text-gold-soft/30 focus:border-gold"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-gold-soft/50">
                    Подсказка: номер, оканчивающийся на «0000», открывает доступ к админ-панели.
                  </p>
                </div>

                {error && (
                  <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-heading text-sm font-extrabold uppercase tracking-[0.25em] text-forest transition-all hover:shadow-[0_10px_30px_-10px_rgba(232,160,32,0.7)]"
                >
                  Получить код
                  <ArrowRight className="size-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gold-soft/80">
                    Код из SMS
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="0000"
                    className="w-full rounded-lg border border-gold/30 bg-forest/60 px-4 py-3 text-center font-heading text-2xl font-extrabold tracking-[0.5em] text-gold outline-none transition-colors placeholder:text-gold-soft/30 focus:border-gold"
                  />
                  <p className="mt-2 text-[11px] text-gold-soft/50">
                    В демо-режиме подойдёт любой 4-значный код.
                  </p>
                </div>

                {error && (
                  <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-heading text-sm font-extrabold uppercase tracking-[0.25em] text-forest transition-all hover:shadow-[0_10px_30px_-10px_rgba(232,160,32,0.7)] disabled:opacity-60"
                >
                  Войти
                  <ArrowRight className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone")
                    setCode("")
                    setError(null)
                  }}
                  className="w-full text-center text-xs uppercase tracking-[0.2em] text-gold-soft/60 hover:text-gold"
                >
                  Изменить номер
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center gap-2 border-t border-gold/10 pt-4 text-[11px] text-gold-soft/50">
              <MessageCircle className="size-3.5" />
              <span>
                Войдите, чтобы отслеживать заказы и сохранять избранное.{" "}
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
