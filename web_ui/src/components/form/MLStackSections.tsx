"use client"

import { Brain, GitBranch } from "lucide-react"
import { SectionHeader } from "./UIHelpers"
import { CustomSelectField } from "./CustomSelectField"
import type { Options } from "./types"

export function CoreMLStack({ options }: { options: Options }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Brain}
        title="Core ML Stack"
        subtitle="Configure your fundamental machine learning components"
        iconClass="icon-gradient-violet"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="framework"
          label="ML Framework"
          description="Your preferred machine learning framework"
          options={options.framework || []}
          placeholder="Select framework…"
        />
        <CustomSelectField
          name="task_type"
          label="Task Type"
          description="The type of machine learning task"
          options={options.task_type || []}
          placeholder="Select task type…"
        />
      </div>
      <CustomSelectField
        name="experiment_tracking"
        label="Experiment Tracking"
        description="How you'll track and compare ML experiments"
        options={options.experiment_tracking || []}
        placeholder="Select experiment tracker…"
      />
    </div>
  )
}

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
