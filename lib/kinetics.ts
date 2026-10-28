/** Scroll and gesture math for the signature effects (spec portfolio-motion-signature). Pure functions. */

export interface Box {
  left: number
  top: number
  width: number
  height: number
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Linear map of `p` from [a, b] to [from, to], clamped. */
const range = (p: number, a: number, b: number, from: number, to: number) => from + (to - from) * clamp((p - a) / (b - a), 0, 1)

/** Hero values for a scroll progress `p` of the pinned section (SIG-31..33). `titleY` is in vh. */
export function heroScrollMap(p: number) {
  return {
    titleScale: range(p, 0, 1, 1, 0.84),
    titleY: range(p, 0, 1, 0, -6),
    contentOpacity: range(p, 0, 0.4, 1, 0),
    spread: range(p, 0.2, 0.9, 1, 2.4),
    fieldOpacity: range(p, 0.2, 0.9, 1, 0),
  }
}

const MAGNET_PULL = 0.35
const MAGNET_REACH = 24

/** Magnetic offset toward the pointer (SIG-50): 0.35 of the distance to the centre, clamped to ±max. */
export function magnet(pointer: { x: number; y: number }, box: Box, max: number) {
  const inside =
    pointer.x >= box.left - MAGNET_REACH &&
    pointer.x <= box.left + box.width + MAGNET_REACH &&
    pointer.y >= box.top - MAGNET_REACH &&
    pointer.y <= box.top + box.height + MAGNET_REACH
  if (!inside) return { x: 0, y: 0 }
  return {
    x: clamp((pointer.x - (box.left + box.width / 2)) * MAGNET_PULL, -max, max),
    y: clamp((pointer.y - (box.top + box.height / 2)) * MAGNET_PULL, -max, max),
  }
}

/** Carousel index after a drag (SIG-63): a 120px drag or a 500px/s flick moves one slide. */
export function dragTarget(index: number, offsetX: number, velocityX: number) {
  if (offsetX < -120 || velocityX < -500) return index + 1
  if (offsetX > 120 || velocityX > 500) return index - 1
  return index
}

const MARQUEE_SPEED = 40

/**
 * Next marquee offset (SIG-72): 40px/s to the left, up to 5× faster with the scroll velocity, reversed when
 * scrolling up, wrapped into (−copyWidth, 0] so the second copy takes over seamlessly.
 */
export function marqueeStep(x: number, dtMs: number, velocity: number, copyWidth: number) {
  if (copyWidth <= 0) return x
  const factor = 1 + Math.min(Math.abs(velocity) / 1000, 4)
  const direction = velocity < 0 ? -1 : 1
  let next = (x - direction * MARQUEE_SPEED * factor * (dtMs / 1000)) % copyWidth
  if (next > 0) next -= copyWidth
  if (next <= -copyWidth) next += copyWidth
  return next
}
