/**
 * Pure TypeScript MLOps project generator.
 * Uses legacy Jinja templates (repo templates/) when available, plus TS modules for new features.
 */

import { generateCloudFiles } from "./files/cloud"
import { generateCommonFiles } from "./files/common"
import { generateDeploymentFiles } from "./files/deployment"
import { generatePlaceholderDirs } from "./files/directories"
import { generateFrameworkFiles } from "./files/frameworks"
import { generateMonitoringFiles } from "./files/monitoring"
import { generateNlpHuggingfaceFiles } from "./files/nlp-huggingface"
import { generateOrchestrationFiles } from "./files/orchestration"
import { generateProfileFiles } from "./files/profiles-extra"
import { generateTaskExtensionFiles } from "./files/task-extensions"
import { resolveProfile } from "./profiles"
import { buildContext } from "./template"
import { generateLegacyTemplateFiles } from "./template/legacy-templates"
import type { GeneratorConfig, VirtualFile } from "./types"

export type { GeneratorConfig, VirtualFile } from "./types"
export { renderTemplate } from "./template"
export { resolveProfile } from "./profiles"
export { canUseLegacyTemplates, isLegacyTaskType } from "./template/legacy-templates"

const GENERATOR_VERSION = "1.2.0"

function withoutPaths(files: VirtualFile[], skip: Set<string>): VirtualFile[] {
  return files.filter(f => !skip.has(f.path))
}

function mergeByPath(...groups: VirtualFile[][]): VirtualFile[] {
  const map = new Map<string, VirtualFile>()
  for (const group of groups) {
    for (const file of group) {
      map.set(file.path, file)
    }
  }
  return Array.from(map.values())
}

export function generateProject(cfg: GeneratorConfig): VirtualFile[] {
  const profile = resolveProfile(cfg)
  const ctx = buildContext(cfg, profile)
  const isNlp = cfg.task_type === "nlp"

  const { files: legacyFiles, overridePaths } = isNlp
    ? { files: [], overridePaths: new Set<string>() }
    : generateLegacyTemplateFiles(cfg, ctx)

  const modernCore = withoutPaths(generateCommonFiles(ctx, profile), overridePaths)

  const modernFramework = isNlp
    ? []
    : withoutPaths(generateFrameworkFiles(cfg.framework, ctx), overridePaths)

  const nlpFiles = isNlp ? generateNlpHuggingfaceFiles(ctx) : []

  const taskExtensions = isNlp
    ? generateTaskExtensionFiles(ctx).filter(
        f => f.path !== "notebooks/nlp_quickstart.md" && f.path !== "src/data/text_preprocessor.py",
      )
    : generateTaskExtensionFiles(ctx)

  const extras = [
    ...modernCore,
    ...modernFramework,
    ...nlpFiles,
    ...taskExtensions,
    ...generatePlaceholderDirs(cfg),
    ...generateDeploymentFiles(cfg, ctx),
    ...generateOrchestrationFiles(cfg, ctx),
    ...generateMonitoringFiles(cfg, ctx),
    ...generateProfileFiles(cfg, ctx, profile),
  ]

  if (cfg.cloud_provider && cfg.cloud_service) {
    extras.push(...generateCloudFiles(cfg.cloud_provider, cfg.cloud_service, ctx))
  }

  const merged = mergeByPath(extras, legacyFiles)

  merged.push({
    path: "project_config.json",
    content: JSON.stringify(
      {
        ...cfg,
        generator_version: GENERATOR_VERSION,
        generation_profile: profile,
        legacy_templates: legacyFiles.length > 0,
        generated_at: new Date().toISOString(),
      },
      null,
      2,
    ),
  })

  return merged
}

/** File paths only — for preview API */
export function listProjectFiles(cfg: GeneratorConfig): string[] {
  return generateProject(cfg).map(f => f.path).sort()
}
