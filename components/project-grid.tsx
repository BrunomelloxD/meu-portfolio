"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink, Code } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const projects = [
  {
    id: 1,
    title: "Fintech Dashboard",
    description: "Dashboard interativo para visualização de dados financeiros com gráficos e análises em tempo real.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
    category: "web",
    github: "https://github.com",
    demo: "https://exemplo.com",
  },
  {
    id: 2,
    title: "E-commerce Mobile App",
    description: "Aplicativo de compras com recursos de carrinho, pagamentos e rastreamento de pedidos.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React Native", "Redux", "Firebase", "Stripe"],
    category: "mobile",
    github: "https://github.com",
    demo: "https://exemplo.com",
  },
  {
    id: 3,
    title: "Task Management System",
    description: "Sistema completo de gerenciamento de tarefas com recursos de colaboração em equipe.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Vue.js", "Node.js", "MongoDB", "Socket.io"],
    category: "web",
    github: "https://github.com",
    demo: "https://exemplo.com",
  },
  {
    id: 4,
    title: "AI Content Generator",
    description: "Ferramenta que utiliza IA para gerar conteúdo para blogs, redes sociais e marketing.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Python", "TensorFlow", "React", "FastAPI"],
    category: "ai",
    github: "https://github.com",
    demo: "https://exemplo.com",
  },
  {
    id: 5,
    title: "Real Estate Platform",
    description: "Plataforma para busca e listagem de imóveis com mapas interativos e filtros avançados.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "PostgreSQL", "Google Maps API", "Prisma"],
    category: "web",
    github: "https://github.com",
    demo: "https://exemplo.com",
  },
  {
    id: 6,
    title: "Health Tracking App",
    description: "Aplicativo para monitoramento de saúde, exercícios e hábitos diários.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Flutter", "Firebase", "HealthKit", "Google Fit"],
    category: "mobile",
    github: "https://github.com",
    demo: "https://exemplo.com",
  },
]

export default function ProjectGrid() {
  const [filter, setFilter] = useState("all")

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {["all", "web", "mobile", "ai"].map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            onClick={() => setFilter(category)}
            className="capitalize"
          >
            {category === "all" ? "Todos" : category}
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
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="Ver código no GitHub">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Github className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label="Ver demonstração">
                    <Button size="icon" className="rounded-full">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </a>
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
