/** Text effects (spec portfolio-motion-signature): the scramble of mono titles and the counted stats. */

export const SCRAMBLE_GLYPHS = "▓▒░<>/{}[]_=+*#01"

/** When character `i` of `n` settles, in ms: section titles resolve left to right after a 280ms lead (SIG-40). */
export type ResolveAt = (i: number, n: number) => number
export const titleResolve: ResolveAt = (i) => 280 + i * 35
/** The nav hover replay settles the whole label in 300ms (SIG-44). */
export const hoverResolve: ResolveAt = (i, n) => (i * 300) / n

const GLYPH_STEP = 40

/** Total duration of a scramble: the moment the last character settles. */
export const scrambleDuration = (text: string, resolveAt: ResolveAt = titleResolve) =>
  text.length ? resolveAt(text.length - 1, text.length) : 0

/** Characters already settled at time `t` (they settle in order). */
export function resolvedCount(text: string, t: number, resolveAt: ResolveAt = titleResolve) {
  let count = 0
  while (count < text.length && t >= resolveAt(count, text.length)) count++
  return count
}

// Small integer hash: same seed, index and 40ms bucket always give the same glyph.
function glyphFor(seed: number, i: number, bucket: number) {
  let h = (seed * 374761393 + i * 668265263 + bucket * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return SCRAMBLE_GLYPHS[Math.abs(h) % SCRAMBLE_GLYPHS.length]
}

/**
 * The text as shown `t` ms into the scramble (SIG-40, SIG-41): settled characters are final, spaces are kept,
 * the rest show a glyph that only changes when the 40ms bucket changes. Same length as `text`.
 */
export function scrambleFrame(text: string, t: number, seed: number, resolveAt: ResolveAt = titleResolve) {
  const settled = resolvedCount(text, t, resolveAt)
  const bucket = Math.floor(t / GLYPH_STEP)
  let out = ""
  for (let i = 0; i < text.length; i++) {
    out += i < settled || text[i] === " " ? text[i] : glyphFor(seed, i, bucket)
  }
  return out
}

/** Splits a stat such as "20+" or "+3 anos" into prefix, integer and suffix (SIG-100); null without digits. */
export function parseStat(value: string) {
  const match = value.match(/^(\D*?)(\d+)(.*)$/)
  if (!match) return null
  return { prefix: match[1], value: Number(match[2]), suffix: match[3] }
}
