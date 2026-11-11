import type { GenerationProfile } from "../profiles"
import type { GeneratorConfig } from "../types"
import type { TemplateContext } from "../types"

export function toTitle(s: unknown): string {
  return String(s ?? "").replace(/\b\w/g, c => c.toUpperCase())
}

export function buildContext(cfg: GeneratorConfig, profile: GenerationProfile): TemplateContext {
  const projectSlug = cfg.project_name.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-")
  const authorSlug = (cfg.author_name ?? "author").toLowerCase().replace(/\s+/g, "_")

  return {
    ...cfg,
    project_slug: projectSlug,
    author_slug: authorSlug,
    python_version: cfg.python_version || "3.11",
    env_manager: cfg.env_manager || "uv",
    license: cfg.license || "mit",
    ci_provider: cfg.ci_provider || "github-actions",
    year: new Date().getFullYear().toString(),
    framework_display: toTitle(cfg.framework),
    task_display: toTitle(cfg.task_type),
    framework: cfg.framework,
    task_type: cfg.task_type,
    experiment_tracking: cfg.experiment_tracking,
    orchestration: cfg.orchestration,
    deployment: cfg.deployment,
    monitoring: cfg.monitoring,
    preset_config: cfg.preset_config,
    custom_template: cfg.custom_template,
    include_makefile: profile.includeMakefile,
    enhanced_tests: profile.enhancedTests,
    microservice_mode: profile.microserviceMode,
  }
}
