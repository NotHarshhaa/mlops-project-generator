import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  iconClass?: string
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  iconClass = "icon-gradient-violet",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className={`w-10 h-10 rounded-2xl ${iconClass} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
