"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { usePointerFine } from "@/hooks/useMediaQuery"
import { spring, tween } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Mode = "dot" | "link" | "ver" | "field"

const SCALE: Record<Mode, number> = { dot: 1, link: 4, ver: 8.8, field: 1 }

/** What the pointer is over. Text fields keep the system cursor; a link inside a project is still a link. */
export function cursorMode(target: Element | null): Mode {
  if (!target) return "dot"
  if (target.closest("input, textarea, select, [contenteditable]")) return "field"
  if (target.closest('a, button, [role="button"]')) return "link"
  if (target.closest('[data-cursor="ver"]')) return "ver"
  return "dot"
}

function Cursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const x = useSpring(mouseX, spring.cursor)
  const y = useSpring(mouseY, spring.cursor)
  const [mode, setMode] = useState<Mode>("dot")
  const [inside, setInside] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add("has-custom-cursor")
    const onMove = (event: PointerEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setInside(true)
      setMode(cursorMode(event.target as Element | null))
    }
    const onLeave = () => setInside(false)
    window.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    return () => {
      root.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
    }
  }, [mouseX, mouseY])

  const shown = inside && mode !== "field"
  return (
    <motion.div aria-hidden="true" data-custom-cursor className="pointer-events-none fixed left-0 top-0 z-[60]" style={{ x, y }}>
      <motion.div
        data-dot
        className={cn(
          "absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rounded-full",
          mode === "ver" ? "bg-accent" : "bg-ink mix-blend-difference",
        )}
        animate={{ scale: SCALE[mode], opacity: shown ? 1 : 0 }}
        transition={spring.cursor}
      />
      <motion.span
        data-label
        className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[13px] font-medium text-inverse-ink"
        animate={{ opacity: shown && mode === "ver" ? 1 : 0 }}
        transition={tween("fast")}
      >
        ver
      </motion.span>
    </motion.div>
  )
}

/** A precise dot that grows over links and invites a look over the projects (E4). Mouse only, no reduced motion. */
export function CustomCursor() {
  const fine = usePointerFine()
  const reduced = !!useReducedMotion()
  if (!fine || reduced) return null
  return <Cursor />
}
