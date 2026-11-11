"use client"

import { useRef } from "react"
import { RotateCcw, Upload } from "lucide-react"
import { toast } from "sonner"

interface FormCardHeaderProps {
  presetLabel?: string
  onClearAll: () => void
}

export function FormCardHeader({ presetLabel, onClearAll }: FormCardHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      try {
        const text = event.target?.result as string
        const parsed = JSON.parse(text)
        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("Invalid config JSON format")
        }
        window.dispatchEvent(new CustomEvent("loadMLOpsConfig", { detail: parsed }))
        toast.success("Stack specification imported successfully.")
      } catch (err) {
        toast.error("Failed to parse config file. Please ensure valid JSON.")
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    reader.readAsText(file)
  }

  return (
    <div
      id="project-config-card"
      className="pb-6 mb-8 border-b border-black/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold mb-1">
          [ STEP 02 // CONFIGURATION MATRIX ]
        </p>
        <h2 className="font-display text-2xl sm:text-4xl text-[#000000] uppercase tracking-tight">
          Stack Architecture & Metadata
        </h2>
        <p className="font-mono text-xs text-black/60 mt-1">
          {presetLabel
            ? `Preset "${presetLabel}" active. Adjust specific fields to tune requirements.`
            : "Specify ML framework, experiment logger, orchestrator, deployment format, and project descriptors."}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          id="config-file-import"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-monograph-outline text-[10px] py-2 px-3"
          title="Import configuration JSON"
        >
          <Upload className="h-3 w-3" />
          <span>Import Config JSON</span>
        </button>

        <button
          type="button"
          onClick={onClearAll}
          className="btn-monograph-outline text-[10px] py-2 px-3"
          title="Reset all form fields"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Form</span>
        </button>
      </div>
    </div>
  )
}
