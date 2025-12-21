import { useState, useEffect } from "react"
import { SCROLL_THRESHOLD } from "@/lib/constants"

export function useActiveSection(sections: readonly string[]) {
  const [activeSection, setActiveSection] = useState(sections[0])

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= SCROLL_THRESHOLD && rect.bottom >= SCROLL_THRESHOLD) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  return activeSection
}
