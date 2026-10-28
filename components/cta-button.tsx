"use client"

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"
import { motion } from "motion/react"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** React's drag/animation handlers clash with motion's own signatures, so they are not accepted. */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"

type CtaButtonProps = {
  children: ReactNode
  className?: string
} & (
  | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className" | MotionConflicts>)
  | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | MotionConflicts>)
)

const root =
  "group inline-flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-60"
const pill =
  "inline-flex h-[52px] items-center rounded-full bg-inverse px-7 text-base font-semibold text-inverse-ink transition-colors duration-200 ease-out-strong group-hover:bg-accent"
const circle =
  "inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-inverse text-xl text-inverse-ink transition-[background-color] duration-200 ease-out-strong group-hover:bg-accent"

const lift = { hover: { y: -2 } }
const nudge = { hover: { x: 4 } }
const interactive = { whileHover: "hover", whileTap: { scale: 0.98 } } as const

/** The inspiration's pill + arrow circle, as a single control (one tab stop). */
export function CtaButton({ children, className, ...props }: CtaButtonProps) {
  const content = (
    <>
      <span className={pill}>{children}</span>
      <motion.span aria-hidden="true" className={circle} variants={nudge}>
        →
      </motion.span>
    </>
  )

  if (props.href !== undefined) {
    return (
      <motion.a
        target="_blank"
        rel="noopener noreferrer"
        className={cn(root, className)}
        variants={lift}
        transition={spring.press}
        {...interactive}
        {...props}
      >
        {content}
      </motion.a>
    )
  }

  const { type = "button", ...buttonProps } = props
  return (
    <motion.button
      type={type}
      className={cn(root, className)}
      variants={lift}
      transition={spring.press}
      {...(buttonProps.disabled ? {} : interactive)}
      {...buttonProps}
    >
      {content}
    </motion.button>
  )
}
