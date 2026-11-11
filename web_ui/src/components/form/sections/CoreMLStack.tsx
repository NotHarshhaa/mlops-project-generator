"use client"

import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"
import type { Options } from "../types"

export function CoreMLStack({ options }: { options: Options }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        title="Core ML Stack"
        subtitle="Specify machine learning framework, modeling task objective, and experiment tracking telemetry."
        step="LAYER 01 // MODEL CORE"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="framework"
          label="ML Framework"
          description="Primary modeling engine (PyTorch, TensorFlow, Scikit-learn)"
          options={options.framework || []}
          placeholder="Select framework…"
        />
        <CustomSelectField
          name="task_type"
          label="Task Objective"
          description="Classification, regression, time-series, or NLP"
          options={options.task_type || []}
          placeholder="Select task type…"
        />
      </div>
      <CustomSelectField
        name="experiment_tracking"
        label="Experiment Tracking"
        description="Automated telemetry and metric logging server"
        options={options.experiment_tracking || []}
        placeholder="Select experiment tracker…"
      />
    </div>
  )
}
