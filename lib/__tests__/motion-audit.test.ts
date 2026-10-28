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

// Layout properties as object keys (SIG-04): `width: …`, `marginTop: …`, `top: …`.
const LAYOUT_KEY = /(?:^|[{,\s])(?:width|height|top|left|right|bottom|margin\w*|padding\w*)\s*:/;

/** The balanced object after `from`, e.g. the `{ … }` of `animate={{ … }}`, nested objects included. */
function objectAt(source: string, from: number) {
  let depth = 0;
  for (let i = from; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) return source.slice(from, i + 1);
  }
  return source.slice(from);
}

/** Every Motion target literal: animate/initial/exit/while* props and objects typed or named as variants. */
function motionTargets(source: string) {
  const starts = /\b(?:animate|initial|exit|whileHover|whileTap|whileFocus|whileInView|whileDrag)=\{\{|\bvariants=\{\{|:\s*Variants\s*=\s*\{|\bconst\s+\w+\s*=\s*\{\s*hover\s*:/g;
  const out: string[] = [];
  for (let m = starts.exec(source); m; m = starts.exec(source)) out.push(objectAt(source, source.indexOf("{", m.index + m[0].length - 2)));
  return out;
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
    const sources = files.filter((file) => /\.tsx?$/.test(file) && !file.includes("__tests__") && !file.endsWith("mocks.tsx"));
    const offenders = sources.flatMap((file) =>
      motionTargets(readFileSync(file, "utf8"))
        .filter((target) => LAYOUT_KEY.test(target))
        .map((target) => `${file}: ${target.slice(0, 80)}`),
    );
    expect(offenders).toEqual([]);
  });

  it("the SIG-04 scan finds layout keys in nested targets and in variants consts", () => {
    const nested = `<motion.div animate={{ opacity: 1, transition: { duration: 0.2 }, width: 0 }} />`;
    const variants = `const lift: Variants = { hover: { y: -2, height: 40 } }`;
    const clean = `<motion.div animate={{ x: 4, clipPath: "inset(0 0 100% 0)", transition: { delay: 0.1 } }} />`;
    expect(motionTargets(nested).some((t) => LAYOUT_KEY.test(t))).toBe(true);
    expect(motionTargets(variants).some((t) => LAYOUT_KEY.test(t))).toBe(true);
    expect(motionTargets(clean).some((t) => LAYOUT_KEY.test(t))).toBe(false);
  });

  it("has no infinite animation loops (MOV-44)", () => {
    expect(files.filter((file) => /repeat:\s*Infinity/.test(readFileSync(file, "utf8")))).toEqual([])
  })
})
