"use client"

import { motion, useReducedMotion } from "motion/react"
import { Counter } from "@/components/counter"
import { Reveal, RevealItem } from "@/components/reveal"
import { ScrambleText } from "@/components/scramble-text"
import { WorkRow } from "@/components/work/work-row"
import { SECTION_IDS } from "@/lib/constants"
import { experiences } from "@/lib/content"
import { tween } from "@/lib/motion"

export function WorkTable() {
  const reduced = !!useReducedMotion()
  return (
    <section id={SECTION_IDS.EXPERIENCE} aria-labelledby="experiencia-title" className="scroll-mt-24 pt-24 lg:pt-44">
      <Reveal>
        <RevealItem>
          <h2
            id="experiencia-title"
            className="px-4 text-right font-mono text-[52px] font-bold leading-[52px] tracking-[-0.04em] text-ink md:px-16 lg:text-8xl lg:leading-[92px]"
          >
            <ScrambleText text="Experiência" />
          </h2>
        </RevealItem>
      </Reveal>

      {/* The table's top rule draws itself from the right as it enters (E8). */}
      <motion.div
        aria-hidden="true"
        data-rule
        className="mt-7 h-px origin-right bg-line lg:mt-10"
        {...(reduced
          ? {}
          : { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true }, transition: tween("slow") })}
      />
      <ul>
        {experiences.map((experience) => (
          <WorkRow key={`${experience.company}-${experience.period}`} experience={experience} />
        ))}
      </ul>

      <div className="mt-5 flex flex-col items-end px-4 md:px-16 lg:mt-7">
        <p className="text-sm text-ink-soft">Experiência total</p>
        <p className="text-[22px] italic leading-[30px] text-ink lg:text-[28px] lg:leading-[38px]">
          <Counter value="+3 anos" />
        </p>
      </div>
    </section>
  )
}
