import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Copies text to the clipboard and keeps `copied` true for `ms` (CONT-07). Without a clipboard, or when the
 * copy is refused, nothing happens (CONT-08): callers keep their own default action, such as a mailto.
 */
export function useCopyText(ms = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard?.writeText(text).then(
        () => {
          setCopied(true)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => setCopied(false), ms)
        },
        () => {},
      )
    },
    [ms],
  )

  return { copied, copy }
}
