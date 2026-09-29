import { motion } from "framer-motion"
import { PanelFrame } from "@/components/rpg/panel-frame"
import { AttributeBar } from "@/components/rpg/attribute-bar"
import { PERSONAL_INFO, SECTION_IDS, EDUCATION, STATS } from "@/lib/constants"

export function AboutSection() {
  return (
    <section id={SECTION_IDS.ABOUT} className="py-20 bg-er-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="font-display text-xs uppercase tracking-widest text-er-gold mb-3">Status do Personagem</p>
          <h2 className="font-display text-3xl md:text-4xl text-er-text mb-10">Sobre mim</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <PanelFrame className="p-6">
              <h3 className="font-display text-xl text-er-gold-bright mb-4">Retrato</h3>
              <p className="text-lg text-er-text mb-1">{PERSONAL_INFO.name}</p>
              <p className="text-er-muted mb-1">{PERSONAL_INFO.role}</p>
              <p className="text-sm text-er-muted mb-4">{PERSONAL_INFO.location}</p>
              <p className="font-serif italic text-sm text-er-gold-bright">Disponível para novos projetos</p>
            </PanelFrame>

            <PanelFrame className="p-6">
              <h3 className="font-display text-xl text-er-gold-bright mb-4">Atributos</h3>
              <div className="space-y-4">
                {STATS.map((stat) => (
                  <AttributeBar key={stat.label} name={stat.label} description={stat.value} value={100} max={100} />
                ))}
                {EDUCATION.map((edu) => (
                  <AttributeBar
                    key={edu.degree}
                    name={edu.degree}
                    description={edu.institution}
                    value={100}
                    max={100}
                  />
                ))}
              </div>
            </PanelFrame>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
