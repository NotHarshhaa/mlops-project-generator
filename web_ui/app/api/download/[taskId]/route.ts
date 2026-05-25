import { NextResponse } from "next/server"
import path from "path"
import os from "os"
import fs from "fs"
import { getTask } from "@/lib/tasks"

export const dynamic = "force-dynamic"

const TEMP_DIR = path.join(os.tmpdir(), "mlops_projects")

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params

  // Safety check: only allow UUID-shaped task IDs to prevent path traversal
  if (!/^[0-9a-f-]{36}$/.test(taskId)) {
    return NextResponse.json({ detail: "Invalid task ID" }, { status: 400 })
  }

  const task = getTask(taskId)
  if (!task) {
    return NextResponse.json({ detail: "Task not found" }, { status: 404 })
  }

  if (task.status !== "completed") {
    return NextResponse.json({ detail: "Project not ready for download" }, { status: 400 })
  }

  const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)

  try {
    // Read into buffer and stream back
    const fileBuffer = fs.readFileSync(zipPath)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":        "application/zip",
        "Content-Disposition": `attachment; filename="${task.task_id}.zip"`,
        "Content-Length":      fileBuffer.length.toString(),
      },
    })
  } catch {
    return NextResponse.json({ detail: "Project archive not found" }, { status: 404 })
  }
}
