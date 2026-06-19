import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactsPage } from "@/components/info/contacts-page"

export const metadata = {
  title: "Контакты — YUSUF BRAND",
  description: "Контакты YUSUF BRAND: WhatsApp, телефон, email, Instagram и адрес шоурума.",
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <ContactsPage />
      </main>
      <SiteFooter />
    </>
  )
}
