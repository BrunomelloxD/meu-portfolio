import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, render, screen } from "@testing-library/react"
import { useReducedMotion, useSpring, useTransform } from "motion/react"
import { CtaButton } from "../cta-button"
import { SocialChip } from "../social-chip"
import { spring } from "@/lib/motion"

type Mv = { __mv: string; get: () => number }
type Spring = { __mv: "spring"; source: Mv; options: unknown }

let pointerFine = true
// Every control sits at (100, 100), 200 × 52: centre (200, 126).
const RECT = { left: 100, top: 100, width: 200, height: 52, right: 300, bottom: 152, x: 100, y: 100 }

beforeEach(() => {
  pointerFine = true
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: query === "(hover: hover) and (pointer: fine)" ? pointerFine : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ ...RECT, toJSON: () => ({}) }) as DOMRect)
})
afterEach(() => vi.restoreAllMocks())

// The mocked motion components serialise motion values; the live ones are in useSpring's mock results.
const springs = () => vi.mocked(useSpring).mock.results.map((r) => r.value as Spring)

const motionOf = (el: Element) => JSON.parse(el.getAttribute("data-motion") ?? "{}")
const move = (x: number, y: number) => act(() => window.dispatchEvent(Object.assign(new Event("pointermove"), { clientX: x, clientY: y })))
const pulled = () => {
  const live = springs().filter((s) => s?.__mv === "spring")
  const last = live.slice(-2)
  return { x: last[0].source.get(), y: last[1].source.get() }
}

describe("magnetic CTA (SIG-51, SIG-52)", () => {
  it("follows the pointer by 0.35 of its offset, clamped to 12px, on the magnetic spring", () => {
    render(<CtaButton>Ver projetos</CtaButton>)
    const button = motionOf(screen.getByRole("button", { name: "Ver projetos" }))
    expect(button.style.x).toMatchObject({ __mv: "spring", options: spring.magnetic })
    expect(button.style.y).toMatchObject({ __mv: "spring", options: spring.magnetic })
    move(220, 136)
    expect(pulled()).toEqual({ x: 20 * 0.35, y: 10 * 0.35 })
  })

  it("clamps the pull to 12px", () => {
    render(<CtaButton>Ver projetos</CtaButton>)
    move(320, 126)
    expect(pulled()).toEqual({ x: 12, y: 0 })
  })

  it("measures the box where the control rests, not where the pull has moved it", () => {
    render(<CtaButton>Ver projetos</CtaButton>)
    move(220, 136) // pulled 7px right: the measured rect is now 7px ahead of the resting box
    move(320, 126) // 20px past the resting box's right edge + 24 − 7 = 317 → outside
    expect(pulled()).toEqual({ x: 0, y: 0 })
  })

  it("moves the arrow 1.6× as far: 0.6 more on top of the control it sits in", () => {
    const { container } = render(<CtaButton>Ver projetos</CtaButton>)
    const arrow = motionOf(container.querySelector('[aria-hidden="true"]')!)
    expect(arrow.style.x.__mv).toBe("transform")
    const [, toArrow] = vi.mocked(useTransform).mock.calls[0] as unknown as [unknown, (v: number) => number]
    expect(10 + toArrow(10)).toBe(16)
  })

  it("replaces the hover lift with the pull and keeps the press", () => {
    render(<CtaButton>Ver projetos</CtaButton>)
    const button = motionOf(screen.getByRole("button", { name: "Ver projetos" }))
    expect(button).not.toHaveProperty("whileHover")
    expect(button.whileTap).toEqual({ scale: 0.98 })
  })

  it("returns to 0 when the pointer leaves the 24px capture zone", () => {
    render(<CtaButton>Ver projetos</CtaButton>)
    move(220, 136)
    move(325, 126)
    expect(pulled()).toEqual({ x: 0, y: 0 })
  })

  it("returns to 0 when the pointer leaves the window", () => {
    render(<CtaButton>Ver projetos</CtaButton>)
    move(220, 136)
    act(() => document.documentElement.dispatchEvent(new Event("pointerleave")))
    expect(pulled()).toEqual({ x: 0, y: 0 })
  })
})

describe("magnetic chip (SIG-51)", () => {
  it("pulls at most 6px", () => {
    render(<SocialChip href="https://github.com/x" label="GitHub" />)
    expect(motionOf(screen.getByRole("link", { name: /GitHub/ })).style.x.options).toEqual(spring.magnetic)
    move(320, 100)
    expect(pulled()).toEqual({ x: 6, y: -6 })
  })
})

describe("touch (SIG-53)", () => {
  it("registers no pointermove listener and keeps the hover lift and the press", () => {
    pointerFine = false
    const add = vi.spyOn(window, "addEventListener")
    render(
      <>
        <CtaButton>Ver projetos</CtaButton>
        <SocialChip href="https://github.com/x" label="GitHub" />
      </>,
    )
    expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(0)
    const button = motionOf(screen.getByRole("button", { name: "Ver projetos" }))
    expect(button.whileHover).toBe("hover")
    expect(button.whileTap).toEqual({ scale: 0.98 })
    expect(button).not.toHaveProperty("style")
    const chip = motionOf(screen.getByRole("link", { name: /GitHub/ }))
    expect(chip.whileHover).toEqual({ y: -2 })
    expect(chip.whileTap).toEqual({ scale: 0.97 })
  })
})

describe("reduced motion (SIG-54) and disabled (SIG-55)", () => {
  it("turns the pull off under reduced motion", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const add = vi.spyOn(window, "addEventListener")
    render(<CtaButton>Ver projetos</CtaButton>)
    expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(0)
    expect(motionOf(screen.getByRole("button", { name: "Ver projetos" }))).not.toHaveProperty("style")
  })

  it("does not pull a disabled button", () => {
    const add = vi.spyOn(window, "addEventListener")
    render(<CtaButton disabled>Enviando…</CtaButton>)
    expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(0)
    expect(motionOf(screen.getByRole("button", { name: "Enviando…" }))).not.toHaveProperty("style")
  })
})
