"use client"

import { useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { usePointerFine } from "@/hooks/useMediaQuery"
import { useCopyText } from "@/hooks/useCopyText"
import { useMagnet } from "@/hooks/useMagnet"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface SocialChipProps {
  href: string
  label: string
  className?: string
}

export function SocialChip({ href, label, className }: SocialChipProps) {
  const external = href.startsWith("http")
  // Email: copy the address too, for visitors without a mail app; the mailto still opens (CONT-06).
  const email = href.startsWith("mailto:") ? href.slice("mailto:".length) : null
  const { copied, copy } = useCopyText()
  const ref = useRef<HTMLAnchorElement>(null)
  const fine = usePointerFine()
  const reduced = !!useReducedMotion()
  const magnetic = fine && !reduced
  // Mouse: a 6px magnetic pull (SIG-51) instead of the hover lift; touch keeps the lift.
  const pull = useMagnet(ref, 6, magnetic)
  const link = (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(magnetic ? { style: { x: pull.x, y: pull.y } } : { whileHover: { y: -2 } })}
      onClick={email ? () => copy(email) : undefined}
      whileTap={{ scale: 0.97 }}
      transition={spring.press}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line-strong px-[18px] text-sm font-semibold text-ink",
        "transition-[color,background-color,border-color] duration-200 ease-out-strong hover:border-ink hover:bg-surface-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
    >
      {/* Both labels share one grid cell, so "Copiado" never changes the chip's width (CONT-07). */}
      <span className="grid">
        <span className={cn("col-start-1 row-start-1", copied && "opacity-0")}>{label}</span>
        {email && (
          <span aria-hidden="true" className={cn("col-start-1 row-start-1", !copied && "opacity-0")}>
            Copiado
          </span>
        )}
      </span>
      <span aria-hidden="true" className="font-mono text-[13px] text-ink-soft">
        {copied ? "✓" : "↗"}
      </span>
    </motion.a>
  )

  if (!email) return link
  return (
    <>
      {link}
      <span role="status" className="sr-only">
        {copied ? "Email copiado" : ""}
      </span>
    </>
  )
}
