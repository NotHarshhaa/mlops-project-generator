import { Loader2 } from "lucide-react"

export function FormLoadingSkeleton() {
  return (
    <div className="min-h-screen observatory-bg flex flex-col">
      <div className="h-14 border-b border-border/80 bg-background/85" />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="panel p-10 flex flex-col items-center gap-5 max-w-sm w-full text-center">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-primary-foreground animate-spin" />
            </div>
            <span className="orbit-ring" />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Initializing</p>
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
