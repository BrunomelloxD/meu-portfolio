import { describe, it, expect } from "vitest"
import { buildBrCode, crc16, PIX_BR_CODE } from "../pix"

/** Splits a TLV payload into [id, value] pairs, reading each field's two-digit length. */
function fields(payload: string): [string, string][] {
  const out: [string, string][] = []
  for (let i = 0; i < payload.length; ) {
    const id = payload.slice(i, i + 2)
    const len = Number(payload.slice(i + 2, i + 4))
    out.push([id, payload.slice(i + 4, i + 4 + len)])
    i += 4 + len
  }
  return out
}

const BCB = { key: "123e4567-e12b-12d1-a456-426655440000", name: "Fulano de Tal", city: "BRASILIA" }

describe("crc16", () => {
  it("matches the CRC-16/CCITT-FALSE check value (PIX-11)", () => {
    expect(crc16("123456789")).toBe("29B1")
  })

  it("writes 4 uppercase hex digits, zero-padded (PIX-11)", () => {
    expect(crc16("")).toBe("FFFF")
    expect(crc16("A")).toMatch(/^[0-9A-F]{4}$/)
  })
})

describe("buildBrCode", () => {
  it("gives CRC 1D3D over the BCB manual example payload (PIX-12)", () => {
    const payload =
      "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***6304"
    expect(crc16(payload)).toBe("1D3D")
  })

  it("builds the BCB example with the same fields, the name only uppercased (PIX-12, PIX-13)", () => {
    expect(buildBrCode(BCB).slice(0, -4)).toBe(
      "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913FULANO DE TAL6008BRASILIA62070503***6304",
    )
  })

  it("writes the fields in the static BR Code order, with the CRC over the payload and 6304 (PIX-10, PIX-11)", () => {
    const code = buildBrCode({ key: "+5519997119007", name: "Ana", city: "Mococa" })
    expect(fields(code)).toEqual([
      ["00", "01"],
      ["26", "0014br.gov.bcb.pix0114+5519997119007"],
      ["52", "0000"],
      ["53", "986"],
      ["58", "BR"],
      ["59", "ANA"],
      ["60", "MOCOCA"],
      ["62", "0503***"],
      ["63", crc16(code.slice(0, -4))],
    ])
    expect(code.slice(-8, -4)).toBe("6304")
  })

  it("puts an optional amount in field 54, before field 58", () => {
    const ids = fields(buildBrCode({ key: "k", name: "A", city: "B", amount: "10.00" })).map(([id, v]) => `${id}=${v}`)
    expect(ids.slice(4, 6)).toEqual(["54=10.00", "58=BR"])
  })

  it("writes the name in uppercase without diacritics, cut to 25 characters (PIX-13)", () => {
    const name = fields(buildBrCode({ key: "k", name: "João Antônio de Araújo Conceição", city: "X" })).find(([id]) => id === "59")
    expect(name?.[1]).toBe("JOAO ANTONIO DE ARAUJO CO")
  })

  it("writes the city in uppercase without diacritics, cut to 15 characters (PIX-14)", () => {
    const city = fields(buildBrCode({ key: "k", name: "A", city: "São José dos Campos do Norte" })).find(([id]) => id === "60")
    expect(city?.[1]).toBe("SAO JOSE DOS CA")
  })

  it("throws on an empty key (PIX-15)", () => {
    expect(() => buildBrCode({ key: "", name: "A", city: "B" })).toThrow(/Pix key/)
  })

  it("throws on a key longer than 77 characters and accepts one of 77 (PIX-15)", () => {
    expect(() => buildBrCode({ key: "a".repeat(78), name: "A", city: "B" })).toThrow(/Pix key/)
    expect(fields(buildBrCode({ key: "a".repeat(77), name: "A", city: "B" }))[1][1]).toHaveLength(99)
  })
})

describe("PIX_BR_CODE", () => {
  it("is the BR Code of the real Pix data (PIX-41)", () => {
    expect(PIX_BR_CODE).toBe(
      "00020126360014br.gov.bcb.pix0114+55199971190075204000053039865802BR5923BRUNO DE OLIVEIRA MELLO6006MOCOCA62070503***6304EDAF",
    )
  })
})
