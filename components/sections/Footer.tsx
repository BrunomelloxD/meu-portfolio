import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SOCIAL_LINKS } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">©2025 Bruno Mello. Todos os direitos reservados.</p>
          </div>

          <div className="flex space-x-4">
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Github size={18} />
              </Button>
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Linkedin size={18} />
              </Button>
            </a>
            <a href={`mailto:${SOCIAL_LINKS.email}`} aria-label="Email">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Mail size={18} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
