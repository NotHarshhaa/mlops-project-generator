import { ArrowDown, Box } from "lucide-react"
import { HERO_STATS } from "./content"

export function LandingHero() {
  return (
    <section className="relative mb-16 sm:mb-20 pt-4 sm:pt-8">
      <div className="absolute -top-20 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--glow-amber), transparent 70%)" }}
        aria-hidden
      />

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8">
            <span className="status-live">Generator online</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold leading-[1.05] tracking-tight">
            From idea to
            <br />
            <span className="text-gradient">production MLOps</span>
            <br />
            in minutes.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            MLOps Project Generator scaffolds complete machine learning repositories — training scripts,
            experiment tracking, deployment targets, and cloud templates — configured by you, delivered as a ZIP.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="#generator"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg gradient-primary btn-shine text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Start configuring
              <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg btn-ghost-panel text-sm font-semibold text-foreground"
            >
              Explore features
            </a>
          </div>
        </div>

        <div className="panel p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10" aria-hidden>
            <Box className="w-24 h-24" strokeWidth={0.5} />
          </div>

          <p className="font-mono-label text-muted-foreground mb-5">At a glance</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {HERO_STATS.map(({ value, label }) => (
              <div
                key={label}
                className="text-center p-4 rounded-lg bg-muted/30 border border-border/60"
              >
                <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">{value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-mono font-bold">→</span>
              <span>No local Python install required — generation runs in the browser</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-mono font-bold">→</span>
              <span>Fully editable output — presets are starting points, not lock-in</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-mono font-bold">→</span>
              <span>Recent projects saved in your browser for quick re-download</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
