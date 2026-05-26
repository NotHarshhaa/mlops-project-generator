import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: string
  iconClass: string
}

export function SummaryCard({ icon: Icon, label, value, iconClass }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3 hover:border-primary/25 transition-colors group">
      <div className="flex items-center gap-2 mb-2">
        <div className={`icon-chip ${iconClass}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="font-mono-label text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground capitalize truncate font-mono">{value}</p>
    </div>
  )
}
