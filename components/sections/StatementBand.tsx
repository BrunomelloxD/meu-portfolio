import { Reveal } from "@/components/reveal"
import { HIGHLIGHT } from "@/lib/content"

export function StatementBand() {
  return (
    <div className="pt-24 lg:pt-44">
      <Reveal className="flex flex-col gap-3 bg-surface px-4 py-8 md:px-16 lg:flex-row lg:items-center lg:justify-between lg:py-14">
        <p className="font-mono text-[34px] font-bold leading-10 tracking-[-0.03em] text-ink lg:text-5xl lg:leading-[54px]">
          {HIGHLIGHT.title}
        </p>
        <p className="text-base text-ink-soft lg:max-w-[360px] lg:text-[17px] lg:leading-[27px]">{HIGHLIGHT.subtitle}</p>
      </Reveal>
    </div>
  )
}
