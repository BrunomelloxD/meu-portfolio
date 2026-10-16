import { useState, useEffect } from "react"
import { SCROLL_THRESHOLD } from "@/lib/constants"

export function useActiveSection(sections: readonly string[]) {
  const [activeSection, setActiveSection] = useState(sections[0])

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return

    // A section is active while it overlaps the band from SCROLL_THRESHOLD px to 30% of the viewport height.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (hit) setActiveSection(hit.target.id)
      },
      { rootMargin: `-${SCROLL_THRESHOLD}px 0px -70% 0px`, threshold: 0 },
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  return activeSection
}
