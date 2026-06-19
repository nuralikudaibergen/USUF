"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Menu, Search, ShoppingBag, User, Heart, X, LogIn } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"
import { products } from "@/lib/products"
import { YBLogo } from "@/components/yb-logo"

const navLinks = [
  { label: "Мужская", href: "/men" },
  { label: "Женская", href: "/women" },
  { label: "Обувь", href: "/shoes" },
  { label: "Распродажа", href: "/sale" },
  { label: "О бренде", href: "/about" },
]

export function SiteHeader() {
  const router = useRouter()
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, hydrated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
  }, [searchQuery])

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-forest-deep/95 backdrop-blur supports-[backdrop-filter]:bg-forest-deep/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="text-gold md:hidden"
          aria-label="Открыть меню"
        >
          <Menu className="size-6" />
        </button>

        <Link href="/" aria-label="YUSUF BRAND — главная">
          <YBLogo size="md" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="gold-underline whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-gold sm:gap-4">
          <button
            type="button"
            aria-label="Открыть поиск"
            onClick={() => setSearchOpen(true)}
            className="hover:text-gold-soft"
          >
            <Search className="size-5" />
          </button>
          {hydrated && user ? (
            <Link
              href="/account"
              aria-label="Аккаунт"
              className="hidden hover:text-gold-soft sm:block"
            >
              <User className="size-5" />
            </Link>
          ) : (
            <Link
              href="/auth"
              aria-label="Войти"
              className="hidden hover:text-gold-soft sm:block"
            >
              <LogIn className="size-5" />
            </Link>
          )}
          <Link
            href="/account?tab=wishlist"
            aria-label="Избранное"
            className="relative hidden hover:text-gold-soft sm:block"
          >
            <Heart className="size-5" />
            {wishCount > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-forest">
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label="Корзина"
            className="relative hover:text-gold-soft"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-forest">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search overlay with autocomplete */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-forest-deep/80 px-4 pt-24 backdrop-blur"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={submitSearch}
              className="flex w-full items-center gap-2 rounded-t-lg border border-b-0 border-gold/40 bg-forest p-2 shadow-2xl"
            >
              <Search className="ml-2 size-5 text-gold" />
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по каталогу: пальто, кеды, SKU..."
                className="flex-1 bg-transparent px-2 py-2 text-sm text-gold outline-none placeholder:text-gold/50"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Закрыть поиск"
                className="rounded-md p-2 text-gold hover:text-gold-soft"
              >
                <X className="size-5" />
              </button>
            </form>

            {suggestions.length > 0 ? (
              <ul className="rounded-b-lg border border-t-0 border-gold/40 bg-forest shadow-2xl">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug ?? p.id}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gold hover:bg-forest-deep/60"
                    >
                      <span className="font-bold">{p.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gold-soft/50">
                        {p.sku}
                      </span>
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-gold-soft/50">
                        {p.category === "men"
                          ? "Мужская"
                          : p.category === "women"
                            ? "Женская"
                            : "—"}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="block w-full rounded-b-lg border-t border-gold/20 px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-gold hover:bg-gold/10"
                  >
                    Показать все результаты →
                  </button>
                </li>
              </ul>
            ) : (
              <div className="rounded-b-lg border border-t-0 border-gold/40 bg-forest px-4 py-3 text-xs text-gold-soft/60 shadow-2xl">
                Введите название товара или артикул
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-forest-deep/80 md:hidden">
          <div className="h-full w-80 max-w-[85%] overflow-y-auto bg-forest p-6">
            <div className="mb-10 flex items-center justify-between">
              <YBLogo size="sm" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
                className="text-gold"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-2xl font-extrabold uppercase tracking-[0.15em] text-gold"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-gold/20" />
              <Link
                href={hydrated && user ? "/account" : "/auth"}
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-gold-soft"
              >
                {hydrated && user ? "Аккаунт" : "Войти"}
              </Link>
              <Link
                href="/catalog"
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-gold-soft"
              >
                Каталог
              </Link>
              <Link
                href="/delivery"
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-gold-soft"
              >
                Доставка и возврат
              </Link>
              <Link
                href="/contacts"
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-gold-soft"
              >
                Контакты
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-gold-soft"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
