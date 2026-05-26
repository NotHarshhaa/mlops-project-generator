import fs from "fs"
import path from "path"
import { renderTemplate } from "./engine"
import type { GeneratorConfig } from "../types"
import type { TemplateContext, VirtualFile } from "../types"

const LEGACY_ML_TASK_TYPES = new Set(["classification", "regression", "timeseries"])

const BASE_OVERRIDE_PATHS = [
  "configs/config.yaml",
  "requirements.txt",
  "README.md",
  "Makefile",
  ".env.example",
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

function shouldSkipPath(fullPath: string): boolean {
  return fullPath.includes(`${path.sep}snippets${path.sep}`)
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
    author_slug: String(ctx.author_slug ?? ctx.author_name ?? "author")
      .toLowerCase()
      .replace(/\s+/g, "_"),
  }
}

function renderJ2(content: string, ctx: TemplateContext): string {
  return renderTemplate(preprocessTemplateSource(content), buildLegacyContext(ctx))
}

function postRenderFixes(content: string, ctx: TemplateContext): string {
  if (String(ctx.task_type) === "timeseries") {
    return content.replace(/TimeseriesModel/g, "TimeSeriesModel")
  }
  return content
}

function readAndRender(filePath: string, outputPath: string, ctx: TemplateContext): VirtualFile | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return { path: outputPath, content: postRenderFixes(renderJ2(raw, ctx), ctx) }
  } catch (err) {
    console.warn(`[legacy-templates] skip ${filePath}:`, err)
    return null
  }
}

function walkJ2Tree(
  baseDir: string,
  ctx: TemplateContext,
  overridePaths: Set<string>,
  options?: { modelTaskFilter?: string },
): VirtualFile[] {
  const files: VirtualFile[] = []
  if (!fs.existsSync(baseDir)) return files

  const stack = [baseDir]
  while (stack.length > 0) {
    const dir = stack.pop()!
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
        continue
      }

      if (entry.name.endsWith(".j2")) {
        if (shouldSkipPath(full)) continue
        const rel = path.relative(baseDir, full).replace(/\\/g, "/")
        if (options?.modelTaskFilter && rel.includes("models/") && !rel.includes(`${options.modelTaskFilter}_model`)) {
          continue
        }
        const outPath = rel.replace(/\.j2$/, "")
        overridePaths.add(outPath)
        const rendered = readAndRender(full, outPath, ctx)
        if (rendered) files.push(rendered)
      } else if (entry.name.endsWith(".py") && !entry.name.includes(".j2")) {
        const rel = path.relative(baseDir, full).replace(/\\/g, "/")
        files.push({ path: rel, content: fs.readFileSync(full, "utf-8") })
      }
    }
  }

  return files
}

export function canUseLegacyTemplates(cfg: GeneratorConfig): boolean {
  return LEGACY_ML_TASK_TYPES.has(cfg.task_type) || cfg.task_type === "nlp"
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

  const legacyCtx = buildLegacyContext(ctx)
  const files: VirtualFile[] = []
  const commonDir = path.join(root, "common")

  files.push(...walkJ2Tree(commonDir, legacyCtx, overridePaths))

  if (cfg.task_type === "nlp") {
    const nlpDir = path.join(root, "nlp")
    files.push(...walkJ2Tree(nlpDir, legacyCtx, overridePaths))
    overridePaths.add("configs/nlp.yaml")
    overridePaths.add("src/nlp/finetune.py")
    return { files, overridePaths }
  }

  const frameworkDir = path.join(root, cfg.framework)
  files.push(
    ...walkJ2Tree(frameworkDir, legacyCtx, overridePaths, {
      modelTaskFilter: cfg.task_type,
    }),
  )

  return { files, overridePaths }
}

export function isLegacyTaskType(taskType: string): boolean {
  return LEGACY_ML_TASK_TYPES.has(taskType) || taskType === "nlp"
}
