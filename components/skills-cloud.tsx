"use client"

import {
  Atom,
  Triangle,
  FileCode,
  Braces,
  LayoutGrid,
  Smartphone,
  Code,
  Wind,
  Hexagon,
  TestTube,
  Server,
  Rocket,
  Cat,
  FileCode2,
  Layers,
  Component,
  Boxes,
  CheckCircle2,
  Network,
  Database,
  GitBranch,
  Container,
  Workflow,
  RefreshCw,
  ClipboardList,
  Gauge,
  Accessibility,
  Search,
  type LucideIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { PanelFrame } from "@/components/rpg/panel-frame"
import { EquipmentSlot } from "@/components/rpg/equipment-slot"

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

// Documented skill -> icon mapping (lucide-react). Every skill above has its own entry;
// no placeholder icon is reused across slots.
const SKILL_ICONS: Record<string, LucideIcon> = {
  React: Atom,
  Angular: Triangle,
  TypeScript: FileCode,
  JavaScript: Braces,
  "Ext JS": LayoutGrid,
  "React Native": Smartphone,
  "HTML/CSS": Code,
  "Tailwind CSS": Wind,
  "Next.js": Hexagon,
  Jest: TestTube,
  "Node.js": Server,
  Express: Rocket,
  NestJS: Cat,
  PHP: FileCode2,
  Laravel: Layers,
  Symfony: Component,
  "Zend Framework": Boxes,
  PHPUnit: CheckCircle2,
  "REST API": Network,
  SQL: Database,
  Git: GitBranch,
  Docker: Container,
  "CI/CD": Workflow,
  "Agile/Scrum": RefreshCw,
  Jira: ClipboardList,
  Performance: Gauge,
  Acessibilidade: Accessibility,
  ElasticSearch: Search,
}

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
          <PanelFrame className="p-6">
            <h3 className="font-display text-xs uppercase tracking-widest text-er-gold mb-4">{category.label}</h3>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill) => (
                <EquipmentSlot key={skill} icon={SKILL_ICONS[skill]} label={skill} />
              ))}
            </div>
          </PanelFrame>
        </motion.div>
      ))}
    </div>
  )
}
