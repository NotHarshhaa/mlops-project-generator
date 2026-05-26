import { HOW_IT_WORKS } from "./content"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mb-8 sm:mb-20 scroll-mt-14 sm:scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 px-1">
        <p className="font-mono-label text-accent mb-1.5 sm:mb-2">Workflow</p>
        <h2 className="font-display text-xl sm:text-3xl font-bold">How it works</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
          Three steps from configuration to a downloadable project archive.
        </p>
      </div>

      {/* Mobile: compact stacked cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {HOW_IT_WORKS.map(({ step, title, description }) => (
          <article key={step} className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-2xl font-black text-gradient/80 tabular-nums">{step}</span>
            </div>
            <h3 className="font-display font-bold text-base text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </article>
        ))}
      </div>

      {/* Desktop: open timeline (no panel — avoids overflow clipping) */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-10 relative">
        <div
          className="absolute top-14 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />

        {HOW_IT_WORKS.map(({ step, title, description }) => (
          <article key={step} className="relative text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-4xl font-black text-gradient/80 tabular-nums leading-none">
                {step}
              </span>
              <div className="flex-1 h-px bg-border/60 max-w-[48px]" aria-hidden />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
