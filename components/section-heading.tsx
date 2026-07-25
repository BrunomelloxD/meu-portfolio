interface SectionHeadingProps {
  command: string
  title: string
  description?: string
}

export function SectionHeading({ command, title, description }: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <p className="font-mono text-sm text-primary mb-3">$ {command}</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}
