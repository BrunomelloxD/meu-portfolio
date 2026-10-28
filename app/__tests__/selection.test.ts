import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const css = readFileSync(resolve(__dirname, "../globals.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")

/** Every `selector { … }` rule whose body turns text selection off. */
const unselectable = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(([, , body]) => /(?:^|;)\s*user-select:\s*none/.test(body))
  .map(([, selector]) => selector.trim())

describe("text selection (SEL-01..SEL-03)", () => {
  it("paints selected text in the accent, with the background colour as ink (SEL-01)", () => {
    expect(css).toMatch(/::selection \{ background-color: var\(--accent\); color: var\(--bg\); \}/)
  })

  it("turns selection off for the whole page (SEL-02)", () => {
    expect(unselectable).toEqual(["body"])
  })

  it("gives it back only to the email and phone links and the form fields, at zero specificity (SEL-03)", () => {
    const selectable = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, , body]) => /(?:^|;)\s*user-select:\s*text/.test(body))
      .map(([, selector]) => selector.trim())
    expect(selectable).toEqual([':where(a[href^="mailto:"], a[href^="tel:"], input, textarea, [contenteditable])'])
  })
})
