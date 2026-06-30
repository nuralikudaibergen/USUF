"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { promoCodes as seedPromos, type PromoCode } from "@/lib/brand-config"
import { products as seedProducts, type Product } from "@/lib/products"
import {
  deleteCategoryFromSupabase,
  deleteProductFromSupabase,
  deletePromoFromSupabase,
  fetchCategoriesFromSupabase,
  fetchProductsFromSupabase,
  fetchPromosFromSupabase,
  saveCategoryToSupabase,
  saveProductToSupabase,
  savePromoToSupabase,
} from "@/lib/supabase-store"
import { useHydrated } from "@/lib/use-hydrated"

type NewProduct = Omit<Product, "id"> & { id?: string }

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
  addProduct: (product: NewProduct) => Product
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => Promise<boolean>
  addPromo: (promo: PromoCode) => void
  deletePromo: (code: string) => void
  addCategory: (category: Omit<NavCategory, "id">) => NavCategory
  updateCategory: (id: string, patch: Partial<NavCategory>) => void
  deleteCategory: (id: string) => void
  resetToDefaults: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

const PRODUCTS_KEY = "yb-admin-products"
const PROMOS_KEY = "yb-admin-promos"
const CATEGORIES_KEY = "yb-admin-categories"

const seedCategories: NavCategory[] = [
  { id: "cat-men", slug: "men", label: "Мужская", image: "/categories/men.png", href: "/men" },
  { id: "cat-women", slug: "women", label: "Женская", image: "/categories/women.png", href: "/women" },
  { id: "cat-shoes", slug: "shoes", label: "Обувь", image: "/products/men-tshirt.png", href: "/shoes" },
  { id: "cat-sale", slug: "sale", label: "Sale", image: "/products/women-dress.png", href: "/sale" },
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
    // LocalStorage can be full when many large uploaded photos are saved.
  }
}

function nextProductId() {
  return `prod-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`
}

function nextCategoryId() {
  return `cat-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [promos, setPromos] = useState<PromoCode[]>(seedPromos)
  const [categories, setCategories] = useState<NavCategory[]>(seedCategories)

  useEffect(() => {
    setProducts(readJSON(PRODUCTS_KEY, seedProducts))
    setPromos(readJSON(PROMOS_KEY, seedPromos))
    setCategories(readJSON(CATEGORIES_KEY, seedCategories))

    let cancelled = false
    async function loadRemote() {
      const [remoteProducts, remotePromos, remoteCategories] = await Promise.all([
        fetchProductsFromSupabase(),
        fetchPromosFromSupabase(),
        fetchCategoriesFromSupabase(),
      ])
      if (cancelled) return
      if (remoteProducts && remoteProducts.length > 0) setProducts(remoteProducts)
      if (remotePromos && remotePromos.length > 0) setPromos(remotePromos)
      if (remoteCategories && remoteCategories.length > 0) setCategories(remoteCategories)
    }
    loadRemote()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (hydrated) writeJSON(PRODUCTS_KEY, products)
  }, [products, hydrated])

  useEffect(() => {
    if (hydrated) writeJSON(PROMOS_KEY, promos)
  }, [promos, hydrated])

  useEffect(() => {
    if (hydrated) writeJSON(CATEGORIES_KEY, categories)
  }, [categories, hydrated])

  const addProduct = (productDraft: NewProduct): Product => {
    const product: Product = {
      ...(productDraft as Product),
      id: productDraft.id ?? nextProductId(),
    }
    setProducts((prev) => [product, ...prev])
    saveProductToSupabase(product).then((saved) => {
      if (!saved) return
      setProducts((prev) => prev.map((item) => (item.id === product.id ? saved : item)))
    })
    return product
  }

  const updateProduct = (id: string, patch: Partial<Product>) => {
    let nextProduct: Product | null = null
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product
        nextProduct = { ...product, ...patch }
        return nextProduct
      }),
    )
    queueMicrotask(() => {
      if (nextProduct) saveProductToSupabase(nextProduct)
    })
  }

  const deleteProduct = async (id: string) => {
    const product = products.find((item) => item.id === id)
    setProducts((prev) => prev.filter((product) => product.id !== id))
    const deleted = await deleteProductFromSupabase(product ?? id)
    if (!deleted && product) {
      setProducts((prev) => (prev.some((item) => item.id === id) ? prev : [product, ...prev]))
    }
    return deleted
  }

  const addPromo = (promo: PromoCode) => {
    setPromos((prev) => [promo, ...prev.filter((item) => item.code !== promo.code)])
    savePromoToSupabase(promo)
  }

  const deletePromo = (code: string) => {
    setPromos((prev) => prev.filter((promo) => promo.code !== code))
    deletePromoFromSupabase(code)
  }

  const addCategory = (categoryDraft: Omit<NavCategory, "id">): NavCategory => {
    const category: NavCategory = { ...categoryDraft, id: nextCategoryId() }
    setCategories((prev) => [category, ...prev])
    saveCategoryToSupabase(category).then((saved) => {
      if (!saved) return
      setCategories((prev) => prev.map((item) => (item.id === category.id ? saved : item)))
    })
    return category
  }

  const updateCategory = (id: string, patch: Partial<NavCategory>) => {
    let nextCategory: NavCategory | null = null
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== id) return category
        nextCategory = { ...category, ...patch }
        return nextCategory
      }),
    )
    queueMicrotask(() => {
      if (nextCategory) saveCategoryToSupabase(nextCategory)
    })
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id))
    deleteCategoryFromSupabase(id)
  }

  const resetToDefaults = () => {
    setProducts(seedProducts)
    setPromos(seedPromos)
    setCategories(seedCategories)
    seedProducts.forEach((product) => saveProductToSupabase(product))
    seedPromos.forEach((promo) => savePromoToSupabase(promo))
    seedCategories.forEach((category) => saveCategoryToSupabase(category))
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
