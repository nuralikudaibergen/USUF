"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useAdmin } from "@/lib/admin-store"
import type { Product } from "@/lib/products"
import { useHydrated } from "@/lib/use-hydrated"

export type CartItem = {
  productId: string
  size: string
  color: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  hydrated: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void
  clear: () => void
  count: number
  subtotal: number
  detailed: { item: CartItem; product: Product }[]
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "mavi-cart"

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useAdmin()
  const [items, setItems] = useState<CartItem[]>([])
  const hydrated = useHydrated()

  // Hydrate from localStorage once on the client.
  useEffect(() => {
    setItems(readStorage())
  }, [])

  // Persist on changes (only after hydration to avoid clobbering storage).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota / disabled storage
    }
  }, [items, hydrated])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color === item.color,
      )
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.productId === productId && i.size === size && i.color === color),
      ),
    )
  }

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeItem(productId, size, color)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i,
      ),
    )
  }

  const clear = () => setItems([])

  const detailed = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          return product ? { item, product } : null
        })
        .filter((x): x is { item: CartItem; product: Product } => x !== null),
    [items],
  )

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () =>
      detailed.reduce(
        (sum, { item, product }) => sum + product.price * item.quantity,
        0,
      ),
    [detailed],
  )

  const value: CartContextValue = {
    items,
    hydrated,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    count,
    subtotal,
    detailed,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
