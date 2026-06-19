import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/home/hero"
import { BrandPromise } from "@/components/home/brand-promise"
import { SaleBanner } from "@/components/home/sale-banner"
import { PopularProducts } from "@/components/home/popular-products"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const departmentLinks = [
  {
    href: "/men",
    title: "Мужская",
    tagline: "Пальто, сорочки, кожа, обувь",
    image: "/categories/men.png",
  },
  {
    href: "/women",
    title: "Женская",
    tagline: "Шёлк, кашемир, кожа, обувь",
    image: "/categories/women.png",
  },
  {
    href: "/shoes",
    title: "Обувь",
    tagline: "Кеды, лодочки, кожа, итальянское качество",
    image: "/categories/shoes.png",
  },
  {
    href: "/sale",
    title: "Распродажа",
    tagline: "Сезонные скидки до 40%",
    image: "/categories/sale.png",
  },
]

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BrandPromise />
        <SaleBanner />
        <PopularProducts />

        {/* Departments */}
        <section className="bg-forest-deep py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
                Отделы
              </span>
              <h2 className="mt-3 font-heading text-3xl font-black uppercase text-gold md:text-4xl">
                Выберите свой раздел
              </h2>
              <div className="mx-auto mt-5 h-px w-24 bg-gold" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {departmentLinks.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="group relative aspect-[16/10] overflow-hidden rounded-md border border-gold/20 gold-glow"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${d.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold-soft">
                      Коллекция
                    </span>
                    <h3 className="mt-2 font-heading text-3xl font-black uppercase text-gold md:text-4xl">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-sm text-gold-soft/85">{d.tagline}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gold">
                      Смотреть
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
