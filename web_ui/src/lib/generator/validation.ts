const VALID_OPTIONS: Record<string, string[]> = {
  framework: ["sklearn", "pytorch", "tensorflow"],
  task_type: ["classification", "regression", "timeseries", "nlp", "computer-vision"],
  experiment_tracking: ["mlflow", "wandb", "custom", "none"],
  orchestration: ["airflow", "kubeflow", "none"],
  deployment: ["fastapi", "docker", "kubernetes"],
  monitoring: ["evidently", "custom", "none"],
  cloud_provider: ["aws", "gcp", "azure"],
}

const CLOUD_SERVICES_BY_PROVIDER: Record<string, string[]> = {
  aws: ["sagemaker", "ecs", "lambda"],
  gcp: ["vertex-ai", "cloud-run", "ai-platform"],
  azure: ["ml-studio", "container-instances", "functions"],
}

const REQUIRED_FIELDS = [
  "framework",
  "task_type",
  "experiment_tracking",
  "orchestration",
  "deployment",
  "monitoring",
  "project_name",
  "author_name",
  "description",
] as const

export function validateGeneratorConfig(cfg: Record<string, string>): string | null {
  for (const field of REQUIRED_FIELDS) {
    if (!cfg[field]?.trim()) return `Missing required field: ${field}`
  }

  for (const [key, allowed] of Object.entries(VALID_OPTIONS)) {
    if (cfg[key] && !allowed.includes(cfg[key])) {
      return `Invalid value for ${key}: "${cfg[key]}"`
    }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(cfg.project_name)) {
    return "Project name can only contain letters, numbers, hyphens and underscores"
  }

  if (cfg.project_name.length > 50) {
    return "Project name must be 50 characters or less"
  }

  if (cfg.description.length > 2000) {
    return "Description must be 2000 characters or less"
  }

  const hasProvider = !!cfg.cloud_provider?.trim()
  const hasService = !!cfg.cloud_service?.trim()

  if (hasProvider !== hasService) {
    return "Cloud provider and cloud service must both be set or both be empty"
  }

  if (hasProvider && hasService) {
    const allowed = CLOUD_SERVICES_BY_PROVIDER[cfg.cloud_provider]
    if (!allowed?.includes(cfg.cloud_service)) {
      return `Invalid cloud service "${cfg.cloud_service}" for provider "${cfg.cloud_provider}"`
    }
  }

  return null
}
