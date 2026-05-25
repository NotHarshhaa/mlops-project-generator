import { Rocket } from "lucide-react"

export function FormLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen hero-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl animate-glow-pulse">
          <Rocket className="w-8 h-8 text-white animate-bounce" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing MLOps Generator…</p>
      </div>
    </div>
  )
}
