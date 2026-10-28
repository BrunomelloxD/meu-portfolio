"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "motion/react"

/** Honors prefers-reduced-motion everywhere: Motion drops transform/layout and keeps opacity. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
