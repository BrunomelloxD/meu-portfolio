import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PanelFrameProps {
  children: ReactNode
  className?: string
}

export function PanelFrame({ children, className }: PanelFrameProps) {
  return <div className={cn("border border-er-line bg-er-surface", className)}>{children}</div>
}
