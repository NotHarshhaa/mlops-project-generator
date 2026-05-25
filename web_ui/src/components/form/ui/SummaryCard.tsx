import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: string
  iconClass: string
}

export function SummaryCard({ icon: Icon, label, value, iconClass }: SummaryCardProps) {
  return (
    <div className="glass-card rounded-2xl p-4 group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-7 h-7 rounded-xl ${iconClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</h4>
      </div>
      <p className="text-sm font-semibold text-foreground capitalize truncate">{value}</p>
    </div>
  )
}
