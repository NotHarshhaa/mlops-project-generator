import { X } from "lucide-react"

interface ValidationErrorBannerProps {
  message: string
  onDismiss: () => void
}

export function ValidationErrorBanner({ message, onDismiss }: ValidationErrorBannerProps) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 animate-slide-in-up">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-destructive mb-1">Missing Required Fields</h4>
          <p className="text-sm text-destructive/80 whitespace-pre-line leading-relaxed">{message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-destructive/60 hover:text-destructive"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
