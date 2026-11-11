import { ArrowDown, ArrowRight } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative pt-6 sm:pt-14 pb-12 sm:pb-20 hairline-b">
      {/* Vertical Rotated Annotation in Right Margin */}
      <div className="hidden xl:flex absolute -right-6 top-20 items-center gap-3 vertical-side-label select-none pointer-events-none text-black/40">
        <span className="font-mono text-[10px] tracking-widest uppercase">
          PLATE NO. 01 // ARCHITECTURAL SPECIFICATION
        </span>
        <span className="w-12 h-px bg-black/25" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Micro-label Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-10 font-mono text-[10px] uppercase tracking-wider text-black/60">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#1925aa]" />
            <span className="text-[#0d1355] font-bold">MLOPS SYSTEM ARCHITECTURE</span>
          </div>
          <div className="flex items-center gap-4">
            <span>SPEC: RFC-2026</span>
            <span>·</span>
            <span>SYSTEM RUNTIME: IN-BROWSER WASM</span>
            <span>·</span>
            <span className="text-[#1925aa] font-semibold">STATUS: 100% OPERATIONAL</span>
          </div>
        </div>

        {/* Monumental Hero Headline from DESIGN.md (PP Neue Montreal 160px, line-height 0.94) */}
        <div className="mb-8 sm:mb-14">
          <h1 className="hero-headline uppercase select-none">
            From Code
            <br />
            To Production
            <br />
            <span className="text-[#1925aa]">MLOps.</span>
          </h1>
        </div>

        {/* Hairline Divider */}
        <div className="h-px bg-black/15 my-6 sm:my-10" />

        {/* Broadsheet 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 pt-2 mb-10 sm:mb-14">
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-[#1925aa] font-bold uppercase tracking-wider">
              [ 01 // AUTONOMOUS REPOSITORIES ]
            </p>
            <h3 className="font-editorial text-lg text-black font-medium leading-snug">
              Complete machine learning scaffolds generated in seconds.
            </h3>
            <p className="text-xs text-black/70 leading-relaxed">
              Scaffolds training code, experiment logging, orchestration DAGs, container manifests, and cloud deployment configs with zero manual configuration.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] text-[#1925aa] font-bold uppercase tracking-wider">
              [ 02 // PRODUCTION BOUNDARIES ]
            </p>
            <h3 className="font-editorial text-lg text-black font-medium leading-snug">
              Standardized architecture eliminating technical debt.
            </h3>
            <p className="text-xs text-black/70 leading-relaxed">
              Enforces clean interfaces between training scripts, model serving endpoints, and monitoring systems so teams focus on algorithms, not folder hierarchy.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] text-[#1925aa] font-bold uppercase tracking-wider">
              [ 03 // ZERO RUNTIME INSTALL ]
            </p>
            <h3 className="font-editorial text-lg text-black font-medium leading-snug">
              Pure client-side synthesis delivering immediate ZIP archives.
            </h3>
            <p className="text-xs text-black/70 leading-relaxed">
              Runs in the browser. Inspect file trees, review code templates syntax-by-syntax, and download a ready-to-run repository instantly.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
          <a
            href="#generator"
            className="btn-monograph"
          >
            <span>Configure Stack Matrix</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
          <a
            href="#capabilities"
            className="btn-monograph-outline"
          >
            <span>Explore Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <span className="font-mono text-[10px] text-black/50 ml-auto hidden sm:inline uppercase">
            Output: Standalone ZIP Archive · 8 Curated Presets
          </span>
        </div>
      </div>
    </section>
  )
}
