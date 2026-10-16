import { cn } from "@/lib/utils"

interface SocialChipProps {
  href: string
  label: string
  className?: string
}

export function SocialChip({ href, label, className }: SocialChipProps) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line-strong px-[18px] text-sm font-semibold text-ink",
        "transition-[color,background-color,border-color] duration-200 ease-out-strong hover:border-ink hover:bg-surface-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
    >
      {label}
      <span aria-hidden="true" className="font-mono text-[13px] text-ink-soft">
        ↗
      </span>
    </a>
  )
}
