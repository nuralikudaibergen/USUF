"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Package, Shield, Tag, ListOrdered, LayoutGrid } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { YBLogo } from "@/components/yb-logo"

const navItems = [
  { href: "/admin", label: "Обзор", Icon: Shield },
  { href: "/admin/products", label: "Товары", Icon: Package },
  { href: "/admin/categories", label: "Категории", Icon: LayoutGrid },
  { href: "/admin/promos", label: "Промокоды", Icon: Tag },
  { href: "/admin/orders", label: "Заказы", Icon: ListOrdered },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, hydrated, logout } = useAuth()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    setChecked(true)
    if (!user || !user.isAdmin) {
      router.replace("/auth")
    }
  }, [user, hydrated, router])

  if (!checked || !user?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-deep text-gold-soft/70">
        Проверка доступа...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-forest-deep md:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-gold/20 bg-forest md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2 border-b border-gold/20 px-5 py-5">
          <Link href="/" className="flex items-center gap-2">
            <YBLogo size="sm" withText={false} />
            <span className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                  active
                    ? "bg-gold text-forest"
                    : "text-gold-soft hover:bg-forest-deep/50 hover:text-gold"
                }`}
              >
                <Icon className="size-4" /> {label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-gold/20 p-4 text-xs text-gold-soft/70">
          <p className="font-bold text-gold">{user.phone}</p>
          <p>Администратор</p>
          <button
            onClick={() => {
              logout()
              router.replace("/")
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft hover:text-gold"
          >
            <LogOut className="size-3" /> Выйти
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
    </div>
  )
}
