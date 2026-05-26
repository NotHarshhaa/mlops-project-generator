import { SlidersHorizontal } from "lucide-react"

export function GeneratorCTA() {
  return (
    <section className="mb-6 sm:mb-12">
      <div className="rounded-lg sm:rounded-xl border border-primary/25 bg-primary/5 px-3.5 py-4 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
          <div className="icon-chip icon-chip-amber flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-mono-label text-primary mb-0.5 sm:mb-1">Ready to build</p>
            <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground leading-tight">
              Configure your project below
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg leading-snug">
              Select a stack preset or fine-tune each option, then generate your ZIP when you are satisfied.
            </p>
          </div>
        </div>
        <a
          href="#generator"
          className="inline-flex justify-center items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-primary/40 bg-primary/10 text-xs sm:text-sm font-semibold text-primary hover:bg-primary/15 transition-colors flex-shrink-0"
        >
          Jump to form ↓
        </a>
      </div>
    </section>
  )
}
