"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, type ReactNode, useMemo, useState } from "react"
import { Heart, LogIn, Menu, Search, ShoppingBag, User, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useAdmin } from "@/lib/admin-store"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { YBLogo } from "@/components/yb-logo"

export function SiteHeader() {
  const router = useRouter()
  const { categories, products } = useAdmin()
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, hydrated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const navLinks = useMemo(
    () => [
      ...categories.slice(0, 5).map((category) => ({
        label: category.label,
        href: category.href,
      })),
      { label: "О бренде", href: "/about" },
    ],
    [categories],
  )

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q.length < 1) return []
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.includes(q) ||
          p.sku.toLowerCase().includes(q),
      )
      .slice(0, 5)
  }, [products, searchQuery])

  const submitSearch = (e?: FormEvent) => {
    if (e) e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-forest-deep/90 backdrop-blur-xl supports-[backdrop-filter]:bg-forest-deep/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-10 items-center justify-center rounded-full border border-gold/20 text-gold md:hidden"
          aria-label="Открыть меню"
        >
          <Menu className="size-5" />
        </button>

        <YBLogo size="md" photo />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="gold-underline whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.18em] text-gold-soft transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-gold sm:gap-3">
          <button
            type="button"
            aria-label="Открыть поиск"
            onClick={() => setSearchOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gold/20 transition-colors hover:border-gold hover:bg-gold/10 sm:size-11"
          >
            <Search className="size-5" />
          </button>
          {hydrated && user ? (
            <Link
              href="/account"
              aria-label="Аккаунт"
              className="hidden size-11 items-center justify-center rounded-full border border-gold/20 transition-colors hover:border-gold hover:bg-gold/10 sm:flex"
            >
              <User className="size-5" />
            </Link>
          ) : (
            <Link
              href="/auth"
              aria-label="Войти"
              className="hidden size-11 items-center justify-center rounded-full border border-gold/20 transition-colors hover:border-gold hover:bg-gold/10 sm:flex"
            >
              <LogIn className="size-5" />
            </Link>
          )}
          <Link
            href="/account?tab=wishlist"
            aria-label="Избранное"
            className="relative hidden size-11 items-center justify-center rounded-full border border-gold/20 transition-colors hover:border-gold hover:bg-gold/10 sm:flex"
          >
            <Heart className="size-5" />
            {wishCount > 0 && <Badge>{wishCount}</Badge>}
          </Link>
          <Link
            href="/cart"
            aria-label="Корзина"
            className="relative flex size-10 items-center justify-center rounded-full border border-gold/20 transition-colors hover:border-gold hover:bg-gold/10 sm:size-11"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && <Badge>{count}</Badge>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-forest-deep/85 px-4 pt-20 backdrop-blur sm:pt-24"
          onClick={() => setSearchOpen(false)}
        >
          <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={submitSearch}
              className="flex w-full items-center gap-2 rounded-t-md border border-b-0 border-gold/40 bg-forest p-2 shadow-2xl"
            >
              <Search className="ml-2 size-5 text-gold" />
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по каталогу"
                className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-gold-soft/45"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Закрыть поиск"
                className="flex size-10 items-center justify-center rounded-md text-gold transition-colors hover:bg-gold/10"
              >
                <X className="size-5" />
              </button>
            </form>

            {suggestions.length > 0 ? (
              <ul className="rounded-b-md border border-t-0 border-gold/40 bg-forest shadow-2xl">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug ?? p.id}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-3 px-3 py-3 text-sm text-foreground transition-colors hover:bg-gold/10"
                    >
                      <span className="font-bold">{p.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gold-soft/60">
                        {p.sku}
                      </span>
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-gold-soft/60">
                        {p.category === "men" ? "Мужская" : "Женская"}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="block w-full cursor-pointer rounded-b-md border-t border-gold/20 px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
                  >
                    Показать все результаты
                  </button>
                </li>
              </ul>
            ) : (
              <div className="rounded-b-md border border-t-0 border-gold/40 bg-forest px-4 py-3 text-xs text-gold-soft/70 shadow-2xl">
                Введите название товара или артикул
              </div>
            )}
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-forest-deep/80 backdrop-blur-sm md:hidden">
          <div className="h-full w-80 max-w-[86%] overflow-y-auto border-r border-gold/25 bg-forest p-5">
            <div className="mb-8 flex items-center justify-between">
              <YBLogo size="sm" photo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
                className="flex size-10 items-center justify-center rounded-full border border-gold/25 text-gold"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-xl font-extrabold uppercase tracking-[0.12em] text-gold"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-gold/20" />
              <Link href={hydrated && user ? "/account" : "/auth"} onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gold-soft">
                {hydrated && user ? "Аккаунт" : "Войти"}
              </Link>
              <Link href="/catalog" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gold-soft">
                Каталог
              </Link>
              <Link href="/delivery" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gold-soft">
                Доставка и возврат
              </Link>
              <Link href="/contacts" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gold-soft">
                Контакты
              </Link>
              <Link href="/faq" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gold-soft">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-forest-deep">
      {children}
    </span>
  )
}
