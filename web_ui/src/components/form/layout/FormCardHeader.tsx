import { RotateCcw, SlidersHorizontal } from "lucide-react"

interface FormCardHeaderProps {
  presetLabel?: string
  onClearAll: () => void
}

export function FormCardHeader({ presetLabel, onClearAll }: FormCardHeaderProps) {
  return (
    <div
      id="project-config-card"
      className="px-5 sm:px-8 py-5 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <div className="icon-chip icon-chip-violet mt-0.5">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
        <div>
          <p className="font-mono-label text-primary mb-1">Step 02</p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            Configure stack
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {presetLabel
              ? `Preset "${presetLabel}" applied — adjust any field below`
              : "Select frameworks, deployment targets, and project metadata"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClearAll}
        className="btn-ghost-panel self-start sm:self-center inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset form
      </button>
    </div>
  )
}
