"use client"

import { motion } from "motion/react"
import { Check, ClipboardList, Copy } from "lucide-react"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  kind: "primary" | "secondary"
  label: string
  copiedLabel: string
  icon: "copy" | "clipboard"
  copied: boolean
  onClick: () => void
  className?: string
}

const ICONS = { copy: Copy, clipboard: ClipboardList, check: Check }

const KINDS = {
  primary: "bg-inverse text-inverse-ink hover:bg-accent",
  secondary: "border border-line-strong text-ink hover:border-ink hover:bg-surface-2",
}

/** The CopyButton of the design: pill + icon, "Copiada!" over the label in the same cell (PIX-03, PIX-07). */
export function CopyButton({ kind, label, copiedLabel, icon, copied, onClick, className }: CopyButtonProps) {
  const shown = copied ? "check" : icon
  const Icon = ICONS[shown]
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={spring.press}
      className={cn(
        "inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-7 text-base font-semibold",
        "transition-[color,background-color,border-color] duration-200 ease-out-strong",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        KINDS[kind],
        kind === "secondary" && copied && "border-accent",
        className,
      )}
    >
      <span data-icon={shown} aria-hidden="true" className={cn(kind === "secondary" && copied && "text-accent")}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      {/* Both labels share one grid cell, so "Copiada!" never changes the button's width (PIX-07). */}
      <span className="grid">
        <span aria-hidden={copied || undefined} className={cn("col-start-1 row-start-1", copied && "opacity-0")}>
          {label}
        </span>
        <span aria-hidden={!copied || undefined} className={cn("col-start-1 row-start-1", !copied && "opacity-0")}>
          {copiedLabel}
        </span>
      </span>
    </motion.button>
  )
}
