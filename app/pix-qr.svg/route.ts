import QRCode from "qrcode"
import { PIX_BR_CODE } from "@/lib/pix"

// Built once at build time: the page shows it with <img>, so no QR code reaches the client bundle (PIX-23).
export const dynamic = "force-static"

/** The site's Pix QR Code: dark modules on white in every theme, 4-module quiet zone, level M (PIX-20..PIX-22). */
export async function GET() {
  const svg = await QRCode.toString(PIX_BR_CODE, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 4,
    color: { dark: "#111111", light: "#FFFFFF" },
  })
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
