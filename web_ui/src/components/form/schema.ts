import * as z from "zod"
import { REQUIRED_STACK_FIELDS } from "./constants"

export const formSchema = z.object({
  framework: z.string().optional(),
  task_type: z.string().optional(),
  experiment_tracking: z.string().optional(),
  orchestration: z.string().optional(),
  deployment: z.string().optional(),
  monitoring: z.string().optional(),
  cloud_provider: z.string().optional(),
  cloud_service: z.string().optional(),
  preset_config: z.string().optional(),
  custom_template: z.string().optional(),
  enable_analytics: z.boolean().optional(),
  project_name: z.string().min(1, "Project name is required").max(50, "Project name must be 50 characters or less"),
  author_name: z.string().min(1, "Author name is required").max(100, "Author name must be 100 characters or less"),
  description: z.string().min(1, "Description is required"),
}).refine((data) => {
  return REQUIRED_STACK_FIELDS.every(f => !!data[f])
}, {
  message: "Please select an option for all categories before generating your project",
  path: ["framework"],
})

export type FormValues = z.infer<typeof formSchema>
