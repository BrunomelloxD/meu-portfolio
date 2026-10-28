"use client"

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react"
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from "motion/react"
import { Button } from "@/components/ui/button"
import { ProjectSlide } from "@/components/projects/project-slide"
import { projects } from "@/lib/content"
import { dragTarget } from "@/lib/kinetics"
import { spring, tween } from "@/lib/motion"
import { useIsDesktop, usePointerFine } from "@/hooks/useMediaQuery"

const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches

// Desktop: 780px slides + 32px gap.
const STEP = 812
// A drag longer than this was a drag, not a click on a link inside the slide (SIG-64).
const CLICK_SLOP = 6

export function ProjectCarousel() {
  const [index, setIndex] = useState(0)
  const desktop = useIsDesktop()
  const fine = usePointerFine()
  const reduced = !!useReducedMotion()
  // The hover on the active card needs room, a mouse and motion (SIG-122, SIG-126).
  const gestures = desktop && fine && !reduced
  // The track is draggable on desktop (SIG-121, SIG-65), not under reduced motion (SIG-126).
  const draggable = desktop && !reduced
  const trackRef = useRef<HTMLDivElement>(null)
  const trackX = useMotionValue(0)
  const dragged = useRef(false)
  // Only a slide that becomes active after mount plays the entrance (SIG-123, SIG-124).
  const [moved, setMoved] = useState(false)
  const total = projects.length

  const go = (next: number) => {
    const target = (next + total) % total
    setMoved(true)
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

  // SPEC_DEVIATION: dragMomentum is off; the settle spring inherits the release velocity instead.
  // Reason: Motion's own inertia would fight the animate target that the new index sets.
  const onDragEnd = (_: unknown, info: PanInfo) => {
    dragged.current = Math.abs(info.offset.x) > CLICK_SLOP
    // A drag stops at the ends instead of wrapping around like the buttons.
    const next = Math.min(total - 1, Math.max(0, dragTarget(index, info.offset.x, info.velocity.x)))
    // Same slide: `animate` does not change, so spring the track back by hand. It is not a move: no entrance.
    if (next === index) {
      animate(trackX, -index * STEP, { ...spring.settle, velocity: info.velocity.x })
      return
    }
    setMoved(true)
    setIndex(next)
  }

  const onClickCapture = (event: MouseEvent) => {
    if (!dragged.current) return
    dragged.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  const onScroll = () => {
    const track = trackRef.current
    if (!track || !isPhone()) return
    const slide = track.children[0] as HTMLElement | undefined
    if (!slide) return
    const next = Math.min(total - 1, Math.round(track.scrollLeft / (slide.offsetWidth + 16)))
    if (next === index) return
    setMoved(true)
    setIndex(next)
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
          onClickCapture={onClickCapture}
          {...(draggable
            ? {
                drag: "x" as const,
                dragConstraints: { left: -(total - 1) * STEP, right: 0 },
                dragElastic: 0.12,
                dragMomentum: false,
                onDragEnd,
              }
            : {})}
          // Desktop: a spring moves the track one step per slide; the first slide is centred by the left padding.
          // Below lg the track is a native scroll-snap list, so Motion leaves its transform alone.
          animate={desktop ? { x: -index * STEP } : undefined}
          transition={spring.settle}
          style={desktop ? { x: trackX } : { transform: "none" }}
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
                <ProjectSlide project={project} entering={moved && active} hover={gestures && active} />
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
