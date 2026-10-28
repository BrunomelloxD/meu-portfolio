"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { ContactForm } from "@/components/contact/contact-form"
import { Reveal, RevealItem } from "@/components/reveal"
import { SectionLabel } from "@/components/section-label"
import { SocialChip } from "@/components/social-chip"
import { PERSONAL_INFO, SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants"

export default function ContactSection() {
  const [user, domain] = SOCIAL_LINKS.email.split("@")
  const ref = useRef<HTMLElement>(null)
  const reduced = !!useReducedMotion()
  // The last chapter rises out of a rounded cut as it enters (E10).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.6"] })
  const clipPath = useTransform(scrollYProgress, [0, 1], [
    "inset(12% 0% 0% 0% round 40px)",
    "inset(0% 0% 0% 0% round 40px)",
  ])

  return (
    <motion.section
      ref={ref}
      id={SECTION_IDS.CONTACT}
      aria-labelledby="contato-title"
      style={reduced ? undefined : { clipPath }}
      className="scroll-mt-24 px-4 pt-24 md:px-16 lg:pt-44"
    >
      <Reveal className="flex flex-col gap-5 lg:flex-row">
        <RevealItem className="lg:w-[520px] lg:shrink-0 lg:pt-2.5">
          <SectionLabel id="contato-title">Contato</SectionLabel>
        </RevealItem>
        <div className="flex flex-col gap-3">
          <RevealItem>
            <p className="text-[22px] leading-[30px] text-ink lg:text-[28px] lg:leading-[38px]">Vamos construir algo juntos?</p>
          </RevealItem>
          <RevealItem>
            <p className="text-base text-ink-soft lg:text-[17px]">
              Disponível para trabalho remoto ou presencial, e para reuniões presenciais.
            </p>
          </RevealItem>
        </div>
      </Reveal>

      <Reveal className="mt-8 lg:mt-14">
        <a
          href={`mailto:${SOCIAL_LINKS.email}`}
          className="group inline-flex flex-wrap items-center gap-x-5 font-mono text-[40px] font-bold leading-[44px] tracking-[-0.04em] text-ink transition-colors duration-200 ease-out-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:text-[clamp(56px,6.6vw,96px)] lg:leading-[0.96]"
        >
          <span>
            {user}@<wbr />
            {domain}
          </span>
          <span aria-hidden="true" className="text-[34px] text-accent transition-transform duration-200 ease-out-strong group-hover:-translate-y-1 group-hover:translate-x-1 lg:text-5xl">
            ↗
          </span>
        </a>
      </Reveal>

      <Reveal className="mt-8 flex flex-col gap-8 lg:mt-14 lg:flex-row lg:gap-16">
        <dl className="flex flex-col gap-6 lg:w-[456px] lg:shrink-0 lg:gap-8">
          <div className="flex flex-col gap-1.5">
            <dt className="font-mono text-[13px] text-ink-soft">Telefone</dt>
            <dd>
              <a href="tel:+5519997119007" className="text-ink hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:text-[17px]">
                +55 (19) 99711-9007
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="font-mono text-[13px] text-ink-soft">Localização</dt>
            <dd className="text-ink lg:text-[17px]">{PERSONAL_INFO.location}</dd>
          </div>
          <div className="flex flex-col gap-2.5">
            <dt className="font-mono text-[13px] text-ink-soft">Redes</dt>
            <dd className="flex flex-wrap gap-2.5">
              <SocialChip href={SOCIAL_LINKS.github} label="GitHub" />
              <SocialChip href={SOCIAL_LINKS.linkedin} label="LinkedIn" />
            </dd>
          </div>
        </dl>
        <div className="flex-1">
          <ContactForm />
        </div>
      </Reveal>
    </motion.section>
  )
}
