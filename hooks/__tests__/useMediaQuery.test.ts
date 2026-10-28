import { describe, it, expect, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { POINTER_FINE_QUERY, useIsDesktop, useMediaQuery, usePointerFine } from "../useMediaQuery"

function stubMatchMedia(initial: Record<string, boolean>) {
  const state = { ...initial }
  const listeners = new Map<string, () => void>()
  vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    get matches() {
      return state[query] ?? false
    },
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_: string, cb: () => void) => listeners.set(query, cb)),
    removeEventListener: vi.fn(() => listeners.delete(query)),
    dispatchEvent: vi.fn(),
  }))
  return {
    change(query: string, value: boolean) {
      state[query] = value
      act(() => listeners.get(query)?.())
    },
    listening: (query: string) => listeners.has(query),
  }
}

describe("usePointerFine (SIG-03)", () => {
  it("queries (hover: hover) and (pointer: fine)", () => {
    expect(POINTER_FINE_QUERY).toBe("(hover: hover) and (pointer: fine)")
  })

  it("is false on the server", () => {
    stubMatchMedia({ [POINTER_FINE_QUERY]: true })
    function Probe() {
      return createElement("span", null, String(usePointerFine()))
    }
    expect(renderToString(createElement(Probe))).toBe("<span>false</span>")
  })

  it("is true when the media query matches and follows its changes", () => {
    const media = stubMatchMedia({ [POINTER_FINE_QUERY]: true })
    const { result } = renderHook(() => usePointerFine())
    expect(result.current).toBe(true)
    media.change(POINTER_FINE_QUERY, false)
    expect(result.current).toBe(false)
  })

  it("is false when the media query does not match", () => {
    stubMatchMedia({})
    const { result } = renderHook(() => usePointerFine())
    expect(result.current).toBe(false)
  })

  it("stops listening on unmount", () => {
    const media = stubMatchMedia({})
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 1px)"))
    expect(media.listening("(min-width: 1px)")).toBe(true)
    unmount()
    expect(media.listening("(min-width: 1px)")).toBe(false)
  })
})

describe("useIsDesktop", () => {
  it("matches at >= 1024px", () => {
    stubMatchMedia({ "(min-width: 1024px)": true })
    const { result } = renderHook(() => useIsDesktop())
    expect(result.current).toBe(true)
  })
})
