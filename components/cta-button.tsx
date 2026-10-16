import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

type CtaButtonProps = {
  children: ReactNode
  className?: string
} & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">)
  | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">)
)

const root =
  "group inline-flex items-center gap-2 rounded-full transition-transform duration-200 ease-out-strong active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-60"
const pill =
  "inline-flex h-[52px] items-center rounded-full bg-inverse px-7 text-base font-semibold text-inverse-ink transition-colors duration-200 ease-out-strong group-hover:bg-accent"
const circle =
  "inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-inverse text-xl text-inverse-ink transition-[background-color,transform] duration-200 ease-out-strong group-hover:translate-x-1 group-hover:bg-accent"

/** The inspiration's pill + arrow circle, as a single control (one tab stop). */
export function CtaButton({ children, className, ...props }: CtaButtonProps) {
  const content = (
    <>
      <span className={pill}>{children}</span>
      <span aria-hidden="true" className={circle}>
        →
      </span>
    </>
  )

  if (props.href !== undefined) {
    return (
      <a target="_blank" rel="noopener noreferrer" className={cn(root, className)} {...props}>
        {content}
      </a>
    )
  }

  const { type = "button", ...buttonProps } = props
  return (
    <button type={type} className={cn(root, className)} {...buttonProps}>
      {content}
    </button>
  )
}
