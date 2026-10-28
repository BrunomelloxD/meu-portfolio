import { describe, it, expect } from "vitest"
import {
  backingSize,
  createParticles,
  forEachLink,
  GOLD,
  goldCount,
  INK,
  linkAlpha,
  linkDistance,
  particleCount,
  repelOffset,
  spreadPoint,
  stepParticles,
  type Point,
} from "../particles"

/** Deterministic random for the tests. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe("particleCount (SIG-12)", () => {
  it("is 45 below 768px, whatever the cores", () => {
    expect(particleCount({ width: 767, cores: 16 })).toBe(45)
    expect(particleCount({ width: 390, cores: 2 })).toBe(45)
  })

  it("is 55 from 768px with 4 cores or fewer", () => {
    expect(particleCount({ width: 768, cores: 4 })).toBe(55)
    expect(particleCount({ width: 1440, cores: 2 })).toBe(55)
  })

  it("is 100 otherwise", () => {
    expect(particleCount({ width: 768, cores: 5 })).toBe(100)
    expect(particleCount({ width: 1440, cores: 8 })).toBe(100)
  })
})

describe("gold particles (SIG-13)", () => {
  it("paints Math.round(count × 0.06) in gold", () => {
    expect(goldCount(100)).toBe(6)
    expect(goldCount(55)).toBe(3)
    expect(goldCount(45)).toBe(3)
  })

  it("creates exactly that many gold particles, the rest in ink with alpha 0.35–0.7", () => {
    const ps = createParticles(100, 1440, 900, seeded(7))
    expect(ps.filter((p) => p.gold)).toHaveLength(6)
    for (const p of ps.filter((q) => !q.gold)) {
      expect(p.alpha).toBeGreaterThanOrEqual(0.35)
      expect(p.alpha).toBeLessThanOrEqual(0.7)
    }
  })

  it("uses the ink and gold colours of the theme", () => {
    expect(INK).toBe("#F3F3F1")
    expect(GOLD).toBe("#C9A95C")
  })

  it("places every particle inside the box and drifts at 0.08–0.25 px/frame", () => {
    for (const p of createParticles(45, 390, 800, seeded(3))) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(390)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(800)
      const speed = Math.hypot(p.vx, p.vy)
      expect(speed).toBeGreaterThanOrEqual(0.08 - 1e-9)
      expect(speed).toBeLessThanOrEqual(0.25 + 1e-9)
    }
  })
})

describe("links (SIG-14)", () => {
  it("uses 110px from 768px and 80px below", () => {
    expect(linkDistance(768)).toBe(110)
    expect(linkDistance(767)).toBe(80)
  })

  it("fades the line as 0.18 × (1 − d / L)", () => {
    expect(linkAlpha(0, 110)).toBeCloseTo(0.18)
    expect(linkAlpha(55, 110)).toBeCloseTo(0.09)
    expect(linkAlpha(110, 110)).toBe(0)
    expect(linkAlpha(200, 110)).toBe(0)
  })
})

describe("spatial grid (SIG-24)", () => {
  it("finds exactly the pairs closer than the link distance (same as brute force)", () => {
    const rnd = seeded(11)
    const points: Point[] = Array.from({ length: 120 }, () => ({ x: rnd() * 1440, y: rnd() * 900 }))
    const brute = new Set<string>()
    for (let i = 0; i < points.length; i++)
      for (let j = i + 1; j < points.length; j++)
        if (Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) < 110) brute.add(`${i}-${j}`)

    const found: string[] = []
    forEachLink(points, 110, (a, b, d) => {
      found.push(`${a}-${b}`)
      expect(d).toBeCloseTo(Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y))
    })
    expect(found).toHaveLength(brute.size)
    expect(new Set(found)).toEqual(brute)
  })
})

describe("pointer repulsion (SIG-15)", () => {
  it("pushes 1.2 × (1 − d / 140) px away from the pointer", () => {
    const push = repelOffset({ x: 170, y: 100 }, { x: 100, y: 100 })
    expect(push.x).toBeCloseTo(1.2 * (1 - 70 / 140))
    expect(push.y).toBeCloseTo(0)
  })

  it("points the push from the pointer to the particle", () => {
    const push = repelOffset({ x: 100, y: 60 }, { x: 100, y: 100 })
    expect(push.x).toBeCloseTo(0)
    expect(push.y).toBeCloseTo(-1.2 * (1 - 40 / 140))
  })

  it("does nothing at 140px or more, or exactly on the pointer", () => {
    expect(repelOffset({ x: 240, y: 100 }, { x: 100, y: 100 })).toEqual({ x: 0, y: 0 })
    expect(repelOffset({ x: 100, y: 100 }, { x: 100, y: 100 })).toEqual({ x: 0, y: 0 })
  })

  it("applies the push in a frame only when there is a pointer", () => {
    const make = () => [{ x: 170, y: 100, vx: 0, vy: 0, gold: false, alpha: 0.5 }]
    const still = make()
    stepParticles(still, 1440, 900, null)
    expect(still[0].x).toBe(170)
    const pushed = make()
    stepParticles(pushed, 1440, 900, { x: 100, y: 100 })
    expect(pushed[0].x).toBeCloseTo(170 + 0.6)
  })

  it("drifts by the velocity and wraps around the edges", () => {
    const ps = [{ x: 1439.9, y: 0.05, vx: 0.2, vy: -0.1, gold: false, alpha: 0.5 }]
    stepParticles(ps, 1440, 900, null)
    expect(ps[0].x).toBeCloseTo(0.1)
    expect(ps[0].y).toBeCloseTo(899.95)
  })
})

describe("backingSize (SIG-16)", () => {
  it("multiplies the CSS size by the device pixel ratio, capped at 2", () => {
    expect(backingSize(1440, 1)).toBe(1440)
    expect(backingSize(1440, 1.5)).toBe(2160)
    expect(backingSize(1440, 3)).toBe(2880)
  })
})

describe("spreadPoint (SIG-33)", () => {
  it("scales a point away from the centre by the spread", () => {
    expect(spreadPoint({ x: 200, y: 100 }, 400, 400, 1)).toEqual({ x: 200, y: 100 })
    expect(spreadPoint({ x: 300, y: 100 }, 400, 400, 2.4)).toEqual({ x: 200 + 100 * 2.4, y: 200 - 100 * 2.4 })
  })
})
