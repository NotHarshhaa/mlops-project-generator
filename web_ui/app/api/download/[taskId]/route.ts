import path from "path"
import fs from "fs/promises"
import { getTask } from "@/lib/tasks"
import { apiError, isValidTaskId, sanitizeFilename, TEMP_DIR } from "@/lib/server"

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

  if (task.status !== "completed") {
    return apiError("Project not ready for download", 400)
  }

  const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)

  try {
    const fileBuffer = await fs.readFile(zipPath)
    const filename = `${sanitizeFilename(task.project_name ?? task.task_id)}.zip`

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch {
    return apiError("Project archive not found", 404)
  }
}
