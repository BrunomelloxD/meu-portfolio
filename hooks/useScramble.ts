"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { resolvedCount, scrambleDuration, scrambleFrame, titleResolve, type ResolveAt } from "@/lib/text-motion"

const seedOf = (text: string) => [...text].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7)

/**
 * Plays a scramble of `text` on demand. `frame` is the text to show, `settled` how many leading characters
 * are final. Idle (and on the server) it is the final text. A play never restarts while one is running, and
 * under reduced motion it does nothing.
 */
export function useScramble(text: string, resolveAt: ResolveAt = titleResolve) {
  const reduced = !!useReducedMotion()
  const [elapsed, setElapsed] = useState<number | null>(null)
  const frameRef = useRef(0)
  const running = useRef(false)

  const play = useCallback(() => {
    if (running.current || reduced || !text) return
    running.current = true
    const duration = scrambleDuration(text, resolveAt)
    let start: number | null = null
    const tick = (now: number) => {
      start ??= now
      const t = now - start
      if (t >= duration) {
        running.current = false
        setElapsed(null)
        return
      }
      setElapsed(t)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [reduced, text, resolveAt])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  if (elapsed === null) return { frame: text, settled: text.length, play }
  return {
    frame: scrambleFrame(text, elapsed, seedOf(text), resolveAt),
    settled: resolvedCount(text, elapsed, resolveAt),
    play,
  }
}
