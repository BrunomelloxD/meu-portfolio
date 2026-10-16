"use client"

import { useState } from "react"
import Image from "next/image"
import type { Testimonial } from "@/lib/content"

interface TestimonialCardProps {
  testimonial: Testimonial
}

// Roughly six lines of 16px text in a 358px phone column.
const LONG_TEXT = 300

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [avatarFailed, setAvatarFailed] = useState(false)
  const long = testimonial.paragraphs.join(" ").length > LONG_TEXT

  return (
    <figure className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6 md:p-9">
      <blockquote
        data-testid="testimonial-body"
        className={`flex flex-col gap-4 text-base leading-[25px] text-ink md:text-[17px] md:leading-[27px] ${long && !expanded ? "max-md:line-clamp-6" : ""}`}
      >
        {testimonial.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </blockquote>

      {long && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
          className="-my-3 inline-flex min-h-[44px] items-center gap-1 self-start text-sm font-semibold text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
        >
          {expanded ? "Mostrar menos" : "Ler tudo"}
          <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
        </button>
      )}

      <figcaption className="flex items-center gap-3.5">
        <span className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-2 font-semibold text-ink">
          {avatarFailed ? (
            testimonial.name.charAt(0)
          ) : (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              sizes="52px"
              className="object-cover"
              onError={() => setAvatarFailed(true)}
            />
          )}
        </span>
        <span className="flex flex-col">
          <span className="font-semibold text-ink">{testimonial.name}</span>
          <span className="text-sm text-ink-soft">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}
