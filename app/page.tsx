"use client"

import { useState, useEffect } from "react"
import ExperienceTimeline from "@/components/experience-timeline"
import ProjectGrid from "@/components/project-grid"
import SkillsCloud from "@/components/skills-cloud"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ContactSection from "@/components/contact-section"
import { TopNav } from "@/components/navigation/TopNav"
import { HeroSection } from "@/components/sections/HeroSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { Footer } from "@/components/sections/Footer"
import { SectionHeading } from "@/components/section-heading"
import { useActiveSection } from "@/hooks/useActiveSection"
import { useScrollTo } from "@/hooks/useScrollTo"
import { NAVIGATION_ITEMS, SECTION_IDS } from "@/lib/constants"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const sections = NAVIGATION_ITEMS.map((item) => item.id)
  const activeSection = useActiveSection(sections)
  const scrollToSection = useScrollTo()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav activeSection={activeSection} onNavigate={scrollToSection} />

      <main className="pt-16">
        <HeroSection onNavigate={scrollToSection} />
        <AboutSection />

        <section id={SECTION_IDS.EXPERIENCE} className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeading
              command="git log experience"
              title="Experiência Profissional"
            />
            <ExperienceTimeline />
          </div>
        </section>

        <section id={SECTION_IDS.PROJECTS} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <SectionHeading
              command="ls projects/"
              title="Projetos em Destaque"
              description="Uma seleção de projetos que mostram como transformo problemas complexos em produtos simples de usar."
            />
            <ProjectGrid />
          </div>
        </section>

        <section id={SECTION_IDS.SKILLS} className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeading
              command="ls skills/"
              title="Skills & Tecnologias"
              description="Ferramentas e linguagens que uso no dia a dia para construir produtos completos, do banco de dados à interface."
            />
            <SkillsCloud />
          </div>
        </section>

        <section id={SECTION_IDS.TESTIMONIALS} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <SectionHeading
              command="cat depoimentos.log"
              title="O Que Dizem Sobre Mim"
              description="Feedback de clientes e colegas com quem tive o prazer de trabalhar ao longo da minha carreira."
            />
            <TestimonialCarousel />
          </div>
        </section>

        <section id={SECTION_IDS.CONTACT} className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeading command="contato --iniciar" title="Vamos construir algo juntos?" />
            <ContactSection />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
