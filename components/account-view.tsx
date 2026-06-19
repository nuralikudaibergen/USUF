"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Heart,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Trash2,
  User as UserIcon,
} from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"
import { useAdmin } from "@/lib/admin-store"
import { products } from "@/lib/products"
import { brandConfig } from "@/lib/brand-config"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import type { Address } from "@/lib/auth-context"

type Tab = "orders" | "wishlist" | "profile"

export function AccountView({
  activeTab,
}: {
  activeTab: "orders" | "wishlist" | "profile"
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>(activeTab)
  const wishlist = useWishlist()
  const { user, hydrated, logout, updateUser, addAddress, removeAddress } = useAuth()
  const { products: adminProducts } = useAdmin()

  // Show login CTA while hydrating or when unauthenticated
  if (!hydrated) {
    return (
      <div className="mt-8 h-40 rounded-lg border border-dashed border-gold/20" />
    )
  }

  if (!user) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-gold/20 bg-forest-deep/40 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-forest">
          <UserIcon className="size-7 text-gold" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-extrabold uppercase tracking-[0.2em] text-gold">
          Вы не вошли
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gold-soft/70">
          Войдите по номеру телефона, чтобы увидеть заказы, избранное и сохранить адреса доставки.
        </p>
        <Link
          href="/auth"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.25em] text-forest"
        >
          Войти
        </Link>
      </div>
    )
  }

  // Merge admin-edited products on top of seed, so favorites from edited catalog still resolve.
  const productMap = new Map(products.map((p) => [p.id, p]))
  for (const p of adminProducts) productMap.set(p.id, p)
  const wishlistProducts = user
    ? wishlist.ids
        .map((id) => productMap.get(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : []

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <div className="mb-4 rounded-lg border border-gold/20 bg-forest-deep/40 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft/60">
            Вход выполнен
          </p>
          <p className="mt-1 truncate font-bold text-gold">{user.phone}</p>
          {user.isAdmin && (
            <span className="mt-1 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
              Админ
            </span>
          )}
        </div>

        <Button
          variant={tab === "orders" ? "secondary" : "ghost"}
          className="w-full justify-start text-gold hover:text-gold"
          onClick={() => setTab("orders")}
        >
          <Package className="size-4" /> Заказы
        </Button>
        <Button
          variant={tab === "wishlist" ? "secondary" : "ghost"}
          className="w-full justify-start text-gold hover:text-gold"
          onClick={() => setTab("wishlist")}
        >
          <Heart className="size-4" /> Избранное
          {wishlist.count > 0 && (
            <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-forest">
              {wishlist.count}
            </span>
          )}
        </Button>
        <Button
          variant={tab === "profile" ? "secondary" : "ghost"}
          className="w-full justify-start text-gold hover:text-gold"
          onClick={() => setTab("profile")}
        >
          <UserIcon className="size-4" /> Профиль
        </Button>

        {user.isAdmin && (
          <Link
            href="/admin"
            className="mt-2 flex w-full items-center justify-start gap-2 rounded-md border border-gold/30 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold hover:bg-gold/10"
          >
            <Package className="size-4" /> Админ-панель
          </Link>
        )}

        <button
          onClick={() => {
            logout()
            router.replace("/")
          }}
          className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-soft/70 hover:text-gold"
        >
          <LogOut className="size-4" /> Выйти
        </button>
      </aside>

      <section>
        {tab === "orders" && (
          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-[0.15em] text-gold">
              История заказов
            </h2>
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gold/30 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30">
                <MessageCircle className="size-6 text-gold" />
              </div>
              <p className="mt-4 font-bold text-gold">Все заказы — в WhatsApp</p>
              <p className="mt-1 max-w-sm text-sm text-gold-soft/70">
                Оформление и история заказов ведутся в чате с менеджером — там же
                согласуем доставку и оплату (Kaspi / наличные).
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${brandConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] transition-all hover:shadow-[0_12px_32px_-6px_rgba(37,211,102,0.8)]"
                >
                  <MessageCircle className="size-4" /> Открыть WhatsApp
                </a>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-gold hover:bg-gold/10"
                >
                  В каталог
                </Link>
              </div>
            </div>
          </div>
        )}

        {tab === "wishlist" && (
          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold uppercase tracking-[0.15em] text-gold">
                  Избранное
                </h2>
                <p className="mt-1 text-sm text-gold-soft/70">
                  Сохранено {wishlist.count}{" "}
                  {wishlist.count === 1 ? "товар" : "товаров"}
                </p>
              </div>
              {wishlistProducts.length > 0 && (
                <button
                  onClick={wishlist.clear}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-soft hover:text-gold"
                >
                  <Trash2 className="size-3.5" /> Очистить
                </button>
              )}
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gold/30 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30">
                  <Heart className="size-6 text-gold" />
                </div>
                <p className="mt-4 font-bold text-gold">В избранном пусто</p>
                <p className="mt-1 max-w-sm text-sm text-gold-soft/70">
                  Нажмите на сердечко на любом товаре, чтобы сохранить его.
                </p>
                <Link
                  href="/catalog"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
                >
                  Открыть каталог
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <ProfileTab
            name={user.name}
            phone={user.phone}
            addresses={user.addresses}
            onSaveName={(name) => updateUser({ name })}
            onAddAddress={addAddress}
            onRemoveAddress={removeAddress}
          />
        )}
      </section>
    </div>
  )
}

function ProfileTab({
  name,
  phone,
  addresses,
  onSaveName,
  onAddAddress,
  onRemoveAddress,
}: {
  name: string
  phone: string
  addresses: Address[]
  onSaveName: (name: string) => void
  onAddAddress: (a: Omit<Address, "id">) => void
  onRemoveAddress: (id: string) => void
}) {
  const [draft, setDraft] = useState(name)
  const [saved, setSaved] = useState(false)

  const [showAddr, setShowAddr] = useState(false)
  const [label, setLabel] = useState("Дом")
  const [city, setCity] = useState("Туркестан")
  const [street, setStreet] = useState("")
  const [apartment, setApartment] = useState("")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-bold uppercase tracking-[0.15em] text-gold">
          Профиль
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gold-soft/80">
              Имя
            </label>
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                setSaved(false)
              }}
              className="w-full rounded-lg border border-gold/30 bg-forest-deep/40 px-3 py-2.5 text-sm text-gold outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gold-soft/80">
              Телефон
            </label>
            <input
              value={phone}
              readOnly
              className="w-full rounded-lg border border-gold/20 bg-forest-deep/20 px-3 py-2.5 text-sm text-gold-soft/70 outline-none"
            />
          </div>
        </div>
        <button
          onClick={() => {
            onSaveName(draft.trim())
            setSaved(true)
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
        >
          Сохранить
        </button>
        {saved && (
          <p className="mt-2 text-xs text-gold-soft/70">Имя сохранено.</p>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-end justify-between">
          <h3 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
            Адреса доставки
          </h3>
          <button
            onClick={() => setShowAddr((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold hover:text-gold-soft"
          >
            <Plus className="size-3.5" /> Добавить
          </button>
        </div>

        {showAddr && (
          <div className="mb-4 grid gap-3 rounded-lg border border-gold/20 bg-forest-deep/30 p-4 sm:grid-cols-4">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Метка (Дом, Офис)"
              className="rounded border border-gold/20 bg-forest-deep/40 px-2.5 py-2 text-sm text-gold outline-none focus:border-gold"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Город"
              className="rounded border border-gold/20 bg-forest-deep/40 px-2.5 py-2 text-sm text-gold outline-none focus:border-gold"
            />
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Улица, дом"
              className="rounded border border-gold/20 bg-forest-deep/40 px-2.5 py-2 text-sm text-gold outline-none focus:border-gold"
            />
            <input
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="Кв./офис"
              className="rounded border border-gold/20 bg-forest-deep/40 px-2.5 py-2 text-sm text-gold outline-none focus:border-gold"
            />
            <div className="sm:col-span-4">
              <button
                onClick={() => {
                  if (!street.trim()) return
                  onAddAddress({
                    label: label.trim() || "Адрес",
                    city: city.trim() || "Туркестан",
                    street: street.trim(),
                    apartment: apartment.trim() || undefined,
                    isDefault: addresses.length === 0,
                  })
                  setStreet("")
                  setApartment("")
                  setShowAddr(false)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 font-heading text-[11px] font-extrabold uppercase tracking-[0.2em] text-forest"
              >
                Сохранить адрес
              </button>
            </div>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gold/20 p-6 text-center text-sm text-gold-soft/60">
            У вас пока нет сохранённых адресов.
          </div>
        ) : (
          <ul className="space-y-2">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-gold/20 bg-forest-deep/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 text-gold" />
                  <div>
                    <p className="text-sm font-bold text-gold">
                      {a.label}
                      {a.isDefault && (
                        <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold">
                          По умолчанию
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gold-soft/80">
                      {a.city}, {a.street}
                      {a.apartment ? `, ${a.apartment}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveAddress(a.id)}
                  className="text-gold-soft/60 hover:text-red-400"
                  aria-label="Удалить адрес"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
