import { NextResponse } from "next/server"
import { getTask } from "@/lib/tasks"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params

  const task = getTask(taskId)
  if (!task) {
    return NextResponse.json({ detail: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}
