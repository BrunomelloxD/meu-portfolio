import { Menu, X } from "lucide-react"

interface MobileMenuToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenuToggle({ isOpen, onToggle }: MobileMenuToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-primary text-primary-foreground md:hidden"
      aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  )
}
