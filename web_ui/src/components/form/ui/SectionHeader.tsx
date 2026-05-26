import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  iconClass?: string
  step?: string
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  iconClass = "icon-chip-violet",
  step,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/50">
      <div className={`icon-chip ${iconClass} flex-shrink-0`}>
        <Icon className="w-4 h-4" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        {step && <p className="font-mono-label text-muted-foreground mb-0.5">{step}</p>}
        <h3 className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>
      </div>
    </div>
  )
}
