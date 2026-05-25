"use client"

import { useFormContext } from "react-hook-form"
import { Cloud } from "lucide-react"
import { CLOUD_SERVICES } from "../constants"
import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"
import type { FormValues } from "../schema"

const CLOUD_PROVIDER_OPTIONS = [
  { value: "aws", label: "Amazon Web Services", description: "SageMaker, ECS, Lambda" },
  { value: "gcp", label: "Google Cloud Platform", description: "Vertex AI, Cloud Run" },
  { value: "azure", label: "Microsoft Azure", description: "ML Studio, Functions" },
]

export function CloudDeployment() {
  const form = useFormContext<FormValues>()
  const selectedProvider = form.watch("cloud_provider")
  const serviceOptions = CLOUD_SERVICES[selectedProvider ?? ""] ?? []

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
          options={CLOUD_PROVIDER_OPTIONS}
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
