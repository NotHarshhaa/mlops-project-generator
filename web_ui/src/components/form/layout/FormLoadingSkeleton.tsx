import { Loader2 } from "lucide-react"

export function FormLoadingSkeleton() {
  return (
    <div className="min-h-screen observatory-bg flex flex-col">
      <div className="h-11 sm:h-14 border-b border-border/80 bg-background/85" />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="panel p-6 sm:p-10 flex flex-col items-center gap-4 sm:gap-5 max-w-sm w-full text-center">
          <div className="relative">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center">
              <Loader2 className="w-5 h-5 sm:w-7 sm:h-7 text-primary-foreground animate-spin" />
            </div>
            <span className="orbit-ring" />
          </div>
          <div>
            <p className="font-display font-bold text-base sm:text-lg">Initializing</p>
            <p className="font-mono-label text-muted-foreground mt-1">Loading configuration matrix…</p>
          </div>
          <div className="w-full progress-track">
            <div className="progress-fill w-1/3 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}
