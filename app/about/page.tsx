import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AboutPageContent } from "@/components/home/about-page"

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AboutPageContent />
      </main>
      <SiteFooter />
    </>
  )
}
