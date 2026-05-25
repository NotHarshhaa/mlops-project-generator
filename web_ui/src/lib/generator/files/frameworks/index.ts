import type { TemplateContext, VirtualFile } from "@/lib/generator/types"
import { generatePytorchFiles } from "./pytorch"
import { generateSklearnFiles } from "./sklearn"
import { generateTensorflowFiles } from "./tensorflow"

export function generateFrameworkFiles(framework: string, ctx: TemplateContext): VirtualFile[] {
  if (framework === "sklearn") return generateSklearnFiles(ctx)
  if (framework === "pytorch") return generatePytorchFiles(ctx)
  if (framework === "tensorflow") return generateTensorflowFiles(ctx)
  return []
}
