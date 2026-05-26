import { Boxes } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function FormNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0 w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Boxes className="w-5 h-5 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-sm sm:text-base leading-tight truncate">
              MLOps <span className="text-gradient">Generator</span>
            </p>
            <p className="font-mono-label text-muted-foreground hidden sm:block">
              v1.0 · Project scaffolder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="status-live hidden md:inline-flex">Ready</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
