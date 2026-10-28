/**
 * Particle field math (Hero, E1). Pure functions: the canvas component only draws what these return.
 * Numbers: spec portfolio-motion-signature, SIG-12..16 and SIG-24.
 */

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  gold: boolean
  alpha: number
}

export interface Point {
  x: number
  y: number
}

export const INK = "#F3F3F1"
export const GOLD = "#C9A95C"
export const POINTER_RADIUS = 140
export const MAX_PUSH = 1.2
const GOLD_SHARE = 0.06
const MAX_DPR = 2

export function particleCount({ width, cores }: { width: number; cores: number }) {
  if (width < 768) return 45
  if (cores <= 4) return 55
  return 100
}

export const goldCount = (count: number) => Math.round(count * GOLD_SHARE)

export const linkDistance = (width: number) => (width >= 768 ? 110 : 80)

/** Line opacity between two points `d` apart: fades to 0 at the link distance. */
export const linkAlpha = (d: number, max: number) => (d >= max ? 0 : 0.18 * (1 - d / max))

/** Canvas buffer size for a CSS size, with the device pixel ratio capped at 2. */
export const backingSize = (css: number, dpr: number) => Math.round(css * Math.min(dpr, MAX_DPR))

/** How far the pointer pushes a particle this frame, away from the pointer. */
export function repelOffset(p: Point, pointer: Point): Point {
  const dx = p.x - pointer.x
  const dy = p.y - pointer.y
  const d = Math.hypot(dx, dy)
  if (d === 0 || d >= POINTER_RADIUS) return { x: 0, y: 0 }
  const push = MAX_PUSH * (1 - d / POINTER_RADIUS)
  return { x: (dx / d) * push, y: (dy / d) * push }
}

/** `count` particles spread over the box; the first goldCount(count) are gold. Drift of 0.08–0.25 px/frame. */
export function createParticles(count: number, width: number, height: number, random: () => number = Math.random): Particle[] {
  const gold = goldCount(count)
  return Array.from({ length: count }, (_, i) => {
    const angle = random() * Math.PI * 2
    const speed = 0.08 + random() * 0.17
    return {
      x: random() * width,
      y: random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gold: i < gold,
      alpha: i < gold ? 0.9 : 0.35 + random() * 0.35,
    }
  })
}

/** One frame: drift, wrap at the edges, then the pointer's push (when there is a pointer). */
export function stepParticles(particles: Particle[], width: number, height: number, pointer: Point | null) {
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (pointer) {
      const push = repelOffset(p, pointer)
      p.x += push.x
      p.y += push.y
    }
    if (p.x < 0) p.x += width
    else if (p.x > width) p.x -= width
    if (p.y < 0) p.y += height
    else if (p.y > height) p.y -= height
  }
}

/**
 * Calls `link(a, b, d)` once for every pair closer than `max`. A grid with `max`-sized cells means each
 * point is only compared with the points of its own cell and the 8 around it.
 */
export function forEachLink(points: Point[], max: number, link: (a: number, b: number, d: number) => void) {
  const grid = new Map<string, number[]>()
  const cellOf = (p: Point) => [Math.floor(p.x / max), Math.floor(p.y / max)]
  points.forEach((p, i) => {
    const [cx, cy] = cellOf(p)
    const key = `${cx},${cy}`
    const cell = grid.get(key)
    if (cell) cell.push(i)
    else grid.set(key, [i])
  })
  points.forEach((p, i) => {
    const [cx, cy] = cellOf(p)
    for (let gx = cx - 1; gx <= cx + 1; gx++) {
      for (let gy = cy - 1; gy <= cy + 1; gy++) {
        for (const j of grid.get(`${gx},${gy}`) ?? []) {
          if (j <= i) continue
          const d = Math.hypot(points[j].x - p.x, points[j].y - p.y)
          if (d < max) link(i, j, d)
        }
      }
    }
  })
}

/** Where a particle is drawn when the field is spread from its centre by `spread` (1 = in place). */
export const spreadPoint = (p: Point, width: number, height: number, spread: number): Point => ({
  x: width / 2 + (p.x - width / 2) * spread,
  y: height / 2 + (p.y - height / 2) * spread,
})
