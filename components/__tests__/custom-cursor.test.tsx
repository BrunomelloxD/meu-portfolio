import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, render } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import * as motionModule from "motion/react"
import { useReducedMotion } from "motion/react"
import { CustomCursor, cursorMode } from "../custom-cursor"
import { spring } from "@/lib/motion"

const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8")
const motionOf = (el: Element | null) => JSON.parse(el?.getAttribute("data-motion") ?? "null")
let pointerFine = true

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
})

/** Moves the pointer over `target` (a fresh element appended to the body). */
function hover(html: string) {
  const host = document.createElement("div")
  host.innerHTML = html
  document.body.appendChild(host)
  const target = host.querySelector("[data-target]") ?? host.firstElementChild!
  act(() => {
    const event = Object.assign(new Event("pointermove", { bubbles: true }), { clientX: 10, clientY: 20 })
    target.dispatchEvent(event)
  })
  return host
}

const dot = (c: HTMLElement) => c.querySelector("[data-dot]")!
const label = (c: HTMLElement) => c.querySelector("[data-label]")!

describe("mounting (SIG-80)", () => {
  it("renders with a fine pointer and no reduced motion", () => {
    const { container } = render(<CustomCursor />)
    expect(container.querySelector("[data-custom-cursor]")).not.toBeNull()
  })

  it("renders nothing with a coarse pointer", () => {
    pointerFine = false
    expect(render(<CustomCursor />).container.innerHTML).toBe("")
  })

  it("renders nothing under reduced motion", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    expect(render(<CustomCursor />).container.innerHTML).toBe("")
  })
})

describe("the dot (SIG-81)", () => {
  it("is a hidden, fixed, click-through 10px dot in difference blend, following the pointer on the cursor spring", () => {
    const { container } = render(<CustomCursor />)
    const root = container.querySelector("[data-custom-cursor]")!
    expect(root).toHaveAttribute("aria-hidden", "true")
    expect(root).toHaveClass("pointer-events-none", "fixed")
    expect(dot(container)).toHaveClass("h-2.5", "w-2.5", "rounded-full", "bg-ink")
    // Blended on the fixed root, so it inverts the page under it.
    expect(root).toHaveClass("mix-blend-difference")
    const style = motionOf(root).style
    expect(style.x).toMatchObject({ __mv: "spring", options: spring.cursor })
    expect(style.y).toMatchObject({ __mv: "spring", options: spring.cursor })
    hover("<p>texto</p>")
    // The live springs' sources (data-motion is a render snapshot).
    const { __motionPropsOf } = motionModule as unknown as {
      __motionPropsOf: (el: Element) => { style: Record<"x" | "y", { source: { get: () => number } }> }
    }
    const live = __motionPropsOf(root).style
    expect([live.x.source.get(), live.y.source.get()]).toEqual([10, 20])
  })
})

describe("links (SIG-82)", () => {
  it("grows to scale 4 over a, button and [role=button]", () => {
    expect(cursorMode(hover('<a href="#">x</a>').firstElementChild)).toBe("link")
    const { container } = render(<CustomCursor />)
    hover('<button><span data-target>Enviar</span></button>')
    expect(motionOf(dot(container)).animate.scale).toBe(4)
    hover('<div role="button" data-target>x</div>')
    expect(motionOf(dot(container)).animate.scale).toBe(4)
  })
})

describe("projects (SIG-83)", () => {
  it("becomes an 8.8× gold disc with the word 'ver' over the active project", () => {
    const { container } = render(<CustomCursor />)
    hover('<div data-cursor="ver"><p data-target>Typeracer</p></div>')
    expect(motionOf(dot(container)).animate.scale).toBe(8.8)
    expect(dot(container)).toHaveClass("bg-accent")
    expect(container.querySelector("[data-custom-cursor]")).not.toHaveClass("mix-blend-difference")
    expect(label(container)).toHaveTextContent("ver")
    expect(label(container)).toHaveClass("font-mono", "text-[13px]")
    expect(motionOf(label(container)).animate).toEqual({ opacity: 1 })
  })

  it("is a link again over a link inside the project", () => {
    expect(cursorMode(hover('<div data-cursor="ver"><a href="#" data-target>Ver projeto</a></div>').querySelector("a"))).toBe("link")
  })
})

describe("text fields (SIG-84)", () => {
  it("hides the system cursor while mounted, except in fields", () => {
    expect(css).toMatch(/html\.has-custom-cursor,\s*html\.has-custom-cursor \*\s*\{\s*cursor:\s*none;/)
    expect(css).toMatch(/html\.has-custom-cursor :is\(input, textarea, select, \[contenteditable\]\)\s*\{\s*cursor:\s*revert;/)
    render(<CustomCursor />)
    expect(document.documentElement).toHaveClass("has-custom-cursor")
  })

  it("fades the dot out over a field", () => {
    const { container } = render(<CustomCursor />)
    for (const field of ["<input data-target />", "<textarea data-target></textarea>", "<select data-target></select>", '<div contenteditable="true" data-target></div>']) {
      hover(field)
      expect(motionOf(dot(container)).animate.opacity).toBe(0)
    }
  })
})

describe("leaving the window (SIG-85)", () => {
  it("fades out when the pointer leaves and back in when it returns", () => {
    const { container } = render(<CustomCursor />)
    hover("<p>x</p>")
    act(() => document.documentElement.dispatchEvent(new Event("pointerleave")))
    expect(motionOf(dot(container)).animate.opacity).toBe(0)
    hover("<p>x</p>")
    expect(motionOf(dot(container)).animate.opacity).toBe(1)
  })
})

describe("unmount (SIG-86)", () => {
  it("gives the system cursor back", () => {
    const { unmount } = render(<CustomCursor />)
    unmount()
    expect(document.documentElement).not.toHaveClass("has-custom-cursor")
  })
})
