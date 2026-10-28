"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { REVEAL_VIEWPORT, revealGroup, revealItem } from "@/lib/motion"

interface RevealProps {
  children: ReactNode
  className?: string
}

interface RevealContextValue {
  armed: boolean
  register: () => void
}

const RevealContext = createContext<RevealContextValue | null>(null)

// No values, so the server writes no inline style; still a variant node, so it joins the stagger.
const IDLE: Variants = { hidden: {}, show: {} }

// Matches REVEAL_VIEWPORT.margin: the trigger line sits 10% above the bottom edge.
const TRIGGER_LINE = 0.9

/**
 * Section entrance: items rise 16px and fade in once, 70ms apart, when the block scrolls into view.
 * Server HTML and no-JS visitors get the content visible: no hidden state, and no inline style, until mount.
 */
export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasItems = useRef(false)
  const [mode, setMode] = useState<"idle" | "group" | "self">("idle")
  const reduced = !!useReducedMotion()

  // Children effects run first, so every RevealItem has registered by the time this one runs.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    // SPEC_DEVIATION: approach A arms every block, but whileInView only turns on after the
    // IntersectionObserver's first (async) callback, so a block already on screen would blink to
    // opacity 0 and replay (MOV-15). Only blocks still below the trigger line get armed.
    if (el.getBoundingClientRect().top < window.innerHeight * TRIGGER_LINE) return
    // Without RevealItem children the block animates itself, as a single item.
    setMode(hasItems.current ? "group" : "self")
  }, [])

  const register = useCallback(() => {
    hasItems.current = true
  }, [])
  const armed = mode !== "idle"
  const context = useMemo(() => ({ armed, register }), [armed, register])

  return (
    <RevealContext value={context}>
      <motion.div
        ref={ref}
        className={className}
        variants={mode === "self" ? revealItem(reduced) : revealGroup(reduced)}
        initial={false}
        animate={armed ? "hidden" : "show"}
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
      >
        {children}
      </motion.div>
    </RevealContext>
  )
}

/** One step of a Reveal's stagger. Items start in DOM order. */
export function RevealItem({ children, className }: RevealProps) {
  const context = useContext(RevealContext)
  const reduced = !!useReducedMotion()
  const register = context?.register

  useEffect(() => {
    register?.()
  }, [register])

  return (
    <motion.div className={className} variants={context?.armed ? revealItem(reduced) : IDLE}>
      {children}
    </motion.div>
  )
}
