import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync, statSync } from "fs"
import { join, resolve } from "path"

const ROOT = resolve(__dirname, "../..")
const SELF = resolve(__filename)

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx|css)$/.test(name) && path !== SELF ? [path] : []
  })
}

const files = ["app", "components", "lib", "hooks", "test"].flatMap((dir) => sourceFiles(join(ROOT, dir)))

describe("motion audit", () => {
  it("never imports the legacy framer-motion package (MOV-04)", () => {
    const imports = /(from\s+|import\(|require\(|vi\.mock\()\s*["']framer-motion["']/
    expect(files.filter((file) => imports.test(readFileSync(file, "utf8")))).toEqual([])
  })

  it("does not depend on framer-motion directly (MOV-04)", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))
    expect(pkg.dependencies).toHaveProperty("motion")
    expect(pkg.dependencies).not.toHaveProperty("framer-motion")
  })

  it("never animates layout properties in Motion targets (SIG-04)", () => {
    const target = /\b(?:animate|initial|exit|whileHover|whileTap|whileFocus|whileInView)=\{\{[^}]*?\b(?:width|height|top|left|right|bottom|margin\w*|padding\w*)\s*:/s
    const sources = files.filter((file) => /\.tsx?$/.test(file) && !file.includes("__tests__") && !file.endsWith("mocks.tsx"))
    expect(sources.filter((file) => target.test(readFileSync(file, "utf8")))).toEqual([])
  })

  it("has no infinite animation loops (MOV-44)", () => {
    expect(files.filter((file) => /repeat:\s*Infinity/.test(readFileSync(file, "utf8")))).toEqual([])
  })
})
