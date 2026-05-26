interface ProgressStepProps {
  label: string
  active: boolean
}

export function ProgressStep({ label, active }: ProgressStepProps) {
  return (
    <div
      className={`text-center py-2 px-1 rounded-lg border transition-all duration-300 ${
        active
          ? "border-primary/40 bg-primary/8 text-primary"
          : "border-border/50 bg-transparent text-muted-foreground"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mx-auto mb-1.5 ${
          active ? "bg-primary animate-glow-pulse" : "bg-muted-foreground/30"
        }`}
      />
      <p className="text-[10px] font-mono-label">{label}</p>
    </div>
  )
}
