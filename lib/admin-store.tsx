"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { products as seedProducts, type Product } from "@/lib/products"
import { promoCodes as seedPromos, type PromoCode } from "@/lib/brand-config"
import { useHydrated } from "@/lib/use-hydrated"

type NewProduct = Omit<Product, "id"> & { id?: string }

/**
 * Навигационная категория для шапки / каталога / главной.
 * Отличается от Product.category (пол) — это именно раздел магазина.
 */
export type NavCategory = {
  id: string
  slug: string
  label: string
  image: string
  href: string
}

type AdminContextValue = {
  hydrated: boolean
  products: Product[]
  promos: PromoCode[]
  categories: NavCategory[]
  addProduct: (p: NewProduct) => Product
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addPromo: (p: PromoCode) => void
  deletePromo: (code: string) => void
  addCategory: (c: Omit<NavCategory, "id">) => NavCategory
  updateCategory: (id: string, patch: Partial<NavCategory>) => void
  deleteCategory: (id: string) => void
  resetToDefaults: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

const PRODUCTS_KEY = "yb-admin-products"
const PROMOS_KEY = "yb-admin-promos"
const CATEGORIES_KEY = "yb-admin-categories"

const seedCategories: NavCategory[] = [
  {
    id: "cat-men",
    slug: "men",
    label: "Мужская",
    image: "/categories/men.png",
    href: "/men",
  },
  {
    id: "cat-women",
    slug: "women",
    label: "Женская",
    image: "/categories/women.png",
    href: "/women",
  },
  {
    id: "cat-shoes",
    slug: "shoes",
    label: "Обувь",
    image: "/categories/shoes.png",
    href: "/shoes",
  },
  {
    id: "cat-sale",
    slug: "sale",
    label: "Распродажа",
    image: "/categories/sale.png",
    href: "/sale",
  },
]

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

function nextId(existing: Product[]): string {
  return `prod-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [promos, setPromos] = useState<PromoCode[]>(seedPromos)
  const [categories, setCategories] = useState<NavCategory[]>(seedCategories)

  // Load from localStorage on mount.
  useEffect(() => {
    setProducts(readJSON(PRODUCTS_KEY, seedProducts))
    setPromos(readJSON(PROMOS_KEY, seedPromos))
    setCategories(readJSON(CATEGORIES_KEY, seedCategories))
  }, [])

  // Persist products.
  useEffect(() => {
    if (!hydrated) return
    writeJSON(PRODUCTS_KEY, products)
  }, [products, hydrated])

  // Persist promos.
  useEffect(() => {
    if (!hydrated) return
    writeJSON(PROMOS_KEY, promos)
  }, [promos, hydrated])

  // Persist categories.
  useEffect(() => {
    if (!hydrated) return
    writeJSON(CATEGORIES_KEY, categories)
  }, [categories, hydrated])

  const addProduct = (p: NewProduct): Product => {
    const id = p.id ?? nextId(products)
    const product: Product = { ...(p as Product), id }
    setProducts((prev) => [product, ...prev])
    return product
  }

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addPromo = (p: PromoCode) => {
    setPromos((prev) => [p, ...prev.filter((x) => x.code !== p.code)])
  }

  const deletePromo = (code: string) => {
    setPromos((prev) => prev.filter((p) => p.code !== code))
  }

  const addCategory = (c: Omit<NavCategory, "id">): NavCategory => {
    const id = `cat-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`
    const next: NavCategory = { ...c, id }
    setCategories((prev) => [next, ...prev])
    return next
  }

  const updateCategory = (id: string, patch: Partial<NavCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    )
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const resetToDefaults = () => {
    setProducts(seedProducts)
    setPromos(seedPromos)
    setCategories(seedCategories)
  }

  const value: AdminContextValue = useMemo(
    () => ({
      hydrated,
      products,
      promos,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addPromo,
      deletePromo,
      addCategory,
      updateCategory,
      deleteCategory,
      resetToDefaults,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, products, promos, categories],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}
