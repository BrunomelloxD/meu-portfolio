import type React from "react"
import "@/app/globals.css"
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google"
import { AccessLogger } from "@/components/AccessLogger"
import { MotionProvider } from "@/components/motion-provider"

const sourceSans = Source_Sans_3({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-sans" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" })

export const metadata = {
  title: "Bruno Mello | Engenheiro de Software Full Stack ",
  description:
    "Portfolio de Bruno Mello, engenheiro de software full stack com experiência em React, Next.js, Nest.js, PHP e muito mais. Confira meus projetos e habilidades.",
}

export const viewport = {
  themeColor: "#111111",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${sourceSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <AccessLogger />
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
