interface SectionLabelProps {
  children: string
  id?: string
}

/** Section title in the inspiration's `…/Label…` pattern; the dots are decorative. */
export function SectionLabel({ children, id }: SectionLabelProps) {
  return (
    <h2 id={id} className="font-mono text-[13px] font-medium leading-[18px] text-ink-soft">
      <span aria-hidden="true">…/</span>
      {children}
      <span aria-hidden="true">…</span>
    </h2>
  )
}
