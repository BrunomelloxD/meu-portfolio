"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, type MotionValue } from "motion/react"
import { usePointerFine } from "@/hooks/useMediaQuery"
import {
  backingSize,
  createParticles,
  forEachLink,
  GOLD,
  INK,
  linkAlpha,
  linkDistance,
  particleCount,
  spreadPoint,
  stepParticles,
  type Particle,
  type Point,
} from "@/lib/particles"

interface ParticleFieldProps {
  /** Hero scroll: 1 = in place, 2.4 = fully dispersed. Read every frame, never re-renders. */
  spread?: MotionValue<number>
  /** Hero scroll: whole-field opacity. */
  fieldOpacity?: MotionValue<number>
}

const RESIZE_DEBOUNCE = 150
const IDLE_TIMEOUT = 1200
const IDLE_FALLBACK = 200

/**
 * The Hero's network of points (E1). Loaded with next/dynamic (ssr: false) and started when the browser is idle,
 * so it never competes with the h1 for the LCP. Pauses off screen and in hidden tabs; one still frame under
 * reduced motion.
 */
export default function ParticleField({ spread, fieldOpacity }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = !!useReducedMotion()
  const fine = usePointerFine()
  const pointerRef = useRef<Point | null>(null)
  const [ready, setReady] = useState(false)

  // Repulsion needs a mouse: on touch no pointermove listener is registered at all.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!fine || !canvas) return
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onPointerLeave = () => {
      pointerRef.current = null
    }
    window.addEventListener("pointermove", onPointerMove)
    document.documentElement.addEventListener("pointerleave", onPointerLeave)
    return () => {
      pointerRef.current = null
      window.removeEventListener("pointermove", onPointerMove)
      document.documentElement.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [fine])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let particles: Particle[] = []
    let width = 0
    let height = 0
    let maxLink = 0
    let frame = 0
    let running = false
    let started = false
    let inView = true

    const setup = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = window.devicePixelRatio || 1
      canvas.width = backingSize(width, dpr)
      canvas.height = backingSize(height, dpr)
      ctx.setTransform(Math.min(dpr, 2), 0, 0, Math.min(dpr, 2), 0, 0)
      const viewport = window.innerWidth
      particles = createParticles(particleCount({ width: viewport, cores: navigator.hardwareConcurrency || 8 }), width, height)
      maxLink = linkDistance(viewport)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const alpha = fieldOpacity?.get() ?? 1
      if (alpha <= 0) return
      const s = spread?.get() ?? 1
      const points = particles.map((p) => spreadPoint(p, width, height, s))
      ctx.lineWidth = 1
      ctx.strokeStyle = INK
      forEachLink(points, maxLink, (a, b, d) => {
        ctx.globalAlpha = linkAlpha(d, maxLink) * alpha
        ctx.beginPath()
        ctx.moveTo(points[a].x, points[a].y)
        ctx.lineTo(points[b].x, points[b].y)
        ctx.stroke()
      })
      particles.forEach((p, i) => {
        ctx.globalAlpha = p.alpha * alpha
        ctx.fillStyle = p.gold ? GOLD : INK
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, p.gold ? 1.6 : 1.2, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    const tick = () => {
      // The points are drawn spread from the centre: take the pointer back to their unspread space,
      // so the point pushed is the one under the cursor.
      const pointer = pointerRef.current
      const s = spread?.get() ?? 1
      const local = pointer && {
        x: width / 2 + (pointer.x - width / 2) / s,
        y: height / 2 + (pointer.y - height / 2) / s,
      }
      stepParticles(particles, width, height, local)
      draw()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!started || running || reduced || !inView || document.visibilityState === "hidden") return
      running = true
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const begin = () => {
      started = true
      setup()
      setReady(true)
      if (reduced) draw()
      else start()
    }

    const idle = typeof window.requestIdleCallback === "function"
    const idleId = idle ? window.requestIdleCallback(begin, { timeout: IDLE_TIMEOUT }) : 0
    const fallbackId = idle ? undefined : setTimeout(begin, IDLE_FALLBACK)

    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            if (inView) start()
            else stop()
          })
    io?.observe(canvas)

    const onVisibility = () => (document.visibilityState === "hidden" ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    let resizeId: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(resizeId)
      resizeId = setTimeout(() => {
        if (!started) return
        setup()
        if (reduced) draw()
      }, RESIZE_DEBOUNCE)
    }
    window.addEventListener("resize", onResize)

    return () => {
      stop()
      if (idle) window.cancelIdleCallback?.(idleId)
      clearTimeout(fallbackId)
      clearTimeout(resizeId)
      io?.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("resize", onResize)
    }
  }, [reduced, spread, fieldOpacity])

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
