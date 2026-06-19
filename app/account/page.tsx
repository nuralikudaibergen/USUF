import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountView } from "@/components/account-view"

export const metadata = {
  title: "Личный кабинет — YUSUF BRAND",
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab: "orders" | "wishlist" | "profile" =
    tab === "wishlist" ? "wishlist" : tab === "profile" ? "profile" : "orders"

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gold-soft/70">
          <Link href="/" className="hover:text-gold">
            Главная
          </Link>
          <span>/</span>
          <span className="font-medium text-gold">Кабинет</span>
        </nav>

        <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-gold md:text-4xl">
          Личный кабинет
        </h1>
        <p className="mt-2 text-sm text-gold-soft/70">
          Заказы, избранное и ваш профиль.
        </p>

        <AccountView activeTab={activeTab} />
      </main>
      <SiteFooter />
    </div>
  )
}
