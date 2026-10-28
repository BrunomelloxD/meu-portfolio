import { Reveal, RevealItem } from "@/components/reveal"
import { SectionLabel } from "@/components/section-label"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"
import { SECTION_IDS } from "@/lib/constants"
import { PULL_QUOTE, testimonials } from "@/lib/content"

export function Testimonials() {
  return (
    <section
      id={SECTION_IDS.TESTIMONIALS}
      aria-labelledby="depoimentos-title"
      className="scroll-mt-24 px-4 pt-24 md:px-16 lg:pt-44"
    >
      <Reveal className="flex flex-col gap-5 lg:flex-row">
        <RevealItem className="lg:w-[520px] lg:shrink-0 lg:pt-2.5">
          <SectionLabel id="depoimentos-title">Depoimentos</SectionLabel>
        </RevealItem>
        <RevealItem>
          <figure className="flex flex-col gap-5">
            <blockquote className="max-w-[780px] text-[26px] italic leading-[34px] tracking-[-0.01em] text-ink lg:text-[44px] lg:leading-[54px]">
              <p>“{PULL_QUOTE.text}”</p>
            </blockquote>
            <figcaption className="text-sm text-ink-soft">
              — {PULL_QUOTE.author}, {PULL_QUOTE.company}
            </figcaption>
          </figure>
        </RevealItem>
      </Reveal>

      {/* Two masonry columns: cards keep their natural height instead of leaving gaps in a grid row. */}
      <Reveal className="mt-8 md:columns-2 md:gap-6 lg:mt-16">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="mb-3 break-inside-avoid md:mb-6">
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </Reveal>
    </section>
  )
}
