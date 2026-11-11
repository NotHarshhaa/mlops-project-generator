import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  icon?: LucideIcon
  label: string
  value: string
  iconClass?: string
}

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="border border-black/15 bg-white p-2.5">
      <span className="font-mono text-[9px] uppercase tracking-wider text-black/50 block mb-0.5">
        {label}
      </span>
      <p className="font-mono text-xs font-bold text-black uppercase truncate">
        {value}
      </p>
    </div>
  )
}
