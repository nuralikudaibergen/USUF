import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FaqPage } from "@/components/info/faq-page"

export const metadata = {
  title: "Частые вопросы — YUSUF BRAND",
  description: "Ответы на вопросы о доставке, оплате, возврате, размерах и аккаунте YUSUF BRAND.",
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <FaqPage />
      </main>
      <SiteFooter />
    </>
  )
}
