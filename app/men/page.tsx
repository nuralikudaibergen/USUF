import { CollectionPage } from "@/components/home/collection-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function MenPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <CollectionPage
          category="men"
          otherHref="/women"
          otherLabel="Женская коллекция"
          eyebrow="Для современного мужчины"
          title="Мужская коллекция"
          tagline="Базовые вещи, smart casual и акценты для уверенного повседневного образа."
          image="/categories/men.png"
        />
      </main>
      <SiteFooter />
    </>
  )
}
