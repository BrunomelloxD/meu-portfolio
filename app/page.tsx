"use client"

import { useState, useEffect } from "react"
import ExperienceTimeline from "@/components/experience-timeline"
import ProjectGrid from "@/components/project-grid"
import SkillsCloud from "@/components/skills-cloud"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ContactSection from "@/components/contact-section"
import { MobileMenuToggle } from "@/components/navigation/MobileMenuToggle"
import { ThemeToggle } from "@/components/navigation/ThemeToggle"
import { SideNavigation } from "@/components/navigation/SideNavigation"
import { HeroSection } from "@/components/sections/HeroSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { Footer } from "@/components/sections/Footer"
import { useActiveSection } from "@/hooks/useActiveSection"
import { useScrollTo } from "@/hooks/useScrollTo"
import { NAVIGATION_ITEMS, SECTION_IDS } from "@/lib/constants"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const sections = NAVIGATION_ITEMS.map((item) => item.id)
  const activeSection = useActiveSection(sections)
  const scrollToSection = useScrollTo()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigate = (sectionId: string) => {
    scrollToSection(sectionId)
    setIsMenuOpen(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileMenuToggle isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <ThemeToggle isMobile />
      <SideNavigation isMenuOpen={isMenuOpen} activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="md:ml-20 transition-all duration-300">
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection onNavigate={handleNavigate} />

        <section id={SECTION_IDS.EXPERIENCE} className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Minha Jornada Profissional</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um histórico das empresas e projetos que contribuíram para minha experiência e crescimento profissional.
              </p>
            </div>
            <ExperienceTimeline />
          </div>
        </section>

        <section id={SECTION_IDS.PROJECTS} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Meus Projetos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Alguns dos projetos mais recentes e relevantes que desenvolvi, demonstrando minhas habilidades e experiência em diferentes áreas.
              </p>
            </div>
            <ProjectGrid />
          </div>
        </section>

        <section id={SECTION_IDS.SKILLS} className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Minhas Habilidades</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tecnologias e ferramentas que domino e utilizo para criar soluções digitais de alta qualidade.
              </p>
            </div>
            <SkillsCloud />
          </div>
        </section>

        <section id={SECTION_IDS.TESTIMONIALS} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">O Que Dizem Sobre Mim</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Feedback de clientes e colegas com quem tive o prazer de trabalhar ao longo da minha carreira.
              </p>
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        <section id={SECTION_IDS.CONTACT} className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Vamos Conversar</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Interessado em trabalhar juntos? Entre em contato para discutirmos seu projeto ou oportunidade.
              </p>
            </div>
            <ContactSection />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
