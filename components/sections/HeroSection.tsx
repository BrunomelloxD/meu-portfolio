"use client"

import { useRef, type CSSProperties } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import { CtaButton } from "@/components/cta-button"
import { SocialChip } from "@/components/social-chip"
import { useIsDesktop } from "@/hooks/useMediaQuery"
import { PERSONAL_INFO, SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants"
import { heroScrollMap } from "@/lib/kinetics"
import { spring } from "@/lib/motion"

// Client only, and it waits for the browser to be idle: the h1 (LCP) never waits for the canvas.
const ParticleField = dynamic(() => import("@/components/hero/particle-field"), { ssr: false })

// The sticky nav is 96px tall from md; the pinned hero sits right under it.
const NAV_HEIGHT = 96

// Order of the fade-up items, read by .animate-fade-up in globals.css.
const order = (i: number) => ({ "--i": i }) as CSSProperties

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void
}

function MaskedLine({ children, delay, className }: { children: string; delay: number; className?: string }) {
  return (
    <span data-line className={`block overflow-hidden ${className ?? ""}`}>
      <span className="block animate-mask-up" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  )
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = !!useReducedMotion()
  const desktop = useIsDesktop()
  // From lg up the content is pinned (CSS below); the hero leaves while the pin lasts.
  const pinned = desktop && !reduced
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: pinned ? ["start start", "end end"] : ["start start", "end start"],
  })
  const progress = useSpring(scrollYProgress, spring.scroll)
  const titleScale = useTransform(progress, (p: number) => heroScrollMap(p).titleScale)
  const titleY = useTransform(progress, (p: number) => `${heroScrollMap(p).titleY}vh`)
  const contentOpacity = useTransform(progress, (p: number) => heroScrollMap(p).contentOpacity)
  const spread = useTransform(progress, (p: number) => heroScrollMap(p).spread)
  const fieldOpacity = useTransform(progress, (p: number) => heroScrollMap(p).fieldOpacity)

  // The fade-up items keep their CSS entrance; the scroll fade sits on a wrapper so the two never fight.
  const contentStyle = pinned ? { opacity: contentOpacity } : undefined

  // Keyboard focus never lands on content the pin has faded out: back to the top of the hero first (SIG-37).
  const onFocus = () => {
    const top = ref.current?.getBoundingClientRect().top ?? NAV_HEIGHT
    if (pinned && top < NAV_HEIGHT) window.scrollBy({ top: top - NAV_HEIGHT })
  }

  return (
    <section ref={ref} id={SECTION_IDS.HOME} className="relative lg:motion-safe:-mb-[25vh] lg:motion-safe:h-[170vh]">
      <div
        onFocus={onFocus}
        className="relative px-4 pt-14 md:px-16 lg:pt-[120px] lg:motion-safe:sticky lg:motion-safe:top-24 lg:motion-safe:h-[calc(100dvh-96px)]"
      >
        {reduced ? <ParticleField /> : <ParticleField spread={spread} fieldOpacity={fieldOpacity} />}

        {/* --hero-fs drives the display size and, from xl up, the placement of the sentence and the CTA. */}
        <div className="relative [--hero-fs:15.4vw] sm:[--hero-fs:60px] lg:[--hero-fs:clamp(96px,10.5vw,152px)]">
          <motion.div style={pinned ? { scale: titleScale, y: titleY, originX: 0, originY: 0 } : undefined}>
            <h1 className="flex flex-col font-mono text-[length:var(--hero-fs)] font-bold leading-[0.95] tracking-[-0.04em] text-ink lg:leading-[0.92]">
              <span className="sr-only">{PERSONAL_INFO.name}, </span>
              <MaskedLine delay={0}>Engenheiro</MaskedLine>
              <MaskedLine delay={110} className="lg:self-end">
                Full Stack
              </MaskedLine>
            </h1>
          </motion.div>

          <motion.div data-hero-content style={contentStyle}>
            <p
              style={order(0)}
              className="animate-fade-up mt-7 max-w-[380px] text-[17px] leading-[27px] text-ink-soft xl:absolute xl:bottom-1 xl:left-0 xl:mt-0 xl:max-w-[min(380px,calc(100%-5.6*var(--hero-fs)-48px))] xl:text-[19px] xl:leading-[29px]"
            >
              Crio experiências digitais robustas com <em className="text-ink">código limpo</em>,{" "}
              <em className="text-ink">arquitetura sólida</em> e atenção aos detalhes.
            </p>

            <div
              style={order(1)}
              className="animate-fade-up mt-7 xl:absolute xl:right-0 xl:top-[calc((0.92*var(--hero-fs)-52px)/2)] xl:mt-0"
            >
              <CtaButton onClick={() => onNavigate(SECTION_IDS.PROJECTS)}>Ver projetos</CtaButton>
            </div>
          </motion.div>
        </div>

        <motion.div data-hero-content style={contentStyle} className="relative">
          <div style={order(2)} className="animate-fade-up mt-7 flex flex-wrap gap-2 lg:mt-14 lg:justify-center lg:gap-3">
            <SocialChip href={SOCIAL_LINKS.github} label="GitHub" />
            <SocialChip href={SOCIAL_LINKS.linkedin} label="LinkedIn" />
            <SocialChip href={`mailto:${SOCIAL_LINKS.email}`} label="Email" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
