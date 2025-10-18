"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    id: 1,
    role: "Desenvolvedor I.III",
    company: "Gazin Tech",
    period: "2025 - Presente",
    description:
      "Manutenho e desenvolvo aplicações web, focando na melhoria contínua e na implementação de novas funcionalidades. Participo ativamente de reuniões de planejamento e revisão de código.",
    technologies: ["Angular", "Nest.js", "Next", "Docker", "TypeScript", "PHP", "Git", "PostgreSQL"],
  },
  {
    id: 2,
    role: "Desenvolvedor I.II",
    company: "Gazin Tech",
    period: "2024 - 2025",
    description:
      "Manutenho e desenvolvo aplicações web, focando na melhoria contínua e na implementação de novas funcionalidades. Participo ativamente de reuniões de planejamento e revisão de código.",
    technologies: ["Angular", "Nest.js", "Next", "Docker", "TypeScript", "PHP", "Git", "PostgreSQL"],
  },
  {
    id: 3,
    role: "Desenvolvedor Backend Júnior",
    company: "Alares Internet",
    period: "2023 - 2024",
    description:
      "Desenvolvi e mantive aplicações web de alta performance, trabalhando tanto no frontend quanto no backend. Implementei novas funcionalidades e otimizei sistemas existentes. Participei ativamente no desenvolvimento do e-commerce Alares Internet: www.alaresinternet.com.br",
    technologies: ["Nest.js", "Docker", "TypeScript", "PHP", "Git", "Prisma", "PostgreSQL"],
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
