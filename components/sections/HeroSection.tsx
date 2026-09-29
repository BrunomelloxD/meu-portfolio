import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { OrnamentDivider } from "@/components/rpg/ornament-divider"
import { PERSONAL_INFO, SECTION_IDS } from "@/lib/constants"

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section
      id={SECTION_IDS.HOME}
      className="min-h-screen flex items-center relative overflow-hidden bg-er-bg"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-erdtree.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-er-bg via-er-bg/70 to-er-bg/30" />
      </div>

      <div className="container mx-auto px-4 py-32 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block font-display text-xs uppercase tracking-widest text-er-gold border border-er-gold/40 bg-er-bg/60 px-3 py-1 mb-6">
            Portador da Chama
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-er-text mb-4">{PERSONAL_INFO.name}</h1>
          <h2 className="font-serif italic text-2xl md:text-3xl text-er-gold-bright mb-6">{PERSONAL_INFO.role}</h2>
          <OrnamentDivider className="mb-6" />
          <p className="font-serif text-lg md:text-xl mb-8 max-w-2xl mx-auto text-er-muted">
            Crio experiências digitais robustas com código limpo, arquitetura sólida e atenção aos detalhes.
            Especialista em React, NestJS, PHP e integração de sistemas complexos.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button variant="gold" size="lg" onClick={() => onNavigate(SECTION_IDS.PROJECTS)}>
              Ver Projetos
            </Button>
            <Button variant="gold-outline" size="lg" onClick={() => onNavigate(SECTION_IDS.CONTACT)}>
              Fale Comigo
            </Button>
          </div>
          <p className="text-sm text-er-muted mb-12">{PERSONAL_INFO.experience} em desenvolvimento Full Stack</p>
        </motion.div>
      </div>
    </section>
  )
}
