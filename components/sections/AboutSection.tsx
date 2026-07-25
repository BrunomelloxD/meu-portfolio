import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { PERSONAL_INFO, SECTION_IDS, EDUCATION, STATS } from "@/lib/constants"

export function AboutSection() {
  return (
    <section id={SECTION_IDS.ABOUT} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-sm text-primary mb-3">$ cat sobre.md</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Sobre mim</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-lg mb-4">
                Sou engenheiro de software full stack com mais de {PERSONAL_INFO.experience.replace("+", "")} construindo
                produtos digitais do zero ao deploy. Trabalho na fronteira entre front-end e back-end, unindo interfaces
                cuidadosas a arquiteturas de servidor sólidas e escaláveis.
              </p>
              <p className="text-lg mb-4">
                Já atuei em times ágeis, integrando sistemas legados, modernizando stacks e liderando decisões técnicas.
                Curioso por natureza, gosto de entender o problema de negócio antes de escrever a primeira linha de
                código.
              </p>
              <div className="mt-8">
                <h3 className="font-bold text-xl mb-2">Educação</h3>
                {EDUCATION.map((edu, index) => (
                  <div key={index} className={index > 0 ? "mt-3" : ""}>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-sm">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
