"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Github, ExternalLink, Code } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// TODO: Adicione seus projetos reais aqui
// Estrutura recomendada para cada projeto:
// - title: Nome do projeto
// - description: Descrição breve (1-2 frases)
// - image: Caminho da screenshot em /public/images/projects/nome-projeto.png
// - tags: Array de tecnologias usadas
// - category: "fullstack" | "frontend" | "backend" | "mobile"
// - github: Link do repositório (opcional se for privado)
// - demo: Link do projeto em produção

const projects = [
  {
    id: 1,
    title: "Meu Portfólio Profissional",
    description: "Portfólio moderno e responsivo desenvolvido com Next.js 15, TypeScript e Tailwind CSS. Inclui modo escuro/claro e animações suaves.",
    image: "/images/projects/portfolio.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "frontend",
    github: "https://github.com/BrunomelloxD/meu-portfolio",
    demo: "https://www.brunomellodev.com.br/",
  },
  {
    id: 2,
    title: "Cronometro Codecon",
    description: "Aplicativo de cronômetro simples e eficiente com funcionalidades de iniciar, pausar e resetar. Desenvolvido com Next.",
    image: "/images/projects/cronometro-codecon.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "frontend",
    github: "https://github.com/BrunomelloxD/cronometro-codecon",
    demo: "https://cronometro.up.railway.app/",
  },
  {
    id: 3,
    title: "API Ceps BR",
    description: "API RESTful para consulta de CEPs brasileiros, integrada com banco de dados PostgreSQL e ViaCEP. Desenvolvida com Nest.js e Prisma.",
    image: "/images/projects/api.png",
    tags: ["Nest.js", "TypeScript", "PostgreSQL", "Prisma", "ViaCEP"],
    category: "backend",
    github: "",
    demo: "https://generic-api.up.railway.app/api/v1/cep/95555-000",
  },
]

export default function ProjectGrid() {
  const [filter, setFilter] = useState("all")

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  // Se não houver projetos, mostra mensagem
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Projetos em breve! Estou preparando conteúdo incrível para compartilhar.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {["all", "fullstack", "frontend", "backend", "mobile"].map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            onClick={() => setFilter(category)}
            className="capitalize"
          >
            {category === "all" ? "Todos" : category === "fullstack" ? "Full Stack" : category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-lg group">
              <div className="relative overflow-hidden aspect-video bg-muted">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  width={600}
                  height={400}
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="Ver código no GitHub">
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Github className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label="Ver demonstração">
                      <Button size="icon" className="rounded-full">
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">{project.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
