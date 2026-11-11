export function HowItWorksSection() {
  return (
    <section id="workflow" className="py-12 sm:py-20 hairline-b">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-8 sm:mb-12">
        <div>
          <p className="font-mono text-[10px] text-[#1925aa] uppercase tracking-wider font-bold mb-1">
            [ SECTION 03 // WORKFLOW ]
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#000000] uppercase tracking-tight">
            Synthesis Sequence
          </h2>
        </div>
        <p className="font-mono text-[11px] text-black/60 max-w-xs sm:text-right">
          Three deterministic stages from architectural matrix to standalone repository.
        </p>
      </div>

      {/* 3-Column Architectural Plate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 border-t border-black/15 pt-8 sm:pt-10 mb-12 sm:mb-16">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-black/15 pb-2">
            <span className="font-mono text-2xl font-bold text-[#1925aa]">01</span>
            <span className="font-mono text-[10px] text-black/50 uppercase">Input Layer</span>
          </div>
          <h3 className="font-editorial text-lg text-black font-semibold">
            Select Stack Matrix
          </h3>
          <p className="font-mono text-xs text-black/70 leading-relaxed">
            Choose from 8 curated presets or configure each layer individually: ML framework, task type, experiment tracker, orchestrator, deployment format, and cloud target.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-black/15 pb-2">
            <span className="font-mono text-2xl font-bold text-[#1925aa]">02</span>
            <span className="font-mono text-[10px] text-black/50 uppercase">Synthesis Layer</span>
          </div>
          <h3 className="font-editorial text-lg text-black font-semibold">
            Interactive Tree & Code Inspection
          </h3>
          <p className="font-mono text-xs text-black/70 leading-relaxed">
            Preview the full generated file tree instantly. Open any file in the Code Inspector to review syntax-highlighted training loops, Docker configs, and Airflow DAGs before downloading.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-black/15 pb-2">
            <span className="font-mono text-2xl font-bold text-[#1925aa]">03</span>
            <span className="font-mono text-[10px] text-black/50 uppercase">Delivery Layer</span>
          </div>
          <h3 className="font-editorial text-lg text-black font-semibold">
            ZIP Archive Compilation
          </h3>
          <p className="font-mono text-xs text-black/70 leading-relaxed">
            One-click archive generation packages your entire production scaffold into a standard ZIP archive. Unpack, create your virtual environment, and train immediately.
          </p>
        </div>
      </div>

      {/* Signature Centered Body Caption from DESIGN.md */}
      <div className="max-w-2xl mx-auto text-center py-6 px-4 bg-white border border-black/15">
        <p className="font-mono text-[10px] tracking-[0.02em] uppercase text-[#1925aa] leading-relaxed">
          ALL GENERATION ROUTINES EXECUTE DETERMINISTICALLY. NO CODE, TOKENS, OR DATA ARE PERSISTED REMOTELY. THE RESULTING REPOSITORY IS 100% UNENCUMBERED AND EDITABLE.
        </p>
      </div>
    </section>
  )
}
