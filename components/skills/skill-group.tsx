import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { SkillCategory } from "@/lib/content"

interface SkillGroupProps {
  category: SkillCategory
  inverse?: boolean
  className?: string
}

export function SkillGroup({ category, inverse = false, className }: SkillGroupProps) {
  return (
    <Card variant={inverse ? "inverse" : "default"} className={cn("flex flex-col gap-3 p-6 md:p-7", className)}>
      <h3 className="text-xl leading-[26px]">{category.label}</h3>
      <p className={cn("font-mono text-sm leading-6", inverse ? "text-inverse-soft" : "text-ink-soft")}>
        {category.skills.join(" / ")}
      </p>
    </Card>
  )
}
