import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import path from "path"
import os from "os"
import fs from "fs/promises"
import { execFile } from "child_process"
import { promisify } from "util"
import { setTask, updateTask } from "@/lib/task-store"

const execFileAsync = promisify(execFile)

export const dynamic = "force-dynamic"

// Temp directory for generated projects (system temp — auto-cleaned by OS)
const TEMP_DIR = path.join(os.tmpdir(), "mlops_projects")

// Path to the Python CLI script (relative to repo root)
const CLI_SCRIPT = path.join(process.cwd(), "..", "generator", "cli.py")

// ─── Validation ─────────────────────────────────────────────────────────────

const VALID = {
  framework:            ["sklearn", "pytorch", "tensorflow"],
  task_type:            ["classification", "regression", "timeseries", "nlp", "computer-vision"],
  experiment_tracking:  ["mlflow", "wandb", "custom", "none"],
  orchestration:        ["airflow", "kubeflow", "none"],
  deployment:           ["fastapi", "docker", "kubernetes"],
  monitoring:           ["evidently", "custom", "none"],
} as const

function validateConfig(cfg: Record<string, string>): string | null {
  const required = ["framework", "task_type", "experiment_tracking", "orchestration", "deployment", "monitoring", "project_name", "author_name"]
  for (const field of required) {
    if (!cfg[field]?.trim()) return `Missing required field: ${field}`
  }

  for (const [key, allowed] of Object.entries(VALID)) {
    if (cfg[key] && !(allowed as readonly string[]).includes(cfg[key])) {
      return `Invalid value for ${key}: "${cfg[key]}"`
    }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(cfg.project_name)) {
    return "Project name can only contain letters, numbers, hyphens and underscores"
  }
  if (cfg.project_name.length > 50) {
    return "Project name must be 50 characters or less"
  }

  return null // valid
}

// ─── POST /api/generate ──────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const config = await request.json() as Record<string, string>

    const error = validateConfig(config)
    if (error) {
      return NextResponse.json({ detail: error }, { status: 400 })
    }

    const taskId = randomUUID()

    setTask(taskId, {
      task_id: taskId,
      status: "pending",
      message: "Project generation queued",
    })

    // Fire and forget — do NOT await so the response is immediate
    runGeneratorBackground(taskId, config).catch((err) => {
      console.error(`[generate] unhandled error for task ${taskId}:`, err)
    })

    return NextResponse.json({
      task_id: taskId,
      status: "pending",
      message: "Project generation started",
    })
  } catch (err: any) {
    console.error("[generate] POST error:", err)
    return NextResponse.json({ detail: "Failed to start project generation" }, { status: 500 })
  }
}

// ─── Background generator ────────────────────────────────────────────────────

async function runGeneratorBackground(taskId: string, config: Record<string, string>) {
  const projectDir = path.join(TEMP_DIR, taskId)
  const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)

  try {
    // Mark as processing
    updateTask(taskId, { status: "processing", message: "Generating project structure…" })

    // Ensure temp directory exists
    await fs.mkdir(projectDir, { recursive: true })

    // Build CLI args — use execFile (no shell injection risk)
    const args = [
      CLI_SCRIPT,
      "init",
      "--framework",       config.framework,
      "--task-type",       config.task_type,
      "--tracking",        config.experiment_tracking,
      "--orchestration",   config.orchestration,
      "--deployment",      config.deployment,
      "--monitoring",      config.monitoring,
      "--project-name",    config.project_name,
      "--author-name",     config.author_name,
      "--description",     config.description || "A production-ready ML project",
    ]

    // Optional flags
    if (config.cloud_provider && config.cloud_service) {
      args.push("--cloud-provider", config.cloud_provider)
      args.push("--cloud-service",  config.cloud_service)
    }
    if (config.preset_config)   args.push("--preset",   config.preset_config)
    if (config.custom_template) args.push("--template", config.custom_template)
    if (config.enable_analytics === "true" || config.enable_analytics === true as any) {
      args.push("--enable-analytics")
    }

    const { stdout, stderr } = await execFileAsync("python", args, {
      cwd: projectDir,
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        PYTHONUNBUFFERED: "1",
      },
      maxBuffer: 50 * 1024 * 1024, // 50 MB
    })

    if (stderr) console.warn(`[generate] Python stderr for ${taskId}:`, stderr)
    if (stdout) console.log(`[generate] Python stdout for ${taskId}:`, stdout.slice(0, 500))

    // Zip the output directory
    updateTask(taskId, { message: "Creating project archive…" })
    await createZip(projectDir, zipPath)

    // Cleanup project dir (keep only the zip)
    await fs.rm(projectDir, { recursive: true, force: true })

    updateTask(taskId, {
      status:       "completed",
      message:      "Project generated successfully",
      download_url: `/api/download/${taskId}`,
    })
  } catch (err: any) {
    console.error(`[generate] background error for ${taskId}:`, err)
    updateTask(taskId, {
      status:  "failed",
      message: `Generation failed: ${err.message ?? String(err)}`,
    })

    // Cleanup on failure
    await fs.rm(projectDir, { recursive: true, force: true }).catch(() => {})
    await fs.rm(zipPath, { force: true }).catch(() => {})
  }
}

// ─── ZIP helper (uses Node.js built-ins via archiver) ────────────────────────

async function createZip(sourceDir: string, zipPath: string): Promise<void> {
  // Dynamic import so TypeScript doesn't need @types/archiver available at compile
  const archiver = (await import("archiver")).default
  const { createWriteStream } = await import("fs")

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 6 } })

    output.on("close", resolve)
    output.on("error", reject)
    archive.on("error", reject)

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}
