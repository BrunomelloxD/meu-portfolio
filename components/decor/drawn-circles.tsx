"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { ease } from "@/lib/motion"

// Thin outline circles from the inspiration, now drawn like a technical sketch (E8). Positions are relative to
// <main>, which starts under the 72px (96px from md) nav.
const TOP = "pointer-events-none absolute -top-[222px] left-[200px] h-[360px] w-[360px] md:-top-[346px] md:left-auto md:right-[-190px] md:h-[620px] md:w-[620px]"
const LOWER = "pointer-events-none absolute right-[-380px] top-[1464px] hidden h-[760px] w-[760px] lg:block"

const ring = { cx: 50, cy: 50, r: 49.5, fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const

export function DrawnCircles() {
  const lowerRef = useRef<HTMLDivElement>(null)
  const reduced = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: lowerRef, offset: ["start end", "center center"] })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <>
      <svg aria-hidden="true" data-circle="top" viewBox="0 0 100 100" className={`${TOP} text-line`}>
        {reduced ? (
          <circle {...ring} />
        ) : (
          <motion.circle
            {...ring}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: ease.soft, delay: 0.3 }}
          />
        )}
      </svg>
      <div ref={lowerRef} aria-hidden="true" data-circle="lower" className={`${LOWER} text-line`}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {reduced ? <circle {...ring} /> : <motion.circle {...ring} style={{ pathLength }} />}
        </svg>
      </div>
    </>
  )
}
