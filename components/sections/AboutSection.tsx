import { SectionLabel } from "@/components/section-label"
import { SkillStack } from "@/components/skills/skill-stack"
import { Reveal } from "@/components/reveal"
import { SECTION_IDS, EDUCATION, STATS } from "@/lib/constants"

export function AboutSection() {
  return (
    <section
      id={SECTION_IDS.ABOUT}
      aria-labelledby="sobre-title"
      className="scroll-mt-24 px-4 pt-24 md:px-16 lg:pt-44"
    >
      <Reveal className="flex flex-col gap-7 lg:flex-row lg:gap-0">
        <div className="lg:w-[520px] lg:shrink-0 lg:pt-2.5">
          <SectionLabel id="sobre-title">Sobre</SectionLabel>
        </div>
        <div className="flex flex-col gap-10 lg:gap-14">
          <p className="max-w-[620px] text-[22px] leading-[30px] tracking-[-0.01em] text-ink-soft lg:text-[28px] lg:leading-[38px]">
            Olá! Sou o Bruno, engenheiro de software <em className="text-ink">full stack</em>.{" "}
            <em className="text-ink">+3 anos</em> de experiência.
          </p>
          <dl className="grid grid-cols-3 gap-4 lg:flex lg:gap-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-ink-soft">{stat.label}</dt>
                <dd className="font-mono text-[34px] font-bold leading-10 tracking-[-0.03em] text-ink lg:text-5xl lg:leading-[54px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <Reveal className="mt-16 lg:mt-[120px]">
        <SkillStack>
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-[13px] font-medium text-ink-soft">
              <span aria-hidden="true">…/</span>Formação<span aria-hidden="true">…</span>
            </h3>
            <ul className="flex flex-col gap-4">
              {EDUCATION.map((edu) => (
                <li key={edu.degree}>
                  <p className="text-base text-ink">{edu.degree}</p>
                  <p className="text-sm text-ink-soft">{edu.institution}</p>
                </li>
              ))}
            </ul>
          </div>
        </SkillStack>
      </Reveal>
    </section>
  )
}
