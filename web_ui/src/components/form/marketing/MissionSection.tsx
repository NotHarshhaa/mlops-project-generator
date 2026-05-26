import { INTENTION, MISSION_POINTS } from "./content"

export function MissionSection() {
  return (
    <section id="mission" className="mb-8 sm:mb-20 scroll-mt-14 sm:scroll-mt-20">
      <div className="panel p-4 sm:p-10">
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-10 lg:gap-14">
          <div className="space-y-3 sm:space-y-4">
            <p className="font-mono-label text-primary">{INTENTION.eyebrow}</p>
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {INTENTION.headline}
            </h2>
            <p className="text-muted-foreground leading-snug sm:leading-relaxed text-sm sm:text-lg">
              {INTENTION.body}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug sm:leading-relaxed border-l-2 border-primary/40 pl-3 sm:pl-4">
              We believe the hard part of MLOps is not choosing tools — it is wiring them together consistently.
              This generator encodes those decisions so your team spends time on models, not folder structures.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-4">
            {MISSION_POINTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border/60 bg-muted/15 hover:border-primary/25 transition-colors"
              >
                <div className="icon-chip icon-chip-violet flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm sm:text-base text-foreground mb-0.5 sm:mb-1">{title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug sm:leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
