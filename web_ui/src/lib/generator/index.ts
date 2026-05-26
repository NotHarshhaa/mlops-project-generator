/**
 * Pure TypeScript MLOps project generator.
 * Replaces the Python CLI — runs natively in Next.js / Vercel edge runtimes.
 */

import { generateCloudFiles } from "./files/cloud"
import { generateCommonFiles } from "./files/common"
import { generateDeploymentFiles } from "./files/deployment"
import { generatePlaceholderDirs } from "./files/directories"
import { generateFrameworkFiles } from "./files/frameworks"
import { generateMonitoringFiles } from "./files/monitoring"
import { generateOrchestrationFiles } from "./files/orchestration"
import { generateProfileFiles } from "./files/profiles-extra"
import { generateTaskExtensionFiles } from "./files/task-extensions"
import { resolveProfile } from "./profiles"
import { buildContext } from "./template"
import type { GeneratorConfig, VirtualFile } from "./types"

export type { GeneratorConfig, VirtualFile } from "./types"
export { renderTemplate } from "./template"
export { resolveProfile } from "./profiles"

const GENERATOR_VERSION = "1.1.0"

export function generateProject(cfg: GeneratorConfig): VirtualFile[] {
  const profile = resolveProfile(cfg)
  const ctx = buildContext(cfg, profile)
  const files: VirtualFile[] = []

  files.push(...generateCommonFiles(ctx, profile))
  files.push(...generateFrameworkFiles(cfg.framework, ctx))
  files.push(...generateTaskExtensionFiles(ctx))
  files.push(...generatePlaceholderDirs(cfg))
  files.push(...generateDeploymentFiles(cfg, ctx))
  files.push(...generateOrchestrationFiles(cfg, ctx))
  files.push(...generateMonitoringFiles(cfg, ctx))
  files.push(...generateProfileFiles(cfg, ctx, profile))

  if (cfg.cloud_provider && cfg.cloud_service) {
    files.push(...generateCloudFiles(cfg.cloud_provider, cfg.cloud_service, ctx))
  }

  files.push({
    path: "project_config.json",
    content: JSON.stringify(
      {
        ...cfg,
        generator_version: GENERATOR_VERSION,
        generation_profile: profile,
        generated_at: new Date().toISOString(),
      },
      null,
      2,
    ),
  })

  return files
}

/** File paths only — for preview API */
export function listProjectFiles(cfg: GeneratorConfig): string[] {
  return generateProject(cfg).map(f => f.path).sort()
}
