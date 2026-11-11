import { AlertTriangle, X } from "lucide-react"

interface ValidationErrorBannerProps {
  message: string
  onDismiss: () => void
}

export function ValidationErrorBanner({ message, onDismiss }: ValidationErrorBannerProps) {
  return (
    <div className="border border-red-700 bg-white p-4 animate-monograph-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 flex items-center justify-center bg-red-700 text-white shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-red-700 uppercase tracking-wider font-bold mb-1">
              [ SPECIFICATION INCOMPLETE // COMPILATION HALTED ]
            </p>
            <p className="font-mono text-xs text-black/85 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 hover:bg-black/5 text-black/60 hover:text-black cursor-pointer"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
