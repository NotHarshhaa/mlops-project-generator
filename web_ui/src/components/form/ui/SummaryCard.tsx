import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: string
  iconClass: string
}

export function SummaryCard({ icon: Icon, label, value, iconClass }: SummaryCardProps) {
  return (
    <div className="rounded-md sm:rounded-lg border border-border/70 bg-muted/20 p-2 sm:p-3 hover:border-primary/25 transition-colors group">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
        <div className={`icon-chip ${iconClass}`}>
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
        <span className="font-mono-label text-muted-foreground">{label}</span>
      </div>
      <p className="text-xs sm:text-sm font-semibold text-foreground capitalize truncate font-mono">{value}</p>
    </div>
  )
}
