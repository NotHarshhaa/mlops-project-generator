import { ArrowDown, Box } from "lucide-react"
import { HERO_STATS } from "./content"

export function LandingHero() {
  return (
    <section className="relative mb-8 sm:mb-20 pt-2 sm:pt-8">
      <div
        className="absolute -top-20 right-0 w-48 sm:w-72 h-48 sm:h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--glow-amber), transparent 70%)" }}
        aria-hidden
      />

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5 sm:gap-10 lg:gap-14 items-center">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-primary/30 bg-primary/8">
            <span className="status-live">Generator online</span>
          </div>

          <h1 className="font-display text-[1.65rem] leading-[1.1] sm:text-5xl lg:text-[3.25rem] xl:text-6xl sm:leading-[1.05] font-extrabold tracking-tight">
            From idea to
            <br />
            <span className="text-gradient">production MLOps</span>
            <br />
            in minutes.
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground max-w-xl leading-snug sm:leading-relaxed">
            MLOps Project Generator scaffolds complete machine learning repositories — training scripts,
            experiment tracking, deployment targets, and cloud templates — configured by you, delivered as a ZIP.
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3 pt-0 sm:pt-1">
            <a
              href="#generator"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg gradient-primary btn-shine text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Start configuring
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg btn-ghost-panel text-xs sm:text-sm font-semibold text-foreground"
            >
              Explore features
            </a>
          </div>
        </div>

        <div className="panel p-4 sm:p-8 relative overflow-hidden">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-10" aria-hidden>
            <Box className="w-16 h-16 sm:w-24 sm:h-24" strokeWidth={0.5} />
          </div>

          <p className="font-mono-label text-muted-foreground mb-3 sm:mb-5">At a glance</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {HERO_STATS.map(({ value, label }) => (
              <div
                key={label}
                className="text-center p-2.5 sm:p-4 rounded-lg bg-muted/30 border border-border/60"
              >
                <p className="font-display text-xl sm:text-3xl font-bold text-gradient">{value}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider leading-tight">{label}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground leading-snug">
            <li className="flex gap-2 sm:gap-3">
              <span className="text-primary font-mono font-bold shrink-0">→</span>
              <span>No local Python install — generation runs in the browser</span>
            </li>
            <li className="flex gap-2 sm:gap-3">
              <span className="text-accent font-mono font-bold shrink-0">→</span>
              <span>Fully editable output — presets are starting points</span>
            </li>
            <li className="flex gap-2 sm:gap-3">
              <span className="text-primary font-mono font-bold shrink-0">→</span>
              <span>Recent projects saved locally for quick re-download</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
