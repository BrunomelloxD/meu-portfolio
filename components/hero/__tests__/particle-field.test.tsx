import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, cleanup, render } from "@testing-library/react"
import { useReducedMotion, type MotionValue } from "motion/react"
import ParticleField from "../particle-field"

/** Records what the field draws: one entry per fill() with the colour in use, and the clears. */
function fakeContext() {
  const ctx = {
    fills: [] as string[],
    arcs: [] as { x: number; y: number }[],
    clears: 0,
    fillStyle: "",
    strokeStyle: "",
    globalAlpha: 1,
    lineWidth: 1,
    setTransform: vi.fn(),
    clearRect: vi.fn(() => {
      ctx.clears++
      ctx.fills = []
      ctx.arcs = []
    }),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn((x: number, y: number) => ctx.arcs.push({ x, y })),
    fill: vi.fn(() => ctx.fills.push(ctx.fillStyle)),
  }
  return ctx
}

let ctx: ReturnType<typeof fakeContext>
let frames: FrameRequestCallback[]
let idle: (() => void) | undefined
let observer: ((entries: Partial<IntersectionObserverEntry>[]) => void) | undefined
let rect = { width: 1440, height: 900 }
let pointerFine = false

const mv = (value: number) => ({ get: () => value }) as unknown as MotionValue<number>

/** Runs the queued animation frames once. */
function flushFrame() {
  const queue = frames
  frames = []
  act(() => queue.forEach((cb) => cb(performance.now())))
}

beforeEach(() => {
  ctx = fakeContext()
  frames = []
  idle = undefined
  observer = undefined
  rect = { width: 1440, height: 900 }
  pointerFine = false
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ ...rect, left: 0, top: 0, right: rect.width, bottom: rect.height, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect,
  )
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb: FrameRequestCallback) => {
      frames.push(cb)
      return frames.length
    }),
  )
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn(() => {
      frames = []
    }),
  )
  vi.stubGlobal(
    "requestIdleCallback",
    vi.fn((cb: () => void) => {
      idle = cb
      return 1
    }),
  )
  vi.stubGlobal("cancelIdleCallback", vi.fn())
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (cb: typeof observer) {
      observer = cb
      return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn(), takeRecords: vi.fn() }
    }),
  )
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: query.includes("pointer: fine") ? pointerFine : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 })
  Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 1 })
  Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 })
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" })
})

afterEach(() => {
  cleanup() // unmount while the stubs still exist
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

const startIdle = () => act(() => idle?.())

describe("ParticleField — start (SIG-11)", () => {
  it("waits for requestIdleCallback (timeout 1200ms) before drawing anything", () => {
    render(<ParticleField />)
    expect(window.requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 1200 })
    expect(ctx.clears).toBe(0)
    expect(frames).toHaveLength(0)
    startIdle()
    expect(frames).toHaveLength(1)
  })

  it("falls back to a 200ms timeout when requestIdleCallback does not exist", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
    vi.stubGlobal("requestIdleCallback", undefined)
    render(<ParticleField />)
    act(() => vi.advanceTimersByTime(199))
    expect(frames).toHaveLength(0)
    act(() => vi.advanceTimersByTime(1))
    expect(frames).toHaveLength(1)
  })

  it("fades the canvas from opacity 0 to 1 over 600ms once it starts", () => {
    const { container } = render(<ParticleField />)
    const canvas = () => JSON.parse(container.querySelector("canvas")!.getAttribute("data-motion")!)
    expect(canvas()).toMatchObject({ initial: { opacity: 0 }, animate: { opacity: 0 }, transition: { duration: 0.6 } })
    startIdle()
    expect(canvas().animate).toEqual({ opacity: 1 })
  })
})

describe("ParticleField — drawing (SIG-13)", () => {
  it("draws 100 points at 1440px with 8 cores, 6 of them gold and the rest ink", () => {
    render(<ParticleField />)
    startIdle()
    flushFrame()
    expect(ctx.fills).toHaveLength(100)
    expect(ctx.fills.filter((c) => c === "#C9A95C")).toHaveLength(6)
    expect(ctx.fills.filter((c) => c === "#F3F3F1")).toHaveLength(94)
  })
})

describe("ParticleField — pointer (SIG-15)", () => {
  it("registers no pointermove listener without a fine pointer", () => {
    const add = vi.spyOn(window, "addEventListener")
    render(<ParticleField />)
    expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(0)
  })

  it("pushes the points near a fine pointer away from it", () => {
    pointerFine = true
    vi.spyOn(Math, "random").mockReturnValue(0.5) // every point starts at the centre (720, 450), drifting 0.165px/frame
    render(<ParticleField />)
    startIdle()
    flushFrame()
    const still = ctx.arcs[0]
    act(() => window.dispatchEvent(Object.assign(new Event("pointermove"), { clientX: 700, clientY: 450 })))
    flushFrame()
    // random 0.5 → the point drifts −0.165px/frame on x. The frame drifts it first, then the pointer 20px to its
    // left pushes it 1.2 × (1 − d / 140) px to the right.
    const drift = Math.cos(Math.PI) * (0.08 + 0.5 * 0.17)
    const d = still.x + drift - 700
    expect(ctx.arcs[0].x - still.x).toBeCloseTo(drift + 1.2 * (1 - d / 140), 6)
  })
})

describe("ParticleField — device pixel ratio (SIG-16)", () => {
  it("sizes the buffer as CSS size × min(devicePixelRatio, 2)", () => {
    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 3 })
    const { container } = render(<ParticleField />)
    startIdle()
    const canvas = container.querySelector("canvas")!
    expect(canvas.width).toBe(2880)
    expect(canvas.height).toBe(1800)
  })
})

describe("ParticleField — pausing (SIG-17, SIG-18)", () => {
  it("cancels the frame when the canvas leaves the viewport and resumes when it returns", () => {
    render(<ParticleField />)
    startIdle()
    act(() => observer?.([{ isIntersecting: false }]))
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect(frames).toHaveLength(0)
    act(() => observer?.([{ isIntersecting: true }]))
    expect(frames).toHaveLength(1)
  })

  it("stops in a hidden tab and resumes when visible again", () => {
    render(<ParticleField />)
    startIdle()
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" })
    act(() => document.dispatchEvent(new Event("visibilitychange")))
    expect(frames).toHaveLength(0)
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" })
    act(() => document.dispatchEvent(new Event("visibilitychange")))
    expect(frames).toHaveLength(1)
  })

  it("does not resume a hidden tab when the canvas comes back into view", () => {
    render(<ParticleField />)
    startIdle()
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" })
    act(() => document.dispatchEvent(new Event("visibilitychange")))
    act(() => observer?.([{ isIntersecting: true }]))
    expect(frames).toHaveLength(0)
  })
})

describe("ParticleField — reduced motion (SIG-19)", () => {
  it("draws exactly one frame and never requests another", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    render(<ParticleField />)
    startIdle()
    expect(ctx.clears).toBe(1)
    expect(ctx.fills).toHaveLength(100)
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
    act(() => document.dispatchEvent(new Event("visibilitychange")))
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })
})

describe("ParticleField — no 2D context (SIG-20)", () => {
  it("renders the canvas and draws nothing when getContext returns null", () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null)
    const { container } = render(<ParticleField />)
    expect(container.querySelector("canvas")).not.toBeNull()
    expect(window.requestIdleCallback).not.toHaveBeenCalled()
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })
})

describe("ParticleField — resize (SIG-21)", () => {
  it("resizes and recounts 150ms after the last resize event", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
    const { container } = render(<ParticleField />)
    startIdle()
    rect = { width: 390, height: 800 }
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 })
    act(() => {
      window.dispatchEvent(new Event("resize"))
      vi.advanceTimersByTime(100)
      window.dispatchEvent(new Event("resize"))
      vi.advanceTimersByTime(149)
    })
    expect(container.querySelector("canvas")!.width).toBe(1440)
    act(() => vi.advanceTimersByTime(1))
    expect(container.querySelector("canvas")!.width).toBe(390)
    flushFrame()
    expect(ctx.fills).toHaveLength(45)
  })
})

describe("ParticleField — without IntersectionObserver (SIG-22)", () => {
  it("keeps running and still pauses on visibilitychange", () => {
    vi.stubGlobal("IntersectionObserver", undefined)
    render(<ParticleField />)
    startIdle()
    expect(frames).toHaveLength(1)
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" })
    act(() => document.dispatchEvent(new Event("visibilitychange")))
    expect(frames).toHaveLength(0)
  })
})

describe("ParticleField — markup (SIG-23)", () => {
  it("is hidden from assistive tech and lets pointer events through", () => {
    const { container } = render(<ParticleField />)
    const canvas = container.querySelector("canvas")!
    expect(canvas).toHaveAttribute("aria-hidden", "true")
    expect(canvas).toHaveClass("pointer-events-none", "absolute", "inset-0")
  })
})

describe("ParticleField — scroll values (SIG-33)", () => {
  it("draws nothing when the field opacity reaches 0", () => {
    render(<ParticleField fieldOpacity={mv(0)} spread={mv(2.4)} />)
    startIdle()
    flushFrame()
    expect(ctx.clears).toBe(1)
    expect(ctx.fills).toHaveLength(0)
  })

  it("spreads the points from the centre by the spread value", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.75) // x = 1080, 360px right of the centre
    render(<ParticleField spread={mv(2)} />)
    startIdle()
    flushFrame()
    expect(ctx.arcs[0].x).toBeCloseTo(720 + (1080 + Math.cos(Math.PI * 1.5) * (0.08 + 0.75 * 0.17) - 720) * 2, 1)
  })
})
