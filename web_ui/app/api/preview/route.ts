import { listProjectFiles } from "@/lib/generator"
import { apiError, apiJson } from "@/lib/server/responses"
import { normalizeGenerateBody, toGeneratorConfig } from "@/lib/server/config"
import { validateGeneratorConfig } from "@/lib/generator/validation"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
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

  const cfg = toGeneratorConfig(normalized)
  const validationError = validateGeneratorConfig(normalized)
  if (validationError) {
    return apiError(validationError, 400)
  }

  const files = listProjectFiles(cfg)
  return apiJson({
    file_count: files.length,
    files,
    project_name: cfg.project_name,
  })
}
