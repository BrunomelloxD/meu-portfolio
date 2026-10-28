"use client"

import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react"
import { motion, useReducedMotion, useTransform } from "motion/react"
import { usePointerFine } from "@/hooks/useMediaQuery"
import { useMagnet } from "@/hooks/useMagnet"
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
const press = { whileTap: { scale: 0.98 } } as const
const interactive = { whileHover: "hover", ...press } as const

// Magnetic pull (SIG-51): the control follows the pointer up to 12px, the arrow 1.6× as far.
const MAGNET_MAX = 12
const ARROW_EXTRA = 0.6

/** The inspiration's pill + arrow circle, as a single control (one tab stop). */
export function CtaButton({ children, className, ...props }: CtaButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const fine = usePointerFine()
  const reduced = !!useReducedMotion()
  const disabled = props.href === undefined && !!props.disabled
  const magnetic = fine && !reduced && !disabled
  const pull = useMagnet(ref, MAGNET_MAX, magnetic)
  // The arrow sits inside the moving control, so 0.6 more of the pull makes 1.6× in total.
  const arrowX = useTransform(pull.x, (v: number) => v * ARROW_EXTRA)
  const arrowY = useTransform(pull.y, (v: number) => v * ARROW_EXTRA)

  // With a mouse the pull replaces the hover lift; touch keeps the lift and the press.
  const gestures = magnetic ? { ...press, style: { x: pull.x, y: pull.y } } : interactive

  const content = (
    <>
      <span className={pill}>{children}</span>
      <motion.span
        aria-hidden="true"
        className={circle}
        variants={nudge}
        style={magnetic ? { x: arrowX, y: arrowY } : undefined}
      >
        →
      </motion.span>
    </>
  )

  if (props.href !== undefined) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(root, className)}
        variants={lift}
        transition={spring.press}
        {...gestures}
        {...props}
      >
        {content}
      </motion.a>
    )
  }

  const { type = "button", ...buttonProps } = props
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={cn(root, className)}
      variants={lift}
      transition={spring.press}
      {...(disabled ? {} : gestures)}
      {...buttonProps}
    >
      {content}
    </motion.button>
  )
}
