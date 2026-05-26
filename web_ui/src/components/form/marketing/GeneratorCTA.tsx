import { SlidersHorizontal } from "lucide-react"

export function GeneratorCTA() {
  return (
    <section className="mb-10 sm:mb-12">
      <div className="rounded-xl border border-primary/25 bg-primary/5 px-5 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="icon-chip icon-chip-amber flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <p className="font-mono-label text-primary mb-1">Ready to build</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Configure your project below
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Select a stack preset or fine-tune each option, then generate your ZIP when you are satisfied.
            </p>
          </div>
        </div>
        <a
          href="#generator"
          className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-primary/40 bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors flex-shrink-0"
        >
          Jump to form ↓
        </a>
      </div>
    </section>
  )
}
