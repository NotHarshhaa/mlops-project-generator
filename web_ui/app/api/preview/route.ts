import { listProjectFiles } from "@/lib/generator"
import { validateGeneratorConfig } from "@/lib/generator/validation"
import { normalizeGenerateBody, toGeneratorConfig } from "@/lib/server/config"
import { buildPreviewConfig } from "@/lib/server/preview"
import { apiError, apiJson } from "@/lib/server/responses"
import type { GeneratorConfig } from "@/lib/generator"

export const dynamic = "force-dynamic"

function previewResponse(cfg: GeneratorConfig, partial: boolean) {
  const files = listProjectFiles(cfg)
  return apiJson({
    file_count: files.length,
    files,
    project_name: cfg.project_name,
    partial,
    legacy_templates:
      cfg.task_type !== "nlp" &&
      ["classification", "regression", "timeseries"].includes(cfg.task_type),
  })
}

/**
 * GET /api/preview?framework=pytorch&task_type=classification&...
 * Returns a file tree using defaults for missing fields (no strict validation).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const input: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    input[key] = value
  })

  const cfg = buildPreviewConfig(input)
  return previewResponse(cfg, true)
}

/**
 * POST /api/preview — body fields; use ?strict=true for full validation like /api/generate
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const strict = searchParams.get("strict") === "true"

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError("Invalid JSON body", 400)
  }

  const normalized = normalizeGenerateBody(body)
  if (!normalized) {
    return apiError("Invalid request body", 400)
  }

  if (strict) {
    const validationError = validateGeneratorConfig(normalized)
    if (validationError) {
      return apiError(validationError, 400)
    }
    return previewResponse(toGeneratorConfig(normalized), false)
  }

  return previewResponse(buildPreviewConfig(normalized), true)
}
