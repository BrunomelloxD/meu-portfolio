"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", level: 70 },
      { name: "Angular", level: 40 },
      { name: "TypeScript", level: 75 },
      { name: "JavaScript", level: 90 },
      { name: "Ext JS", level: 70 },
      { name: "React Native", level: 60 },
      { name: "HTML/CSS", level: 80 },
      { name: "Tailwind CSS", level: 70 },
      { name: "Next.js", level: 65 },
      { name: "Jest", level: 60 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", level: 80 },
      { name: "Express", level: 70 },
      { name: "NestJS", level: 80 },
      { name: "PHP", level: 75 },
      { name: "Laravel", level: 75 },
      { name: "Symfony", level: 75 },
      { name: "Zend Framework", level: 75 },
      { name: "PHPUnit", level: 75 },
      { name: "REST API", level: 90 },
      { name: "SQL", level: 90 }
    ],
  },
  {
    id: "outros",
    label: "Outros",
    skills: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 50 },
      { name: "CI/CD", level: 30 },
      { name: "Agile/Scrum", level: 90 },
      { name: "Jira", level: 85 },
      { name: "Performance", level: 75 },
      { name: "Acessibilidade", level: 60 },
      { name: "ElasticSearch", level: 60 },
    ],
  },
]

export default function SkillsCloud() {
  const [activeCategory, setActiveCategory] = useState("frontend")

  const currentSkills = skillCategories.find((cat) => cat.id === activeCategory)?.skills || []

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {skillCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
            className="capitalize"
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-2">
                  <span className="font-medium">{skill.name}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  ></motion.div>
                </div>
                <div className="text-right mt-1">
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
