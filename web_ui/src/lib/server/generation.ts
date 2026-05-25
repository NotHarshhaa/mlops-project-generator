import path from "path"
import fs from "fs/promises"
import { writeProjectZip } from "@/lib/archive/zip"
import { generateProject } from "@/lib/generator"
import { updateTask } from "@/lib/tasks"
import { TEMP_DIR } from "./constants"
import { toGeneratorConfig } from "./config"
import type { GeneratorConfig } from "@/lib/generator"

export async function runGeneratorBackground(
  taskId: string,
  raw: Record<string, string>,
): Promise<void> {
  const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)

  try {
    updateTask(taskId, { status: "processing", message: "Generating project structure…" })

    const cfg: GeneratorConfig = toGeneratorConfig(raw)
    const files = generateProject(cfg)

    updateTask(taskId, { message: "Creating project archive…" })

    await fs.mkdir(TEMP_DIR, { recursive: true })
    await writeProjectZip(files, cfg.project_name, zipPath)

    updateTask(taskId, {
      status: "completed",
      message: "Project generated successfully",
      download_url: `/api/download/${taskId}`,
      project_name: cfg.project_name,
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
