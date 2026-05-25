import { randomUUID } from "crypto"
import { validateGeneratorConfig } from "@/lib/generator/validation"
import { setTask, updateTask } from "@/lib/tasks"
import { apiError, apiJson, normalizeGenerateBody } from "@/lib/server"
import { runGeneratorBackground } from "@/lib/server/generation"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError("Invalid JSON body", 400)
  }

  const config = normalizeGenerateBody(body)
  if (!config) {
    return apiError("Invalid request body", 400)
  }

  const validationError = validateGeneratorConfig(config)
  if (validationError) {
    return apiError(validationError, 400)
  }

  const taskId = randomUUID()

  setTask(taskId, {
    task_id: taskId,
    status: "pending",
    message: "Project generation queued",
    project_name: config.project_name,
  })

  runGeneratorBackground(taskId, config).catch(err => {
    console.error(`[generate] unhandled error task ${taskId}:`, err)
    updateTask(taskId, {
      status: "failed",
      message: "Generation failed due to an unexpected server error",
    })
  })

  return apiJson({
    task_id: taskId,
    status: "pending",
    message: "Project generation started",
  })
}
