import { RotateCcw, SlidersHorizontal } from "lucide-react"

interface FormCardHeaderProps {
  presetLabel?: string
  onClearAll: () => void
}

export function FormCardHeader({ presetLabel, onClearAll }: FormCardHeaderProps) {
  return (
    <div
      id="project-config-card"
      className="px-3 sm:px-8 py-3.5 sm:py-5 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
    >
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
        <div className="icon-chip icon-chip-violet mt-0.5 flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-mono-label text-primary mb-0.5 sm:mb-1">Step 02</p>
          <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground leading-tight">
            Configure stack
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 leading-snug">
            {presetLabel
              ? `Preset "${presetLabel}" applied — adjust any field below`
              : "Select frameworks, deployment targets, and project metadata"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClearAll}
        className="btn-ghost-panel self-start sm:self-center inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset form
      </button>
    </div>
  )
}
