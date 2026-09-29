import { OrnamentDivider } from "@/components/rpg/ornament-divider"

interface SectionHeadingProps {
  command: string
  title: string
  description?: string
}

export function SectionHeading({ command, title, description }: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <p className="font-display text-xs uppercase tracking-widest text-er-gold mb-3">{command}</p>
      <h2 className="font-display text-3xl md:text-4xl text-er-text mb-4">{title}</h2>
      <OrnamentDivider className="mb-4" />
      {description && <p className="font-serif italic text-lg text-er-muted max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}
