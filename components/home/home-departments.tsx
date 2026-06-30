"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useAdmin } from "@/lib/admin-store"

export function HomeDepartments() {
  const { categories } = useAdmin()

  return (
    <section className="bg-forest-deep py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center md:mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.32em] text-gold">
            Разделы
          </span>
          <h2 className="mt-3 font-heading text-2xl font-black uppercase text-gold sm:text-3xl md:text-4xl">
            Выберите свой раздел
          </h2>
          <div className="mx-auto mt-4 h-px w-20 bg-gold" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="gold-glow group relative aspect-[16/11] min-h-[150px] cursor-pointer overflow-hidden rounded-md border border-gold/20 bg-forest"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/46 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-soft">
                  Коллекция
                </span>
                <h3 className="mt-2 font-heading text-2xl font-black uppercase text-gold sm:text-3xl">
                  {category.label}
                </h3>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gold">
                  Смотреть
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
