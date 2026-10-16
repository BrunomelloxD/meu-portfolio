"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
}

/**
 * Section entrance: rises 24px and fades in once, when scrolled into view.
 * Server HTML and no-JS visitors get the content visible; the hidden state is only set after mount
 * and never under prefers-reduced-motion.
 */
export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle")

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    setState("hidden")
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("shown")
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={state === "idle" ? undefined : state}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out-strong data-[reveal=hidden]:translate-y-6 data-[reveal=hidden]:opacity-0",
        className,
      )}
    >
      {children}
    </div>
  )
}
