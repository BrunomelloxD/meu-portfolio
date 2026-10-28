import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { useReducedMotion, useScroll } from "motion/react"
import { DrawnCircles } from "../drawn-circles"
import { WorkTable } from "@/components/work/work-table"

const motionOf = (el: Element | null) => JSON.parse(el?.getAttribute("data-motion") ?? "null")

describe("top circle (SIG-90)", () => {
  it("draws pathLength 0 → 1 over 1.6s with ease.soft, after 300ms", () => {
    const { container } = render(<DrawnCircles />)
    expect(motionOf(container.querySelector('[data-circle="top"] circle'))).toEqual({
      initial: { pathLength: 0 },
      animate: { pathLength: 1 },
      transition: { duration: 1.6, ease: [0.33, 1, 0.68, 1], delay: 0.3 },
    })
  })
})

describe("lower circle (SIG-91)", () => {
  it("draws with its own scroll, from entering the viewport to its centre at the centre", () => {
    const { container } = render(<DrawnCircles />)
    const lower = container.querySelector('[data-circle="lower"]')!
    expect(lower).toHaveClass("lg:block", "hidden")
    const options = vi.mocked(useScroll).mock.lastCall![0] as { target: { current: Element }; offset: string[] }
    expect(options.target.current).toBe(lower)
    expect(options.offset).toEqual(["start end", "center center"])
    const pathLength = motionOf(lower.querySelector("circle")).style.pathLength
    expect([pathLength.input, pathLength.output]).toEqual([
      [0, 1],
      [0, 1],
    ])
  })
})

describe("work rule (SIG-92)", () => {
  it("grows scaleX 0 → 1 from the right, once, over dur.slow ease.out", () => {
    const { container } = render(<WorkTable />)
    const rule = container.querySelector("[data-rule]")!
    expect(rule).toHaveClass("origin-right", "h-px", "bg-line")
    expect(motionOf(rule)).toEqual({
      initial: { scaleX: 0 },
      whileInView: { scaleX: 1 },
      viewport: { once: true },
      transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
    })
  })
})

describe("reduced motion (SIG-93)", () => {
  it("shows both circles and the rule complete, without animation", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = render(
      <>
        <DrawnCircles />
        <WorkTable />
      </>,
    )
    for (const circle of container.querySelectorAll("[data-circle] circle")) {
      expect(circle).not.toHaveAttribute("data-motion")
      expect(circle.getAttribute("stroke-dasharray")).toBeNull()
    }
    expect(container.querySelector("[data-rule]")).not.toHaveAttribute("data-motion")
  })
})

describe("decoration (SIG-94)", () => {
  it("hides the circles from assistive tech and lets pointer events through", () => {
    const { container } = render(<DrawnCircles />)
    const circles = container.querySelectorAll("[data-circle]")
    expect(circles).toHaveLength(2)
    for (const c of circles) {
      expect(c).toHaveAttribute("aria-hidden", "true")
      expect(c.getAttribute("class")).toContain("pointer-events-none")
    }
  })
})
