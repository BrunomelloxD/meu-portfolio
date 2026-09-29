import type { LucideIcon } from "lucide-react"

interface RelicCardLink {
  label: string
  href: string
  icon: LucideIcon
}

interface RelicCardProps {
  icon: LucideIcon
  title: string
  tags: string[]
  description: string
  links: RelicCardLink[]
}

export function RelicCard({ icon: Icon, title, tags, description, links }: RelicCardProps) {
  return (
    <div className="flex h-full flex-col border border-er-line bg-er-surface p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-er-gold bg-er-bg">
        <Icon className="h-6 w-6 text-er-gold" />
      </div>
      <h3 className="font-display text-xl text-er-text">{title}</h3>
      <div className="mb-4 mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="border border-er-line px-2 py-0.5 text-xs text-er-muted">
            {tag}
          </span>
        ))}
      </div>
      <p className="flex-1 font-serif text-er-muted">{description}</p>
      <div className="mt-4 flex items-center gap-4">
        {links.map((link) => {
          const LinkIcon = link.icon
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-er-gold hover:text-er-gold-bright"
            >
              <LinkIcon className="h-4 w-4" />
              {link.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}
