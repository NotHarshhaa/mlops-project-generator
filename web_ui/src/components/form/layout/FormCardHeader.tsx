import { Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FormCardHeaderProps {
  presetLabel?: string
  onClearAll: () => void
}

export function FormCardHeader({ presetLabel, onClearAll }: FormCardHeaderProps) {
  return (
    <div
      id="project-config-card"
      className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/5 via-transparent to-primary/3 dark:from-primary/8"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl icon-gradient-violet flex items-center justify-center shadow-md">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">Project Configuration</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {presetLabel
              ? `Using "${presetLabel}" preset — tweak any field below`
              : "Choose your ML stack and deployment preferences"}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="rounded-lg sm:rounded-xl border-border/70 gap-1.5 text-muted-foreground hover:text-foreground px-2 sm:px-3"
      >
        <X className="h-3.5 w-3.5" />
        <span className="hidden sm:inline text-xs font-medium">Clear All</span>
      </Button>
    </div>
  )
}
