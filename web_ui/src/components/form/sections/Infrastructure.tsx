"use client"

import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"
import type { Options } from "../types"

export function Infrastructure({ options }: { options: Options }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        title="Infrastructure & Ops Layer"
        subtitle="Specify workflow pipeline DAGs, model serving formats, and production drift monitors."
        step="LAYER 02 // OPERATIONS"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="orchestration"
          label="Pipeline Orchestration"
          description="Workflow DAG execution (Airflow, Kubeflow)"
          options={options.orchestration || []}
          placeholder="Select orchestration…"
        />
        <CustomSelectField
          name="deployment"
          label="Serving Target"
          description="Inference container topology (FastAPI, Docker, K8s)"
          options={options.deployment || []}
          placeholder="Select deployment…"
        />
      </div>
      <CustomSelectField
        name="monitoring"
        label="Production Monitoring"
        description="Continuous evaluation and statistical data drift detection"
        options={options.monitoring || []}
        placeholder="Select monitoring…"
      />
    </div>
  )
}
