import { describe, it, expect, vi, afterEach } from "vitest"
import QRCode from "qrcode"
import { GET, dynamic } from "../route"
import { PIX_BR_CODE } from "@/lib/pix"

describe("GET /pix-qr.svg", () => {
  afterEach(() => vi.restoreAllMocks())

  it("answers 200 with an SVG that is cached for a year (PIX-20)", async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get("Content-Type")).toBe("image/svg+xml")
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable")
    expect(await res.text()).toMatch(/^<svg[\s\S]*<\/svg>\s*$/)
  })

  it("encodes the site's BR Code at error-correction level M with a 4-module quiet zone (PIX-20, PIX-21, PIX-22)", async () => {
    const toString = vi.spyOn(QRCode, "toString")
    const svg = await (await GET()).text()
    expect(toString).toHaveBeenCalledWith(
      PIX_BR_CODE,
      expect.objectContaining({ type: "svg", errorCorrectionLevel: "M", margin: 4 }),
    )
    // The same payload rendered by the library directly gives the same picture.
    const expected = await QRCode.toString(PIX_BR_CODE, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 4,
      color: { dark: "#111111", light: "#FFFFFF" },
    })
    expect(svg).toBe(expected)
  })

  it("draws only #111111 modules on a #FFFFFF background (PIX-21)", async () => {
    const svg = await (await GET()).text()
    const colours = new Set(svg.match(/#[0-9a-f]{6}/gi)?.map((c) => c.toUpperCase()))
    expect(colours).toEqual(new Set(["#111111", "#FFFFFF"]))
  })

  it("is prerendered as static content (PIX-23)", () => {
    expect(dynamic).toBe("force-static")
  })
})
