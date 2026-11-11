"use client"

import { useState } from "react"

interface AccordionItem {
  id: string
  num: string
  title: string
  summary: string
  details: string
  tags: string[]
  jumpField?: string
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: "frameworks",
    num: "01",
    title: "Core Framework Runtimes",
    summary: "PyTorch, Scikit-Learn, TensorFlow, and HuggingFace Transformers pipelines.",
    details:
      "Generates production training loops, modular dataset loading routines, validation splits, and model export handlers tailored to your chosen machine learning framework.",
    tags: ["PYTORCH 2.x", "SCIKIT-LEARN", "TENSORFLOW", "HUGGINGFACE"],
    jumpField: "framework",
  },
  {
    id: "tracking",
    num: "02",
    title: "Experiment Observability & Lineage",
    summary: "Automatic telemetry with MLflow Tracking Server or Weights & Biases.",
    details:
      "Preconfigured callbacks and hooks log hyperparameter matrices, loss trajectories, evaluation metrics, and model artifact versioning with zero boilerplates.",
    tags: ["MLFLOW", "WEIGHTS & BIASES", "EXPERIMENT METRICS", "MODEL REGISTRY"],
    jumpField: "experiment_tracking",
  },
  {
    id: "orchestration",
    num: "03",
    title: "Pipeline DAGs & Orchestration",
    summary: "Automated execution flows with Apache Airflow or Kubeflow Pipelines.",
    details:
      "Production-ready DAG definitions separate data extraction, training, testing, and deployment stages into scalable, observable execution graphs.",
    tags: ["APACHE AIRFLOW", "KUBEFLOW", "DAG SCHEDULING", "PIPELINE RETRIES"],
    jumpField: "orchestration",
  },
  {
    id: "serving",
    num: "04",
    title: "Inference Serving & Containerization",
    summary: "FastAPI REST microservices and multi-stage Docker topologies.",
    details:
      "Includes typed Pydantic request/response schemas, health checks, batch prediction endpoints, and lightweight production Docker images ready for deployment.",
    tags: ["FASTAPI", "DOCKER MULTI-STAGE", "KUBERNETES MANIFESTS", "HEALTH PROBES"],
    jumpField: "deployment",
  },
  {
    id: "monitoring",
    num: "05",
    title: "Continuous Evaluation & Data Drift",
    summary: "Automated drift monitoring using Evidently AI and custom evaluators.",
    details:
      "Generates test suites to detect statistical covariate shift, concept drift, target decay, and schema anomalies before models degrade in production.",
    tags: ["EVIDENTLY AI", "DATA DRIFT", "TARGET DRIFT", "DATA QUALITY SUITES"],
    jumpField: "monitoring",
  },
  {
    id: "cloud",
    num: "06",
    title: "Multi-Cloud Infrastructure Scaffolding",
    summary: "Native cloud execution scripts for AWS, Google Cloud Platform, and Microsoft Azure.",
    details:
      "Ready-to-deploy cloud configs for Amazon SageMaker, Google Vertex AI, and Azure ML Studio with IAM role guidance and storage bindings.",
    tags: ["AWS SAGEMAKER", "GCP VERTEX AI", "AZURE ML", "CLOUD RUN"],
    jumpField: "cloud_provider",
  },
]

export function FeaturesSection() {
  const [openId, setOpenId] = useState<string | null>("frameworks")

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="capabilities" className="py-12 sm:py-20 hairline-b">
      {/* Signature Section Heading Pair from DESIGN.md */}
      <div className="relative mb-8 sm:mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
          <span className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#1925aa] uppercase tracking-tight">
            System
          </span>
          <span className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#1925aa] uppercase tracking-tight text-right sm:ml-auto">
            Capabilities
          </span>
        </div>
        <div className="h-px bg-black/15 my-4 sm:my-6" />
        <div className="flex justify-between items-center font-mono text-[10px] tracking-wider uppercase text-black/60">
          <span>[ CATALOG OF ARCHITECTURAL MODULES ]</span>
          <span>CLICK ROW TO EXPAND SPECIFICATION</span>
        </div>
      </div>

      {/* Service Accordion Rows from DESIGN.md */}
      <div className="border-t border-black/15">
        {ACCORDION_ITEMS.map((item) => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} className="accordion-row">
              {/* Row Header */}
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full text-left py-5 sm:py-6 flex items-baseline justify-between gap-4 cursor-pointer select-none group"
                aria-expanded={isOpen}
              >
                <div className="flex items-baseline gap-3 sm:gap-6 min-w-0">
                  <span className="font-mono text-xs text-black/40 group-hover:text-[#1925aa] transition-colors shrink-0">
                    {item.num}
                  </span>
                  <h3 className="font-display text-lg sm:text-2xl font-medium text-[#1925aa] group-hover:underline decoration-1 underline-offset-4 truncate">
                    {item.title}
                  </h3>
                  <span className="hidden md:inline font-mono text-[11px] text-black/50 truncate">
                    — {item.summary}
                  </span>
                </div>

                <span className="font-display text-2xl sm:text-3xl text-[#1925aa] font-normal leading-none shrink-0 px-2">
                  {isOpen ? "×" : "+"}
                </span>
              </button>

              {/* Expanded Panel */}
              {isOpen && (
                <div className="pb-6 sm:pb-8 pl-6 sm:pl-12 pr-4 space-y-4 animate-monograph-in">
                  <p className="font-editorial text-sm sm:text-base text-black/85 max-w-3xl leading-relaxed">
                    {item.details}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-tight px-2 py-0.5 border border-black/20 bg-white text-black uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <a
                      href="#generator"
                      className="font-mono text-[10px] text-[#1925aa] font-bold tracking-wider uppercase hover:underline"
                    >
                      [ CONFIGURE THIS MODULE IN STACK MATRIX → ]
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
