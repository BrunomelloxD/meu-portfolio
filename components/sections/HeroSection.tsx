import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PERSONAL_INFO, SECTION_IDS } from "@/lib/constants"

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section id={SECTION_IDS.HOME} className="min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-secondary/20 to-transparent opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Bruno <span className="text-primary">Mello</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground mb-6">{PERSONAL_INFO.role}</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Criando experiências digitais excepcionais com código limpo e design intuitivo. Especializado em React, Nest.js, PHP
            e arquitetura de sistemas modernos.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => onNavigate(SECTION_IDS.PROJECTS)}>
              Ver Projetos
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate(SECTION_IDS.CONTACT)}>
              Fale Comigo
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 border border-primary"
          onClick={() => onNavigate(SECTION_IDS.ABOUT)}
          aria-label="Rolar para baixo"
        >
          <ChevronRight className="rotate-90" />
        </Button>
      </div>
    </section>
  )
}
