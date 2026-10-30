import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useCopyText } from "../useCopyText"

const writeText = vi.fn()
const setClipboard = (value: unknown) => Object.defineProperty(navigator, "clipboard", { configurable: true, value })
const execCommand = vi.fn()

/** Text sitting in the off-screen textarea when execCommand("copy") runs, and whether it is gone afterwards. */
let copiedFromTextarea: string | undefined

beforeEach(() => {
  vi.useFakeTimers()
  writeText.mockReset().mockResolvedValue(undefined)
  setClipboard({ writeText })
  copiedFromTextarea = undefined
  execCommand.mockReset().mockImplementation(() => {
    copiedFromTextarea = document.querySelector("textarea")?.value
    return true
  })
  Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand })
})
afterEach(() => {
  vi.useRealTimers()
  setClipboard(undefined)
})

describe("useCopyText without fallback (CONT-07, CONT-08)", () => {
  it("does nothing when the clipboard rejects or is missing, and never tries execCommand (CONT-08)", async () => {
    writeText.mockRejectedValue(new Error("denied"))
    const { result } = renderHook(() => useCopyText())
    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.copy("x")
    })
    expect(ok).toBe(false)
    expect(result.current).toMatchObject({ copied: false, failed: false })

    setClipboard(undefined)
    await act(async () => {
      ok = await result.current.copy("x")
    })
    expect(ok).toBe(false)
    expect(result.current).toMatchObject({ copied: false, failed: false })
    expect(execCommand).not.toHaveBeenCalled()
  })
})

describe("useCopyText with fallback (PIX-05, PIX-06, PIX-08, PIX-09)", () => {
  const hook = () => renderHook(() => useCopyText(2000, { fallback: true }))

  it("copies through execCommand in a temporary textarea when there is no clipboard (PIX-08)", async () => {
    setClipboard(undefined)
    const { result } = hook()
    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.copy("+5519997119007")
    })
    expect(execCommand).toHaveBeenCalledWith("copy")
    expect(copiedFromTextarea).toBe("+5519997119007")
    expect(document.querySelector("textarea")).toBeNull()
    expect(ok).toBe(true)
    expect(result.current.copied).toBe(true)
  })

  it("falls back to execCommand when writeText rejects (PIX-08)", async () => {
    writeText.mockRejectedValue(new Error("denied"))
    const { result } = hook()
    await act(async () => {
      await result.current.copy("code")
    })
    expect(copiedFromTextarea).toBe("code")
    expect(result.current).toMatchObject({ copied: true, failed: false })
  })

  it("reports a failed copy when execCommand fails too (PIX-09)", async () => {
    writeText.mockRejectedValue(new Error("denied"))
    execCommand.mockReturnValue(false)
    const { result } = hook()
    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.copy("code")
    })
    expect(ok).toBe(false)
    expect(result.current).toMatchObject({ copied: false, failed: true })
  })

  it("reports a failed copy when execCommand throws (PIX-09)", async () => {
    setClipboard(undefined)
    execCommand.mockImplementation(() => {
      throw new Error("unsupported")
    })
    const { result } = hook()
    await act(async () => {
      await result.current.copy("code")
    })
    expect(result.current).toMatchObject({ copied: false, failed: true })
    expect(document.querySelector("textarea")).toBeNull()
  })

  it("uses the clipboard first and keeps copied true for exactly 2000 ms (PIX-05)", async () => {
    const { result } = hook()
    await act(async () => {
      await result.current.copy("key")
    })
    expect(writeText).toHaveBeenCalledWith("key")
    expect(execCommand).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1999))
    expect(result.current.copied).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.copied).toBe(false)
  })

  it("restarts the 2000 ms on a second copy (PIX-06)", async () => {
    const { result } = hook()
    await act(async () => {
      await result.current.copy("key")
    })
    act(() => vi.advanceTimersByTime(1500))
    await act(async () => {
      await result.current.copy("key")
    })
    act(() => vi.advanceTimersByTime(1999))
    expect(result.current.copied).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.copied).toBe(false)
  })

  it("clears a previous failure when a later copy works (PIX-09)", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"))
    execCommand.mockReturnValueOnce(false)
    const { result } = hook()
    await act(async () => {
      await result.current.copy("key")
    })
    expect(result.current.failed).toBe(true)
    await act(async () => {
      await result.current.copy("key")
    })
    expect(result.current).toMatchObject({ copied: true, failed: false })
  })
})
