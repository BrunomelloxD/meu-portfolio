"use client"

import { motion } from "framer-motion"
import { Github, ArrowRight, Layers, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    id: 5,
    title: "TypeRacer",
    description: "Aplicação fullstack de corrida de digitação em tempo real. Frontend interativo e API com WebSockets para multiplayer.",
    icon: Layers,
    tags: ["React", "TypeScript", "Tailwind CSS", "Nest.js", "WebSocket"],
    github: [
      { label: "Frontend", url: "https://github.com/BrunomelloxD/typeracer-front" },
      { label: "API", url: "https://github.com/BrunomelloxD/typeracer-api" },
    ],
    demo: "https://typeracer-front-production.up.railway.app/",
  },
  {
    id: 4,
    title: "Speed Test - Medidor de Velocidade",
    description: "Aplicação fullstack para medir a velocidade da conexão de internet em tempo real. Frontend em React + Vite e API em Nest.js com PostgreSQL.",
    icon: Layers,
    tags: ["React", "Vite", "Tailwind CSS", "Nest.js", "PostgreSQL"],
    github: [
      { label: "Frontend", url: "https://github.com/BrunomelloxD/front-speed-test" },
      { label: "API", url: "https://github.com/BrunomelloxD/api-speed-test" },
    ],
    demo: "https://front-speed-test-production.up.railway.app/",
  },
  {
    id: 3,
    title: "API Ceps BR",
    description: "API RESTful para consulta de CEPs brasileiros, integrada com banco de dados PostgreSQL e ViaCEP. Desenvolvida com Nest.js e Prisma.",
    icon: Database,
    tags: ["Nest.js", "TypeScript", "PostgreSQL", "Prisma"],
    github: [],
    demo: "https://generic-api.up.railway.app/api/v1/cep/95555-000",
  },
]

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        const Icon = project.icon
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full flex flex-col transition-all hover:border-primary/50">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    Ver projeto <ArrowRight className="h-4 w-4" />
                  </a>
                  {project.github.map((repo) => (
                    <a key={repo.url} href={repo.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver código: ${repo.label}`}>
                      <Github className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
