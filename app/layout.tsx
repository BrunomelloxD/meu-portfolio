import type React from "react"
import "@/app/globals.css"
import { Inter, JetBrains_Mono, Cinzel, EB_Garamond } from "next/font/google"
import { AccessLogger } from "@/components/AccessLogger"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-display" })
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-serif" })

export const metadata = {
  title: "Bruno Mello | Engenheiro de Software Full Stack ",
  description:
    "Portfolio de Bruno Mello, engenheiro de software full stack com experiência em React, Next.js, Nest.js, PHP e muito mais. Confira meus projetos e habilidades.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${jetbrainsMono.variable} ${cinzel.variable} ${ebGaramond.variable}`}>
        <AccessLogger />
        {children}
      </body>
    </html>
  )
}
