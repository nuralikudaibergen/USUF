import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CollectionPage } from "@/components/home/collection-page"

export default function MenPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <CollectionPage
          category="men"
          href="/men"
          otherHref="/women"
          otherLabel="Женская коллекция"
          eyebrow="Для современного мужчины"
          title="Мужская коллекция"
          tagline="Базовые вещи и яркие акценты — от деловой встречи до вечерней прогулки. Пальто, сорочки, кожа, обувь."
          image="/categories/men.png"
        />
      </main>
      <SiteFooter />
    </>
  )
}
