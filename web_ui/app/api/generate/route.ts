import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import os from "os"
import path from "path"
import fs from "fs/promises"
import { setTask, updateTask } from "@/lib/task-store"
import { generateProject, type GeneratorConfig } from "@/lib/generator"
import type { VirtualFile } from "@/lib/generator"

export const dynamic = "force-dynamic"

const TEMP_DIR = path.join(os.tmpdir(), "mlops_projects")

// ─── Validation ───────────────────────────────────────────────────────────────

const VALID: Record<string, string[]> = {
  framework:           ["sklearn", "pytorch", "tensorflow"],
  task_type:           ["classification", "regression", "timeseries", "nlp", "computer-vision"],
  experiment_tracking: ["mlflow", "wandb", "custom", "none"],
  orchestration:       ["airflow", "kubeflow", "none"],
  deployment:          ["fastapi", "docker", "kubernetes"],
  monitoring:          ["evidently", "custom", "none"],
}

function validateConfig(cfg: Record<string, string>): string | null {
  const required = ["framework", "task_type", "experiment_tracking", "orchestration", "deployment", "monitoring", "project_name", "author_name"]
  for (const f of required) {
    if (!cfg[f]?.trim()) return `Missing required field: ${f}`
  }
  for (const [key, allowed] of Object.entries(VALID)) {
    if (cfg[key] && !allowed.includes(cfg[key])) return `Invalid value for ${key}: "${cfg[key]}"`
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(cfg.project_name)) {
    return "Project name can only contain letters, numbers, hyphens and underscores"
  }
  if (cfg.project_name.length > 50) return "Project name must be 50 characters or less"
  return null
}

// ─── POST /api/generate ───────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const config = await request.json() as Record<string, string>

    const error = validateConfig(config)
    if (error) return NextResponse.json({ detail: error }, { status: 400 })

    const taskId = randomUUID()

    setTask(taskId, { task_id: taskId, status: "pending", message: "Project generation queued" })

    // Fire-and-forget — response returns immediately while generation runs
    runGeneratorBackground(taskId, config).catch(err => {
      console.error(`[generate] unhandled error task ${taskId}:`, err)
    })

    return NextResponse.json({ task_id: taskId, status: "pending", message: "Project generation started" })
  } catch (err: any) {
    console.error("[generate] POST error:", err)
    return NextResponse.json({ detail: "Failed to start project generation" }, { status: 500 })
  }
}

// ─── Background generation (pure TypeScript — no Python needed) ───────────────

async function runGeneratorBackground(taskId: string, raw: Record<string, string>) {
  const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)

  try {
    updateTask(taskId, { status: "processing", message: "Generating project structure…" })

    // Build typed config
    const cfg: GeneratorConfig = {
      framework:           raw.framework as any,
      task_type:           raw.task_type,
      experiment_tracking: raw.experiment_tracking,
      orchestration:       raw.orchestration,
      deployment:          raw.deployment,
      monitoring:          raw.monitoring,
      project_name:        raw.project_name,
      author_name:         raw.author_name || "ML Engineer",
      description:         raw.description || "A production-ready ML project",
      cloud_provider:      raw.cloud_provider || undefined,
      cloud_service:       raw.cloud_service  || undefined,
      preset_config:       raw.preset_config  || undefined,
      custom_template:     raw.custom_template || undefined,
      enable_analytics:    raw.enable_analytics === "true",
    }

    // Generate all virtual files in memory
    const files: VirtualFile[] = generateProject(cfg)

    updateTask(taskId, { message: "Creating project archive…" })

    // Write zip
    await fs.mkdir(TEMP_DIR, { recursive: true })
    await writeZip(files, cfg.project_name, zipPath)

    updateTask(taskId, {
      status:       "completed",
      message:      "Project generated successfully",
      download_url: `/api/download/${taskId}`,
    })
  } catch (err: any) {
    console.error(`[generate] error for ${taskId}:`, err)
    updateTask(taskId, {
      status:  "failed",
      message: `Generation failed: ${err.message ?? String(err)}`,
    })
    await fs.rm(zipPath, { force: true }).catch(() => {})
  }
}

// ─── ZIP writer ───────────────────────────────────────────────────────────────

async function writeZip(files: VirtualFile[], projectName: string, zipPath: string): Promise<void> {
  const archiver = (await import("archiver")).default
  const { createWriteStream } = await import("fs")

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 6 } })

    output.on("close", resolve)
    output.on("error", reject)
    archive.on("error", reject)

    archive.pipe(output)

    for (const file of files) {
      // Nest everything under the project name folder
      archive.append(file.content, { name: `${projectName}/${file.path}` })
    }

    archive.finalize()
  })
}
