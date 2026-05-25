import os from "os"
import path from "path"

export const TEMP_DIR = path.join(os.tmpdir(), "mlops_projects")

/** UUID v4 task IDs from crypto.randomUUID() */
export const TASK_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
