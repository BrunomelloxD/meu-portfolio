"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    id: 1,
    role: "Engenheiro de Software Sênior",
    company: "Grupo UND",
    period: "2026 — Presente",
    description:
      "Desenvolvimento e manutenção de sistemas internos com foco em desempenho, escalabilidade e integração entre serviços.",
    technologies: ["Vue.JS", "Next.js", "PHP", "Laravel", "Docker", "TypeScript", "SQL", "Git", "Claude Code", "GitHub Copilot"],
  },
  {
    id: 2,
    role: "Desenvolvedor Pleno",
    company: "Gazin Tech",
    period: "2025 — 2026",
    description:
      "Atuação em sistema de renegociação de títulos, incluindo regras de negócio e fluxos financeiros. Implementação de fluxo de cadastro de novos clientes com integrações externas (Serasa, SPC e Unico). Desenvolvimento de funcionalidades para parcelamento de títulos e integração com canais do Teams via Webhook.",
    technologies: ["Angular", "React Native", "Next.js", "ExtJS", "NestJS", "PHP", "Laravel", "Symfony", "Docker", "TypeScript", "SQL", "Git", "Claude Code", "GitHub Copilot"],
  },
  {
    id: 3,
    role: "Desenvolvedor Júnior",
    company: "Gazin Tech",
    period: "2024 — 2025",
    description:
      "Atuação em sistema de renegociação de títulos e fluxos financeiros. Desenvolvimento de funcionalidades para parcelamento de títulos, incluindo cálculos e validações. Integração com avisos em canais do Teams (PHP/Webhook).",
    technologies: ["Angular", "React Native", "Next.js", "ExtJS", "NestJS", "PHP", "Laravel", "Symfony", "Slim", "Docker", "TypeScript", "SQL", "Git"],
  },
  {
    id: 4,
    role: "Desenvolvedor Backend Júnior",
    company: "Alares Internet",
    period: "2023 — 2024",
    description:
      "Participação ativa no desenvolvimento do e-commerce da Alares Internet, contribuindo para a evolução da plataforma. Integração com Elasticsearch para otimização de buscas e performance de consultas. Desenvolvimento de sistema de Flyers Digitais.",
    technologies: ["NestJS", "PHP", "Laravel", "Docker", "TypeScript", "SQL", "Prisma", "Git", "Elasticsearch"],
  },
]

export default function ExperienceTimeline() {
  return (
    <div className="max-w-3xl mx-auto divide-y divide-border">
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-[8rem_1fr] gap-2 md:gap-8 py-8 first:pt-0"
        >
          <p className="font-mono text-sm text-primary">{exp.period}</p>
          <div>
            <h3 className="text-xl font-bold">{exp.role}</h3>
            <p className="text-primary/80 font-medium mb-2">{exp.company}</p>
            <p className="text-muted-foreground mb-4">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="font-mono font-normal">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
