interface FelledBannerProps {
  title: string
  subtitle: string
}

export function FelledBanner({ title, subtitle }: FelledBannerProps) {
  return (
    <div className="w-full bg-gradient-to-r from-er-gold via-er-gold-bright to-er-gold py-8 text-center text-er-bg">
      <p className="font-display text-2xl uppercase tracking-wide">{title}</p>
      <p className="mt-1 font-serif italic">{subtitle}</p>
    </div>
  )
}
