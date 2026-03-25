import * as z from "zod"
import {
  Zap, Beaker, Brain, Activity, Building2, FlaskConical
} from "lucide-react"

// ─── Zod Schema ──────────────────────────────────────────────────────────────
export const formSchema = z.object({
  framework: z.string().optional(),
  task_type: z.string().optional(),
  experiment_tracking: z.string().optional(),
  orchestration: z.string().optional(),
  deployment: z.string().optional(),
  monitoring: z.string().optional(),
  cloud_provider: z.string().optional(),
  cloud_service: z.string().optional(),
  preset_config: z.string().optional(),
  custom_template: z.string().optional(),
  enable_analytics: z.boolean().optional(),
  project_name: z.string().min(1, "Project name is required").max(50, "Project name must be 50 characters or less"),
  author_name: z.string().min(1, "Author name is required").max(100, "Author name must be 100 characters or less"),
  description: z.string().min(1, "Description is required"),
}).refine((data) => {
  const required = ["framework", "task_type", "experiment_tracking", "orchestration", "deployment", "monitoring"] as const
  return required.every(f => !!data[f])
}, {
  message: "Please select an option for all categories before generating your project",
  path: ["framework"],
})

export type FormValues = z.infer<typeof formSchema>

// ─── Option types ─────────────────────────────────────────────────────────────
export interface Option {
  value: string
  label: string
  description: string
}

export interface Options {
  framework: Option[]
  task_type: Option[]
  experiment_tracking: Option[]
  orchestration: Option[]
  deployment: Option[]
  monitoring: Option[]
  cloud_provider: Option[]
  cloud_service: Option[]
  preset_config: Option[]
  custom_template: Option[]
}

// ─── Stack Presets ────────────────────────────────────────────────────────────
export interface StackPreset {
  id: string
  label: string
  tagline: string
  icon: any
  accentFrom: string
  accentTo: string
  iconBg: string
  badgeColor: string
  fields: {
    framework: string
    task_type: string
    experiment_tracking: string
    orchestration: string
    deployment: string
    monitoring: string
  }
  tags: string[]
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
  },
]
