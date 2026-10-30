"use client"

import { useState } from "react"
import { CoffeeSignature } from "@/components/coffee/coffee-signature"
import { PixCard } from "@/components/coffee/pix-card"
import { Reveal, RevealItem } from "@/components/reveal"
import { SectionLabel } from "@/components/section-label"
import { SECTION_IDS } from "@/lib/constants"

/** "Me pague um café": a Pix to the author, between Testimonials and Contact, on the Contact grid (PIX-33, PIX-34). */
export function CoffeeSection() {
  // Every successful copy redraws the steam once (PIX-38).
  const [redraw, setRedraw] = useState(0)

  return (
    <section id={SECTION_IDS.COFFEE} aria-labelledby="cafe-title" className="scroll-mt-24 px-4 pt-24 md:px-16 lg:pt-44">
      <Reveal className="flex flex-col gap-5 lg:flex-row">
        <RevealItem className="lg:w-[520px] lg:shrink-0 lg:pt-2.5">
          <SectionLabel>Café</SectionLabel>
        </RevealItem>
        <div className="flex flex-col gap-3">
          <RevealItem className="flex items-end justify-between gap-4">
            <h3 id="cafe-title" className="text-[22px] leading-[30px] text-ink lg:text-[28px] lg:leading-[38px]">
              Me pague um café
            </h3>
            <CoffeeSignature redraw={redraw} className="h-[70px] w-[62px] shrink-0 lg:hidden" />
          </RevealItem>
          <RevealItem>
            <p className="max-w-[560px] text-base text-ink-soft lg:text-[17px]">
              Se algum projeto ou post daqui te poupou umas horas, um café paga a próxima madrugada de código.
            </p>
          </RevealItem>
        </div>
      </Reveal>

      <Reveal className="mt-6 flex flex-col gap-16 lg:mt-14 lg:flex-row">
        <RevealItem className="hidden flex-col gap-4 pt-2 lg:flex lg:w-[456px] lg:shrink-0">
          <CoffeeSignature redraw={redraw} className="h-[140px] w-[124px]" />
          <p className="text-[15px] leading-[22px] text-ink-soft">
            Pix direto, sem taxa e sem cadastro.
            <br />
            Qualquer valor ajuda.
          </p>
        </RevealItem>
        <RevealItem className="lg:flex-1">
          <PixCard onCopied={() => setRedraw((n) => n + 1)} />
        </RevealItem>
      </Reveal>
    </section>
  )
}
