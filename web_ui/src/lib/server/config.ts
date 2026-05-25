import type { GeneratorConfig } from "@/lib/generator"

const OPTIONAL_STRING_FIELDS = [
  "cloud_provider",
  "cloud_service",
  "preset_config",
  "custom_template",
] as const

const ALL_STRING_FIELDS = [
  "framework",
  "task_type",
  "experiment_tracking",
  "orchestration",
  "deployment",
  "monitoring",
  "project_name",
  "author_name",
  "description",
  ...OPTIONAL_STRING_FIELDS,
] as const

export function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "string") return value === "true" || value === "1"
  if (typeof value === "number") return value === 1
  return false
}

export function normalizeGenerateBody(body: unknown): Record<string, string> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null
  }

  const raw = body as Record<string, unknown>
  const normalized: Record<string, string> = {}

  for (const field of ALL_STRING_FIELDS) {
    const value = raw[field]
    if (value === undefined || value === null) continue
    normalized[field] = String(value).trim()
  }

  if (raw.enable_analytics !== undefined) {
    normalized.enable_analytics = parseBoolean(raw.enable_analytics) ? "true" : "false"
  }

  return normalized
}

export function toGeneratorConfig(raw: Record<string, string>): GeneratorConfig {
  return {
    framework: raw.framework as GeneratorConfig["framework"],
    task_type: raw.task_type,
    experiment_tracking: raw.experiment_tracking,
    orchestration: raw.orchestration,
    deployment: raw.deployment,
    monitoring: raw.monitoring,
    project_name: raw.project_name,
    author_name: raw.author_name || "ML Engineer",
    description: raw.description || "A production-ready ML project",
    cloud_provider: raw.cloud_provider || undefined,
    cloud_service: raw.cloud_service || undefined,
    preset_config: raw.preset_config || undefined,
    custom_template: raw.custom_template || undefined,
    enable_analytics: parseBoolean(raw.enable_analytics ?? true),
  }
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50) || "mlops-project"
}
