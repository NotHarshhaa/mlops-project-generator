import type { LucideIcon } from "lucide-react"
import {
  Zap, Beaker, Brain, Activity, Building2, FlaskConical,
} from "lucide-react"
import type { RequiredStackField } from "./constants"

export interface StackPreset {
  id: string
  label: string
  tagline: string
  icon: LucideIcon
  accentFrom: string
  accentTo: string
  iconBg: string
  badgeColor: string
  fields: Record<RequiredStackField, string>
  tags: string[]
  /** Drives optional file bundles in the generator */
  preset_config?: string
  custom_template?: string
}

export const STACK_PRESETS: StackPreset[] = [
  {
    id: "quick-start",
    label: "Quick Start",
    tagline: "Zero friction — get a working project in seconds",
    icon: Zap,
    accentFrom: "from-amber-500", accentTo: "to-orange-500",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50",
    fields: { framework: "sklearn", task_type: "classification", experiment_tracking: "none", orchestration: "none", deployment: "fastapi", monitoring: "none" },
    tags: ["Scikit-learn", "FastAPI", "No tracking"],
    preset_config: "quick-start",
    custom_template: "minimal",
  },
  {
    id: "data-science",
    label: "Data Science",
    tagline: "Ideal for exploratory analysis and Jupyter workflows",
    icon: Beaker,
    accentFrom: "from-emerald-500", accentTo: "to-teal-500",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50",
    fields: { framework: "sklearn", task_type: "regression", experiment_tracking: "mlflow", orchestration: "none", deployment: "fastapi", monitoring: "custom" },
    tags: ["Scikit-learn", "MLflow", "FastAPI"],
    preset_config: "research",
  },
  {
    id: "deep-learning",
    label: "Deep Learning",
    tagline: "PyTorch-first setup with experiment tracking",
    icon: Brain,
    accentFrom: "from-violet-500", accentTo: "to-purple-600",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/50",
    fields: { framework: "pytorch", task_type: "classification", experiment_tracking: "wandb", orchestration: "none", deployment: "docker", monitoring: "none" },
    tags: ["PyTorch", "W&B", "Docker"],
    custom_template: "comprehensive",
  },
  {
    id: "production-mlops",
    label: "Production MLOps",
    tagline: "Battle-tested stack with full observability",
    icon: Activity,
    accentFrom: "from-blue-500", accentTo: "to-cyan-500",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/50",
    fields: { framework: "pytorch", task_type: "classification", experiment_tracking: "mlflow", orchestration: "airflow", deployment: "docker", monitoring: "evidently" },
    tags: ["PyTorch", "MLflow", "Airflow", "Evidently"],
    preset_config: "production-ready",
    custom_template: "comprehensive",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    tagline: "Maximum scale — Kubernetes & full MLOps suite",
    icon: Building2,
    accentFrom: "from-rose-500", accentTo: "to-pink-600",
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50",
    fields: { framework: "tensorflow", task_type: "classification", experiment_tracking: "mlflow", orchestration: "kubeflow", deployment: "kubernetes", monitoring: "evidently" },
    tags: ["TensorFlow", "Kubeflow", "Kubernetes", "Evidently"],
    preset_config: "enterprise",
    custom_template: "comprehensive",
  },
  {
    id: "research",
    label: "Research",
    tagline: "Flexible setup optimised for experimentation",
    icon: FlaskConical,
    accentFrom: "from-indigo-500", accentTo: "to-sky-500",
    iconBg: "bg-gradient-to-br from-indigo-500 to-sky-500",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50",
    fields: { framework: "pytorch", task_type: "regression", experiment_tracking: "wandb", orchestration: "none", deployment: "fastapi", monitoring: "none" },
    tags: ["PyTorch", "W&B", "FastAPI"],
    preset_config: "research",
    custom_template: "microservice",
  },
]
