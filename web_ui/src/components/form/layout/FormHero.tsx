import { Cloud, Database, GitBranch, Layers, Zap } from "lucide-react"

const STATS = [
  { value: "6", label: "Stack presets" },
  { value: "3", label: "ML frameworks" },
  { value: "<30s", label: "Generation" },
] as const

const FEATURES = [
  { icon: Layers, label: "Full MLOps stack" },
  { icon: Cloud, label: "Cloud templates" },
  { icon: GitBranch, label: "CI/CD ready" },
  { icon: Database, label: "Config presets" },
  { icon: Zap, label: "Instant ZIP" },
] as const

export function FormHero() {
  return (
    <section className="mb-10 sm:mb-14">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-end">
        <div className="space-y-5">
          <p className="font-mono-label text-primary">Production ML scaffolding</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Build your
            <br />
            <span className="text-gradient">MLOps pipeline</span>
            <br />
            in one pass.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Pick a stack preset or configure every layer — framework, tracking, orchestration,
            deployment, and monitoring — then download a production-ready project archive.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="panel p-5 sm:p-6 lg:ml-auto w-full max-w-sm">
          <p className="font-mono-label text-muted-foreground mb-4">System status</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-muted/40 border border-border/60">
                <p className="font-display text-2xl font-bold text-gradient">{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-xs text-muted-foreground font-mono-label">
            <div className="flex justify-between">
              <span>Output</span>
              <span className="text-accent">ZIP archive</span>
            </div>
            <div className="flex justify-between">
              <span>Runtime</span>
              <span className="text-foreground">TypeScript</span>
            </div>
            <div className="flex justify-between">
              <span>Templates</span>
              <span className="text-primary">Best practices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
