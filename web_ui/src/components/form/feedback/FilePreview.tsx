"use client"

import { useState, useMemo } from "react"
import {
  Eye,
  FileCode,
  Loader2,
  Search,
  Copy,
  Check,
  Download,
  FileText,
  Terminal,
  Settings,
  Code2,
  X,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import type { FormValues } from "../schema"
import { getMissingFields } from "../lib/validation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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

interface FileContentResponse {
  path: string
  content: string
  size: number
  lines: number
  language: string
}

type FileCategory = "all" | "code" | "config" | "devops" | "docs"

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

function getFileCategory(path: string): FileCategory {
  const lower = path.toLowerCase()
  if (lower.endsWith(".py") || lower.endsWith(".ipynb")) return "code"
  if (
    lower.endsWith(".json") ||
    lower.endsWith(".toml") ||
    lower.endsWith(".yaml") ||
    lower.endsWith(".yml") ||
    lower.endsWith(".ini") ||
    lower.endsWith(".cfg") ||
    lower.endsWith(".env") ||
    lower.includes("config")
  ) {
    if (lower.includes(".github") || lower.includes("docker") || lower.includes("compose")) {
      return "devops"
    }
    return "config"
  }
  if (
    lower.includes("docker") ||
    lower.includes(".github") ||
    lower.endsWith(".sh") ||
    lower.endsWith(".bash") ||
    lower.includes("workflow")
  ) {
    return "devops"
  }
  if (lower.endsWith(".md") || lower.endsWith(".txt") || lower.endsWith(".rst") || lower.includes("license")) {
    return "docs"
  }
  return "code"
}

function getCategoryBadge(cat: FileCategory) {
  switch (cat) {
    case "code":
      return <span className="font-mono text-[9px] px-1 bg-black text-white">PY</span>
    case "config":
      return <span className="font-mono text-[9px] px-1 bg-black/15 text-black">CFG</span>
    case "devops":
      return <span className="font-mono text-[9px] px-1 bg-[#1925aa] text-white">OPS</span>
    case "docs":
      return <span className="font-mono text-[9px] px-1 bg-black/10 text-black">DOC</span>
    default:
      return <span className="font-mono text-[9px] px-1 bg-black/10 text-black">FILE</span>
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function FilePreview({ values }: FilePreviewProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>("all")

  // Code inspection modal state
  const [inspectingFile, setInspectingFile] = useState<string | null>(null)
  const [fileContentLoading, setFileContentLoading] = useState(false)
  const [fileContent, setFileContent] = useState<FileContentResponse | null>(null)
  const [copied, setCopied] = useState(false)

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
        ? (err.response?.data as { detail?: string })?.detail ?? "Preview synthesis failed"
        : "Preview synthesis failed"
      setError(msg)
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  const handleInspectFile = async (filePath: string) => {
    setInspectingFile(filePath)
    setFileContentLoading(true)
    setFileContent(null)
    setCopied(false)

    try {
      const { data } = await axios.post<FileContentResponse>("/api/preview/file", {
        path: filePath,
        ...values,
      })
      setFileContent(data)
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { detail?: string })?.detail ?? "Failed to load file contents"
        : "Failed to load file contents"
      toast.error(msg)
      setInspectingFile(null)
    } finally {
      setFileContentLoading(false)
    }
  }

  const handleCopyCode = () => {
    if (!fileContent?.content) return
    navigator.clipboard.writeText(fileContent.content)
    setCopied(true)
    toast.success(`Copied ${fileContent.path} to clipboard.`)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadSingleFile = () => {
    if (!fileContent) return
    const blob = new Blob([fileContent.content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileContent.path.split("/").pop() || "file.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`Saved ${link.download}`)
  }

  const filteredFiles = useMemo(() => {
    if (!preview) return []
    return preview.files.filter((path) => {
      const matchesSearch = path.toLowerCase().includes(searchQuery.toLowerCase().trim())
      if (!matchesSearch) return false
      if (selectedCategory === "all") return true
      return getFileCategory(path) === selectedCategory
    })
  }, [preview, searchQuery, selectedCategory])

  const stats = useMemo(() => {
    if (!preview) return null
    let code = 0,
      config = 0,
      devops = 0,
      docs = 0
    preview.files.forEach((f) => {
      const cat = getFileCategory(f)
      if (cat === "code") code++
      else if (cat === "config") config++
      else if (cat === "devops") devops++
      else if (cat === "docs") docs++
    })
    return { code, config, devops, docs, total: preview.files.length }
  }, [preview])

  return (
    <div className="bg-white border border-black/20 p-5 sm:p-6 animate-monograph-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/15">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
            [ ARCHIVE FILE TREE & CODE INSPECTION ]
          </p>
          <h3 className="font-editorial text-lg text-[#000000] uppercase font-semibold">
            Generated Repository File Matrix
          </h3>
          <p className="font-mono text-xs text-black/60 mt-0.5">
            {isComplete
              ? "Synthesizes entire file list. Click any file to view compiled code syntax."
              : "Generates preview with architectural defaults for unfilled fields."}
          </p>
        </div>

        <button
          type="button"
          onClick={loadPreview}
          disabled={loading}
          className="btn-monograph self-start sm:self-auto text-[10px] py-2 px-4"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          <span>{loading ? "Synthesizing…" : preview ? "Refresh Matrix" : "Synthesize Preview"}</span>
        </button>
      </div>

      {error && <p className="mt-3 font-mono text-xs text-red-600">{error}</p>}

      {preview && (
        <div className="mt-5 space-y-4">
          {/* Metadata Bar & Counts */}
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-black/70 border-b border-black/10 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-black">{preview.file_count} Files</span>
              <span>in</span>
              <span className="font-bold text-[#1925aa]">{preview.project_name}/</span>
              {preview.partial && (
                <span className="border border-[#1925aa] text-[#1925aa] px-1.5 py-0.2 text-[9px] uppercase">
                  Partial Draft
                </span>
              )}
            </div>

            {stats && (
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-black font-semibold">{stats.code} Code</span>
                <span>·</span>
                <span className="text-[#1925aa] font-semibold">{stats.devops} CI/CD & Docker</span>
                <span>·</span>
                <span className="text-black/70">{stats.config} Configs</span>
                <span>·</span>
                <span className="text-black/70">{stats.docs} Docs</span>
              </div>
            )}
          </div>

          {/* Search Bar & Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="text"
                placeholder="Search file path (e.g. train.py, Dockerfile, airflow_dag.py)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-black/20 text-black font-mono placeholder:text-black/40 outline-none focus:border-[#1925aa]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: "all", label: "ALL" },
                  { id: "code", label: "CODE" },
                  { id: "devops", label: "DEVOPS" },
                  { id: "config", label: "CONFIGS" },
                  { id: "docs", label: "DOCS" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 font-mono text-[10px] tracking-wider transition-colors cursor-pointer border ${
                    selectedCategory === tab.id
                      ? "bg-[#1925aa] text-white border-[#1925aa] font-bold"
                      : "bg-white hover:bg-black/5 text-black border-black/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Rows List */}
          <div className="border border-black/15 bg-white">
            <div className="flex items-center justify-between font-mono text-[10px] text-black/50 px-3 py-2 border-b border-black/10 bg-[#e8e6e0]/30">
              <span>Matching Paths ({filteredFiles.length}):</span>
              <span className="text-[#1925aa] font-medium">Click any row to view code</span>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-black/50">
                No matching paths for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto divide-y divide-black/10">
                {filteredFiles.map((filePath) => (
                  <button
                    key={filePath}
                    type="button"
                    onClick={() => handleInspectFile(filePath)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#1925aa]/5 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getCategoryBadge(getFileCategory(filePath))}
                      <span className="font-mono text-xs text-black group-hover:text-[#1925aa] transition-colors truncate">
                        {filePath}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#1925aa] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Inspect Code →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Inspector Dialog (Monograph Broadsheet Window) */}
      <Dialog open={!!inspectingFile} onOpenChange={(open) => !open && setInspectingFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border border-black/30 rounded-none shadow-none">
          <DialogHeader className="px-5 py-4 border-b border-black/15 bg-[#e8e6e0]/40">
            <div className="flex items-center justify-between gap-4 pr-8">
              <div className="min-w-0">
                <DialogTitle className="font-mono text-sm sm:text-base font-bold text-black truncate">
                  {inspectingFile}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-black/60 flex items-center gap-2 mt-1">
                  {fileContent && (
                    <>
                      <span className="font-bold text-[#1925aa] uppercase">
                        {fileContent.language}
                      </span>
                      <span>·</span>
                      <span>{fileContent.lines} Lines</span>
                      <span>·</span>
                      <span>{formatBytes(fileContent.size)}</span>
                    </>
                  )}
                </DialogDescription>
              </div>

              {fileContent && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="btn-monograph-outline text-[10px] py-1.5 px-3"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#1925aa]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSingleFile}
                    className="btn-monograph text-[10px] py-1.5 px-3"
                    title="Download this single file"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white font-mono text-xs">
            {fileContentLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-black/50">
                <Loader2 className="w-6 h-6 animate-spin text-[#1925aa]" />
                <p className="font-mono text-xs">Compiling file buffer…</p>
              </div>
            ) : fileContent ? (
              <pre className="p-4 bg-[#e8e6e0]/30 border border-black/15 overflow-x-auto text-xs leading-relaxed text-black">
                <code>{fileContent.content}</code>
              </pre>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
