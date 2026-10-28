import { describe, it, expect } from "vitest"
import { dragTarget, heroScrollMap, magnet, marqueeStep } from "../kinetics"

describe("heroScrollMap (SIG-31)", () => {
  it("scales the title from 1 to 0.84 and moves it from 0 to −6vh over p 0..1", () => {
    expect(heroScrollMap(0)).toMatchObject({ titleScale: 1, titleY: 0 })
    expect(heroScrollMap(0.5).titleScale).toBeCloseTo(0.92)
    expect(heroScrollMap(0.5).titleY).toBeCloseTo(-3)
    expect(heroScrollMap(1).titleScale).toBeCloseTo(0.84)
    expect(heroScrollMap(1).titleY).toBeCloseTo(-6)
  })

  it("clamps outside 0..1", () => {
    expect(heroScrollMap(-0.5)).toMatchObject({ titleScale: 1, titleY: 0, contentOpacity: 1, spread: 1, fieldOpacity: 1 })
    expect(heroScrollMap(1.5).titleScale).toBeCloseTo(0.84)
    expect(heroScrollMap(1.5).titleY).toBeCloseTo(-6)
  })
})

describe("heroScrollMap (SIG-32)", () => {
  it("fades the content from 1 to 0 over p 0..0.4", () => {
    expect(heroScrollMap(0).contentOpacity).toBe(1)
    expect(heroScrollMap(0.2).contentOpacity).toBeCloseTo(0.5)
    expect(heroScrollMap(0.4).contentOpacity).toBe(0)
    expect(heroScrollMap(0.8).contentOpacity).toBe(0)
  })
})

describe("heroScrollMap (SIG-33)", () => {
  it("spreads the field from 1 to 2.4 and fades it from 1 to 0 over p 0.2..0.9", () => {
    expect(heroScrollMap(0.2)).toMatchObject({ spread: 1, fieldOpacity: 1 })
    expect(heroScrollMap(0.55).spread).toBeCloseTo(1.7)
    expect(heroScrollMap(0.55).fieldOpacity).toBeCloseTo(0.5)
    expect(heroScrollMap(0.9).spread).toBeCloseTo(2.4)
    expect(heroScrollMap(0.9).fieldOpacity).toBeCloseTo(0)
    expect(heroScrollMap(1).spread).toBeCloseTo(2.4)
  })
})

describe("magnet (SIG-50)", () => {
  const box = { left: 100, top: 100, width: 200, height: 52 } // centre (200, 126)

  it("pulls 0.35 of the distance to the centre", () => {
    expect(magnet({ x: 220, y: 136 }, box, 12)).toEqual({ x: 20 * 0.35, y: 10 * 0.35 })
  })

  it("clamps each axis to ±max", () => {
    expect(magnet({ x: 300, y: 100 }, box, 12)).toEqual({ x: 12, y: -26 * 0.35 })
    expect(magnet({ x: 100, y: 126 }, box, 6)).toEqual({ x: -6, y: 0 })
  })

  it("reaches 24px outside the box and returns zero beyond", () => {
    expect(magnet({ x: 324, y: 126 }, box, 12)).toEqual({ x: 12, y: 0 })
    expect(magnet({ x: 325, y: 126 }, box, 12)).toEqual({ x: 0, y: 0 })
    expect(magnet({ x: 200, y: 75 }, box, 12)).toEqual({ x: 0, y: 0 })
  })
})

describe("dragTarget (SIG-121)", () => {
  it("advances after a drag past −120px or a flick under −500px/s", () => {
    expect(dragTarget(2, -121, 0)).toBe(3)
    expect(dragTarget(2, -10, -501)).toBe(3)
  })

  it("goes back after a drag past 120px or a flick over 500px/s", () => {
    expect(dragTarget(2, 121, 0)).toBe(1)
    expect(dragTarget(2, 10, 501)).toBe(1)
  })

  it("stays otherwise, including exactly at the thresholds", () => {
    expect(dragTarget(2, -120, -500)).toBe(2)
    expect(dragTarget(2, 120, 500)).toBe(2)
    expect(dragTarget(2, 0, 0)).toBe(2)
  })
})

describe("marqueeStep (SIG-72)", () => {
  it("moves 40px/s to the left at rest", () => {
    expect(marqueeStep(0, 1000, 0, 2000)).toBeCloseTo(-40)
    expect(marqueeStep(-100, 500, 0, 2000)).toBeCloseTo(-120)
  })

  it("speeds up by 1 + min(|v| / 1000, 4)", () => {
    expect(marqueeStep(0, 1000, 2000, 2000)).toBeCloseTo(-120)
    expect(marqueeStep(0, 1000, 9000, 2000)).toBeCloseTo(-200)
  })

  it("reverses when the scroll velocity is negative", () => {
    expect(marqueeStep(-500, 1000, -1000, 2000)).toBeCloseTo(-420)
  })

  it("wraps into (−copyWidth, 0]", () => {
    expect(marqueeStep(-1990, 1000, 0, 2000)).toBeCloseTo(-30)
    expect(marqueeStep(-10, 1000, -1000, 2000)).toBeCloseTo(-1930)
    expect(marqueeStep(-1960, 1000, 0, 2000)).toBeCloseTo(0)
  })

  it("leaves x alone until the copy is measured", () => {
    expect(marqueeStep(-30, 1000, 0, 0)).toBe(-30)
  })
})
