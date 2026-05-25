export interface Option {
  value: string
  label: string
  description: string
}

export interface Options {
  framework: Option[]
  task_type: Option[]
  experiment_tracking: Option[]
  orchestration: Option[]
  deployment: Option[]
  monitoring: Option[]
  cloud_provider: Option[]
  cloud_service: Option[]
  preset_config: Option[]
  custom_template: Option[]
}

export type { FormValues } from "./schema"
