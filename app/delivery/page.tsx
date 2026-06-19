import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DeliveryPage } from "@/components/info/delivery-page"

export const metadata = {
  title: "Доставка и возврат — YUSUF BRAND",
  description:
    "Доставка, оплата и возврат в YUSUF BRAND. Курьер по Туркестану, Казпочта по РК, бесплатно от 100 000 ₸.",
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <DeliveryPage />
      </main>
      <SiteFooter />
    </>
  )
}
