import { AlertTriangle, X } from "lucide-react"

interface ValidationErrorBannerProps {
  message: string
  onDismiss: () => void
}

export function ValidationErrorBanner({ message, onDismiss }: ValidationErrorBannerProps) {
  return (
    <div className="rounded-lg sm:rounded-xl border border-destructive/40 bg-destructive/5 p-3 sm:p-4 animate-slide-in-up">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="icon-chip icon-chip-rose flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono-label text-destructive mb-0.5 sm:mb-1">Validation error</p>
          <p className="text-xs sm:text-sm text-destructive/90 whitespace-pre-line leading-relaxed">{message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 sm:p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors flex-shrink-0"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
