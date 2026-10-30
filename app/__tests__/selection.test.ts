import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, resolve } from "node:path"

const css = readFileSync(resolve(__dirname, "../globals.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")

/** Every `selector { … }` rule whose body turns text selection off. */
const unselectable = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(([, , body]) => /(?:^|;)\s*(?:-webkit-)?user-select:\s*none/.test(body))
  .map(([, selector]) => selector.trim())

describe("text selection (SEL-01..SEL-03)", () => {
  it("paints selected text in the accent, with the background colour as ink (SEL-01)", () => {
    expect(css).toMatch(/::selection \{ background-color: var\(--accent\); color: var\(--bg\); \}/)
  })

  it("turns selection off for the whole page (SEL-02)", () => {
    expect(unselectable).toEqual(["body"])
  })

  it("gives it back only to the email and phone links, the form fields and data-selectable text, at zero specificity (SEL-03, PIX-01)", () => {
    const selectable = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, , body]) => /(?:^|;)\s*(?:-webkit-)?user-select:\s*(?:text|all|auto)/.test(body))
      .map(([, selector]) => selector.trim())
    expect(selectable).toEqual([':where(a[href^="mailto:"], a[href^="tel:"], input, textarea, [contenteditable], [data-selectable])'])
  })

  it("has no component class that brings selection back or takes it from the email and phone (SEL-02, SEL-03)", () => {
    const ROOT = resolve(__dirname, "../..")
    const tsx = (dir: string): string[] =>
      readdirSync(dir).flatMap((name) => {
        const path = join(dir, name)
        if (statSync(path).isDirectory()) return name === "__tests__" ? [] : tsx(path)
        return name.endsWith(".tsx") ? [path] : []
      })
    const files = ["app", "components"].flatMap((dir) => tsx(join(ROOT, dir)))
    const using = (cls: RegExp) => files.filter((f) => cls.test(readFileSync(f, "utf8"))).map((f) => relative(ROOT, f))
    expect(using(/\bselect-(?:text|all|auto)\b/)).toEqual([])
    expect(using(/\bselect-none\b/)).toEqual(["components/social-chip.tsx"])
  })
})
