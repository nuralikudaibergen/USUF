"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useHydrated } from "@/lib/use-hydrated"

type WishlistContextValue = {
  ids: string[]
  hydrated: boolean
  has: (id: string) => boolean
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  count: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

const STORAGE_KEY = "mavi-wishlist"

function readStorage(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const hydrated = useHydrated()

  useEffect(() => {
    setIds(readStorage())
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // ignore
    }
  }, [ids, hydrated])

  const has = (id: string) => ids.includes(id)

  const add = (id: string) =>
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

  const remove = (id: string) =>
    setIds((prev) => prev.filter((x) => x !== id))

  const toggle = (id: string) =>
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const clear = () => setIds([])

  const count = useMemo(() => ids.length, [ids])

  return (
    <WishlistContext.Provider
      value={{ ids, hydrated, has, add, remove, toggle, clear, count }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
