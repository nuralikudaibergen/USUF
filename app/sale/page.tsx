import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SalePageContent } from "@/components/home/sale-page"

export default function SalePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <SalePageContent />
      </main>
      <SiteFooter />
    </>
  )
}
