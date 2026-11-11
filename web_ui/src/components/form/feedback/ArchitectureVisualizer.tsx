"use client"

import { useMemo } from "react"
import { Layers, Activity, Server, Cloud, Cpu, Terminal } from "lucide-react"
import type { FormValues } from "../schema"

interface ArchitectureVisualizerProps {
  values: FormValues
}

export function ArchitectureVisualizer({ values }: ArchitectureVisualizerProps) {
  const frameworkName = (values.framework || "Unspecified").toUpperCase()
  const taskName = (values.task_type || "Task").toUpperCase()
  const trackingName = (values.experiment_tracking || "None").toUpperCase()
  const orchestrationName = (values.orchestration || "Standalone").toUpperCase()
  const deploymentName = (values.deployment || "FastAPI").toUpperCase()
  const monitoringName = (values.monitoring || "None").toUpperCase()
  const cloudName = values.cloud_provider
    ? `${values.cloud_provider.toUpperCase()} (${(values.cloud_service || "Cloud").toUpperCase()})`
    : "CLOUD AGNOSTIC"

  const activeNodesCount = useMemo(() => {
    let count = 0
    if (values.framework) count++
    if (values.task_type) count++
    if (values.experiment_tracking && values.experiment_tracking !== "none") count++
    if (values.orchestration && values.orchestration !== "none") count++
    if (values.deployment) count++
    if (values.monitoring && values.monitoring !== "none") count++
    if (values.cloud_provider) count++
    return count
  }, [values])

  return (
    <div className="bg-white border border-black/20 p-5 sm:p-6 animate-monograph-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-black/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1925aa]" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
              [ REAL-TIME TOPOLOGY // ARCHITECTURAL SCHEMATIC ]
            </p>
          </div>
          <h3 className="font-editorial text-lg text-black uppercase font-semibold mt-0.5">
            Active Dataflow Pipeline Blueprint
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 border border-black/20 bg-[#e8e6e0]/60 text-black">
            {activeNodesCount} / 7 LAYERS WIRED
          </span>
          <span className="px-2 py-0.5 border border-[#1925aa] bg-[#1925aa] text-white font-bold">
            LIVE SCHEMATIC
          </span>
        </div>
      </div>

      {/* Schematic Flow Matrix */}
      <div className="p-4 bg-[#e8e6e0]/30 border border-black/10 font-mono text-xs overflow-x-auto">
        <div className="min-w-[620px] space-y-4">
          {/* Top Tier: Ingestion -> Model Core -> Telemetry */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 p-3 bg-white border border-black/20">
              <span className="text-[9px] text-black/50 block uppercase">01 / Ingestion</span>
              <span className="font-bold text-black text-xs">Dataset Ingestion</span>
              <span className="text-[10px] text-black/60 block mt-0.5">data/raw → data/processed</span>
            </div>

            <span className="text-[#1925aa] font-bold px-1">──►</span>

            <div className={`flex-[1.4] p-3 border ${values.framework ? "bg-white border-[#1925aa]" : "bg-black/5 border-dashed border-black/20"}`}>
              <div className="flex justify-between items-center text-[9px] mb-0.5">
                <span className="text-black/50 uppercase">02 / Model Engine</span>
                {values.framework && <span className="text-[#1925aa] font-bold">[ ACTIVE ]</span>}
              </div>
              <span className="font-bold text-black text-xs block">
                {frameworkName}
              </span>
              <span className="text-[10px] text-black/70 block">
                Objective: {taskName}
              </span>
            </div>

            <span className="text-[#1925aa] font-bold px-1">──►</span>

            <div className={`flex-1 p-3 border ${values.experiment_tracking && values.experiment_tracking !== "none" ? "bg-white border-black/20" : "bg-black/5 border-dashed border-black/20 text-black/50"}`}>
              <span className="text-[9px] text-black/50 block uppercase">03 / Telemetry</span>
              <span className="font-bold text-black text-xs block">
                {trackingName}
              </span>
              <span className="text-[10px] text-black/60 block mt-0.5">
                {values.experiment_tracking === "none" ? "No Tracking Configured" : "Lineage & Metric Logs"}
              </span>
            </div>
          </div>

          {/* Vertical Link Arrow */}
          <div className="flex justify-around text-[#1925aa] font-bold text-sm select-none pl-36">
            <span>│</span>
            <span>▼</span>
          </div>

          {/* Middle Tier: Orchestration -> Serving -> Drift Monitoring */}
          <div className="flex items-center justify-between gap-2">
            <div className={`flex-1 p-3 border ${values.orchestration && values.orchestration !== "none" ? "bg-white border-black/20" : "bg-black/5 border-dashed border-black/20 text-black/50"}`}>
              <span className="text-[9px] text-black/50 block uppercase">04 / Pipeline DAG</span>
              <span className="font-bold text-black text-xs block">
                {orchestrationName}
              </span>
              <span className="text-[10px] text-black/60 block mt-0.5">
                {values.orchestration === "none" ? "Direct Execution" : "Scheduled Graph Pipeline"}
              </span>
            </div>

            <span className="text-[#1925aa] font-bold px-1">──►</span>

            <div className={`flex-[1.4] p-3 border ${values.deployment ? "bg-white border-[#1925aa]" : "bg-black/5 border-dashed border-black/20"}`}>
              <div className="flex justify-between items-center text-[9px] mb-0.5">
                <span className="text-black/50 uppercase">05 / Serving Container</span>
                {values.deployment && <span className="text-[#1925aa] font-bold">[ SERVING ]</span>}
              </div>
              <span className="font-bold text-black text-xs block">
                {deploymentName}
              </span>
              <span className="text-[10px] text-black/70 block">
                Inference REST Endpoints & Health Probes
              </span>
            </div>

            <span className="text-[#1925aa] font-bold px-1">──►</span>

            <div className={`flex-1 p-3 border ${values.monitoring && values.monitoring !== "none" ? "bg-white border-black/20" : "bg-black/5 border-dashed border-black/20 text-black/50"}`}>
              <span className="text-[9px] text-black/50 block uppercase">06 / Quality & Drift</span>
              <span className="font-bold text-black text-xs block">
                {monitoringName}
              </span>
              <span className="text-[10px] text-black/60 block mt-0.5">
                {values.monitoring === "none" ? "No Drift Telemetry" : "Automated Drift Tests"}
              </span>
            </div>
          </div>

          {/* Bottom Tier: Cloud Anchor */}
          <div className="pt-2 border-t border-black/10 flex items-center justify-between font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1925aa]" />
              <span className="text-black/60">INFRASTRUCTURE TARGET:</span>
              <span className="font-bold text-black">{cloudName}</span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-black/60">
              <span>RUNTIME: PYTHON {values.python_version || "3.11"}</span>
              <span>·</span>
              <span>PKG: {(values.env_manager || "uv").toUpperCase()}</span>
              <span>·</span>
              <span>CI: {(values.ci_provider || "github-actions").toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
