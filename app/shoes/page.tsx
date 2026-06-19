import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShoesPage } from "@/components/home/shoes-page"

export const metadata = {
  title: "Обувь — YUSUF BRAND",
  description: "Коллекция обуви YUSUF BRAND: кожаные кеды, лодочки и другая премиальная обувь.",
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
