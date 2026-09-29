import { cn } from "@/lib/utils"

interface OrnamentDividerProps {
  className?: string
}

export function OrnamentDivider({ className }: OrnamentDividerProps) {
  return (
    <div
      role="separator"
      data-testid="ornament-divider"
      className={cn("flex items-center justify-center gap-3", className)}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-er-gold" />
      <span className="h-2 w-2 rotate-45 bg-er-gold" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-er-gold" />
    </div>
  )
}
