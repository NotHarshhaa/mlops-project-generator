import { REQUIRED_DETAIL_FIELDS, REQUIRED_STACK_FIELDS } from "../constants"
import type { FormValues } from "../schema"

export interface MissingField {
  field: string
}

export function getMissingFields(values: FormValues): MissingField[] {
  const missingStack = REQUIRED_STACK_FIELDS
    .filter(f => !values[f])
    .map(field => ({ field }))

  const missingDetails = REQUIRED_DETAIL_FIELDS
    .filter(f => !values[f]?.trim())
    .map(field => ({ field }))

  return [...missingStack, ...missingDetails]
}

export function formatMissingFieldsMessage(missing: MissingField[]): string {
  const names = missing.map(({ field }) => field.replace(/_/g, " ")).join(", ")
  return `Please fill all required fields.\n\nMissing: ${names}`
}

const HIGHLIGHT_CLASSES = [
  "ring-2", "ring-destructive/50", "ring-offset-2",
  "bg-destructive/5", "rounded-xl", "p-3", "transition-all", "duration-300",
] as const

export function highlightMissingFields(missing: MissingField[]): void {
  missing.forEach(({ field }) => {
    document.querySelector(`[data-field="${field}"]`)
      ?.classList.add(...HIGHLIGHT_CLASSES)
  })

  document.querySelector(`[data-field="${missing[0].field}"]`)
    ?.scrollIntoView({ behavior: "smooth", block: "center" })

  setTimeout(() => {
    missing.forEach(({ field }) => {
      document.querySelector(`[data-field="${field}"]`)
        ?.classList.remove(...HIGHLIGHT_CLASSES)
    })
  }, 5000)
}

export function hasSummaryData(values: FormValues): boolean {
  return REQUIRED_STACK_FIELDS.some(f => !!values[f]) ||
    !!(values.cloud_provider || values.cloud_service ||
       values.preset_config || values.custom_template ||
       values.project_name || values.author_name || values.description)
}
