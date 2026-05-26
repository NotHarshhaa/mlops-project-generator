"use client"

import { Brain } from "lucide-react"
import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"
import type { Options } from "../types"

export function CoreMLStack({ options }: { options: Options }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        icon={Brain}
        title="Core ML Stack"
        subtitle="Framework, task type, and experiment tracking"
        iconClass="icon-chip-violet"
        step="ML core"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
