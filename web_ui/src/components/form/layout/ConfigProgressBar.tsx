import { REQUIRED_STACK_FIELDS } from "../constants"

interface ConfigProgressBarProps {
  completedCount: number
  completionPct: number
}

export function ConfigProgressBar({ completedCount, completionPct }: ConfigProgressBarProps) {
  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 animate-slide-in-up">
      <div className="flex-1">
        <div className="flex justify-between text-xs font-semibold mb-2">
          <span className="text-foreground">Configuration Progress</span>
          <span className="text-primary">{completedCount}/{REQUIRED_STACK_FIELDS.length} required fields</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>
      <span className="text-2xl font-black text-primary tabular-nums w-12 text-right">{completionPct}%</span>
    </div>
  )
}
