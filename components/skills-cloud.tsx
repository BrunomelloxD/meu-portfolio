"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    skills: ["React", "Angular", "TypeScript", "JavaScript", "Ext JS", "React Native", "HTML/CSS", "Tailwind CSS", "Next.js", "Jest"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Node.js", "Express", "NestJS", "PHP", "Laravel", "Symfony", "Zend Framework", "PHPUnit", "REST API", "SQL"],
  },
  {
    id: "devops",
    label: "Dados & DevOps",
    skills: ["Git", "Docker", "CI/CD", "Agile/Scrum", "Jira", "Performance", "Acessibilidade", "ElasticSearch"],
  },
]

export default function SkillsCloud() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {skillCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-mono text-sm text-muted-foreground mb-4">{category.label}</h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="font-mono font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
