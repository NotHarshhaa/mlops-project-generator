/**
 * In-process task store — a module-level singleton that survives across
 * Next.js API route calls within a single server process.
 *
 * For multi-process / production deployments, swap this for Redis or a DB.
 */

import type { Task } from "./types"

const globalForTasks = globalThis as typeof globalThis & {
  __mlopsTaskStore?: Map<string, Task>
}

if (!globalForTasks.__mlopsTaskStore) {
  globalForTasks.__mlopsTaskStore = new Map<string, Task>()
}

export const taskStore: Map<string, Task> = globalForTasks.__mlopsTaskStore

export function getTask(taskId: string): Task | undefined {
  return taskStore.get(taskId)
}

export function setTask(taskId: string, task: Task): void {
  taskStore.set(taskId, task)
}

export function updateTask(taskId: string, patch: Partial<Task>): void {
  const existing = taskStore.get(taskId)
  if (existing) {
    taskStore.set(taskId, { ...existing, ...patch })
  }
}

export function deleteTask(taskId: string): void {
  taskStore.delete(taskId)
}
