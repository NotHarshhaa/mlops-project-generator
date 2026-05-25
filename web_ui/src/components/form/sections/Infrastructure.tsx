"use client"

import { GitBranch } from "lucide-react"
import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"
import type { Options } from "../types"

export function Infrastructure({ options }: { options: Options }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GitBranch}
        title="Infrastructure & Deployment"
        subtitle="Orchestration, deployment, and monitoring setup"
        iconClass="icon-gradient-cyan"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="orchestration"
          label="Orchestration"
          description="Workflow orchestration for ML pipelines"
          options={options.orchestration || []}
          placeholder="Select orchestration…"
        />
        <CustomSelectField
          name="deployment"
          label="Deployment"
          description="How to deploy your ML model"
          options={options.deployment || []}
          placeholder="Select deployment…"
        />
      </div>
      <CustomSelectField
        name="monitoring"
        label="Monitoring"
        description="Monitoring solution for your ML models in production"
        options={options.monitoring || []}
        placeholder="Select monitoring…"
      />
    </div>
  )
}
