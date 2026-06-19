import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { YBLogo } from "@/components/yb-logo"

export const metadata = {
  title: "Страница не найдена — YUSUF BRAND",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-forest-deep">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <YBLogo size="xl" withText={false} />
          <p className="mt-6 font-heading text-7xl font-black uppercase text-gold md:text-8xl">
            404
          </p>
          <h1 className="mt-3 font-heading text-2xl font-bold uppercase tracking-[0.2em] text-gold md:text-3xl">
            Страница не найдена
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-gold-soft/80">
            Похоже, такой страницы нет — или она переехала. Вернитесь на главную или
            посмотрите каталог.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-forest"
            >
              На главную <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-7 py-3.5 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-gold hover:bg-gold/10"
            >
              В каталог
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
