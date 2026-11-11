"use client"

import { useState } from "react"
import { Download, Terminal, Check } from "lucide-react"
import { toast } from "sonner"
import type { FormValues } from "../schema"

interface ProjectSummaryProps {
  values: FormValues
}

function generateCliCommand(values: FormValues): string {
  const parts = ["python -m mlops_generator"]
  if (values.project_name) parts.push(`--project-name "${values.project_name}"`)
  if (values.framework) parts.push(`--framework ${values.framework}`)
  if (values.task_type) parts.push(`--task-type ${values.task_type}`)
  if (values.experiment_tracking && values.experiment_tracking !== "none") {
    parts.push(`--experiment-tracking ${values.experiment_tracking}`)
  }
  if (values.orchestration && values.orchestration !== "none") {
    parts.push(`--orchestration ${values.orchestration}`)
  }
  if (values.deployment) parts.push(`--deployment ${values.deployment}`)
  if (values.monitoring && values.monitoring !== "none") {
    parts.push(`--monitoring ${values.monitoring}`)
  }
  if (values.cloud_provider) parts.push(`--cloud-provider ${values.cloud_provider}`)
  if (values.cloud_service) parts.push(`--cloud-service ${values.cloud_service}`)
  if (values.preset_config) parts.push(`--preset-config ${values.preset_config}`)
  if (values.custom_template) parts.push(`--custom-template ${values.custom_template}`)
  return parts.join(" \\\n  ")
}

export function ProjectSummary({ values }: ProjectSummaryProps) {
  const [copiedCli, setCopiedCli] = useState(false)

  const handleExportConfig = () => {
    const jsonStr = JSON.stringify(values, null, 2)
    const blob = new Blob([jsonStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${values.project_name || "mlops-config"}.config.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Stack specification exported as JSON.")
  }

  const handleCopyCli = () => {
    const cmd = generateCliCommand(values)
    navigator.clipboard.writeText(cmd)
    setCopiedCli(true)
    toast.success("CLI command copied to clipboard.")
    setTimeout(() => setCopiedCli(false), 2000)
  }

  const summaryItems = [
    { label: "Framework", value: values.framework },
    { label: "Task Objective", value: values.task_type },
    { label: "Experiment Tracking", value: values.experiment_tracking },
    { label: "Pipeline Orchestration", value: values.orchestration },
    { label: "Serving Topology", value: values.deployment },
    { label: "Production Monitoring", value: values.monitoring },
    { label: "Cloud Provider", value: values.cloud_provider },
    { label: "Cloud Service", value: values.cloud_service },
    { label: "Config Preset", value: values.preset_config },
    { label: "Template Density", value: values.custom_template },
  ].filter((item) => Boolean(item.value))

  return (
    <div className="bg-white border border-black/20 p-5 sm:p-6 animate-monograph-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-black/15">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
            [ REVIEW SPECIFICATION ]
          </p>
          <h3 className="font-editorial text-lg text-[#000000] uppercase font-semibold">
            Architectural Bill of Materials
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyCli}
            className="btn-monograph-outline text-[10px] py-1.5 px-3"
            title="Copy equivalent CLI command"
          >
            {copiedCli ? <Check className="w-3 h-3 text-[#1925aa]" /> : <Terminal className="w-3 h-3" />}
            <span>{copiedCli ? "CLI Copied" : "Copy CLI Command"}</span>
          </button>
          <button
            type="button"
            onClick={handleExportConfig}
            className="btn-monograph text-[10px] py-1.5 px-3"
            title="Export configuration JSON"
          >
            <Download className="w-3 h-3" />
            <span>Export Config JSON</span>
          </button>
        </div>
      </div>

      {/* Specification Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 border-b border-black/10 pb-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="p-3 bg-[#e8e6e0]/50 border border-black/10">
            <p className="font-mono text-[9px] uppercase tracking-wider text-black/50 mb-1">
              {item.label}
            </p>
            <p className="font-mono text-xs font-bold text-black uppercase truncate">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Project & Author Identifiers */}
      {(values.project_name || values.author_name) && (
        <div className="pt-3 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs">
          {values.project_name && (
            <div className="flex items-baseline gap-2">
              <span className="text-black/50 text-[10px] uppercase">Package Name:</span>
              <span className="font-bold text-black">{values.project_name}</span>
            </div>
          )}
          {values.author_name && (
            <div className="flex items-baseline gap-2">
              <span className="text-black/50 text-[10px] uppercase">Maintainer:</span>
              <span className="text-black">{values.author_name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
