import type { LucideIcon } from "lucide-react"
import {
  Beaker,
  Cloud,
  Cpu,
  Download,
  GitBranch,
  Layers,
  LineChart,
  Rocket,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react"

export const HERO_STATS = [
  { value: "6", label: "Stack presets" },
  { value: "40+", label: "Files per project" },
  { value: "<30s", label: "To generate" },
] as const

export interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
  tag?: string
}

export const FEATURES: FeatureItem[] = [
  {
    icon: Layers,
    title: "Curated stack presets",
    description: "Quick Start, Production MLOps, Enterprise, and more — pre-fill every layer and customize freely.",
    tag: "Presets",
  },
  {
    icon: Cpu,
    title: "Multi-framework support",
    description: "Scikit-learn, PyTorch, and TensorFlow scaffolds with training, inference, and config templates.",
    tag: "ML core",
  },
  {
    icon: LineChart,
    title: "Experiment tracking",
    description: "Wire in MLflow, Weights & Biases, custom trackers, or skip tracking for lean prototypes.",
    tag: "Tracking",
  },
  {
    icon: Workflow,
    title: "Pipeline orchestration",
    description: "Airflow DAGs and Kubeflow pipeline stubs that call your training scripts — not just empty folders.",
    tag: "Orchestration",
  },
  {
    icon: Rocket,
    title: "Deployment-ready",
    description: "Root Dockerfiles, docker-compose, and Kubernetes manifests when you pick Docker or K8s deployment.",
    tag: "Deploy",
  },
  {
    icon: Shield,
    title: "Production monitoring",
    description: "Evidently drift reports and custom metrics collectors generated under scripts/monitoring/.",
    tag: "Monitoring",
  },
  {
    icon: Cloud,
    title: "Cloud deployment packs",
    description: "AWS, GCP, and Azure template folders with Dockerfiles and provider-specific deploy scripts.",
    tag: "Cloud",
  },
  {
    icon: Download,
    title: "Instant ZIP download",
    description: "Preview the full file tree before generating, then download a complete repo with CI, notebooks, and insights.",
    tag: "Output",
  },
]

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose your stack",
    description: "Pick a preset or configure framework, task type, tracking, orchestration, deployment, and monitoring.",
  },
  {
    step: "02",
    title: "Add cloud & metadata",
    description: "Optionally attach cloud provider templates, project name, author, and description.",
  },
  {
    step: "03",
    title: "Generate & download",
    description: "We assemble your project in seconds and package it as a production-ready ZIP archive.",
  },
] as const

export const MISSION_POINTS = [
  {
    icon: Sparkles,
    title: "Skip the boilerplate",
    body: "Starting an MLOps project means dozens of folders, configs, and glue code. We automate that so you focus on the model.",
  },
  {
    icon: GitBranch,
    title: "Opinionated best practices",
    body: "Every scaffold follows sensible defaults — experiment tracking hooks, deployment entrypoints, and test layout included.",
  },
  {
    icon: Beaker,
    title: "Built for practitioners",
    body: "Whether you are prototyping, shipping to production, or teaching MLOps, the generator adapts to your stack choices.",
  },
] as const

export const INTENTION = {
  eyebrow: "Our intention",
  headline: "Make production MLOps accessible from day one",
  body: "Too many ML projects stall on project structure before the first experiment runs. MLOps Project Generator exists to give teams a consistent, extensible starting point — not a black box, but a transparent scaffold you own and evolve.",
}
