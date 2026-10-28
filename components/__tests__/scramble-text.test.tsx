import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { useInView, useReducedMotion } from "motion/react"
import { ScrambleText } from "../scramble-text"
import { SectionLabel } from "../section-label"
import { WorkTable } from "../work/work-table"
import { HeroSection } from "../sections/HeroSection"
import { SCRAMBLE_GLYPHS } from "@/lib/text-motion"

vi.mock("next/dynamic", () => ({ default: () => () => null }))

let frames: FrameRequestCallback[]
let top = 2000 // below the fold unless a test says otherwise

function runFrame(now: number) {
  const queue = frames
  frames = []
  act(() => queue.forEach((cb) => cb(now)))
}

const painted = (container: HTMLElement) => container.querySelector("[data-scramble] > [aria-hidden]")!

beforeEach(() => {
  frames = []
  top = 2000
  vi.stubGlobal("requestAnimationFrame", vi.fn((cb: FrameRequestCallback) => frames.push(cb)))
  vi.stubGlobal("cancelAnimationFrame", vi.fn())
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ top }) as DOMRect)
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("ScrambleText — markup (SIG-42)", () => {
  it("renders the final text on the server, sr-only for screen readers and aria-hidden for the eye", () => {
    const html = renderToString(<ScrambleText text="Projetos" />)
    expect(html).toContain('<span class="sr-only">Projetos</span>')
    expect(html).toContain('<span aria-hidden="true">Projetos</span>')
  })

  it("gives the heading the final text as its accessible name", () => {
    render(<SectionLabel>Projetos</SectionLabel>)
    expect(screen.getByRole("heading", { level: 2, name: "Projetos" })).toBeInTheDocument()
  })
})

describe("ScrambleText — entering the viewport (SIG-43, SIG-46)", () => {
  it("scrambles once, left to right, and ends on the final text", () => {
    const { container, rerender } = render(<ScrambleText text="Sobre" />)
    expect(vi.mocked(useInView).mock.lastCall![1]).toEqual({ once: true, amount: 0.6 })
    vi.mocked(useInView).mockReturnValue(true)
    rerender(<ScrambleText text="Sobre" />)

    runFrame(1000) // t = 0
    const first = painted(container).textContent!
    expect(first).toHaveLength(5)
    for (const ch of first) expect(SCRAMBLE_GLYPHS).toContain(ch)
    // Nothing settled yet: the whole frame sits in the --ink-faint span.
    expect(painted(container).querySelector(".text-ink-faint")!.textContent).toBe(first)

    runFrame(1000 + 280 + 35) // two characters settled
    expect(painted(container).textContent!.slice(0, 2)).toBe("So")
    expect(painted(container).querySelector(".text-ink-faint")!.textContent).toHaveLength(3)

    runFrame(1000 + 280 + 4 * 35) // last character settles: done
    expect(painted(container).textContent).toBe("Sobre")
    expect(painted(container).querySelector(".text-ink-faint")).toBeNull()
    expect(frames).toHaveLength(0)

    rerender(<ScrambleText text="Sobre" />)
    expect(frames).toHaveLength(0)
  })
})

describe("ScrambleText — reduced motion (SIG-45)", () => {
  it("shows the final text and schedules no frames", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    vi.mocked(useInView).mockReturnValue(true)
    const { container } = render(<ScrambleText text="Contato" />)
    expect(painted(container).textContent).toBe("Contato")
    expect(requestAnimationFrame).not.toHaveBeenCalled()
  })
})

describe("ScrambleText — empty text (SIG-47)", () => {
  it("schedules no frames", () => {
    vi.mocked(useInView).mockReturnValue(true)
    render(<ScrambleText text="" />)
    expect(requestAnimationFrame).not.toHaveBeenCalled()
  })
})

describe("ScrambleText — already on screen (SIG-49)", () => {
  it("keeps a title that is above the trigger line on mount as is", () => {
    top = 100
    vi.mocked(useInView).mockReturnValue(true)
    const { container } = render(<ScrambleText text="Sobre" />)
    expect(requestAnimationFrame).not.toHaveBeenCalled()
    expect(painted(container).textContent).toBe("Sobre")
  })
})

describe("where it applies (SIG-48)", () => {
  it("decodes the section labels and the Experiência title", () => {
    const label = render(<SectionLabel>Depoimentos</SectionLabel>)
    expect(label.container.querySelector("h2 [data-scramble]")).not.toBeNull()
    label.unmount()
    render(<WorkTable />)
    const h2 = screen.getByRole("heading", { level: 2, name: "Experiência" })
    expect(h2.querySelector("[data-scramble]")).not.toBeNull()
  })

  it("never decodes the hero h1", () => {
    render(<HeroSection onNavigate={() => {}} />)
    expect(screen.getByRole("heading", { level: 1 }).querySelector("[data-scramble]")).toBeNull()
  })
})

describe("ScrambleText — hidden tab (edge case)", () => {
  it("shows the final text on the first frame after a long pause, never stuck mid-scramble", () => {
    const { container, rerender } = render(<ScrambleText text="Contato" />)
    vi.mocked(useInView).mockReturnValue(true)
    rerender(<ScrambleText text="Contato" />)
    runFrame(1000)
    runFrame(1100)
    expect(painted(container).textContent).not.toBe("Contato")
    runFrame(1000 + 60_000) // the tab was hidden for a minute: rAF did not run meanwhile
    expect(painted(container).textContent).toBe("Contato")
    expect(frames).toHaveLength(0)
  })
})
