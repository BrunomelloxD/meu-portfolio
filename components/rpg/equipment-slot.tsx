import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface EquipmentSlotProps {
  icon: LucideIcon
  label: string
  highlighted?: boolean
}

export function EquipmentSlot({ icon: Icon, label, highlighted = false }: EquipmentSlotProps) {
  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "flex aspect-square w-16 flex-col items-center justify-center gap-1 border border-er-line bg-er-surface",
        highlighted && "border-er-gold-bright ring-2 ring-er-gold-bright",
      )}
    >
      <Icon className={cn("h-6 w-6 text-er-gold", highlighted && "text-er-gold-bright")} />
      <span className="text-[10px] text-er-muted">{label}</span>
    </div>
  )
}
