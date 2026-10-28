import { stagger, type Transition, type Variants } from "motion/react"

/**
 * Motion tokens (FigCraft page "Motion — Tokens", decision AD-002). Seconds, as Motion expects.
 * --ease-out-strong, --dur-mask and --dur-reveal in app/globals.css mirror ease.out, dur.hero and dur.slow.
 */
export const dur = {
  instant: 0.12,
  fast: 0.18,
  base: 0.32,
  slow: 0.7,
  hero: 0.9,
} as const

export const ease = {
  out: [0.32, 0.72, 0, 1],
  inOut: [0.76, 0, 0.24, 1],
  soft: [0.33, 1, 0.68, 1],
} as const

// UI feedback springs are critically or over-damped (damping ratio >= 1). Only the magnetic pull (AD-003)
// is under-damped on purpose; the carousel drag settles with `settle` (AD-004).
export const spring = {
  press: { type: "spring", stiffness: 500, damping: 45, mass: 1 },
  glide: { type: "spring", stiffness: 380, damping: 40, mass: 1 },
  settle: { type: "spring", stiffness: 220, damping: 32, mass: 1 },
  /** For useSpring (no `type`). */
  scroll: { stiffness: 100, damping: 30, mass: 1, restDelta: 0.001 },
  magnetic: { type: "spring", stiffness: 260, damping: 14, mass: 1 },
} as const

export type DurationToken = keyof typeof dur
export type EaseToken = keyof typeof ease

export function tween(d: DurationToken, e: EaseToken = "out"): Transition {
  return { duration: dur[d], ease: ease[e] }
}

/** Section reveal: once, 10% before the bottom edge. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.1, margin: "0px 0px -10% 0px" } as const

export function revealGroup(reduced: boolean): Variants {
  return {
    hidden: {},
    show: { transition: reduced ? {} : { delayChildren: stagger(0.07) } },
  }
}

// `hidden` is applied instantly: it only arms content that is still below the fold.
export function revealItem(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 16, transition: { duration: 0 } },
    show: { opacity: 1, y: 0, transition: tween(reduced ? "base" : "slow") },
  }
}

/** Enter with opacity + a small y travel, leave with a quick fade. */
export function fadeUp(distance: number, d: DurationToken, e: EaseToken = "out") {
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0, transition: tween(d, e) },
    exit: { opacity: 0, transition: tween("fast") },
  }
}
