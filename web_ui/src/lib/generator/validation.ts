const VALID_OPTIONS: Record<string, string[]> = {
  framework: ["sklearn", "pytorch", "tensorflow"],
  task_type: ["classification", "regression", "timeseries", "nlp", "computer-vision"],
  experiment_tracking: ["mlflow", "wandb", "custom", "none"],
  orchestration: ["airflow", "kubeflow", "none"],
  deployment: ["fastapi", "docker", "kubernetes"],
  monitoring: ["evidently", "custom", "none"],
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

  return null
}
