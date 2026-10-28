"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { CtaButton } from "@/components/cta-button"
import { ScrambleFrame } from "@/components/scramble-text"
import { useScramble } from "@/hooks/useScramble"
import type { Project } from "@/lib/content"
import { tween } from "@/lib/motion"

interface ProjectSlideProps {
  project: Project
  /** The slide just became the active one: fade its picture in and slide its text 12px in (SIG-123). */
  entering?: boolean
  /** Active slide, desktop, fine pointer, no reduced motion: hovering zooms the picture and lifts the CTA (SIG-122). */
  hover?: boolean
}

const zoom = { hover: { scale: 1.03 } }
const lift = { hover: { y: -6 } }
// Reduced motion keeps only the fade (SIG-126).
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: tween("base") }
const slideIn = { initial: { opacity: 0, x: 12 }, animate: { opacity: 1, x: 0 }, transition: tween("base") }

/** The title decodes once when `play` is set on mount (SIG-125); idle, it is plain text. */
function SlideTitle({ text, play }: { text: string; play: boolean }) {
  const { frame, settled, play: start } = useScramble(text)
  useEffect(() => {
    if (play) start()
  }, [play, start])
  return settled < text.length ? <ScrambleFrame text={text} frame={frame} settled={settled} /> : text
}

export function ProjectSlide({ project, entering = false, hover = false }: ProjectSlideProps) {
  const reduced = !!useReducedMotion()
  const [imageFailed, setImageFailed] = useState(false)
  const picture = imageFailed ? (
    <div
      data-testid="image-fallback"
      className="flex h-full items-center justify-center bg-surface-2 p-6 font-mono text-xl font-bold text-ink-soft"
    >
      {project.title}
    </div>
  ) : (
    <Image
      src={project.image}
      alt={`Tela do projeto ${project.title}`}
      fill
      sizes="(min-width: 768px) 340px, 88vw"
      className="object-cover object-left-top"
      onError={() => setImageFailed(true)}
    />
  )

  return (
    <motion.article
      whileHover={hover ? "hover" : undefined}
      className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface md:flex-row"
    >
      <div className="relative h-[190px] shrink-0 overflow-hidden md:h-auto md:w-[340px]">
        <motion.div data-picture className="absolute inset-0" variants={zoom} transition={tween("base")}>
          {entering ? (
            <motion.div data-enter="picture" className="absolute inset-0" {...fadeIn}>
              {picture}
            </motion.div>
          ) : (
            picture
          )}
        </motion.div>
      </div>

      {/* The key remounts the column when the slide enters, so `initial` plays again (it only runs on mount). */}
      <motion.div
        key={entering ? "entering" : "rest"}
        data-enter={entering ? "text" : undefined}
        className="flex flex-1 flex-col gap-4 p-5 md:p-8"
        {...(entering ? (reduced ? fadeIn : slideIn) : {})}
      >
        <h3 className="font-mono text-xl font-bold leading-[26px] tracking-[-0.02em] text-ink md:text-2xl md:leading-[30px]">
          <SlideTitle text={project.title} play={entering} />
        </h3>
        <p className="text-[15px] leading-[23px] text-ink-soft">{project.description}</p>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">{tag}</Badge>
            </li>
          ))}
        </ul>
        <motion.div data-cta className="mt-auto flex flex-col gap-1 pt-2" variants={lift} transition={tween("base")}>
          <CtaButton href={project.demo} className="self-start">
            Ver projeto
          </CtaButton>
          {project.repos.length > 0 && (
            <div className="flex flex-wrap gap-x-5">
              {project.repos.map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-ink-soft transition-colors duration-200 ease-out-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Código: {repo.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.article>
  )
}
