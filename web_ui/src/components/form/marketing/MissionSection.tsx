export function MissionSection() {
  return (
    <section
      id="thesis"
      className="relative -mx-3 sm:-mx-6 lg:-mx-12 xl:-mx-20 px-4 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-24 bg-[#1925aa] text-[#e8e6e0] my-12 sm:my-20"
    >
      {/* Vertical Rotated Annotation in Margin (Bone on Indigo) */}
      <div className="hidden xl:flex absolute right-6 top-16 items-center gap-3 vertical-side-label select-none pointer-events-none text-[#e8e6e0]/40">
        <span className="font-mono text-[10px] tracking-widest uppercase">
          TONAL SHIFT // ARCHITECTURAL THESIS
        </span>
        <span className="w-12 h-px bg-[#e8e6e0]/30" />
      </div>

      <div className="max-w-6xl">
        {/* Eyebrow */}
        <p className="font-mono text-[10px] tracking-widest text-[#e8e6e0]/70 uppercase mb-4 sm:mb-6">
          [ SECTION 01 // MONOGRAPH THESIS ]
        </p>

        {/* 46px Headline in Bone from DESIGN.md */}
        <h2 className="font-display text-2xl sm:text-4xl lg:text-[46px] leading-[1.05] tracking-tight text-[#e8e6e0] mb-8 sm:mb-12 max-w-5xl uppercase">
          We believe the hard part of MLOps is not choosing tools — it is wiring them together consistently.
        </h2>

        {/* 18px Body Copy in Bone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 border-t border-[#e8e6e0]/20 pt-8 sm:pt-10 mb-12 sm:mb-16">
          <p className="font-editorial text-base sm:text-lg text-[#e8e6e0]/90 leading-relaxed">
            Machine learning systems in industry rarely collapse at the mathematical core. They fracture at the perimeter:
            untracked training experiments, ad-hoc containerization, unstandardized inference wrappers, and silent data drift in production.
          </p>
          <p className="font-editorial text-base sm:text-lg text-[#e8e6e0]/80 leading-relaxed">
            The MLOps Project Generator codifies structural consensus into an automated architectural blueprint.
            Every generated archive links model code, artifact tracking, pipeline orchestration, and cloud targets into a cohesive, production-grade repository in seconds.
          </p>
        </div>

        {/* 3 Architectural Pillars on Indigo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-[#e8e6e0]/20 pt-8 sm:pt-10">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#e8e6e0]/60 uppercase tracking-widest block">
              [ PILLAR 01 ]
            </span>
            <h4 className="font-editorial text-lg text-[#e8e6e0] font-medium">Deterministic Reproducibility</h4>
            <p className="font-mono text-xs text-[#e8e6e0]/70 leading-relaxed">
              Standardized folder structures, pinned virtual environments, and declarative configs ensure any engineer can clone and execute immediately.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#e8e6e0]/60 uppercase tracking-widest block">
              [ PILLAR 02 ]
            </span>
            <h4 className="font-editorial text-lg text-[#e8e6e0] font-medium">Container & Cloud Agnostic</h4>
            <p className="font-mono text-xs text-[#e8e6e0]/70 leading-relaxed">
              Target FastAPI microservices, Docker compose topologies, Kubernetes manifests, or native cloud services across AWS, GCP, and Azure.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#e8e6e0]/60 uppercase tracking-widest block">
              [ PILLAR 03 ]
            </span>
            <h4 className="font-editorial text-lg text-[#e8e6e0] font-medium">Continuous Observability</h4>
            <p className="font-mono text-xs text-[#e8e6e0]/70 leading-relaxed">
              Native integration with MLflow, Weights & Biases, Airflow DAGs, and Evidently AI for telemetry, experiment tracking, and drift detection.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
