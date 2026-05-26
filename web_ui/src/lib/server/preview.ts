import type { GeneratorConfig } from "@/lib/generator"
import { toGeneratorConfig } from "./config"

const PREVIEW_DEFAULTS: Record<string, string> = {
  framework: "sklearn",
  task_type: "classification",
  experiment_tracking: "none",
  orchestration: "none",
  deployment: "fastapi",
  monitoring: "none",
  project_name: "preview-project",
  author_name: "Preview User",
  description: "Preview scaffold — fill the form to customize",
}

/** Build a generator config from partial query/body fields (no strict validation). */
export function buildPreviewConfig(input: Record<string, string>): GeneratorConfig {
  const merged: Record<string, string> = { ...PREVIEW_DEFAULTS }

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      merged[key] = String(value).trim()
    }
  }

  if (!merged.project_name || merged.project_name === "") {
    merged.project_name = PREVIEW_DEFAULTS.project_name
  }

  merged.project_name = merged.project_name
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 50) || PREVIEW_DEFAULTS.project_name

  return toGeneratorConfig(merged)
}
