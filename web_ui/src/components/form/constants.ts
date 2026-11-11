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
  python_version: "3.11",
  env_manager: "uv",
  license: "mit",
  ci_provider: "github-actions",
  enable_analytics: true,
  project_name: "",
  author_name: "MLOps Project Generator",
  description:
    "Generated using MLOps Project Generator - A comprehensive tool for creating production-ready machine learning projects with best practices and modern MLOps workflows.",
}

export const PYTHON_VERSION_OPTIONS = [
  { value: "3.11", label: "Python 3.11", description: "Standard LTS target for production ML" },
  { value: "3.12", label: "Python 3.12", description: "Latest performance release with faster CPython runtime" },
  { value: "3.10", label: "Python 3.10", description: "Broad compatibility with legacy CUDA/C++ extensions" },
]

export const ENV_MANAGER_OPTIONS = [
  { value: "uv", label: "UV (Astral)", description: "Blazing fast Rust-based dependency resolver & installer" },
  { value: "poetry", label: "Poetry", description: "Deterministic pyproject.toml packaging and dependency isolation" },
  { value: "pip", label: "Pip + venv", description: "Standard requirements.txt workflow without external tooling" },
  { value: "conda", label: "Conda / Mamba", description: "Environment.yml with native C/CUDA libraries" },
]

export const LICENSE_OPTIONS = [
  { value: "mit", label: "MIT License", description: "Permissive, simple and commercial friendly" },
  { value: "apache-2.0", label: "Apache 2.0", description: "Permissive with explicit patent protection rights" },
  { value: "bsd-3", label: "BSD 3-Clause", description: "Permissive with non-endorsement clause" },
  { value: "proprietary", label: "Proprietary / Closed", description: "All rights reserved, internal proprietary code" },
]

export const CI_PROVIDER_OPTIONS = [
  { value: "github-actions", label: "GitHub Actions", description: ".github/workflows/ci.yml test & lint pipeline" },
  { value: "gitlab-ci", label: "GitLab CI", description: ".gitlab-ci.yml multi-stage runner configuration" },
  { value: "none", label: "None / Manual", description: "No automated continuous integration manifests" },
]

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

export const RANDOM_PROJECT_SLUGS = [
  "strata-classifier",
  "hyperion-vision",
  "zenith-nlp",
  "vanguard-forecaster",
  "aegis-inference",
  "pulse-analytics",
  "tensor-craft",
  "nexus-pipeline",
  "apex-detector",
  "vector-forge",
  "lumina-segmentation",
  "spectra-ranking",
  "helios-timeseries",
  "veritas-drift",
  "cortex-transformer",
]

export const RECENT_PROJECTS_STORAGE_KEY = "recentMLOpsProjects"
export const RECENT_PROJECTS_MAX = 10
