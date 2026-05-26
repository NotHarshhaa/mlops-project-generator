import { REQUIRED_STACK_FIELDS } from "../constants"

interface ConfigProgressBarProps {
  completedCount: number
  completionPct: number
}

export function ConfigProgressBar({ completedCount, completionPct }: ConfigProgressBarProps) {
  return (
    <div className="panel p-3 sm:p-5 mb-4 sm:mb-6 animate-slide-in-up">
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
        <div className="min-w-0">
          <p className="font-mono-label text-muted-foreground">Stack completion</p>
          <p className="text-xs sm:text-sm font-medium text-foreground mt-0.5">
            {completedCount} of {REQUIRED_STACK_FIELDS.length} required fields
          </p>
        </div>
        <span className="font-display text-2xl sm:text-3xl font-bold text-gradient tabular-nums flex-shrink-0">
          {completionPct}%
        </span>
      </div>
      <div className="progress-track h-1.5 sm:h-2">
        <div className="progress-fill" style={{ width: `${completionPct}%` }} />
      </div>
    </div>
  )
}
