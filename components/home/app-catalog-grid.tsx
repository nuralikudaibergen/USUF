"use client"

import { CatalogGrid } from "@/components/home/catalog-grid"
import { useAdmin } from "@/lib/admin-store"

/**
 * Обёртка: берёт товары из AdminStore (включая добавленные через админку)
 * и передаёт в CatalogGrid. Используется на страницах, где товары
 * могут меняться в админке (/catalog, /men, /women, /shoes).
 */
export function AppCatalogGrid() {
  const { products } = useAdmin()
  return <CatalogGrid products={products} />
}
