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

  it("turns selection off only for controls and display titles (SEL-02)", () => {
    expect(unselectable).toEqual([
      ':where(button, [role="button"], nav, h1, h2, a:not([href^="mailto:"], [href^="tel:"]))',
    ])
  })

  it("leaves content, the email and phone links and the form fields selectable (SEL-03)", () => {
    for (const selector of unselectable) {
      expect(selector).not.toMatch(/\b(?:html|body|main|section|p|li|dd|input|textarea)\b|\*/)
    }
  })
})
