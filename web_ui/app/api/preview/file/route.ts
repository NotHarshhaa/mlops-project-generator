import { getProjectFile } from "@/lib/generator"
import { normalizeGenerateBody } from "@/lib/server/config"
import { buildPreviewConfig } from "@/lib/server/preview"
import { apiError, apiJson } from "@/lib/server/responses"

export const dynamic = "force-dynamic"

function getLanguageFromPath(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? ""
  switch (ext) {
    case "py":
      return "python"
    case "json":
      return "json"
    case "yaml":
    case "yml":
      return "yaml"
    case "md":
      return "markdown"
    case "sh":
    case "bash":
      return "bash"
    case "toml":
      return "toml"
    case "txt":
    case "cfg":
    case "ini":
      return "ini"
    case "dockerfile":
    case "containerfile":
      return "dockerfile"
    default:
      if (filePath.toLowerCase().endsWith("dockerfile")) return "dockerfile"
      return "plaintext"
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError("Invalid JSON body", 400)
  }

  if (!body || typeof body !== "object") {
    return apiError("Invalid request body", 400)
  }

  const payload = body as Record<string, unknown>
  const targetPath = typeof payload.path === "string" ? payload.path.trim() : ""

  if (!targetPath) {
    return apiError("Target file path is required", 400)
  }

  const normalized = normalizeGenerateBody(payload)
  if (!normalized) {
    return apiError("Invalid configuration fields", 400)
  }

  const cfg = buildPreviewConfig(normalized)
  const file = getProjectFile(cfg, targetPath)

  if (!file) {
    return apiError(`File '${targetPath}' not found in generated project`, 404)
  }

  return apiJson({
    path: file.path,
    content: file.content,
    size: Buffer.byteLength(file.content, "utf8"),
    lines: file.content.split("\n").length,
    language: getLanguageFromPath(file.path),
  })
}
