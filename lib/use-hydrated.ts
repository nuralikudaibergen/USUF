"use client"

import { useEffect, useState } from "react"

/**
 * Returns `true` once the component has mounted on the client.
 * Use to avoid SSR/CSR mismatches when reading from `localStorage`, `window`, etc.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
