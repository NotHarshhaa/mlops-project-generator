"use client"

import { useFormContext } from "react-hook-form"
import { CLOUD_SERVICES } from "../constants"
import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"
import type { FormValues } from "../schema"

const CLOUD_PROVIDER_OPTIONS = [
  { value: "aws", label: "Amazon Web Services", description: "SageMaker, ECS, Lambda" },
  { value: "gcp", label: "Google Cloud Platform", description: "Vertex AI, Cloud Run" },
  { value: "azure", label: "Microsoft Azure", description: "Azure ML Studio, Functions" },
]

export function CloudDeployment() {
  const form = useFormContext<FormValues>()
  const selectedProvider = form.watch("cloud_provider")
  const serviceOptions = CLOUD_SERVICES[selectedProvider ?? ""] ?? []

  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        title="Cloud Deployment Target"
        subtitle="Optional cloud-specific infrastructure scripts and IAM bindings."
        step="LAYER 03 // CLOUD INFRASTRUCTURE"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="cloud_provider"
          label="Cloud Provider"
          description="AWS, GCP, or Azure (optional)"
          options={CLOUD_PROVIDER_OPTIONS}
          placeholder="Select cloud provider…"
        />
        <CustomSelectField
          name="cloud_service"
          label="Target Cloud Service"
          description="Managed service within the selected cloud"
          options={serviceOptions}
          disabled={!selectedProvider}
          placeholder={selectedProvider ? "Select cloud service…" : "Select provider first"}
        />
      </div>
    </div>
  )
}
