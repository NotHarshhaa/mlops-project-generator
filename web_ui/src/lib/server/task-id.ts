import { TASK_ID_PATTERN } from "./constants"

export function isValidTaskId(taskId: string): boolean {
  return TASK_ID_PATTERN.test(taskId)
}
