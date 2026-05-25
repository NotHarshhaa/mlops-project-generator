import { getTask } from "@/lib/tasks"
import { apiError, apiJson, isValidTaskId } from "@/lib/server"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params

  if (!isValidTaskId(taskId)) {
    return apiError("Invalid task ID", 400)
  }

  const task = getTask(taskId)
  if (!task) {
    return apiError("Task not found", 404)
  }

  return apiJson(task)
}
