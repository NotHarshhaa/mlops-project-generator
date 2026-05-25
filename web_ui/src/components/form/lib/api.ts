import axios from "axios"
import type { FormValues, Options } from "../types"

export async function fetchOptions(): Promise<Options> {
  const { data } = await axios.get<Options>("/api/options")
  return data
}

export async function startGeneration(values: FormValues): Promise<{ task_id: string }> {
  const { data } = await axios.post<{ task_id: string }>("/api/generate", values)
  return data
}

export type TaskStatus = "processing" | "completed" | "failed"

export interface TaskResponse {
  status: TaskStatus
  download_url?: string
  message?: string
}

export async function fetchTaskStatus(taskId: string): Promise<TaskResponse> {
  const { data } = await axios.get<TaskResponse>(`/api/status/${taskId}`)
  return data
}
