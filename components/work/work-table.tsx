import { Reveal, RevealItem } from "@/components/reveal"
import { ScrambleText } from "@/components/scramble-text"
import { WorkRow } from "@/components/work/work-row"
import { SECTION_IDS } from "@/lib/constants"
import { experiences } from "@/lib/content"

export function WorkTable() {
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

      <ul className="mt-7 border-t border-line lg:mt-10">
        {experiences.map((experience) => (
          <WorkRow key={`${experience.company}-${experience.period}`} experience={experience} />
        ))}
      </ul>

      <div className="mt-5 flex flex-col items-end px-4 md:px-16 lg:mt-7">
        <p className="text-sm text-ink-soft">Experiência total</p>
        <p className="text-[22px] italic leading-[30px] text-ink lg:text-[28px] lg:leading-[38px]">+3 anos</p>
      </div>
    </section>
  )
}
