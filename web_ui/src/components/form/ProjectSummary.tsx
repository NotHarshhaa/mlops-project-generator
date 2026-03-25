"use client"

import { Brain, BarChart, Microscope, GitBranch, Rocket, Shield, Cloud, Database, Palette, Star } from "lucide-react"
import { SummaryCard } from "./UIHelpers"
import type { FormValues } from "./types"

interface Props {
  values: FormValues
}

export function ProjectSummary({ values }: Props) {
  return (
    <div className="space-y-4 animate-slide-in-up">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl icon-gradient-violet flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Project Summary</h3>
          <p className="text-xs text-muted-foreground">Review your selections before generating</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {values.framework          && <SummaryCard icon={Brain}      label="ML Framework"        value={values.framework}          iconClass="icon-gradient-violet"  />}
        {values.task_type          && <SummaryCard icon={BarChart}   label="Task Type"            value={values.task_type}          iconClass="icon-gradient-cyan"    />}
        {values.experiment_tracking && <SummaryCard icon={Microscope} label="Experiment Tracking" value={values.experiment_tracking} iconClass="icon-gradient-emerald" />}
        {values.orchestration      && <SummaryCard icon={GitBranch}  label="Orchestration"        value={values.orchestration}      iconClass="icon-gradient-amber"   />}
        {values.deployment         && <SummaryCard icon={Rocket}     label="Deployment"           value={values.deployment}         iconClass="icon-gradient-rose"    />}
        {values.monitoring         && <SummaryCard icon={Shield}     label="Monitoring"           value={values.monitoring}         iconClass="icon-gradient-pink"    />}
        {values.cloud_provider     && <SummaryCard icon={Cloud}      label="Cloud Provider"       value={values.cloud_provider}     iconClass="icon-gradient-cyan"    />}
        {values.cloud_service      && <SummaryCard icon={Cloud}      label="Cloud Service"        value={values.cloud_service}      iconClass="icon-gradient-emerald" />}
        {values.preset_config      && <SummaryCard icon={Database}   label="Preset"               value={values.preset_config}      iconClass="icon-gradient-violet"  />}
        {values.custom_template    && <SummaryCard icon={Palette}    label="Template"             value={values.custom_template}    iconClass="icon-gradient-amber"   />}
      </div>

      {(values.project_name || values.author_name) && (
        <div className="glass-card rounded-2xl p-4 space-y-2">
          {values.project_name && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide w-24 shrink-0">Project</span>
              <span className="text-sm font-semibold font-mono text-foreground">{values.project_name}</span>
            </div>
          )}
          {values.author_name && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide w-24 shrink-0">Author</span>
              <span className="text-sm font-semibold text-foreground">{values.author_name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
