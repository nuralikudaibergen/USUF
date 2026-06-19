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

export type Address = {
  id: string
  label: string
  city: string
  street: string
  apartment?: string
  isDefault?: boolean
}

export type User = {
  id: string
  name: string
  phone: string
  addresses: Address[]
  isAdmin?: boolean
}

type AuthContextValue = {
  hydrated: boolean
  user: User | null
  login: (phone: string, code: string) => { ok: true; user: User } | { ok: false; error: string }
  logout: () => void
  updateUser: (patch: Partial<User>) => void
  addAddress: (addr: Omit<Address, "id">) => void
  removeAddress: (id: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const KEY = "yb-user"
const ADMIN_KEY = "yb-admin-auth"

function readUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function writeUser(user: User | null) {
  try {
    if (user) window.localStorage.setItem(KEY, JSON.stringify(user))
    else window.localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

function newId() {
  return `addr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(readUser())
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeUser(user)
    if (user?.isAdmin) {
      try {
        window.localStorage.setItem(ADMIN_KEY, "true")
      } catch {}
    } else {
      try {
        window.localStorage.removeItem(ADMIN_KEY)
      } catch {}
    }
  }, [user, hydrated])

  const login: AuthContextValue["login"] = (phone, code) => {
    const cleanPhone = phone.replace(/\D/g, "")
    if (cleanPhone.length < 7) return { ok: false, error: "Введите корректный номер" }
    if (code.length < 4) return { ok: false, error: "Введите код из SMS" }

    // Mock-авторизация: принимаем любой 4-значный код.
    // Админ: номер оканчивается на 0000.
    const isAdmin = cleanPhone.endsWith("0000")
    const u: User = {
      id: `u-${cleanPhone}`,
      name: user?.name ?? "",
      phone: `+${cleanPhone}`,
      addresses: user?.addresses ?? [],
      isAdmin,
    }
    setUser(u)
    return { ok: true, user: u }
  }

  const logout = () => setUser(null)

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const addAddress = (addr: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return prev
      const a: Address = { ...addr, id: newId() }
      return { ...prev, addresses: [...prev.addresses, a] }
    })
  }

  const removeAddress = (id: string) => {
    setUser((prev) =>
      prev
        ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }
        : prev,
    )
  }

  const value: AuthContextValue = useMemo(
    () => ({
      hydrated,
      user,
      login,
      logout,
      updateUser,
      addAddress,
      removeAddress,
    }),
    [hydrated, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
