"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"
import { useScramble } from "@/hooks/useScramble"
import { cn } from "@/lib/utils"

// Same trigger line as Reveal: a title already above it on mount is shown as is.
const TRIGGER_LINE = 0.9

interface ScrambleTextProps {
  text: string
  className?: string
}

/** Glyphs and characters while scrambling; unsettled ones in --ink-faint. Screen readers get the sr-only text. */
export function ScrambleFrame({ text, frame, settled }: { text: string; frame: string; settled: number }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {frame.slice(0, settled)}
        {settled < frame.length && <span className="text-ink-faint">{frame.slice(settled)}</span>}
      </span>
    </>
  )
}

/**
 * A mono title that decodes from glyphs to the word once, when it scrolls into view (E2).
 * The server HTML and no-JS visitors get the final text.
 */
export function ScrambleText({ text, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [armed, setArmed] = useState(false)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const { frame, settled, play } = useScramble(text)

  useEffect(() => {
    const el = ref.current
    if (el && el.getBoundingClientRect().top >= window.innerHeight * TRIGGER_LINE) setArmed(true)
  }, [])

  useEffect(() => {
    if (armed && inView) play()
  }, [armed, inView, play])

  return (
    <span ref={ref} data-scramble className={cn("inline-block", className)}>
      <ScrambleFrame text={text} frame={frame} settled={settled} />
    </span>
  )
}
