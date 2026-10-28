import { describe, it, expect } from "vitest"
import {
  hoverResolve,
  parseStat,
  resolvedCount,
  SCRAMBLE_GLYPHS,
  scrambleDuration,
  scrambleFrame,
} from "../text-motion"

const GLYPHS = new Set(SCRAMBLE_GLYPHS)

describe("scrambleFrame (SIG-40)", () => {
  const word = "Experiência"

  it("uses the ASCII charset <>/{}[]_=+*#01, all in the loaded latin subset", () => {
    expect(SCRAMBLE_GLYPHS).toBe("<>/{}[]_=+*#01")
    for (const ch of SCRAMBLE_GLYPHS) expect(ch.charCodeAt(0)).toBeLessThan(0x80)
  })

  it("keeps the length of the text at every moment", () => {
    for (const t of [0, 100, 280, 400, 700, 2000]) expect(scrambleFrame(word, t, 1)).toHaveLength(word.length)
  })

  it("shows only glyphs before 280ms", () => {
    for (const ch of scrambleFrame(word, 279, 1)) expect(GLYPHS.has(ch)).toBe(true)
  })

  it("settles character i at 280 + i × 35 ms", () => {
    // i = 3 settles at 385ms: at 384 three are final, at 385 four.
    expect(scrambleFrame(word, 384, 1).slice(0, 3)).toBe("Exp")
    expect(GLYPHS.has(scrambleFrame(word, 384, 1)[3])).toBe(true)
    expect(scrambleFrame(word, 385, 1).slice(0, 4)).toBe("Expe")
    for (const ch of scrambleFrame(word, 385, 1).slice(4)) expect(GLYPHS.has(ch)).toBe(true)
  })

  it("is the final text once the last character settles", () => {
    expect(scrambleDuration(word)).toBe(280 + 10 * 35)
    expect(scrambleFrame(word, 630, 1)).toBe(word)
  })
})

describe("scrambleFrame (SIG-41)", () => {
  it("keeps spaces", () => {
    const frame = scrambleFrame("Bruno Mello", 0, 4)
    expect(frame[5]).toBe(" ")
  })

  it("gives the same frame for the same seed and 40ms bucket", () => {
    expect(scrambleFrame("Projetos", 41, 9)).toBe(scrambleFrame("Projetos", 79, 9))
  })

  it("changes the glyphs when the bucket changes", () => {
    expect(scrambleFrame("Projetos", 79, 9)).not.toBe(scrambleFrame("Projetos", 80, 9))
  })
})

describe("scrambleFrame (SIG-47)", () => {
  it("returns an empty string for an empty text", () => {
    expect(scrambleFrame("", 100, 1)).toBe("")
    expect(scrambleDuration("")).toBe(0)
  })
})

describe("hover replay (SIG-44)", () => {
  it("settles character i of n at i × 300 / n ms, all of it by 300ms", () => {
    expect(hoverResolve(0, 6)).toBe(0)
    expect(hoverResolve(3, 6)).toBe(150)
    expect(resolvedCount("Skills", 149, hoverResolve)).toBe(3)
    expect(resolvedCount("Skills", 150, hoverResolve)).toBe(4)
    expect(scrambleFrame("Skills", 300, 2, hoverResolve)).toBe("Skills")
  })
})

describe("parseStat (SIG-100)", () => {
  it("splits a number with a suffix", () => {
    expect(parseStat("20+")).toEqual({ prefix: "", value: 20, suffix: "+" })
    expect(parseStat("3+")).toEqual({ prefix: "", value: 3, suffix: "+" })
  })

  it("splits a prefix, a number and a word suffix", () => {
    expect(parseStat("+3 anos")).toEqual({ prefix: "+", value: 3, suffix: " anos" })
  })

  it("returns null without digits", () => {
    expect(parseStat("Presente")).toBeNull()
  })
})
