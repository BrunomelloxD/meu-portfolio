import { PIX } from "@/lib/constants"

interface BrCodeInput {
  key: string
  name: string
  city: string
  amount?: string
  txid?: string
}

/** CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) over the UTF-8 bytes, as 4 uppercase hex digits (PIX-11). */
export function crc16(payload: string): string {
  let crc = 0xffff
  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8
    for (let bit = 0; bit < 8; bit++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, "0")
}

const field = (id: string, value: string) => `${id}${String(value.length).padStart(2, "0")}${value}`

// Uppercase without diacritics, cut to the field's limit (PIX-13, PIX-14).
const normalize = (text: string, max: number) => text.normalize("NFD").replace(/\p{M}/gu, "").toUpperCase().slice(0, max)

/** Static Pix BR Code (EMV MPM) with its CRC (PIX-10..PIX-15). */
export function buildBrCode({ key, name, city, amount, txid = "***" }: BrCodeInput): string {
  // Field 26 holds at most 99 characters: 4 + 14 for the GUI, 4 for the key's own id and length.
  if (!key || key.length > 77) throw new Error(`Pix key must have 1 to 77 characters, got ${key.length}`)
  const payload =
    field("00", "01") +
    field("26", field("00", "br.gov.bcb.pix") + field("01", key)) +
    field("52", "0000") +
    field("53", "986") +
    (amount ? field("54", amount) : "") +
    field("58", "BR") +
    field("59", normalize(name, 25)) +
    field("60", normalize(city, 15)) +
    field("62", field("05", txid)) +
    "6304"
  return payload + crc16(payload)
}

/** The site's own copy-and-paste code; an invalid key fails the build (PIX-41). */
export const PIX_BR_CODE = buildBrCode(PIX)
