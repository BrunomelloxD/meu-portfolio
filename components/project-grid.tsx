"use client"

import { motion } from "framer-motion"
import { Github, ArrowRight, Layers, Database } from "lucide-react"
import { RelicCard } from "@/components/rpg/relic-card"

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
        const links = [
          { label: "Ver projeto", href: project.demo, icon: ArrowRight },
          ...project.github.map((repo) => ({
            label: `Ver código: ${repo.label}`,
            href: repo.url,
            icon: Github,
          })),
        ]

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <RelicCard
              icon={project.icon}
              title={project.title}
              tags={project.tags}
              description={project.description}
              links={links}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
