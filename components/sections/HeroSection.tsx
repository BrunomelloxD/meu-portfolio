import type { CSSProperties } from "react"
import { CtaButton } from "@/components/cta-button"
import { SocialChip } from "@/components/social-chip"
import { PERSONAL_INFO, SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants"

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
  return (
    <section id={SECTION_IDS.HOME} className="px-4 pt-14 md:px-16 lg:pt-[120px]">
      {/* --hero-fs drives the display size and, from xl up, the placement of the sentence and the CTA. */}
      <div className="relative [--hero-fs:15.4vw] sm:[--hero-fs:60px] lg:[--hero-fs:clamp(96px,10.5vw,152px)]">
        <h1 className="flex flex-col font-mono text-[length:var(--hero-fs)] font-bold leading-[0.95] tracking-[-0.04em] text-ink lg:leading-[0.92]">
          <span className="sr-only">{PERSONAL_INFO.name}, </span>
          <MaskedLine delay={0}>Engenheiro</MaskedLine>
          <MaskedLine delay={110} className="lg:self-end">
            Full Stack
          </MaskedLine>
        </h1>

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
      </div>

      <div style={order(2)} className="animate-fade-up mt-7 flex flex-wrap gap-2 lg:mt-14 lg:justify-center lg:gap-3">
        <SocialChip href={SOCIAL_LINKS.github} label="GitHub" />
        <SocialChip href={SOCIAL_LINKS.linkedin} label="LinkedIn" />
        <SocialChip href={`mailto:${SOCIAL_LINKS.email}`} label="Email" />
      </div>
    </section>
  )
}
