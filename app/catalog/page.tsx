import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AppCatalogGrid } from "@/components/home/app-catalog-grid"

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AppCatalogGrid />
      </main>
      <SiteFooter />
    </>
  )
}
