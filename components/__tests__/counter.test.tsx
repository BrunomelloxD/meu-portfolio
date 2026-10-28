import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { animate, useInView, useReducedMotion } from "motion/react"
import { Counter } from "../counter"
import { AboutSection } from "../sections/AboutSection"
import { WorkTable } from "../work/work-table"
import { ease } from "@/lib/motion"

let top = 2000

type AnimateOptions = { duration: number; ease: unknown; onUpdate: (v: number) => void; onComplete: () => void }
const lastAnimate = () => vi.mocked(animate).mock.lastCall as unknown as [number, number, AnimateOptions]
const painted = (container: HTMLElement) => container.querySelector("[data-counter] > [aria-hidden]")!

beforeEach(() => {
  top = 2000
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ top }) as DOMRect)
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 })
})
afterEach(() => vi.restoreAllMocks())

function enterView(value: string) {
  const view = render(<Counter value={value} />)
  vi.mocked(useInView).mockReturnValue(true)
  view.rerender(<Counter value={value} />)
  return view
}

describe("Counter — markup (SIG-101)", () => {
  it("renders the final value on the server, sr-only for screen readers, tabular figures", () => {
    const html = renderToString(<Counter value="20+" />)
    expect(html).toContain('<span class="sr-only">20+</span>')
    expect(html).toMatch(/<span aria-hidden="true">20<span[^>]*>\+<\/span><\/span>/)
    expect(html).toContain("tabular-nums")
  })
})

describe("Counter — counting (SIG-102)", () => {
  it("counts from 0 to the value over 1.4s with ease.out, once it enters the viewport", () => {
    const { container } = enterView("20+")
    expect(vi.mocked(useInView).mock.lastCall![1]).toEqual({ once: true, amount: 0.6 })
    const [from, to, options] = lastAnimate()
    expect([from, to]).toEqual([0, 20])
    expect(options).toMatchObject({ duration: 1.4, ease: ease.out })
    expect(painted(container).textContent).toBe("0+")
    act(() => options.onUpdate(10.6))
    expect(painted(container).textContent).toBe("11+")
    act(() => options.onComplete())
    expect(painted(container).textContent).toBe("20+")
    expect(animate).toHaveBeenCalledTimes(1)
  })

  it("does not count a figure that is already on screen at mount", () => {
    top = 100
    const { container } = enterView("3+")
    expect(animate).not.toHaveBeenCalled()
    expect(painted(container).textContent).toBe("3+")
  })
})

describe("Counter — the sign at the end (SIG-103)", () => {
  it("paints the + in --accent and pulses it 1 → 1.15 → 1 over dur.base when the count ends", () => {
    const { container } = enterView("10+")
    expect(container.querySelector("[data-sign]")).toBeNull() // plain text while counting
    act(() => lastAnimate()[2].onComplete())
    const sign = container.querySelector("[data-sign]")!
    expect(sign).toHaveClass("text-accent")
    expect(JSON.parse(sign.getAttribute("data-motion")!)).toMatchObject({
      animate: { scale: [1, 1.15, 1] },
      transition: { duration: 0.32 },
    })
  })

  it("lights the leading + of '+3 anos'", () => {
    const { container } = enterView("+3 anos")
    act(() => lastAnimate()[2].onComplete())
    expect(container.querySelector("[data-sign]")).toHaveTextContent("+")
    expect(painted(container).textContent).toBe("+3 anos")
  })
})

describe("Counter — no animation (SIG-104)", () => {
  it("shows the final text under reduced motion", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = enterView("20+")
    expect(animate).not.toHaveBeenCalled()
    expect(painted(container).textContent).toBe("20+")
  })

  it("shows a value without digits as is", () => {
    const { container } = enterView("Presente")
    expect(animate).not.toHaveBeenCalled()
    expect(painted(container).textContent).toBe("Presente")
  })
})

describe("Counter — where it applies (SIG-105)", () => {
  it("counts the three About stats and the work total", () => {
    const about = render(<AboutSection />)
    expect(screen.getAllByRole("definition").map((dd) => dd.querySelector("[data-counter] .sr-only")?.textContent)).toEqual([
      "3+",
      "20+",
      "10+",
    ])
    about.unmount()
    const { container } = render(<WorkTable />)
    expect(container.querySelector("[data-counter] .sr-only")).toHaveTextContent("+3 anos")
  })
})
