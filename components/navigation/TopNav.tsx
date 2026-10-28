"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/navigation/MobileMenu"
import { ReadingProgress } from "@/components/navigation/reading-progress"
import { NAVIGATION_ITEMS, SECTION_IDS } from "@/lib/constants"
import { spring } from "@/lib/motion"

interface TopNavProps {
  activeSection: string
  onNavigate: (sectionId: string) => void
}

const HEADER_LINKS = [SECTION_IDS.ABOUT, SECTION_IDS.EXPERIENCE, SECTION_IDS.PROJECTS, SECTION_IDS.SKILLS, SECTION_IDS.CONTACT]
const navLinks = HEADER_LINKS.map((id) => NAVIGATION_ITEMS.find((item) => item.id === id)!)

export function TopNav({ activeSection, onNavigate }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  const navigate = (sectionId: string) => {
    onNavigate(sectionId)
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-bg">
      <a
        href="#conteudo"
        className="sr-only left-4 top-4 z-50 rounded-full bg-inverse px-[22px] py-[14px] font-semibold text-inverse-ink focus:not-sr-only focus:absolute focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 md:h-24 md:px-16">
        <button
          onClick={() => navigate(SECTION_IDS.HOME)}
          aria-label="Ir para o início"
          className="text-left text-base font-semibold leading-[18px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Bruno
          <br />
          Mello
        </button>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-4">
            {navLinks.map((item) => {
              const active = activeSection === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? "true" : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate(item.id)
                    }}
                    className="relative flex flex-col items-center rounded-[10px] px-2.5 pb-4 pt-2 text-[15px] text-ink-soft transition-colors duration-200 ease-out-strong hover:text-ink aria-[current=true]:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        transition={{ layout: spring.glide }}
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-2 mx-auto h-0.5 w-4 rounded-full bg-accent"
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <Button variant="pill" className="hidden md:inline-flex" onClick={() => navigate(SECTION_IDS.CONTACT)}>
          Fale comigo
        </Button>

        <Button
          ref={menuButtonRef}
          variant="pill-outline"
          className="md:hidden"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          Menu
        </Button>
      </div>

      <ReadingProgress />

      <AnimatePresence>
        {isOpen && <MobileMenu links={navLinks} activeSection={activeSection} onNavigate={navigate} onClose={closeMenu} />}
      </AnimatePresence>
    </header>
  )
}
