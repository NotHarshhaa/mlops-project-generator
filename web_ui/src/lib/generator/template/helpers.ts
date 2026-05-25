import type { GeneratorConfig } from "../types"
import type { TemplateContext } from "../types"

export function toTitle(s: unknown): string {
  return String(s ?? "").replace(/\b\w/g, c => c.toUpperCase())
}

export function buildContext(cfg: GeneratorConfig): TemplateContext {
  const projectSlug = cfg.project_name.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-")
  return {
    ...cfg,
    project_slug: projectSlug,
    python_version: "3.11",
    year: new Date().getFullYear().toString(),
    framework_display: toTitle(cfg.framework),
    task_display: toTitle(cfg.task_type),
    framework: cfg.framework,
    task_type: cfg.task_type,
    experiment_tracking: cfg.experiment_tracking,
    orchestration: cfg.orchestration,
    deployment: cfg.deployment,
    monitoring: cfg.monitoring,
  }
}
