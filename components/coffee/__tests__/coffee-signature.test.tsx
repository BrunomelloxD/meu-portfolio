import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { useReducedMotion } from "motion/react"
import { CoffeeSignature } from "../coffee-signature"

const steam = (container: HTMLElement) => [...container.querySelectorAll("[data-steam]")]
const motionOf = (el: Element) => JSON.parse(el.getAttribute("data-motion") ?? "null")

describe("<CoffeeSignature />", () => {
  it("is a decorative SVG with a cup, a saucer and 3 steam paths (PIX-36)", () => {
    const { container } = render(<CoffeeSignature redraw={0} />)
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg.querySelector("[data-part='cup']")).toBeInTheDocument()
    expect(svg.querySelector("[data-part='saucer']")).toBeInTheDocument()
    expect(steam(container)).toHaveLength(3)
  })

  it("draws the steam once on reveal with tween(hero, soft) and a 0.12 s stagger (PIX-37)", () => {
    const { container } = render(<CoffeeSignature redraw={0} />)
    steam(container).forEach((path, i) => {
      const m = motionOf(path)
      expect(m.initial).toEqual({ pathLength: 0, opacity: 0 })
      expect(m.whileInView).toEqual({ pathLength: 1, opacity: 1 })
      expect(m.viewport).toEqual({ once: true, amount: 0.1, margin: "0px 0px -10% 0px" })
      expect(m.transition).toEqual({ duration: 0.9, ease: [0.33, 1, 0.68, 1], delay: [0, 0.12, 0.24][i] })
    })
  })

  it("redraws the steam once, over dur.slow, after a copy (PIX-38)", () => {
    const { container } = render(<CoffeeSignature redraw={1} />)
    for (const path of steam(container)) {
      const m = motionOf(path)
      expect(m.animate).toEqual({ pathLength: [0, 1] })
      expect(m.transition.duration).toBe(0.7)
    }
  })

  it("rests at 0.7 opacity", () => {
    const { container } = render(<CoffeeSignature redraw={0} />)
    expect(steam(container)[0].parentElement).toHaveAttribute("opacity", "0.7")
  })

  it("stays still under reduced motion: full steam at 0.7 opacity, no reveal, no redraw (PIX-39)", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = render(<CoffeeSignature redraw={2} />)
    expect(steam(container)).toHaveLength(3)
    expect(container.querySelector("[data-motion]")).toBeNull()
    expect(steam(container)[0].parentElement).toHaveAttribute("opacity", "0.7")
  })
})
