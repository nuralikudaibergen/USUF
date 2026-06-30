import { ShoesPage } from "@/components/home/shoes-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Обувь - YUSUF BRAND",
  description:
    "Коллекция обуви YUSUF BRAND: повседневные пары, кеды и модели для завершённого образа.",
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <ShoesPage />
      </main>
      <SiteFooter />
    </>
  )
}
