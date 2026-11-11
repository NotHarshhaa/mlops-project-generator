export interface GeneratorConfig {
  framework: "sklearn" | "pytorch" | "tensorflow"
  task_type: string
  experiment_tracking: string
  orchestration: string
  deployment: string
  monitoring: string
  project_name: string
  author_name: string
  description: string
  cloud_provider?: string
  cloud_service?: string
  preset_config?: string
  custom_template?: string
  python_version?: string
  env_manager?: string
  license?: string
  ci_provider?: string
  enable_analytics?: boolean
}

/** A virtual file ready to be written into a ZIP */
export interface VirtualFile {
  path: string
  content: string
}

export type TemplateContext = Record<string, string | number | boolean | undefined | null>
