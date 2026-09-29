"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAVIGATION_ITEMS, SECTION_IDS, PERSONAL_INFO } from "@/lib/constants"

interface TopNavProps {
  activeSection: string
  onNavigate: (sectionId: string) => void
}

export function TopNav({ activeSection, onNavigate }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = NAVIGATION_ITEMS.filter((item) => item.id !== SECTION_IDS.HOME)

  const navigate = (sectionId: string) => {
    onNavigate(sectionId)
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-er-line bg-er-bg/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate(SECTION_IDS.HOME)}
          className="font-display tracking-widest text-er-text hover:text-er-gold-bright transition-colors"
          aria-label="Ir para o início"
        >
          {PERSONAL_INFO.name}
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`font-display text-xs uppercase tracking-wider transition-colors ${
                activeSection === item.id ? "text-er-gold-bright" : "text-er-muted hover:text-er-gold"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Button variant="gold" className="hidden md:inline-flex" onClick={() => navigate(SECTION_IDS.CONTACT)}>
          Fale Comigo
        </Button>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden p-2 text-er-text"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-er-line bg-er-bg px-4 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`text-left font-display text-xs uppercase tracking-wider ${
                activeSection === item.id ? "text-er-gold-bright" : "text-er-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
          <Button variant="gold" className="w-full" onClick={() => navigate(SECTION_IDS.CONTACT)}>
            Fale Comigo
          </Button>
        </div>
      )}
    </nav>
  )
}
