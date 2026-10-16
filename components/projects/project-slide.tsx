"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CtaButton } from "@/components/cta-button"
import type { Project } from "@/lib/content"

interface ProjectSlideProps {
  project: Project
}

export function ProjectSlide({ project }: ProjectSlideProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface md:flex-row">
      <div className="relative h-[190px] shrink-0 md:h-auto md:w-[340px]">
        {imageFailed ? (
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
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-8">
        <h3 className="font-mono text-xl font-bold leading-[26px] tracking-[-0.02em] text-ink md:text-2xl md:leading-[30px]">
          {project.title}
        </h3>
        <p className="text-[15px] leading-[23px] text-ink-soft">{project.description}</p>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">{tag}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-1 pt-2">
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
        </div>
      </div>
    </article>
  )
}
