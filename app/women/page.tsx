import { CollectionPage } from "@/components/home/collection-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function WomenPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <CollectionPage
          category="women"
          otherHref="/men"
          otherLabel="Мужская коллекция"
          eyebrow="Без усилий. С характером."
          title="Женская коллекция"
          tagline="Лаконичные силуэты, сезонные фактуры и вещи, которые легко собрать в образ."
          image="/categories/women.png"
        />
      </main>
      <SiteFooter />
    </>
  )
}
