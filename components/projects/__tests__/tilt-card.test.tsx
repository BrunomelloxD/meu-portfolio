import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { useReducedMotion, useSpring } from "motion/react"
import { TiltCard } from "../tilt-card"
import { ProjectCarousel } from "../project-carousel"
import { spring } from "@/lib/motion"

type Mv = { get: () => number }
const motionOf = (el: Element | null) => JSON.parse(el?.getAttribute("data-motion") ?? "null")
// The card's two springs, in call order: rotateX then rotateY.
const angles = () => {
  const live = vi.mocked(useSpring).mock.results.map((r) => r.value as { source: Mv; options: unknown })
  const [x, y] = live.slice(-2)
  return { rotateX: x.source.get(), rotateY: y.source.get() }
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ left: 100, top: 50, width: 800, height: 400 }) as DOMRect,
  )
})
afterEach(() => vi.restoreAllMocks())

function card(enabled = true) {
  const view = render(
    <TiltCard enabled={enabled}>
      <p>Projeto</p>
    </TiltCard>,
  )
  return { ...view, root: screen.getByText("Projeto").parentElement! }
}

describe("TiltCard — tilt (SIG-61)", () => {
  it("leans with the tilt spring and a 1000px perspective", () => {
    const { root } = card()
    const style = motionOf(root).style
    expect(style.rotateX).toMatchObject({ __mv: "spring", options: spring.tilt })
    expect(style.rotateY).toMatchObject({ __mv: "spring", options: spring.tilt })
    expect(style.transformPerspective).toBe(1000)
  })

  it("follows the pointer: (0.75, 0.25) of the card gives rotateX 3°, rotateY 3°", () => {
    const { root } = card()
    fireEvent.pointerMove(root, { clientX: 100 + 600, clientY: 50 + 100 })
    expect(angles()).toEqual({ rotateX: 3, rotateY: 3 })
  })

  it("returns to 0° when the pointer leaves", () => {
    const { root } = card()
    fireEvent.pointerMove(root, { clientX: 900, clientY: 50 })
    fireEvent.pointerLeave(root)
    expect(angles()).toEqual({ rotateX: 0, rotateY: 0 })
  })
})

describe("TiltCard — spotlight (SIG-62)", () => {
  it("is a hidden, click-through 420px disc moved by transform to the pointer, fading in over dur.fast", () => {
    const { root, container } = card()
    const spot = container.querySelector("[data-spotlight]")!
    expect(spot).toHaveAttribute("aria-hidden", "true")
    expect(spot).toHaveClass("pointer-events-none", "h-[420px]", "w-[420px]")
    expect(motionOf(spot)).toMatchObject({ initial: { opacity: 0 }, animate: { opacity: 0 }, transition: { duration: 0.18 } })
    fireEvent.pointerMove(root, { clientX: 100 + 300, clientY: 50 + 200 })
    const after = motionOf(container.querySelector("[data-spotlight]"))
    expect(after.animate).toEqual({ opacity: 1 })
    expect(after.style.x).toMatchObject({ __mv: "value", current: 300 - 210 })
    expect(after.style.y).toMatchObject({ __mv: "value", current: 200 - 210 })
  })
})

describe("TiltCard — off (SIG-66)", () => {
  it("has no tilt, no spotlight and ignores the pointer when disabled", () => {
    const { root, container } = card(false)
    expect(root).not.toHaveAttribute("data-motion")
    expect(container.querySelector("[data-spotlight]")).toBeNull()
    fireEvent.pointerMove(root, { clientX: 900, clientY: 50 })
    expect(angles()).toEqual({ rotateX: 0, rotateY: 0 })
  })
})

describe("carousel gating (SIG-61, SIG-66)", () => {
  const media = (desktop: boolean, fine: boolean) =>
    vi.mocked(window.matchMedia).mockImplementation(
      (query: string) =>
        ({
          matches: query === "(min-width: 1024px)" ? desktop : query === "(hover: hover) and (pointer: fine)" ? fine : false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    )
  const spotlights = (c: HTMLElement) => c.querySelectorAll("[data-spotlight]").length

  it("tilts only the active slide on desktop with a fine pointer", () => {
    media(true, true)
    const { container } = render(<ProjectCarousel />)
    expect(spotlights(container)).toBe(1)
    const active = screen.getAllByRole("group").find((g) => !g.hasAttribute("aria-hidden"))!
    expect(active.querySelector("[data-spotlight]")).not.toBeNull()
  })

  it("does not tilt below 1024px, with a coarse pointer or under reduced motion", () => {
    media(false, true)
    expect(spotlights(render(<ProjectCarousel />).container)).toBe(0)
    media(true, false)
    expect(spotlights(render(<ProjectCarousel />).container)).toBe(0)
    media(true, true)
    vi.mocked(useReducedMotion).mockReturnValue(true)
    expect(spotlights(render(<ProjectCarousel />).container)).toBe(0)
  })
})
