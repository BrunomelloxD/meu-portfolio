"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", level: 70 },
      { name: "Angular", level: 60 },
      { name: "TypeScript", level: 75 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 80 },
      { name: "Tailwind CSS", level: 70 },
      { name: "Next.js", level: 65 },
      { name: "Jest", level: 75 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", level: 70 },
      { name: "Express", level: 60 },
      { name: "NestJS", level: 80 },
      { name: "PHP", level: 75 },
      { name: "REST API", level: 90 },
      { name: "PostgreSQL", level: 80 },
      { name: "MySQL", level: 75 },
    ],
  },
  {
    id: "outros",
    label: "Outros",
    skills: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 50 },
      { name: "CI/CD", level: 30 },
      { name: "Netlify", level: 85 },
      { name: "Agile/Scrum", level: 90 },
      { name: "Jira", level: 85 },
      { name: "Performance", level: 75 },
      { name: "Acessibilidade", level: 60 },
    ],
  },
]

export default function SkillsCloud() {
  return (
    <Tabs defaultValue="frontend" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 justify-center">
        {skillCategories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className="text-center">
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {skillCategories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.skills.map((skill, index) => (
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
        </TabsContent>
      ))}
    </Tabs>
  )
}
