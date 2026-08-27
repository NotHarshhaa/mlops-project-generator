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
  Boxes,
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

function getFileIcon(path: string) {
  const cat = getFileCategory(path)
  switch (cat) {
    case "code":
      return <Code2 className="w-3.5 h-3.5 text-blue-400" />
    case "config":
      return <Settings className="w-3.5 h-3.5 text-amber-400" />
    case "devops":
      return <Terminal className="w-3.5 h-3.5 text-emerald-400" />
    case "docs":
      return <FileText className="w-3.5 h-3.5 text-purple-400" />
    default:
      return <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
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
        ? (err.response?.data as { detail?: string })?.detail ?? "Preview failed"
        : "Preview failed"
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
        ? (err.response?.data as { detail?: string })?.detail ?? "Failed to load file content"
        : "Failed to load file content"
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
    toast.success(`Copied ${fileContent.path} to clipboard!`)
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
    toast.success(`Downloaded ${link.download}`)
  }

  const filteredFiles = useMemo(() => {
    if (!preview) return []
    return preview.files.filter(path => {
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
    preview.files.forEach(f => {
      const cat = getFileCategory(f)
      if (cat === "code") code++
      else if (cat === "config") config++
      else if (cat === "devops") devops++
      else if (cat === "docs") docs++
    })
    return { code, config, devops, docs, total: preview.files.length }
  }, [preview])

  return (
    <div className="rounded-lg sm:rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-5 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
          <div className="icon-chip icon-chip-violet flex-shrink-0">
            <FileCode className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-mono-label text-muted-foreground">Preview & Code Explorer</p>
              {stats && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                  {stats.total} files
                </span>
              )}
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
              Archive file tree & Code Inspector
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isComplete
                ? "Full interactive preview with code inspector and file search"
                : "Quick preview with defaults for empty fields (GET)"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadPreview}
          disabled={loading}
          className="btn-ghost-panel inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-foreground disabled:opacity-50 self-start sm:self-center cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {loading ? "Loading…" : preview ? "Refresh Preview" : "Preview Files"}
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

      {preview && (
        <div className="mt-4 sm:mt-5 space-y-3">
          {/* Metadata Bar & Category Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span>
                <span className="font-semibold text-foreground">{preview.file_count}</span> files in{" "}
                <span className="font-mono text-primary font-medium">{preview.project_name}/</span>
              </span>
              {preview.partial && (
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
                  partial
                </span>
              )}
              {preview.legacy_templates && (
                <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-medium border border-accent/20">
                  jinja templates
                </span>
              )}
            </div>

            {stats && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-blue-400 font-medium">{stats.code} py</span>·
                <span className="text-emerald-400 font-medium">{stats.devops} devops</span>·
                <span className="text-amber-400 font-medium">{stats.config} config</span>·
                <span className="text-purple-400 font-medium">{stats.docs} docs</span>
              </div>
            )}
          </div>

          {/* Search Bar & Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search file name or path (e.g. train.py, docker, pipeline)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-background/80 border border-border/70 rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 font-mono transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "code", label: "Code" },
                  { id: "devops", label: "CI/CD & Docker" },
                  { id: "config", label: "Configs" },
                  { id: "docs", label: "Docs" },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === tab.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive File Tree Grid */}
          <div className="rounded-lg border border-border/60 bg-background/60 p-2 sm:p-3">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5 px-1 font-mono">
              <span>Matching files ({filteredFiles.length}):</span>
              <span className="text-[10px] text-primary">💡 Click any file to inspect code</span>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No files match &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-1 pr-1">
                {filteredFiles.map(filePath => (
                  <button
                    key={filePath}
                    type="button"
                    onClick={() => handleInspectFile(filePath)}
                    className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(filePath)}
                      <span className="font-mono text-xs text-foreground/90 group-hover:text-primary transition-colors truncate">
                        {filePath}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Eye className="w-3 h-3" /> View Code
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Inspector Dialog */}
      <Dialog open={!!inspectingFile} onOpenChange={open => !open && setInspectingFile(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-card border-border shadow-2xl">
          <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/80 bg-muted/20">
            <div className="flex items-center justify-between gap-3 pr-6">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="icon-chip icon-chip-violet flex-shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="font-mono text-sm sm:text-base font-bold text-foreground truncate">
                    {inspectingFile}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    {fileContent && (
                      <>
                        <span className="font-semibold text-foreground uppercase text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                          {fileContent.language}
                        </span>
                        <span>{fileContent.lines} lines</span>
                        <span>·</span>
                        <span>{formatBytes(fileContent.size)}</span>
                      </>
                    )}
                  </DialogDescription>
                </div>
              </div>

              {fileContent && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSingleFile}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors cursor-pointer"
                    title="Download file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-background font-mono text-xs sm:text-sm">
            {fileContentLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="w-7 h-7 animate-spin text-primary" />
                <p className="text-xs font-mono">Generating syntax-highlighted code...</p>
              </div>
            ) : fileContent ? (
              <div className="relative rounded-lg border border-border/60 bg-muted/15 overflow-hidden">
                <pre className="p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-foreground/95">
                  <code>{fileContent.content}</code>
                </pre>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

