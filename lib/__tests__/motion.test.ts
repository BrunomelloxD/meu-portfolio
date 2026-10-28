import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"
import { dur, ease, spring, tween, revealGroup, revealItem, fadeUp, REVEAL_VIEWPORT } from "../motion"

const css = readFileSync(resolve(__dirname, "../../app/globals.css"), "utf8")
const cssVar = (name: string) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim()

describe("motion tokens (MOV-01)", () => {
  it("defines the durations in seconds", () => {
    expect(dur).toEqual({ instant: 0.12, fast: 0.18, base: 0.32, slow: 0.7, hero: 0.9 })
  })

  it("defines the easing curves", () => {
    expect(ease.out).toEqual([0.32, 0.72, 0, 1])
    expect(ease.inOut).toEqual([0.76, 0, 0.24, 1])
    expect(ease.soft).toEqual([0.33, 1, 0.68, 1])
  })

  it("defines the springs (stiffness, damping, mass)", () => {
    expect(spring.press).toEqual({ type: "spring", stiffness: 500, damping: 45, mass: 1 })
    expect(spring.glide).toEqual({ type: "spring", stiffness: 380, damping: 40, mass: 1 })
    expect(spring.settle).toEqual({ type: "spring", stiffness: 220, damping: 32, mass: 1 })
    expect(spring.scroll).toEqual({ stiffness: 100, damping: 30, mass: 1, restDelta: 0.001 })
  })

  it("builds a tween from tokens", () => {
    expect(tween("base", "inOut")).toEqual({ duration: 0.32, ease: [0.76, 0, 0.24, 1] })
    expect(tween("slow")).toEqual({ duration: 0.7, ease: [0.32, 0.72, 0, 1] })
  })
})

describe("CSS parity (MOV-02)", () => {
  it("mirrors ease.out, dur.hero and dur.slow in globals.css", () => {
    expect(cssVar("--ease-out-strong")).toBe(`cubic-bezier(${ease.out.join(", ")})`)
    expect(cssVar("--dur-mask")).toBe(`${dur.hero * 1000}ms`)
    expect(cssVar("--dur-reveal")).toBe(`${dur.slow * 1000}ms`)
  })
})

describe("gesture springs (SIG-120)", () => {
  it("defines magnetic and velocity, and no tilt, cursor or snap spring", () => {
    expect(spring.magnetic).toEqual({ type: "spring", stiffness: 260, damping: 14, mass: 1 })
    expect(spring.velocity).toEqual({ stiffness: 400, damping: 50 })
    for (const gone of ["tilt", "cursor", "snap"]) expect(spring).not.toHaveProperty(gone)
  })
})

// SIG-120 replaces SIG-02 (and MOV-05): UI feedback never overshoots; magnetic is the only gesture that does.
describe("damping ratio by role (SIG-120)", () => {
  const ratio = (s: { stiffness: number; damping: number; mass: number }) => s.damping / (2 * Math.sqrt(s.stiffness * s.mass))

  it.each(["press", "glide", "settle", "scroll"] as const)("%s has a damping ratio >= 1", (name) => {
    expect(ratio(spring[name])).toBeGreaterThanOrEqual(1)
  })

  it("magnetic is the only spring with a damping ratio < 1", () => {
    const under = Object.entries(spring)
      .filter(([, s]) => "mass" in s && ratio(s as { stiffness: number; damping: number; mass: number }) < 1)
      .map(([name]) => name)
    expect(under).toEqual(["magnetic"])
  })
})

describe("reveal variants (MOV-10, MOV-11, MOV-14)", () => {
  it("uses the reveal viewport", () => {
    expect(REVEAL_VIEWPORT).toEqual({ once: true, amount: 0.1, margin: "0px 0px -10% 0px" })
  })

  it("rises 16px over dur.slow and staggers children by 70ms", () => {
    expect(revealItem(false).hidden).toEqual({ opacity: 0, y: 16, transition: { duration: 0 } })
    expect(revealItem(false).show).toEqual({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] } })
    expect(revealGroup(false).show).toEqual({ transition: { delayChildren: { __stagger: [0.07, null] } } })
  })

  it("only fades, faster and without stagger, under reduced motion", () => {
    expect(revealItem(true).hidden).toEqual({ opacity: 0, y: 0, transition: { duration: 0 } })
    expect(revealItem(true).show).toEqual({ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] } })
    expect(revealGroup(true).show).toEqual({ transition: {} })
  })
})

describe("fadeUp", () => {
  it("enters from the given distance and leaves with a fast fade", () => {
    expect(fadeUp(4, "base", "soft")).toEqual({
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.33, 1, 0.68, 1] } },
      exit: { opacity: 0, transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] } },
    })
  })
})

describe("only compositor-friendly keys (MOV-43)", () => {
  const ALLOWED = new Set(["opacity", "x", "y", "scale", "scaleX"])
  const targets = [
    ...[true, false].flatMap((r) => [...Object.values(revealItem(r)), ...Object.values(revealGroup(r))]),
    ...Object.values(fadeUp(8, "base")),
  ]

  it("animates nothing but opacity, x, y, scale and scaleX", () => {
    for (const target of targets) {
      for (const key of Object.keys(target as object)) {
        if (key === "transition") continue
        expect(ALLOWED).toContain(key)
      }
    }
  })
})
