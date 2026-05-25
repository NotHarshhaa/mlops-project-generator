import type { FormValues } from "./schema"

export const REQUIRED_STACK_FIELDS = [
  "framework",
  "task_type",
  "experiment_tracking",
  "orchestration",
  "deployment",
  "monitoring",
] as const

export type RequiredStackField = (typeof REQUIRED_STACK_FIELDS)[number]

export const REQUIRED_DETAIL_FIELDS = ["project_name", "author_name", "description"] as const

export type RequiredDetailField = (typeof REQUIRED_DETAIL_FIELDS)[number]

export const DEFAULT_FORM_VALUES: FormValues = {
  framework: "",
  task_type: "",
  experiment_tracking: "",
  orchestration: "",
  deployment: "",
  monitoring: "",
  cloud_provider: "",
  cloud_service: "",
  preset_config: "",
  custom_template: "",
  enable_analytics: true,
  project_name: "",
  author_name: "MLOps Project Generator",
  description:
    "Generated using MLOps Project Generator - A comprehensive tool for creating production-ready machine learning projects with best practices and modern MLOps workflows.",
}

export const CLOUD_SERVICES: Record<string, Array<{ value: string; label: string; description: string }>> = {
  aws: [
    { value: "sagemaker", label: "SageMaker", description: "AWS managed ML service" },
    { value: "ecs", label: "ECS", description: "Elastic Container Service" },
    { value: "lambda", label: "Lambda", description: "Serverless functions" },
  ],
  gcp: [
    { value: "vertex-ai", label: "Vertex AI", description: "GCP unified ML platform" },
    { value: "cloud-run", label: "Cloud Run", description: "Serverless containers" },
    { value: "ai-platform", label: "AI Platform", description: "GCP ML training & deployment" },
  ],
  azure: [
    { value: "ml-studio", label: "Azure ML Studio", description: "Azure ML workspace" },
    { value: "container-instances", label: "Container Instances", description: "Azure container service" },
    { value: "functions", label: "Functions", description: "Azure serverless functions" },
  ],
}

export const RECENT_PROJECTS_STORAGE_KEY = "recentMLOpsProjects"
export const RECENT_PROJECTS_MAX = 10
