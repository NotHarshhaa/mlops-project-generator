"use client"

import { Database } from "lucide-react"
import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"

const PRESET_OPTIONS = [
  { value: "quick-start", label: "Quick Start", description: "Basic setup for rapid prototyping" },
  { value: "production-ready", label: "Production Ready", description: "Enterprise-grade configuration" },
  { value: "research", label: "Research", description: "Optimized for ML research" },
  { value: "enterprise", label: "Enterprise", description: "Full enterprise MLOps stack" },
]

const TEMPLATE_OPTIONS = [
  { value: "minimal", label: "Minimal", description: "Lightweight template with essentials" },
  { value: "comprehensive", label: "Comprehensive", description: "Full-featured with all options" },
  { value: "microservice", label: "Microservice", description: "Microservice-oriented template" },
]

export function ConfigTemplates() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Database}
        title="Configuration & Templates"
        subtitle="Advanced configuration presets and template options"
        iconClass="icon-gradient-amber"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="preset_config"
          label="Configuration Preset"
          description="Use a predefined configuration preset (optional)"
          options={PRESET_OPTIONS}
          placeholder="Select preset (optional)…"
        />
        <CustomSelectField
          name="custom_template"
          label="Custom Template"
          description="Choose a custom template variant (optional)"
          options={TEMPLATE_OPTIONS}
          placeholder="Select template (optional)…"
        />
      </div>
    </div>
  )
}
