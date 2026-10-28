"use client"

import { useEffect, type RefObject } from "react"
import { useMotionValue, useSpring } from "motion/react"
import { magnet } from "@/lib/kinetics"
import { spring } from "@/lib/motion"

/**
 * Magnetic pull toward the pointer (E5): returns spring-smoothed x/y to put on the element's style.
 * Listens only while `enabled` (fine pointer, no reduced motion); otherwise the offset stays at 0.
 */
export function useMagnet(ref: RefObject<HTMLElement | null>, max: number, enabled: boolean) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, spring.magnetic)
  const sy = useSpring(y, spring.magnetic)

  useEffect(() => {
    if (!enabled) {
      x.set(0)
      y.set(0)
      return
    }
    const onMove = (event: PointerEvent) => {
      const el = ref.current
      if (!el) return
      // The box is measured where the element rests, not where the pull has moved it.
      const r = el.getBoundingClientRect()
      const box = { left: r.left - x.get(), top: r.top - y.get(), width: r.width, height: r.height }
      const pull = magnet({ x: event.clientX, y: event.clientY }, box, max)
      x.set(pull.x)
      y.set(pull.y)
    }
    const onLeave = () => {
      x.set(0)
      y.set(0)
    }
    window.addEventListener("pointermove", onMove)
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [enabled, max, ref, x, y])

  return { x: sx, y: sy }
}
