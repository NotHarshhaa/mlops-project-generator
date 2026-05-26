"use client"

import { useState } from "react"
import { Eye, FileCode, Loader2 } from "lucide-react"
import axios from "axios"
import type { FormValues } from "../schema"
import { getMissingFields } from "../lib/validation"

interface FilePreviewProps {
  values: FormValues
}

interface PreviewResponse {
  file_count: number
  files: string[]
  project_name: string
  partial?: boolean
  legacy_templates?: boolean
}

function toPreviewParams(values: FormValues): Record<string, string> {
  const params: Record<string, string> = {}
  for (const [key, val] of Object.entries(values)) {
    if (val === undefined || val === null) continue
    if (typeof val === "boolean") {
      params[key] = val ? "true" : "false"
      continue
    }
    const s = String(val).trim()
    if (s) params[key] = s
  }
  return params
}

export function FilePreview({ values }: FilePreviewProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const missing = getMissingFields(values)
  const isComplete = missing.length === 0

  const loadPreview = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = isComplete
        ? await axios.post<PreviewResponse>("/api/preview?strict=true", values)
        : await axios.get<PreviewResponse>("/api/preview", { params: toPreviewParams(values) })
      setPreview(data)
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { detail?: string })?.detail ?? "Preview failed"
        : "Preview failed"
      setError(msg)
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg sm:rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-5 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
          <div className="icon-chip icon-chip-violet flex-shrink-0">
            <FileCode className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-mono-label text-muted-foreground">Preview</p>
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
              Archive file tree
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isComplete
                ? "Full preview of your configured archive"
                : "Quick preview with defaults for empty fields (GET)"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadPreview}
          disabled={loading}
          className="btn-ghost-panel inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-foreground disabled:opacity-50 self-start sm:self-center"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {loading ? "Loading…" : "Preview files"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-xs text-destructive">{error}</p>
      )}

      {preview && (
        <div className="mt-3 sm:mt-4">
          <p className="text-xs text-muted-foreground mb-2">
            <span className="font-semibold text-foreground">{preview.file_count}</span> files in{" "}
            <span className="font-mono">{preview.project_name}/</span>
            {preview.partial && (
              <span className="ml-2 text-primary">· partial preview</span>
            )}
            {preview.legacy_templates && (
              <span className="ml-2 text-accent">· legacy Jinja templates</span>
            )}
          </p>
          <ul className="max-h-40 sm:max-h-52 overflow-y-auto rounded-lg border border-border/60 bg-background/50 p-2 sm:p-3 font-mono text-[10px] sm:text-xs text-muted-foreground space-y-0.5 columns-1 sm:columns-2 gap-x-4">
            {preview.files.map(path => (
              <li key={path} className="break-all leading-relaxed">{path}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
