import type { GeneratorConfig } from "./types"

export interface GenerationProfile {
  includeCi: boolean
  includePreCommit: boolean
  includeStarterNotebook: boolean
  includeMakefile: boolean
  includeInsights: boolean
  enhancedTests: boolean
  microserviceMode: boolean
}

/** Maps preset_config + custom_template to optional file bundles */
export function resolveProfile(cfg: GeneratorConfig): GenerationProfile {
  const preset = cfg.preset_config ?? ""
  const template = cfg.custom_template ?? ""

  const minimal = template === "minimal" || preset === "quick-start"
  const comprehensive =
    template === "comprehensive" || preset === "enterprise" || preset === "production-ready"
  const research = preset === "research"

  return {
    includeCi: comprehensive || preset === "production-ready",
    includePreCommit: comprehensive,
    includeStarterNotebook: research || comprehensive,
    includeMakefile: !minimal,
    includeInsights: cfg.enable_analytics ?? false,
    enhancedTests: comprehensive || preset === "production-ready",
    microserviceMode: template === "microservice",
  }
}
