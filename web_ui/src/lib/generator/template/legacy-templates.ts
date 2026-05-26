import fs from "fs"
import path from "path"
import { renderTemplate } from "./engine"
import type { GeneratorConfig } from "../types"
import type { TemplateContext, VirtualFile } from "../types"

const LEGACY_TASK_TYPES = new Set(["classification", "regression", "timeseries"])

const COMMON_TEMPLATES = [
  "configs/config.yaml.j2",
  "requirements.txt.j2",
  "README.md.j2",
] as const

const BASE_OVERRIDE_PATHS = [
  "configs/config.yaml",
  "requirements.txt",
  "README.md",
  "src/train.py",
  "src/inference.py",
]

function resolveTemplatesRoot(): string | null {
  const candidates = [
    path.join(process.cwd(), "templates"),
    path.join(process.cwd(), "..", "templates"),
    path.join(process.cwd(), "..", "..", "templates"),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "common"))) return dir
  }
  return null
}

function preprocessTemplateSource(source: string): string {
  return source
    .replace(
      /\{\{\s*'random_forest'\s+if\s+task_type\s+in\s+\['classification',\s*'regression'\]\s+else\s+'arima'\s*\}\}/g,
      "{{ default_model_type }}",
    )
    .replace(/\{%\s*elif\s+framework\s*==\s*'docker'\s*%\}/g, "{% elif deployment == 'docker' %}")
    .replace(
      /\{\{\s*author_name\.lower\(\)\.replace\(' ', '_'\)\s*\}\}/g,
      "{{ author_slug }}",
    )
}

function buildLegacyContext(ctx: TemplateContext): TemplateContext {
  const taskType = String(ctx.task_type ?? "classification")
  const isClassificationOrRegression = taskType === "classification" || taskType === "regression"

  return {
    ...ctx,
    default_model_type: isClassificationOrRegression ? "random_forest" : "arima",
    author_slug: String(ctx.author_name ?? "author")
      .toLowerCase()
      .replace(/\s+/g, "_"),
  }
}

function renderJ2(content: string, ctx: TemplateContext): string {
  const legacyCtx = buildLegacyContext(ctx)
  return renderTemplate(preprocessTemplateSource(content), legacyCtx)
}

function postRenderFixes(content: string, ctx: TemplateContext): string {
  if (String(ctx.task_type) === "timeseries") {
    content = content.replace(/TimeseriesModel/g, "TimeSeriesModel")
  }
  return content
}

function readAndRender(filePath: string, outputPath: string, ctx: TemplateContext): VirtualFile | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    const content = postRenderFixes(renderJ2(raw, ctx), ctx)
    return { path: outputPath, content }
  } catch (err) {
    console.warn(`[legacy-templates] skip ${filePath}:`, err)
    return null
  }
}

function walkFrameworkTemplates(
  frameworkDir: string,
  ctx: TemplateContext,
  overridePaths: Set<string>,
): VirtualFile[] {
  const files: VirtualFile[] = []
  const taskType = String(ctx.task_type ?? "")

  if (!LEGACY_TASK_TYPES.has(taskType)) return files
  if (!fs.existsSync(frameworkDir)) return files

  const stack: string[] = [frameworkDir]
  while (stack.length > 0) {
    const dir = stack.pop()!
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
        continue
      }

      if (entry.name.endsWith(".j2")) {
        const rel = path.relative(frameworkDir, full).replace(/\\/g, "/")
        if (rel.includes("models/") && !rel.includes(`${taskType}_model`)) {
          continue
        }
        const outPath = rel.replace(/\.j2$/, "")
        overridePaths.add(outPath)
        const rendered = readAndRender(full, outPath, ctx)
        if (rendered) files.push(rendered)
      } else if (entry.name.endsWith(".py") && !entry.name.includes(".j2")) {
        const rel = path.relative(frameworkDir, full).replace(/\\/g, "/")
        files.push({ path: rel, content: fs.readFileSync(full, "utf-8") })
      }
    }
  }

  return files
}

export function canUseLegacyTemplates(cfg: GeneratorConfig): boolean {
  return LEGACY_TASK_TYPES.has(cfg.task_type)
}

export function generateLegacyTemplateFiles(
  cfg: GeneratorConfig,
  ctx: TemplateContext,
): { files: VirtualFile[]; overridePaths: Set<string> } {
  const root = resolveTemplatesRoot()
  const overridePaths = new Set(BASE_OVERRIDE_PATHS)

  if (!root || !canUseLegacyTemplates(cfg)) {
    return { files: [], overridePaths }
  }

  const files: VirtualFile[] = []
  const legacyCtx = buildLegacyContext(ctx)

  const commonDir = path.join(root, "common")
  for (const rel of COMMON_TEMPLATES) {
    const filePath = path.join(commonDir, rel)
    if (!fs.existsSync(filePath)) continue
    const outPath = rel.replace(/\.j2$/, "")
    overridePaths.add(outPath)
    const rendered = readAndRender(filePath, outPath, legacyCtx)
    if (rendered) files.push(rendered)
  }

  const frameworkDir = path.join(root, cfg.framework)
  files.push(...walkFrameworkTemplates(frameworkDir, legacyCtx, overridePaths))

  return { files, overridePaths }
}

export function isLegacyTaskType(taskType: string): boolean {
  return LEGACY_TASK_TYPES.has(taskType)
}
