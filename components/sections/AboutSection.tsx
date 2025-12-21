import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProfileImage from "@/public/images/profile-img.jpg"
import { PERSONAL_INFO, SECTION_IDS, EDUCATION } from "@/lib/constants"

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void
}

export function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <section id={SECTION_IDS.ABOUT} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative">
            <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-primary">
              <Image src={ProfileImage.src} alt={PERSONAL_INFO.name} className="w-full h-full object-cover" width={400} height={400} />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-lg border border-border">
              <p className="font-medium">{PERSONAL_INFO.experience}</p>
              <p className="text-sm text-muted-foreground">{PERSONAL_INFO.experienceType}</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="w-12 h-1 bg-primary mr-4" />
              Sobre Mim
            </h2>
            <p className="text-lg mb-4">
              Olá! Sou Bruno, um desenvolvedor full stack apaixonado por criar soluções digitais que combinam funcionalidade e
              estética.
            </p>
            <p className="text-lg mb-4">
              Com mais de 2 anos de experiência no mercado, já trabalhei em diversos projetos, desde startups até grandes
              empresas, sempre buscando inovação e excelência técnica.
            </p>
            <p className="text-lg mb-6">
              Minha abordagem combina pensamento estratégico, design centrado no usuário e desenvolvimento técnico sólido para
              criar produtos que realmente fazem a diferença.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-bold text-xl mb-2">Educação</h3>
                {EDUCATION.map((edu, index) => (
                  <div key={index} className={index > 0 ? "mt-4" : ""}>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-sm">{edu.institution}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Localização</h3>
                <p className="text-muted-foreground">{PERSONAL_INFO.location}</p>
                <p className="text-sm">Disponível para trabalho remoto e presencial</p>
              </div>
            </div>

            <Button onClick={() => onNavigate(SECTION_IDS.EXPERIENCE)}>Minha Experiência</Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
