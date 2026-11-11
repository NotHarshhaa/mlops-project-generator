"use client"

import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"

const PRESET_OPTIONS = [
  { value: "quick-start", label: "Quick Start", description: "Basic setup for rapid prototyping" },
  { value: "production-ready", label: "Production Ready", description: "Enterprise-grade configuration with CI/CD" },
  { value: "research", label: "Research", description: "Optimized for ML experimentation & notebook flows" },
  { value: "enterprise", label: "Enterprise", description: "Full enterprise topology with Kubernetes & Kubeflow" },
]

const TEMPLATE_OPTIONS = [
  { value: "minimal", label: "Minimal", description: "Lightweight essential scaffold" },
  { value: "comprehensive", label: "Comprehensive", description: "Full-featured topology with tests and docs" },
  { value: "microservice", label: "Microservice", description: "Focused inference microservice architecture" },
]

export function ConfigTemplates() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        title="Templates & Extra Bundles"
        subtitle="Optional configuration bundles, test harnesses, and CI/CD pipelines."
        step="LAYER 04 // BUNDLES"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="preset_config"
          label="Configuration Profile"
          description="Adds CI/CD, tests, and profile extras"
          options={PRESET_OPTIONS}
          placeholder="Select profile (optional)…"
        />
        <CustomSelectField
          name="custom_template"
          label="Template Density"
          description="Minimal, comprehensive, or microservice bundle"
          options={TEMPLATE_OPTIONS}
          placeholder="Select density (optional)…"
        />
      </div>
    </div>
  )
}
