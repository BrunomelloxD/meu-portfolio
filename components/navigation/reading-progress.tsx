"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react"
import { spring } from "@/lib/motion"

/** Reading progress bar along the bottom edge of the sticky header. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, spring.scroll)
  const reduced = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : smooth, originX: 0 }}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-accent"
    />
  )
}
