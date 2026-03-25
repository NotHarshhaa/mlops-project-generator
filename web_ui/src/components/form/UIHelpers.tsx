export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  iconClass = "icon-gradient-violet",
}: {
  icon: any
  title: string
  subtitle: string
  iconClass?: string
}) {
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

export function ProgressStep({
  label,
  colorClass,
  active,
}: {
  label: string
  colorClass: string
  active: boolean
}) {
  return (
    <div className={`text-center p-2.5 rounded-xl border transition-all duration-500 ${
      active ? `${colorClass} shadow-sm scale-105` : "bg-white/50 dark:bg-white/5 border-border"
    }`}>
      <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${active ? "animate-pulse" : "bg-muted-foreground/30"}`} />
      <p className={`text-xs font-semibold ${active ? "" : "text-muted-foreground"}`}>{label}</p>
    </div>
  )
}

export function SummaryCard({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: any
  label: string
  value: string
  iconClass: string
}) {
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
