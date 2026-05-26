import { HOW_IT_WORKS } from "./content"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mb-16 sm:mb-20 scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="font-mono-label text-accent mb-2">Workflow</p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold">How it works</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Three steps from configuration to a downloadable project archive.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 relative">
        <div
          className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />

        {HOW_IT_WORKS.map(({ step, title, description }) => (
          <div key={step} className="relative text-center md:text-left">
            <div className="inline-flex md:flex items-center gap-3 mb-4">
              <span className="font-display text-4xl font-black text-gradient/80 tabular-nums">{step}</span>
              <div className="hidden md:block flex-1 h-px bg-border/60 max-w-[40px]" aria-hidden />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
