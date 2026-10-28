"use client"

import { useEffect, useState } from "react"

export const DESKTOP_QUERY = "(min-width: 1024px)"
export const POINTER_FINE_QUERY = "(hover: hover) and (pointer: fine)"

/** False on the server and on the first client render (no hydration mismatch), then follows the query. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)
    update()
    list.addEventListener("change", update)
    return () => list.removeEventListener("change", update)
  }, [query])
  return matches
}

/** True at >= 1024px. */
export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY)

/** True for a mouse or trackpad: the gate for magnetism and the project hover. */
export const usePointerFine = () => useMediaQuery(POINTER_FINE_QUERY)
