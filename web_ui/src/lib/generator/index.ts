/**
 * Pure TypeScript MLOps project generator.
 * Replaces the Python CLI — runs natively in Next.js / Vercel edge runtimes.
 */

import { generateCloudFiles } from "./files/cloud"
import { generateCommonFiles } from "./files/common"
import { generatePlaceholderDirs } from "./files/directories"
import { generateFrameworkFiles } from "./files/frameworks"
import { buildContext } from "./template"
import type { GeneratorConfig, VirtualFile } from "./types"

export type { GeneratorConfig, VirtualFile } from "./types"
export { renderTemplate } from "./template"

export function generateProject(cfg: GeneratorConfig): VirtualFile[] {
  const ctx = buildContext(cfg)
  const files: VirtualFile[] = []

  files.push(...generateCommonFiles(ctx))
  files.push(...generateFrameworkFiles(cfg.framework, ctx))
  files.push(...generatePlaceholderDirs(cfg))

  if (cfg.cloud_provider && cfg.cloud_service) {
    files.push(...generateCloudFiles(cfg.cloud_provider, cfg.cloud_service, ctx))
  }

  files.push({
    path: "project_config.json",
    content: JSON.stringify({
      ...cfg,
      generator_version: "1.0.8",
      generated_at: new Date().toISOString(),
    }, null, 2),
  })

  return files
}
