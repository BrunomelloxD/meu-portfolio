"use client"

import { useEffect, useRef } from "react"
import { motion, stagger, usePresence, type Variants } from "motion/react"
import { Button } from "@/components/ui/button"
import { SocialChip } from "@/components/social-chip"
import { SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants"
import { tween } from "@/lib/motion"

interface MobileMenuProps {
  links: readonly { id: string; label: string }[]
  activeSection: string
  onNavigate: (sectionId: string) => void
  onClose: () => void
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.04, { startDelay: 0.08 }) } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: tween("slow") },
}

export function MobileMenu({ links, activeSection, onNavigate, onClose }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [isPresent] = usePresence()

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!isPresent}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: tween("base") }}
      exit={{ opacity: 0, transition: tween("fast") }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-bg md:hidden"
    >
      <div className="flex h-[72px] items-center justify-between px-4">
        <span className="text-base font-semibold leading-[18px] text-ink" aria-hidden="true">
          Bruno
          <br />
          Mello
        </span>
        <Button ref={closeRef} variant="pill-outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
      <div className="flex flex-col gap-10 px-4 py-10">
        <motion.ul variants={listVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
          {links.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <a
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(item.id)
                }}
                className="font-mono text-[40px] font-bold leading-[48px] tracking-[-0.04em] text-ink aria-[current=true]:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {item.label}
              </a>
            </motion.li>
          ))}
        </motion.ul>
        <Button variant="pill" className="self-start" onClick={() => onNavigate(SECTION_IDS.CONTACT)}>
          Fale comigo
        </Button>
        <div className="flex flex-wrap gap-2">
          <SocialChip href={SOCIAL_LINKS.github} label="GitHub" />
          <SocialChip href={SOCIAL_LINKS.linkedin} label="LinkedIn" />
          <SocialChip href={`mailto:${SOCIAL_LINKS.email}`} label="Email" />
        </div>
      </div>
    </motion.div>
  )
}
