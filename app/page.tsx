"use client"

import ContactSection from "@/components/contact-section"
import { TopNav } from "@/components/navigation/TopNav"
import { HeroSection } from "@/components/sections/HeroSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { StatementBand } from "@/components/sections/StatementBand"
import { Footer } from "@/components/sections/Footer"
import { ProjectCarousel } from "@/components/projects/project-carousel"
import { WorkTable } from "@/components/work/work-table"
import { Testimonials } from "@/components/testimonials/testimonials"
import { SectionLabel } from "@/components/section-label"
import { Reveal } from "@/components/reveal"
import { useActiveSection } from "@/hooks/useActiveSection"
import { useScrollTo } from "@/hooks/useScrollTo"
import { NAVIGATION_ITEMS, SECTION_IDS } from "@/lib/constants"

const SECTIONS = NAVIGATION_ITEMS.map((item) => item.id)

export default function Home() {
  const activeSection = useActiveSection(SECTIONS)
  const scrollToSection = useScrollTo()

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-bg text-ink">
      {/* Thin outline circles from the inspiration: decorative, behind everything. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[150px] left-[200px] h-[360px] w-[360px] rounded-full border border-line md:-top-[250px] md:left-auto md:right-[-190px] md:h-[620px] md:w-[620px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[-380px] top-[1560px] hidden h-[760px] w-[760px] rounded-full border border-line lg:block"
      />

      <TopNav activeSection={activeSection} onNavigate={scrollToSection} />

      <main id="conteudo" className="relative">
        <HeroSection onNavigate={scrollToSection} />

        <section id={SECTION_IDS.PROJECTS} className="scroll-mt-24 pt-[88px] lg:pt-[120px]">
          <Reveal className="mb-6 px-4 md:px-16 lg:mb-8">
            <SectionLabel id="projetos-title">Projetos</SectionLabel>
          </Reveal>
          <ProjectCarousel />
        </section>

        <AboutSection />
        <StatementBand />
        <WorkTable />
        <Testimonials />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
