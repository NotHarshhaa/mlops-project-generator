import { ArrowDown } from "lucide-react"

export function GeneratorCTA() {
  return (
    <section className="my-8 sm:my-14">
      <div className="bg-white border border-black/20 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#1925aa] font-bold">
            [ READY FOR COMPILATION ]
          </p>
          <h2 className="font-display text-2xl sm:text-4xl text-[#000000] uppercase tracking-tight">
            Configure Your Stack Architecture Below
          </h2>
          <p className="font-editorial text-sm sm:text-base text-black/70 leading-relaxed">
            Select a curated MLOps blueprint or fine-tune each framework layer. Preview files in the live code inspector, then compile your production repository.
          </p>
        </div>

        <a
          href="#generator"
          className="btn-monograph self-start md:self-center shrink-0"
        >
          <span>Jump to Stack Matrix</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  )
}
