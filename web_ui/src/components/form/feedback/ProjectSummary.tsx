"use client"

import {
  Brain, BarChart, Microscope, GitBranch, Rocket, Shield, Cloud, Database, Palette, ListChecks,
} from "lucide-react"
import { SummaryCard } from "../ui"
import type { FormValues } from "../schema"

interface ProjectSummaryProps {
  values: FormValues
}

export function ProjectSummary({ values }: ProjectSummaryProps) {
  return (
    <div className="rounded-lg sm:rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-5 animate-slide-in-up">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-border/50">
        <div className="icon-chip icon-chip-cyan flex-shrink-0">
          <ListChecks className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-mono-label text-muted-foreground">Review</p>
          <h3 className="font-display text-sm sm:text-base font-bold text-foreground">Configuration summary</h3>
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
