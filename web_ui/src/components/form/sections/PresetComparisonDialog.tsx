"use client"

import { Check, X } from "lucide-react"
import { STACK_PRESETS, type StackPreset } from "../presets"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface PresetComparisonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (preset: StackPreset) => void
  activePreset: string | null
}

export function PresetComparisonDialog({
  open,
  onOpenChange,
  onApply,
  activePreset,
}: PresetComparisonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border border-black/30 rounded-none shadow-none">
        <DialogHeader className="px-6 py-4 border-b border-black/15 bg-[#e8e6e0]/40">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
            [ COMPARATIVE ANALYSIS // ARCHITECTURAL BLUEPRINTS ]
          </p>
          <DialogTitle className="font-display text-xl sm:text-2xl text-black uppercase mt-0.5">
            Stack Presets Comparison Matrix
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-black/60 mt-1">
            Compare all 8 curated MLOps topology profiles and apply with one click.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4 sm:p-6 font-mono text-xs">
          <table className="w-full text-left border-collapse border border-black/20">
            <thead>
              <tr className="bg-[#e8e6e0]/60 border-b border-black/20 text-[10px] text-black/70 uppercase">
                <th className="p-3 border-r border-black/15">Blueprint Profile</th>
                <th className="p-3 border-r border-black/15">Framework</th>
                <th className="p-3 border-r border-black/15">Task</th>
                <th className="p-3 border-r border-black/15">Tracking</th>
                <th className="p-3 border-r border-black/15">DAG Orchestration</th>
                <th className="p-3 border-r border-black/15">Serving Target</th>
                <th className="p-3 border-r border-black/15">Drift Telemetry</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {STACK_PRESETS.map((preset) => {
                const isActive = activePreset === preset.id
                return (
                  <tr
                    key={preset.id}
                    className={`transition-colors ${
                      isActive ? "bg-[#1925aa]/8 font-bold" : "hover:bg-black/5"
                    }`}
                  >
                    <td className="p-3 border-r border-black/15">
                      <span className="font-bold text-black block">{preset.label}</span>
                      <span className="text-[10px] text-black/55 font-normal line-clamp-1">
                        {preset.tagline}
                      </span>
                    </td>
                    <td className="p-3 border-r border-black/15 uppercase">
                      {preset.fields.framework}
                    </td>
                    <td className="p-3 border-r border-black/15 uppercase">
                      {preset.fields.task_type}
                    </td>
                    <td className="p-3 border-r border-black/15 uppercase">
                      {preset.fields.experiment_tracking}
                    </td>
                    <td className="p-3 border-r border-black/15 uppercase">
                      {preset.fields.orchestration}
                    </td>
                    <td className="p-3 border-r border-black/15 uppercase">
                      {preset.fields.deployment}
                    </td>
                    <td className="p-3 border-r border-black/15 uppercase">
                      {preset.fields.monitoring}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onApply(preset)
                          onOpenChange(false)
                        }}
                        className={`px-3 py-1 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[#1925aa] text-white border-[#1925aa]"
                            : "bg-white hover:bg-[#1925aa] hover:text-white border-black/25 text-black"
                        }`}
                      >
                        {isActive ? "Active" : "Apply"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
