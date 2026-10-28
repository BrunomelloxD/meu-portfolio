"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { ProjectSlide } from "@/components/projects/project-slide"
import { projects } from "@/lib/content"
import { spring, tween } from "@/lib/motion"

const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches

const DESKTOP_QUERY = "(min-width: 1024px)"
// Desktop: 780px slides + 32px gap.
const STEP = 812

/** True at >= 1024px. False on the server and on the first client render, then follows the media query. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return desktop
}

export function ProjectCarousel() {
  const [index, setIndex] = useState(0)
  const desktop = useIsDesktop()
  const trackRef = useRef<HTMLDivElement>(null)
  const total = projects.length

  const go = (next: number) => {
    const target = (next + total) % total
    setIndex(target)
    // Below lg the track is a native scroll-snap list; keep it in sync with the buttons.
    if (isPhone()) {
      trackRef.current?.children[target]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") go(index + 1)
    if (event.key === "ArrowLeft") go(index - 1)
  }

  const onScroll = () => {
    const track = trackRef.current
    if (!track || !isPhone()) return
    const slide = track.children[0] as HTMLElement | undefined
    if (!slide) return
    setIndex(Math.min(total - 1, Math.round(track.scrollLeft / (slide.offsetWidth + 16))))
  }

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Projetos"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <div className="overflow-hidden">
        <motion.div
          ref={trackRef}
          data-testid="track"
          onScroll={onScroll}
          // Desktop: a spring moves the track one step per slide; the first slide is centred by the left padding.
          // Below lg the track is a native scroll-snap list, so Motion leaves its transform alone.
          animate={desktop ? { x: -index * STEP } : undefined}
          transition={spring.settle}
          style={desktop ? undefined : { transform: "none" }}
          className={[
            "flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [scrollbar-width:none]",
            "lg:snap-none lg:gap-8 lg:overflow-visible lg:px-0 lg:pl-[calc(50%-390px)]",
          ].join(" ")}
        >
          {projects.map((project, i) => {
            const active = i === index
            return (
              <motion.div
                key={project.title}
                role="group"
                aria-roledescription="slide"
                aria-label={`Projeto ${i + 1} de ${total}`}
                aria-hidden={active ? undefined : "true"}
                inert={active ? undefined : true}
                animate={{ opacity: desktop && !active ? 0.35 : 1 }}
                transition={tween("base", "inOut")}
                className="w-[88%] shrink-0 snap-center lg:h-[380px] lg:w-[780px]"
              >
                <ProjectSlide project={project} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-between px-4 md:px-16">
        <p aria-live="polite" className="font-mono text-[13px] text-ink-soft">
          {index + 1} / {total}
        </p>
        <div className="flex gap-2">
          <Button variant="icon-circle-outline" aria-label="Projeto anterior" onClick={() => go(index - 1)}>
            <span aria-hidden="true">←</span>
          </Button>
          <Button variant="icon-circle-outline" aria-label="Próximo projeto" onClick={() => go(index + 1)}>
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
