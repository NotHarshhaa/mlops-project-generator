import { FEATURES } from "./content"

export function FeaturesSection() {
  return (
    <section id="features" className="mb-16 sm:mb-20 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <p className="font-mono-label text-primary mb-2">Capabilities</p>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
          Everything in one generator
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Configure the full MLOps lifecycle — from model code to cloud deploy scripts — and receive a cohesive repository in one download.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, title, description, tag }) => (
          <article
            key={title}
            className="group rounded-xl border border-border/70 bg-card/40 p-5 hover:border-primary/30 hover:bg-muted/20 transition-all duration-200 flex flex-col"
          >
            {tag && (
              <span className="font-mono-label text-primary/80 mb-3 self-start">{tag}</span>
            )}
            <div className="icon-chip icon-chip-cyan mb-4 group-hover:border-primary/40 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-2 text-sm sm:text-base">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
