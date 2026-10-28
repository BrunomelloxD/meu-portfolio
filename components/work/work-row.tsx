"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { fadeUp } from "@/lib/motion"
import type { Experience } from "@/lib/content"

interface WorkRowProps {
  experience: Experience
}

// Text colours follow the row: ink on the dark ground, on-inverse while hovered, focused or expanded.
const inverted = "group-hover:text-inverse-ink group-has-[:focus-visible]:text-inverse-ink group-data-[expanded=true]:text-inverse-ink"
const invertedSoft = "group-hover:text-inverse-soft group-has-[:focus-visible]:text-inverse-soft group-data-[expanded=true]:text-inverse-soft"

export function WorkRow({ experience }: WorkRowProps) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()
  const [start, end] = experience.period.split(" — ")

  return (
    <li
      data-expanded={expanded}
      className="group border-b border-line transition-colors duration-200 ease-out-strong hover:bg-inverse has-[:focus-visible]:bg-inverse data-[expanded=true]:bg-inverse"
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-6 px-4 py-5 text-left focus-visible:outline-none lg:min-h-[84px] lg:grid-cols-[220px_300px_1fr_24px] lg:px-16 lg:py-0"
      >
        <span className={`col-start-1 row-start-3 mt-1 font-mono text-[13px] tabular-nums text-ink-soft lg:row-start-1 lg:mt-0 lg:font-sans lg:text-[17px] lg:text-ink ${inverted}`}>
          {start} — <span className={end === "Presente" ? "text-accent group-hover:text-inverse-ink group-has-[:focus-visible]:text-inverse-ink group-data-[expanded=true]:text-inverse-ink" : ""}>{end}</span>
        </span>
        <span className={`col-start-1 row-start-1 text-[17px] font-semibold text-ink lg:col-start-2 lg:font-normal ${inverted}`}>
          {experience.company}
        </span>
        <span className={`col-start-1 row-start-2 text-sm text-ink-soft lg:col-start-3 lg:row-start-1 lg:font-mono lg:text-[15px] lg:text-ink ${inverted}`}>
          {experience.role}
          <span className="hidden lg:inline">
            {"  "}|{"  "}
            {experience.stackSummary}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`col-start-2 row-span-3 row-start-1 font-mono text-[22px] font-bold text-ink-soft lg:col-start-4 lg:row-span-1 ${invertedSoft}`}
        >
          {expanded ? "−" : "+"}
        </span>
      </button>

      {/* Opacity + y only: height is never animated, the row snaps to its new size (MOV-29). */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="painel"
            {...fadeUp(8, "base")}
            id={panelId}
            role="region"
            aria-label={`${experience.company}, ${experience.role}`}
            className="px-4 pb-6 lg:pl-[calc(4rem+220px+300px+48px)] lg:pr-16 lg:pb-10"
          >
            <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-[26px] text-inverse-ink marker:text-inverse-soft">
              {experience.highlights.map((highlight) => (
                <li key={highlight.slice(0, 32)}>{highlight}</li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <li key={tech}>
                  <Badge variant="inverse">{tech}</Badge>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
