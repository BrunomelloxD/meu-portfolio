"use client"

import { useRef, useState, type PointerEvent, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { tilt } from "@/lib/kinetics"
import { spring, tween } from "@/lib/motion"

const SPOT = 420

interface TiltCardProps {
  /** Active slide, desktop, fine pointer, no reduced motion. */
  enabled: boolean
  children: ReactNode
}

/** The active project leans toward the pointer and a soft light follows it (E6). */
export function TiltCard({ enabled, children }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, spring.tilt)
  const springY = useSpring(rotateY, spring.tilt)
  const spotX = useMotionValue(0)
  const spotY = useMotionValue(0)
  const [lit, setLit] = useState(false)

  const onPointerMove = (event: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const x = event.clientX - r.left
    const y = event.clientY - r.top
    const angle = tilt(x / r.width, y / r.height)
    rotateX.set(angle.rotateX)
    rotateY.set(angle.rotateY)
    spotX.set(x - SPOT / 2)
    spotY.set(y - SPOT / 2)
    setLit(true)
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    setLit(false)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={enabled ? onPointerMove : undefined}
      onPointerLeave={enabled ? onPointerLeave : undefined}
      style={enabled ? { rotateX: springX, rotateY: springY, transformPerspective: 1000 } : undefined}
      className="relative h-full overflow-hidden rounded-card"
    >
      {children}
      {enabled && (
        <motion.div
          data-spotlight
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: lit ? 1 : 0 }}
          transition={tween("fast")}
          style={{ x: spotX, y: spotY }}
          className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full border border-accent/[0.08] bg-[radial-gradient(circle,rgba(243,243,241,0.06),transparent_70%)]"
        />
      )}
    </motion.div>
  )
}
