"use client"

import { useState } from "react"
import {
  Brain,
  BarChart,
  Microscope,
  GitBranch,
  Rocket,
  Shield,
  Cloud,
  Database,
  Palette,
  ListChecks,
  Download,
  Terminal,
  Check,
  Copy,
} from "lucide-react"
import { toast } from "sonner"
import { SummaryCard } from "../ui"
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
    toast.success("Stack configuration exported as JSON!")
  }

  const handleCopyCli = () => {
    const cmd = generateCliCommand(values)
    navigator.clipboard.writeText(cmd)
    setCopiedCli(true)
    toast.success("CLI command copied to clipboard!")
    setTimeout(() => setCopiedCli(false), 2000)
  }

  return (
    <div className="rounded-lg sm:rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-5 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-border/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="icon-chip icon-chip-cyan flex-shrink-0">
            <ListChecks className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-mono-label text-muted-foreground">Review</p>
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground">Configuration summary</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyCli}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold transition-colors cursor-pointer"
            title="Copy equivalent CLI command"
          >
            {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5 text-primary" />}
            <span>{copiedCli ? "Copied Command" : "Copy CLI Cmd"}</span>
          </button>
          <button
            type="button"
            onClick={handleExportConfig}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold transition-colors cursor-pointer"
            title="Export configuration JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
        {values.framework && <SummaryCard icon={Brain} label="Framework" value={values.framework} iconClass="icon-chip-violet" />}
        {values.task_type && <SummaryCard icon={BarChart} label="Task" value={values.task_type} iconClass="icon-chip-cyan" />}
        {values.experiment_tracking && <SummaryCard icon={Microscope} label="Tracking" value={values.experiment_tracking} iconClass="icon-chip-emerald" />}
        {values.orchestration && <SummaryCard icon={GitBranch} label="Orchestration" value={values.orchestration} iconClass="icon-chip-amber" />}
        {values.deployment && <SummaryCard icon={Rocket} label="Deploy" value={values.deployment} iconClass="icon-chip-rose" />}
        {values.monitoring && <SummaryCard icon={Shield} label="Monitoring" value={values.monitoring} iconClass="icon-chip-pink" />}
        {values.cloud_provider && <SummaryCard icon={Cloud} label="Cloud" value={values.cloud_provider} iconClass="icon-chip-cyan" />}
        {values.cloud_service && <SummaryCard icon={Cloud} label="Service" value={values.cloud_service} iconClass="icon-chip-emerald" />}
        {values.preset_config && <SummaryCard icon={Database} label="Preset" value={values.preset_config} iconClass="icon-chip-violet" />}
        {values.custom_template && <SummaryCard icon={Palette} label="Template" value={values.custom_template} iconClass="icon-chip-amber" />}
      </div>

      {(values.project_name || values.author_name) && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50 space-y-1.5 sm:space-y-2 font-mono text-xs sm:text-sm">
          {values.project_name && (
            <div className="flex gap-2 sm:gap-3">
              <span className="text-muted-foreground w-14 sm:w-16 shrink-0 font-mono-label">Project</span>
              <span className="font-semibold text-foreground truncate">{values.project_name}</span>
            </div>
          )}
          {values.author_name && (
            <div className="flex gap-2 sm:gap-3">
              <span className="text-muted-foreground w-14 sm:w-16 shrink-0 font-mono-label">Author</span>
              <span className="text-foreground truncate">{values.author_name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

