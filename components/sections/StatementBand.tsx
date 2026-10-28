"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react"
import { HIGHLIGHT } from "@/lib/content"
import { marqueeStep } from "@/lib/kinetics"
import { spring } from "@/lib/motion"

// What the band runs: the highlight, then the systems it integrates and where.
const SEQUENCE = [HIGHLIGHT.title, "Serasa", "SPC", "Unico", "Gazin Tech"]
const TYPE = "font-mono text-[34px] font-bold leading-10 tracking-[-0.03em] text-ink lg:text-[64px] lg:leading-[72px]"

function Copy({ copyRef }: { copyRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={copyRef} data-copy className="flex shrink-0 items-center">
      {SEQUENCE.map((item) => (
        <span key={item} className="flex items-center">
          {item}
          <span data-star className="mx-[0.5em] text-accent">
            ✦
          </span>
        </span>
      ))}
    </div>
  )
}

/**
 * The highlight as an endless line (E7): it runs at 40px/s, speeds up, reverses and leans with the scroll
 * velocity, and opens from the centre as it enters (E10). Reduced motion gets the title still.
 */
export function StatementBand() {
  const ref = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const copyWidth = useRef(0)
  const reduced = !!useReducedMotion()
  const inView = useInView(ref)
  const [held, setHeld] = useState(false)
  // It runs for more than 5s, so it needs a stop control too (WCAG 2.2.2, SIG-77).
  const [stopped, setStopped] = useState(false)

  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), spring.velocity)
  const skewX = useTransform(velocity, [-2000, 2000], [-8, 8], { clamp: true })
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start center"] })
  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"])

  useEffect(() => {
    const copy = copyRef.current
    if (!copy) return
    const measure = () => {
      copyWidth.current = copy.offsetWidth
    }
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(copy)
    return () => observer.disconnect()
  }, [reduced])

  useAnimationFrame((_, delta) => {
    if (reduced || !inView || held || stopped) return
    x.set(marqueeStep(x.get(), delta, velocity.get(), copyWidth.current))
  })

  const hold = () => setHeld(true)
  const release = () => setHeld(false)

  return (
    <div className="pt-24 lg:pt-44">
      <motion.section
        ref={ref}
        style={reduced ? undefined : { clipPath }}
        onPointerEnter={hold}
        onPointerLeave={release}
        onFocus={hold}
        onBlur={release}
        className="flex flex-col gap-3 overflow-hidden bg-surface py-8 lg:gap-5 lg:py-14"
      >
        {reduced ? (
          <p className={`px-4 md:px-16 ${TYPE}`}>{HIGHLIGHT.title}</p>
        ) : (
          <>
            <p className="sr-only">{HIGHLIGHT.title}</p>
            <motion.div aria-hidden="true" data-track style={{ x, skewX }} className={`flex w-max whitespace-nowrap ${TYPE}`}>
              <Copy copyRef={copyRef} />
              <Copy />
            </motion.div>
          </>
        )}
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between md:px-16">
          <p className="text-base text-ink-soft lg:max-w-[720px] lg:text-[17px] lg:leading-[27px]">{HIGHLIGHT.subtitle}</p>
          {!reduced && (
            <button
              type="button"
              aria-pressed={stopped}
              onClick={() => setStopped((v) => !v)}
              className="inline-flex min-h-[44px] items-center self-start rounded-full border border-line-strong px-[18px] font-mono text-[13px] text-ink-soft transition-[color,border-color] duration-200 ease-out-strong hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:self-auto"
            >
              {stopped ? "Retomar faixa" : "Pausar faixa"}
            </button>
          )}
        </div>
      </motion.section>
    </div>
  )
}
