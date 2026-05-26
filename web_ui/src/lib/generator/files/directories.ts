import type { GeneratorConfig } from "../types"
import type { VirtualFile } from "../types"

export function generatePlaceholderDirs(cfg: GeneratorConfig): VirtualFile[] {
  const dirs = [
    "data/raw", "data/processed", "data/external",
    "models/checkpoints", "models/production",
    "notebooks", "scripts", "configs", "tests", "logs",
  ]

  if (cfg.framework === "pytorch" || cfg.framework === "tensorflow") {
    dirs.push("src/data", "src/models", "src/training", "src/utils")
  } else {
    dirs.push("src/data", "src/models", "src/features", "src/utils")
  }

  if (cfg.experiment_tracking === "mlflow") dirs.push("mlruns")
  if (cfg.experiment_tracking === "wandb") dirs.push("wandb")
  if (cfg.orchestration === "airflow") dirs.push("dags")
  if (cfg.orchestration === "kubeflow") dirs.push("pipelines")
  if (cfg.deployment === "kubernetes") dirs.push("k8s")
  if (cfg.monitoring === "evidently" || cfg.monitoring === "custom") {
    dirs.push("reports", "scripts/monitoring")
  }

  return dirs.map(dir => ({ path: `${dir}/.gitkeep`, content: "" }))
}
