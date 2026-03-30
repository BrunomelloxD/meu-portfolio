"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    id: 1,
    role: "Desenvolvedor Pleno",
    company: "Gazin Tech",
    period: "2025 - Presente",
    description:
      "Desenvolvimento e manutenção de sistemas internos com foco em desempenho, escalabilidade e integração entre serviços. Atuação em sistema de renegociação de títulos, incluindo regras de negócio e fluxos financeiros. Implementação de fluxo de cadastro de novos clientes com integrações externas (Serasa, SPC e Unico). Desenvolvimento de funcionalidades para parcelamento de títulos e integração com canais do Teams via Webhook.",
    technologies: ["Angular", "React Native", "Next.js", "ExtJS", "NestJS", "PHP", "Laravel", "Symfony", "Docker", "TypeScript", "SQL", "Git", "Claude Code", "GitHub Copilot"],
  },
  {
    id: 2,
    role: "Desenvolvedor Júnior",
    company: "Gazin Tech",
    period: "2024 - 2025",
    description:
      "Desenvolvimento e manutenção de sistemas internos com foco em desempenho e escalabilidade. Atuação em sistema de renegociação de títulos e fluxos financeiros. Desenvolvimento de funcionalidades para parcelamento de títulos, incluindo cálculos e validações. Integração com avisos em canais do Teams (PHP/Webhook).",
    technologies: ["Angular", "React Native", "Next.js", "ExtJS", "NestJS", "PHP", "Laravel", "Symfony", "Slim", "Docker", "TypeScript", "SQL", "Git"],
  },
  {
    id: 3,
    role: "Desenvolvedor Backend Júnior",
    company: "Alares Internet",
    period: "2023 - 2024",
    description:
      "Participação ativa no desenvolvimento do e-commerce da Alares Internet (www.alaresinternet.com.br), contribuindo para a evolução da plataforma e melhoria da experiência do usuário. Desenvolvimento e manutenção de sistemas internos garantindo estabilidade e escalabilidade. Integração com Elasticsearch para otimização de buscas e performance de consultas. Desenvolvimento de sistema de Flyers Digitais.",
    technologies: ["NestJS", "PHP", "Laravel", "Docker", "TypeScript", "SQL", "Prisma", "Git", "Elasticsearch"],
  }
]

export default function ExperienceTimeline() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-border"></div>

      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } gap-8 md:gap-0`}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background"></div>

            {/* Content */}
            <div className="md:w-1/2 md:px-12">
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">{exp.role}</h3>
                  </div>
                  <div className="text-lg font-medium mb-2">{exp.company}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.period}</span>
                  </div>
                  <p className="mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Empty space for the other side */}
            <div className="hidden md:block md:w-1/2"></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
