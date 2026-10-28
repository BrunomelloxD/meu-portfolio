"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { animate, motion, useInView, useReducedMotion } from "motion/react"
import { ease, tween } from "@/lib/motion"
import { parseStat } from "@/lib/text-motion"
import { cn } from "@/lib/utils"

// Same trigger line as Reveal: a figure already above it on mount is shown as is.
const TRIGGER_LINE = 0.9
const COUNT_DURATION = 1.4

interface CounterProps {
  value: string
  className?: string
}

/** The "+" of a stat in gold; it pulses once when a count has just finished. */
function Sign({ text, pulse }: { text: string; pulse: boolean }): ReactNode {
  if (!text.includes("+")) return text
  const [before, after] = text.split("+")
  return (
    <>
      {before}
      <motion.span
        data-sign
        className="inline-block text-accent"
        animate={pulse ? { scale: [1, 1.15, 1] } : undefined}
        transition={tween("base")}
      >
        +
      </motion.span>
      {after}
    </>
  )
}

/**
 * A stat that counts up from 0 once when it scrolls into view (E9). Server HTML, no-JS and reduced motion
 * get the final value; screen readers always read the final text.
 */
export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const stat = parseStat(value)
  const reduced = !!useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [armed, setArmed] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el && el.getBoundingClientRect().top >= window.innerHeight * TRIGGER_LINE) setArmed(true)
  }, [])

  const target = stat?.value
  useEffect(() => {
    if (!armed || !inView || reduced || target === undefined) return
    setCount(0)
    const controls = animate(0, target, {
      duration: COUNT_DURATION,
      ease: ease.out,
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setCount(null)
        setPulse(true)
      },
    })
    return () => controls.stop()
  }, [armed, inView, reduced, target])

  const counting = count !== null
  return (
    <span ref={ref} data-counter className={cn("tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {stat ? (
          counting ? (
            `${stat.prefix}${count}${stat.suffix}`
          ) : (
            <>
              <Sign text={stat.prefix} pulse={pulse} />
              {stat.value}
              <Sign text={stat.suffix} pulse={pulse} />
            </>
          )
        ) : (
          value
        )}
      </span>
    </span>
  )
}

