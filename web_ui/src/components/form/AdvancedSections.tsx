"use client"

import { useFormContext } from "react-hook-form"
import { Cloud, Database, TrendingUp } from "lucide-react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { SectionHeader } from "./UIHelpers"
import { CustomSelectField } from "./CustomSelectField"

const CLOUD_SERVICES: Record<string, Array<{ value: string; label: string; description: string }>> = {
  aws: [
    { value: "sagemaker",  label: "SageMaker",  description: "AWS managed ML service" },
    { value: "ecs",        label: "ECS",         description: "Elastic Container Service" },
    { value: "lambda",     label: "Lambda",      description: "Serverless functions" },
  ],
  gcp: [
    { value: "vertex-ai",   label: "Vertex AI",   description: "GCP unified ML platform" },
    { value: "cloud-run",   label: "Cloud Run",   description: "Serverless containers" },
    { value: "ai-platform", label: "AI Platform", description: "GCP ML training & deployment" },
  ],
  azure: [
    { value: "ml-studio",            label: "Azure ML Studio",      description: "Azure ML workspace" },
    { value: "container-instances",  label: "Container Instances",  description: "Azure container service" },
    { value: "functions",            label: "Functions",            description: "Azure serverless functions" },
  ],
}

export function CloudDeployment() {
  const form = useFormContext()
  const selectedProvider = form.watch("cloud_provider")
  const serviceOptions = CLOUD_SERVICES[selectedProvider] ?? []

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Cloud}
        title="Cloud Deployment"
        subtitle="Optional — generate cloud-specific deployment templates"
        iconClass="icon-gradient-emerald"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="cloud_provider"
          label="Cloud Provider"
          description="Choose your cloud provider (optional)"
          options={[
            { value: "aws",   label: "Amazon Web Services",  description: "SageMaker, ECS, Lambda" },
            { value: "gcp",   label: "Google Cloud Platform", description: "Vertex AI, Cloud Run" },
            { value: "azure", label: "Microsoft Azure",       description: "ML Studio, Functions" },
          ]}
          placeholder="Select cloud provider…"
        />
        <CustomSelectField
          name="cloud_service"
          label="Cloud Service"
          description="Choose the specific cloud service"
          options={serviceOptions}
          placeholder={selectedProvider ? "Select cloud service…" : "Select cloud provider first"}
        />
      </div>
    </div>
  )
}

export function ConfigTemplates() {
  const form = useFormContext()

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
          options={[
            { value: "quick-start",      label: "Quick Start",      description: "Basic setup for rapid prototyping" },
            { value: "production-ready", label: "Production Ready", description: "Enterprise-grade configuration" },
            { value: "research",         label: "Research",         description: "Optimized for ML research" },
            { value: "enterprise",       label: "Enterprise",       description: "Full enterprise MLOps stack" },
          ]}
          placeholder="Select preset (optional)…"
        />
        <CustomSelectField
          name="custom_template"
          label="Custom Template"
          description="Choose a custom template variant (optional)"
          options={[
            { value: "minimal",       label: "Minimal",       description: "Lightweight template with essentials" },
            { value: "comprehensive", label: "Comprehensive", description: "Full-featured with all options" },
            { value: "microservice",  label: "Microservice",  description: "Microservice-oriented template" },
          ]}
          placeholder="Select template (optional)…"
        />
      </div>
    </div>
  )
}

export function AnalyticsToggle() {
  const form = useFormContext()

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={TrendingUp}
        title="Analytics & Insights"
        subtitle="Enable project analytics and usage tracking"
        iconClass="icon-gradient-rose"
      />
      <FormField
        control={form.control}
        name="enable_analytics"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 p-4 gap-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-semibold text-foreground cursor-pointer">Enable Analytics</FormLabel>
                <FormDescription className="text-xs">
                  Track project generation metrics and get insights about your MLOps projects
                </FormDescription>
              </div>
              <FormControl>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    field.value ? "gradient-primary" : "bg-muted"
                  }`}
                >
                  <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    field.value ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
