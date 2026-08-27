import fs from "fs/promises"
import path from "path"
import os from "os"
import type { Task } from "./types"

const TEMP_DIR = path.join(os.tmpdir(), "mlops_projects")
const TASK_TTL_MS = 60 * 60 * 1000 // 1 hour TTL
const MAX_TASKS = 200 // Max in-memory tasks

const globalForTasks = globalThis as typeof globalThis & {
  __mlopsTaskStore?: Map<string, Task>
  __mlopsCleanupInterval?: NodeJS.Timeout
}

if (!globalForTasks.__mlopsTaskStore) {
  globalForTasks.__mlopsTaskStore = new Map<string, Task>()
}

export const taskStore: Map<string, Task> = globalForTasks.__mlopsTaskStore

async function cleanupExpiredTasks(): Promise<void> {
  const now = Date.now()
  for (const [taskId, task] of taskStore.entries()) {
    const age = now - (task.created_at ?? now)
    if (age > TASK_TTL_MS) {
      taskStore.delete(taskId)
      const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)
      await fs.rm(zipPath, { force: true }).catch(() => {})
    }
  }

  // Cap size if exceeding limit
  if (taskStore.size > MAX_TASKS) {
    const sorted = Array.from(taskStore.entries()).sort(
      (a, b) => (a[1].created_at ?? 0) - (b[1].created_at ?? 0),
    )
    const toRemove = sorted.slice(0, taskStore.size - MAX_TASKS)
    for (const [taskId] of toRemove) {
      taskStore.delete(taskId)
      const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)
      await fs.rm(zipPath, { force: true }).catch(() => {})
    }
  }
}

if (!globalForTasks.__mlopsCleanupInterval) {
  globalForTasks.__mlopsCleanupInterval = setInterval(() => {
    cleanupExpiredTasks().catch(() => {})
  }, 10 * 60 * 1000) // Run every 10 minutes
}

export function getTask(taskId: string): Task | undefined {
  const task = taskStore.get(taskId)
  if (!task) return undefined
  if (task.created_at && Date.now() - task.created_at > TASK_TTL_MS) {
    taskStore.delete(taskId)
    const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)
    fs.rm(zipPath, { force: true }).catch(() => {})
    return undefined
  }
  return task
}

export function setTask(taskId: string, task: Task): void {
  taskStore.set(taskId, {
    ...task,
    created_at: task.created_at ?? Date.now(),
  })
}

export function updateTask(taskId: string, patch: Partial<Task>): void {
  const existing = taskStore.get(taskId)
  if (existing) {
    taskStore.set(taskId, { ...existing, ...patch })
  }
}

export function deleteTask(taskId: string): void {
  taskStore.delete(taskId)
  const zipPath = path.join(TEMP_DIR, `${taskId}.zip`)
  fs.rm(zipPath, { force: true }).catch(() => {})
}

