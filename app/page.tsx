import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/home/hero"
import { HomeDepartments } from "@/components/home/home-departments"
import { PopularProducts } from "@/components/home/popular-products"
import { SaleBanner } from "@/components/home/sale-banner"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <SaleBanner />
        <PopularProducts />
        <HomeDepartments />
      </main>
      <SiteFooter />
    </>
  )
}
