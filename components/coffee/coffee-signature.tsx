"use client"

import { motion, useReducedMotion } from "motion/react"
import { REVEAL_VIEWPORT, tween } from "@/lib/motion"

const STEAM = [
  "M40 50 C34 42 46 36 40 28 C34 20 46 14 40 6",
  "M58 50 C52 42 64 36 58 28 C52 20 64 14 58 6",
  "M76 50 C70 42 82 36 76 28 C70 20 82 14 76 6",
]

interface CoffeeSignatureProps {
  /** Goes up on each successful copy; every new value redraws the steam once (PIX-38). */
  redraw: number
  className?: string
}

/** The cup whose steam draws itself in when the section shows up (PIX-36, PIX-37); still under reduced motion (PIX-39). */
export function CoffeeSignature({ redraw, className }: CoffeeSignatureProps) {
  const reduced = !!useReducedMotion()
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 124 140"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <g opacity={0.7} className="stroke-accent">
        {STEAM.map((d, i) =>
          reduced ? (
            <path key={d} d={d} data-steam="" />
          ) : redraw > 0 ? (
            <motion.path
              key={`${d}-${redraw}`}
              d={d}
              data-steam=""
              animate={{ pathLength: [0, 1] }}
              transition={tween("slow", "soft")}
            />
          ) : (
            <motion.path
              key={d}
              d={d}
              data-steam=""
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ ...tween("hero", "soft"), delay: i * 0.12 }}
            />
          ),
        )}
      </g>
      <g className="stroke-ink-soft">
        <path data-part="cup" d="M20 60 L20 104 C20 116 30 124 42 124 L74 124 C86 124 96 116 96 104 L96 60 Z" />
        <path d="M96 72 L104 72 C113 72 118 78 118 86 C118 94 113 100 104 100 L96 100" />
        <path data-part="saucer" d="M4 134 L112 134" />
      </g>
    </svg>
  )
}
