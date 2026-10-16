import { SocialChip } from "@/components/social-chip"
import { PERSONAL_INFO, SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-[120px] md:px-16 lg:pb-12 lg:pt-[200px]">
      <p className="font-mono text-[13.3vw] font-bold leading-none tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[clamp(96px,10.5vw,152px)] lg:leading-[0.92]">
        {PERSONAL_INFO.name}
      </p>

      <div className="mt-7 flex flex-col gap-7 lg:mt-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2.5">
          <SocialChip href={SOCIAL_LINKS.github} label="GitHub" />
          <SocialChip href={SOCIAL_LINKS.linkedin} label="LinkedIn" />
          <SocialChip href={`mailto:${SOCIAL_LINKS.email}`} label="Email" />
        </div>
        <a
          href={`#${SECTION_IDS.HOME}`}
          className="inline-flex h-[52px] items-center gap-2 self-start rounded-full border border-line-strong px-7 font-semibold text-ink transition-colors duration-200 ease-out-strong hover:border-ink hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Voltar ao topo
          <span aria-hidden="true">↑</span>
        </a>
      </div>

      <div className="mt-7 flex flex-col gap-1 border-t border-line pt-5 text-sm text-ink-soft lg:mt-12 lg:flex-row lg:justify-between lg:pt-6">
        <p>&copy; {new Date().getFullYear()} Bruno Mello. Todos os direitos reservados.</p>
        <p>{PERSONAL_INFO.location}</p>
      </div>
    </footer>
  )
}
