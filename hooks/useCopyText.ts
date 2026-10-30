import { useCallback, useEffect, useRef, useState } from "react"

/** Copies through a selected off-screen textarea, for browsers without the async clipboard (PIX-08). */
function execCopy(text: string): boolean {
  const area = document.createElement("textarea")
  area.value = text
  area.setAttribute("readonly", "")
  area.style.position = "fixed"
  area.style.left = "-9999px"
  document.body.appendChild(area)
  area.select()
  try {
    return document.execCommand("copy")
  } catch {
    return false
  } finally {
    area.remove()
  }
}

/**
 * Copies text to the clipboard and keeps `copied` true for `ms` (CONT-07). Without a clipboard, or when the
 * copy is refused, nothing happens (CONT-08): callers keep their own default action, such as a mailto.
 * With `fallback`, a refused or missing clipboard tries execCommand, and a copy that still fails sets `failed` (PIX-08, PIX-09).
 */
export function useCopyText(ms = 2000, { fallback = false }: { fallback?: boolean } = {}) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      const viaClipboard = navigator.clipboard
        ? await navigator.clipboard.writeText(text).then(
            () => true,
            () => false,
          )
        : false
      const ok = viaClipboard || (fallback && execCopy(text))
      if (ok) {
        setFailed(false)
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), ms)
      } else if (fallback) {
        setFailed(true)
      }
      return ok
    },
    [ms, fallback],
  )

  return { copied, failed, copy }
}
