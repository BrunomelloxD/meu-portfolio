interface AttributeBarProps {
  name: string
  description: string
  value: number
  max?: number
}

export function AttributeBar({ name, description, value, max = 100 }: AttributeBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-er-text">{name}</span>
        <span className="font-mono text-sm text-er-gold-bright">{value}</span>
      </div>
      <p className="text-sm italic text-er-muted">{description}</p>
      <div className="h-1.5 w-full rounded-full bg-er-bg" data-testid="attribute-bar-track">
        <div
          className="h-full rounded-full bg-gradient-to-r from-er-gold to-er-gold-bright"
          style={{ width: `${percentage}%` }}
          data-testid="attribute-bar-fill"
        />
      </div>
    </div>
  )
}
