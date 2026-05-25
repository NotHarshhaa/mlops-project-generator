import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import os from "os"
import path from "path"
import fs from "fs/promises"
import { writeProjectZip } from "@/lib/archive/zip"
import { generateProject, type GeneratorConfig } from "@/lib/generator"
import { validateGeneratorConfig } from "@/lib/generator/validation"
import { setTask, updateTask } from "@/lib/tasks"

export const dynamic = "force-dynamic"

const TEMP_DIR = path.join(os.tmpdir(), "mlops_projects")

export async function POST(request: Request) {
  try {
    const config = await request.json() as Record<string, string>

    const error = validateGeneratorConfig(config)
    if (error) return NextResponse.json({ detail: error }, { status: 400 })

    const taskId = randomUUID()

    setTask(taskId, { task_id: taskId, status: "pending", message: "Project generation queued" })

    runGeneratorBackground(taskId, config).catch(err => {
      console.error(`[generate] unhandled error task ${taskId}:`, err)
    })

    return NextResponse.json({ task_id: taskId, status: "pending", message: "Project generation started" })
  } catch (err: unknown) {
    console.error("[generate] POST error:", err)
    return NextResponse.json({ detail: "Failed to start project generation" }, { status: 500 })
  }
}

async function runGeneratorBackground(taskId: string, raw: Record<string, string>) {
  const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)

  try {
    updateTask(taskId, { status: "processing", message: "Generating project structure…" })

    const cfg: GeneratorConfig = {
      framework: raw.framework as GeneratorConfig["framework"],
      task_type: raw.task_type,
      experiment_tracking: raw.experiment_tracking,
      orchestration: raw.orchestration,
      deployment: raw.deployment,
      monitoring: raw.monitoring,
      project_name: raw.project_name,
      author_name: raw.author_name || "ML Engineer",
      description: raw.description || "A production-ready ML project",
      cloud_provider: raw.cloud_provider || undefined,
      cloud_service: raw.cloud_service || undefined,
      preset_config: raw.preset_config || undefined,
      custom_template: raw.custom_template || undefined,
      enable_analytics: raw.enable_analytics === "true",
    }

    const files = generateProject(cfg)

    updateTask(taskId, { message: "Creating project archive…" })

    await fs.mkdir(TEMP_DIR, { recursive: true })
    await writeProjectZip(files, cfg.project_name, zipPath)

    updateTask(taskId, {
      status: "completed",
      message: "Project generated successfully",
      download_url: `/api/download/${taskId}`,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[generate] error for ${taskId}:`, err)
    updateTask(taskId, {
      status: "failed",
      message: `Generation failed: ${message}`,
    })
    await fs.rm(zipPath, { force: true }).catch(() => {})
  }
}
