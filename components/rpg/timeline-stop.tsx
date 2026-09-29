import { Badge } from "@/components/ui/badge"

interface TimelineStopProps {
  period: string
  role: string
  company: string
  description: string
  technologies: readonly string[]
  bossPhrase: string
}

export function TimelineStop({ period, role, company, description, technologies, bossPhrase }: TimelineStopProps) {
  return (
    <div className="border border-er-line bg-er-surface p-6">
      <span className="font-mono text-sm text-er-gold">{period}</span>
      <h3 className="font-display text-xl text-er-text">{role}</h3>
      <p className="text-er-muted">{company}</p>
      <p className="mt-2 font-serif text-er-text">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>
      <div
        role="status"
        data-testid="boss-defeated"
        className="mt-4 border border-er-gold px-3 py-2 text-sm text-er-gold-bright"
      >
        Chefe derrotado: {bossPhrase}
      </div>
    </div>
  )
}
