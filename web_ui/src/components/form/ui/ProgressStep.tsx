interface ProgressStepProps {
  label: string
  colorClass: string
  active: boolean
}

export function ProgressStep({ label, colorClass, active }: ProgressStepProps) {
  return (
    <div className={`text-center p-2.5 rounded-xl border transition-all duration-500 ${
      active ? `${colorClass} shadow-sm scale-105` : "bg-white/50 dark:bg-white/5 border-border"
    }`}>
      <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${active ? "animate-pulse" : "bg-muted-foreground/30"}`} />
      <p className={`text-xs font-semibold ${active ? "" : "text-muted-foreground"}`}>{label}</p>
    </div>
  )
}
