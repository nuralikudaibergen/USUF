import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CollectionPage } from "@/components/home/collection-page"

export default function WomenPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <CollectionPage
          category="women"
          href="/women"
          otherHref="/men"
          otherLabel="Мужская коллекция"
          eyebrow="Без усилий. С характером."
          title="Женская коллекция"
          tagline="Скульптурные силуэты и благородные ткани — пальто, шёлк, кашемир, кожа, обувь. Вещи, которые говорят за вас."
          image="/categories/women.png"
        />
      </main>
      <SiteFooter />
    </>
  )
}
