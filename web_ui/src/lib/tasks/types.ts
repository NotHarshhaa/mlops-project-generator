export type TaskStatus = "pending" | "processing" | "completed" | "failed"

export interface Task {
  task_id: string
  status: TaskStatus
  message: string
  download_url?: string
}
