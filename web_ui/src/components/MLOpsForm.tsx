"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import {
  Loader2, Rocket, Settings, X, Cloud, Database, Palette,
  TrendingUp, Sparkles, Zap,
} from "lucide-react"

// ─── Sub-components ───────────────────────────────────────────────────────────
import { formSchema, STACK_PRESETS, type FormValues, type Options, type StackPreset } from "./form/types"
import { StackPresets } from "./form/StackPresets"
import { CoreMLStack, Infrastructure } from "./form/MLStackSections"
import { CloudDeployment, ConfigTemplates, AnalyticsToggle } from "./form/AdvancedSections"
import { ProjectDetails } from "./form/ProjectDetails"
import { GenerationProgress } from "./form/GenerationProgress"
import { ProjectSummary } from "./form/ProjectSummary"
import { SuccessDialog } from "./form/SuccessDialog"
import { CreatorCard } from "./form/CreatorCard"

const REQUIRED_FIELDS = ["framework", "task_type", "experiment_tracking", "orchestration", "deployment", "monitoring"] as const

export default function MLOpsForm() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [options, setOptions] = useState<Options | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  // ─── Form ─────────────────────────────────────────────────────────────────
  const form = useForm<FormValues>({
    defaultValues: {
      framework: "", task_type: "", experiment_tracking: "",
      orchestration: "", deployment: "", monitoring: "",
      cloud_provider: "", cloud_service: "",
      preset_config: "", custom_template: "",
      enable_analytics: true,
      project_name: "",
      author_name: "MLOps Project Generator",
      description: "Generated using MLOps Project Generator - A comprehensive tool for creating production-ready machine learning projects with best practices and modern MLOps workflows.",
    },
  })

  const formValues = form.watch()
  const completedCount = REQUIRED_FIELDS.filter(f => !!formValues[f]).length
  const completionPct = Math.round((completedCount / REQUIRED_FIELDS.length) * 100)
  const hasSummaryData = REQUIRED_FIELDS.some(f => !!formValues[f]) ||
    !!(formValues.cloud_provider || formValues.cloud_service ||
       formValues.preset_config || formValues.custom_template ||
       formValues.project_name || formValues.author_name || formValues.description)

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const sub = form.watch((_, { name }) => {
      if (name === "cloud_provider") form.setValue("cloud_service", "")
    })
    return () => sub.unsubscribe()
  }, [form])

  useEffect(() => {
    axios.get("/api/options")
      .then(r => setOptions(r.data))
      .catch(() => toast.error("Failed to load options."))
  }, [])

  // ─── Preset handlers ──────────────────────────────────────────────────────
  const applyPreset = (preset: StackPreset) => {
    Object.entries(preset.fields).forEach(([key, val]) => form.setValue(key as any, val))
    setActivePreset(preset.id)
    toast.success(`"${preset.label}" stack applied — customize as needed`)
    setTimeout(() => {
      document.getElementById("project-config-card")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 150)
  }

  const clearPreset = () => {
    REQUIRED_FIELDS.forEach(f => form.setValue(f, ""))
    setActivePreset(null)
    toast.success("Preset cleared")
  }

  // ─── Clear all ────────────────────────────────────────────────────────────
  const unselectAll = () => {
    form.reset()
    setActivePreset(null)
    toast.success("All selections cleared")
  }

  // ─── Task polling ─────────────────────────────────────────────────────────
  const checkTaskStatus = async (id: string) => {
    try {
      const { data: task } = await axios.get(`/api/status/${id}`)
      if (task.status === "processing") {
        setProgress(p => (p < 80 ? p + 20 : p + 5))
        setTimeout(() => checkTaskStatus(id), 2000)
      } else if (task.status === "completed") {
        setProgress(100)
        setDownloadUrl(task.download_url)
        setShowSuccessDialog(true)
        toast.success("Project generated successfully!")
        setIsGenerating(false)
      } else if (task.status === "failed") {
        toast.error(`Generation failed: ${task.message}`)
        setIsGenerating(false)
        setProgress(0)
      }
    } catch {
      toast.error("Failed to check task status")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  // ─── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (values: FormValues) => {
    const missingOptions = REQUIRED_FIELDS.filter(f => !values[f]).map(f => ({ field: f }))
    const missingDetails = (["project_name", "author_name", "description"] as const)
      .filter(f => !values[f]?.trim()).map(f => ({ field: f }))
    const allMissing = [...missingOptions, ...missingDetails]

    if (allMissing.length > 0) {
      const names = allMissing.map(({ field }) => field.replace(/_/g, " ")).join(", ")
      setValidationError(`Please fill all required fields.\n\nMissing: ${names}`)
      setTimeout(() => setValidationError(null), 8000)

      setTimeout(() => {
        allMissing.forEach(({ field }) => {
          const el = document.querySelector(`[data-field="${field}"]`)
          if (el) {
            el.classList.add("ring-2", "ring-destructive/50", "ring-offset-2", "bg-destructive/5", "rounded-xl", "p-3", "transition-all", "duration-300")
          }
        })
        document.querySelector(`[data-field="${allMissing[0].field}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => {
          allMissing.forEach(({ field }) => {
            document.querySelector(`[data-field="${field}"]`)
              ?.classList.remove("ring-2", "ring-destructive/50", "ring-offset-2", "bg-destructive/5", "rounded-xl", "p-3", "transition-all", "duration-300")
          })
        }, 5000)
      }, 100)
      return
    }

    setValidationError(null)
    setIsGenerating(true)
    setProgress(5)
    await new Promise(r => setTimeout(r, 500))
    setProgress(15)

    try {
      const { data: task } = await axios.post("/api/generate", values)
      setTaskId(task.task_id)
      setProgress(30)
      toast.success("Project generation started!")
      setTimeout(() => checkTaskStatus(task.task_id), 1000)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to generate project")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  // ─── Download / Reset ─────────────────────────────────────────────────────
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank")
      setShowSuccessDialog(false)
    }
  }

  const resetForm = async () => {
    setShowSuccessDialog(false)
    setDownloadUrl(null)
    setTaskId(null)
    setProgress(0)
    setActivePreset(null)
    form.reset()
    toast.success("Form reset — Ready for a new project!")
    try {
      const r = await axios.get("/api/options")
      setOptions(r.data)
    } catch {
      toast.error("Failed to refresh options.")
    }
    setTimeout(() => {
      (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus()
    }, 100)
  }

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (!options) {
    return (
      <div className="flex items-center justify-center min-h-screen hero-gradient">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl animate-glow-pulse">
            <Rocket className="w-8 h-8 text-white animate-bounce" />
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing MLOps Generator…</p>
        </div>
      </div>
    )
  }

  const presetLabel = STACK_PRESETS.find(p => p.id === activePreset)?.label

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen hero-gradient overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <div className="mesh-blob w-[700px] h-[700px] -top-64 -left-64 text-violet-400/15 dark:text-violet-500/10 animate-mesh" />
        <div className="mesh-blob w-[600px] h-[600px] top-1/3 -right-64 text-cyan-400/15 dark:text-cyan-500/10" style={{ animation: "mesh-move 14s ease-in-out infinite reverse" }} />
        <div className="mesh-blob w-[500px] h-[500px] bottom-0 left-1/4 text-indigo-400/12 dark:text-indigo-500/8" style={{ animation: "mesh-move 16s ease-in-out infinite" }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 right-0"><ThemeToggle /></div>

          <div className="flex justify-center mb-5">
            <div className="relative inline-flex">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-2xl animate-glow-pulse animate-float">
                <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 dark:bg-amber-300 flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 text-amber-900" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
              MLOps Project
            </span>
            <br />
            <span className="text-foreground">Generator</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
            Generate <span className="font-semibold text-foreground">production-ready</span> MLOps project templates with cloud deployment, experiment tracking, and modern ML workflows — in seconds.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { icon: Cloud,      label: "Cloud Deployment",  cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60" },
              { icon: Database,   label: "Config Presets",    cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60" },
              { icon: TrendingUp, label: "Analytics",         cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60" },
              { icon: Palette,    label: "Custom Templates",  cls: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60" },
              { icon: Zap,        label: "Instant Download",  cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60" },
            ].map(({ icon: Icon, label, cls }, i) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${cls} animate-badge-pop`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Stack Presets ─────────────────────────────────────────────── */}
        <StackPresets activePreset={activePreset} onApply={applyPreset} onClear={clearPreset} />

        {/* ── Config progress bar ───────────────────────────────────────── */}
        {completedCount > 0 && completedCount < REQUIRED_FIELDS.length && (
          <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-4 animate-slide-in-up">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-foreground">Configuration Progress</span>
                <span className="text-primary">{completedCount}/{REQUIRED_FIELDS.length} required fields</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all duration-700 ease-out" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
            <span className="text-2xl font-black text-primary tabular-nums w-12 text-right">{completionPct}%</span>
          </div>
        )}

        {/* ── Main Form Card ────────────────────────────────────────────── */}
        <div className="glass-card rounded-3xl overflow-hidden">

          {/* Card header */}
          <div id="project-config-card" className="px-6 sm:px-8 py-5 sm:py-6 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/5 via-transparent to-primary/3 dark:from-primary/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl icon-gradient-violet flex items-center justify-center shadow-md">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground leading-tight">Project Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  {presetLabel
                    ? `Using "${presetLabel}" preset — tweak any field below`
                    : "Choose your ML stack and deployment preferences"}
                </p>
              </div>
            </div>
            <Button
              type="button" variant="outline" size="sm" onClick={unselectAll}
              className="rounded-xl border-border/70 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs font-medium">Clear All</span>
            </Button>
          </div>

          {/* Form body */}
          <div className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                <CoreMLStack options={options} />
                <div className="border-t border-border/50" />

                <Infrastructure options={options} />
                <div className="border-t border-border/50" />

                <CloudDeployment />
                <div className="border-t border-border/50" />

                <ConfigTemplates />
                <div className="border-t border-border/50" />

                <AnalyticsToggle />
                <div className="border-t border-border/50" />

                <ProjectDetails />

                {/* Generation progress */}
                {isGenerating && <GenerationProgress progress={progress} />}

                {/* Summary */}
                {hasSummaryData && !isGenerating && <ProjectSummary values={formValues as FormValues} />}

                {/* Validation error */}
                {validationError && (
                  <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 animate-slide-in-up">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-destructive mb-1">Missing Required Fields</h4>
                        <p className="text-sm text-destructive/80 whitespace-pre-line leading-relaxed">{validationError}</p>
                      </div>
                      <button onClick={() => setValidationError(null)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-destructive/60 hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Generate button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-base font-bold rounded-2xl gradient-primary btn-shine shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-0 text-white"
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Generating Your Project…</>
                  ) : (
                    <><Rocket className="h-5 w-5 mr-2" />Generate Project<Sparkles className="h-4 w-4 ml-2 opacity-80" /></>
                  )}
                </Button>

              </form>
            </Form>
          </div>
        </div>

        {/* ── Creator + footer ──────────────────────────────────────────── */}
        <CreatorCard />

      </div>

      {/* ── Success Dialog ────────────────────────────────────────────── */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={(open) => { if (!open) { form.reset(); setShowSuccessDialog(false) } else setShowSuccessDialog(true) }}
        onDownload={handleDownload}
        onReset={resetForm}
      />
    </div>
  )
}
