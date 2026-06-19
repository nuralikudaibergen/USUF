import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchPage } from "@/components/home/search-page"

export const metadata = {
  title: "Поиск — YUSUF BRAND",
  description: "Поиск по каталогу YUSUF BRAND.",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <SearchPage initialQuery={q ?? ""} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  )
}
