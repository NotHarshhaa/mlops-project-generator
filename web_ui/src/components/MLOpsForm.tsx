"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"

// Use internal API routes
const API_URL = ""
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import {
  Loader2, Download, Rocket, Settings, Info, User, FileText,
  CheckCircle, X, Brain, BarChart, Microscope, GitBranch, Shield,
  Cloud, Database, Palette, TrendingUp, Linkedin, Github, Mail,
  Sparkles, Zap, Star, ChevronDown, Check
} from "lucide-react"

const formSchema = z.object({
  framework: z.string().optional(),
  task_type: z.string().optional(),
  experiment_tracking: z.string().optional(),
  orchestration: z.string().optional(),
  deployment: z.string().optional(),
  monitoring: z.string().optional(),
  cloud_provider: z.string().optional(),
  cloud_service: z.string().optional(),
  preset_config: z.string().optional(),
  custom_template: z.string().optional(),
  enable_analytics: z.boolean().optional(),
  project_name: z.string().min(1, "Project name is required").max(50, "Project name must be 50 characters or less"),
  author_name: z.string().min(1, "Author name is required").max(100, "Author name must be 100 characters or less"),
  description: z.string().min(1, "Description is required")
}).refine((data) => {
  const requiredFields = ['framework', 'task_type', 'experiment_tracking', 'orchestration', 'deployment', 'monitoring'] as const
  const missingFields = requiredFields.filter(field => !data[field])
  return missingFields.length === 0
}, {
  message: "Please select an option for all categories before generating your project",
  path: ["framework"]
})

type FormValues = z.infer<typeof formSchema>

interface Option {
  value: string
  label: string
  description: string
}

interface Options {
  framework: Option[]
  task_type: Option[]
  experiment_tracking: Option[]
  orchestration: Option[]
  deployment: Option[]
  monitoring: Option[]
  cloud_provider: Option[]
  cloud_service: Option[]
  preset_config: Option[]
  custom_template: Option[]
}

// ─── Progress Step Badge ───────────────────────────────────────
const ProgressStep = ({ label, colorClass, active }: { label: string; colorClass: string; active: boolean }) => (
  <div className={`text-center p-2.5 rounded-xl border transition-all duration-500 ${
    active
      ? `${colorClass} shadow-sm scale-105`
      : 'bg-white/50 dark:bg-white/5 border-border'
  }`}>
    <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${
      active ? 'animate-pulse' : 'bg-muted-foreground/30'
    }`} />
    <p className={`text-xs font-semibold ${active ? '' : 'text-muted-foreground'}`}>{label}</p>
  </div>
)

// ─── Section Header ────────────────────────────────────────────
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconClass = "icon-gradient-violet"
}: {
  icon: any; title: string; subtitle: string; iconClass?: string
}) => (
  <div className="flex items-center space-x-3 mb-6">
    <div className={`w-10 h-10 rounded-2xl ${iconClass} flex items-center justify-center flex-shrink-0 shadow-lg`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
)

// ─── Stat Badge ────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, iconClass }: { icon: any; label: string; value: string; iconClass: string }) => (
  <div className="glass-card rounded-2xl p-4 group hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center space-x-2 mb-2">
      <div className={`w-7 h-7 rounded-xl ${iconClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</h4>
    </div>
    <p className="text-sm font-semibold text-foreground capitalize truncate">{value}</p>
  </div>
)

export default function MLOpsForm() {
  const [options, setOptions] = useState<Options | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    defaultValues: {
      framework: "",
      task_type: "",
      experiment_tracking: "",
      orchestration: "",
      deployment: "",
      monitoring: "",
      cloud_provider: "",
      cloud_service: "",
      preset_config: "",
      custom_template: "",
      enable_analytics: true,
      project_name: "",
      author_name: "MLOps Project Generator",
      description: "Generated using MLOps Project Generator - A comprehensive tool for creating production-ready machine learning projects with best practices and modern MLOps workflows."
    }
  })

  const formValues = form.watch()

  // ─── Custom Select Field ───────────────────────────────────
  const CustomSelectField = ({ name, label, description, options, placeholder }: {
    name: any
    label: string
    description: string
    options: Array<{ value: string; label: string; description?: string }>
    placeholder: string
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const fieldValue = form.watch(name)

    const handleSelect = (value: string) => {
      form.setValue(name, value)
      setIsOpen(false)
    }

    const selectedOption = options.find(opt => opt.value === fieldValue)

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem data-field={name}>
            <FormLabel className="text-sm font-semibold text-foreground">{label}</FormLabel>
            <div className="relative">
              <FormControl>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-full h-12 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between border ${
                    fieldValue
                      ? 'bg-card dark:bg-card border-primary/50 dark:border-primary/40 shadow-sm shadow-primary/10'
                      : 'bg-card dark:bg-card border-border hover:border-primary/40'
                  }`}
                >
                  <span className={`text-sm font-medium ${!fieldValue ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                  <div className="flex items-center gap-2">
                    {fieldValue && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 dark:bg-primary/20">
                        <Check className="w-3 h-3 text-primary" />
                      </span>
                    )}
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </FormControl>

              {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl overflow-hidden animate-slide-in-up border border-border shadow-xl shadow-black/20 dark:shadow-black/50" style={{ background: 'var(--popover)' }}>
                  <div className="max-h-60 overflow-y-auto" style={{ background: 'var(--popover)' }}>
                    {options.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-border/50 last:border-b-0 ${
                          fieldValue === option.value
                            ? 'bg-primary/10 dark:bg-primary/20'
                            : 'hover:bg-muted dark:hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${fieldValue === option.value ? 'text-primary' : 'text-foreground'}`}>
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-xs mt-0.5 text-muted-foreground">
                                {option.description}
                              </span>
                            )}
                          </div>
                          {fieldValue === option.value && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <FormDescription className="text-xs text-muted-foreground">{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  // ─── Effects ───────────────────────────────────────────────
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'cloud_provider') {
        form.setValue('cloud_service', '')
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/options`)
        setOptions(response.data)
      } catch (error) {
        toast.error("Failed to load options. Please ensure the backend is running.")
      }
    }
    fetchOptions()
  }, [])

  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/status/${taskId}`)
      const task = response.data

      if (task.status === "processing") {
        setProgress(prev => {
          if (prev < 40) return 40
          if (prev < 60) return 60
          if (prev < 80) return 80
          return prev + 5
        })
        setTimeout(() => checkTaskStatus(taskId), 2000)
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
    } catch (error) {
      toast.error("Failed to check task status")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const missingOptions = []
      if (!values.framework) missingOptions.push({ field: 'framework', name: 'ML Framework', icon: '🤖' })
      if (!values.task_type) missingOptions.push({ field: 'task_type', name: 'Task Type', icon: '🎯' })
      if (!values.experiment_tracking) missingOptions.push({ field: 'experiment_tracking', name: 'Experiment Tracking', icon: '📊' })
      if (!values.orchestration) missingOptions.push({ field: 'orchestration', name: 'Orchestration', icon: '⚙️' })
      if (!values.deployment) missingOptions.push({ field: 'deployment', name: 'Deployment', icon: '🚀' })
      if (!values.monitoring) missingOptions.push({ field: 'monitoring', name: 'Monitoring', icon: '📈' })

      const missingDetails = []
      if (!values.project_name?.trim()) missingDetails.push({ field: 'project_name', name: 'Project Name', icon: '📝' })
      if (!values.author_name?.trim()) missingDetails.push({ field: 'author_name', name: 'Author Name', icon: '👤' })
      if (!values.description?.trim()) missingDetails.push({ field: 'description', name: 'Project Description', icon: '📄' })

      const allMissing = [...missingOptions, ...missingDetails]

      if (allMissing.length > 0) {
        const missingFieldNames = allMissing.map(field => field.name).join(', ')
        setValidationError(`Please select all required options before generating!\n\nMissing: ${missingFieldNames}`)
        setTimeout(() => setValidationError(null), 8000)

        setTimeout(() => {
          allMissing.forEach(missingField => {
            const element = document.querySelector(`[data-field="${missingField.field}"]`)
            if (element) {
              element.classList.add(
                'ring-2', 'ring-destructive/50', 'ring-offset-2',
                'bg-destructive/5', 'rounded-xl', 'p-3',
                'transition-all', 'duration-300'
              )
            }
          })

          const firstElement = document.querySelector(`[data-field="${allMissing[0].field}"]`)
          if (firstElement) firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

          setTimeout(() => {
            allMissing.forEach(missingField => {
              const element = document.querySelector(`[data-field="${missingField.field}"]`)
              if (element) {
                element.classList.remove(
                  'ring-2', 'ring-destructive/50', 'ring-offset-2',
                  'bg-destructive/5', 'rounded-xl', 'p-3',
                  'transition-all', 'duration-300'
                )
              }
            })
          }, 5000)
        }, 100)
        return
      }

      setValidationError(null)
      setIsGenerating(true)
      setProgress(5)

      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(15)

      const response = await axios.post(`${API_URL}/api/generate`, values)
      const task = response.data

      setTaskId(task.task_id)
      setProgress(30)
      toast.success("Project generation started!")

      setTimeout(() => checkTaskStatus(task.task_id), 1000)

    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to generate project")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleDownload = () => {
    if (downloadUrl && taskId) {
      window.open(downloadUrl, "_blank")
      setShowSuccessDialog(false)
    }
  }

  const resetForm = async () => {
    setShowSuccessDialog(false)
    setDownloadUrl(null)
    setTaskId(null)
    setProgress(0)
    form.reset()
    toast.success("Form reset — Ready for a new project!")

    try {
      const response = await axios.get("/api/options")
      setOptions(response.data)
    } catch (error) {
      toast.error("Failed to refresh options.")
    }

    setTimeout(() => {
      const firstInput = document.querySelector('input[type="text"]') as HTMLInputElement
      if (firstInput) firstInput.focus()
    }, 100)
  }

  const unselectAll = () => {
    form.setValue("framework", "")
    form.setValue("task_type", "")
    form.setValue("experiment_tracking", "")
    form.setValue("orchestration", "")
    form.setValue("deployment", "")
    form.setValue("monitoring", "")
    form.setValue("cloud_provider", "")
    form.setValue("cloud_service", "")
    form.setValue("preset_config", "")
    form.setValue("custom_template", "")
    form.setValue("enable_analytics", true)
    toast.success("All selections cleared")
  }

  // ─── Loading state ────────────────────────────────────────
  if (!options) {
    return (
      <div className="flex items-center justify-center min-h-screen hero-gradient">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl animate-glow-pulse">
              <Rocket className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing MLOps Generator…</p>
        </div>
      </div>
    )
  }

  // ─── Completion of required fields ────────────────────────
  const requiredFields = ['framework', 'task_type', 'experiment_tracking', 'orchestration', 'deployment', 'monitoring'] as const
  const completedCount = requiredFields.filter(f => !!formValues[f]).length
  const completionPct = Math.round((completedCount / requiredFields.length) * 100)

  const hasSummaryData = requiredFields.some(f => !!formValues[f]) ||
    formValues.cloud_provider || formValues.cloud_service ||
    formValues.preset_config || formValues.custom_template ||
    formValues.project_name || formValues.author_name || formValues.description

  return (
    <div className="min-h-screen hero-gradient overflow-x-hidden">
      {/* ── Ambient mesh blobs ─────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="mesh-blob w-[600px] h-[600px] -top-48 -left-48 bg-violet-400/10 dark:bg-violet-500/8 animate-mesh" />
        <div className="mesh-blob w-[500px] h-[500px] top-1/3 -right-48 bg-cyan-400/10 dark:bg-cyan-500/8" style={{ animationDelay: '-4s', animation: 'mesh-move 14s ease-in-out infinite reverse' }} />
        <div className="mesh-blob w-[400px] h-[400px] -bottom-32 left-1/3 bg-indigo-400/10 dark:bg-indigo-500/8" style={{ animationDelay: '-8s', animation: 'mesh-move 16s ease-in-out infinite' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Hero Header ────────────────────────────────────── */}
        <div className="text-center mb-10 relative">
          {/* Theme toggle */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>

          {/* Logo mark */}
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

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { icon: Cloud, label: "Cloud Deployment", cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60" },
              { icon: Database, label: "Config Presets", cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60" },
              { icon: TrendingUp, label: "Analytics", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60" },
              { icon: Palette, label: "Custom Templates", cls: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60" },
              { icon: Zap, label: "Instant Download", cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60" },
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

        {/* ── Completion Progress Bar ────────────────────────── */}
        {completedCount > 0 && completedCount < requiredFields.length && (
          <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-4 animate-slide-in-up">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-foreground">Configuration Progress</span>
                <span className="text-primary">{completedCount}/{requiredFields.length} required fields</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
            <span className="text-2xl font-black text-primary tabular-nums w-12 text-right">{completionPct}%</span>
          </div>
        )}

        {/* ── Main Form Card ─────────────────────────────────── */}
        <div className="glass-card rounded-3xl overflow-hidden">

          {/* Card header */}
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/5 via-transparent to-primary/3 dark:from-primary/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl icon-gradient-violet flex items-center justify-center shadow-md">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground leading-tight">Project Configuration</h2>
                <p className="text-sm text-muted-foreground">Choose your ML stack and deployment preferences</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={unselectAll}
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

                {/* ── Core ML Stack ─────────────────────────── */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={Brain}
                    title="Core ML Stack"
                    subtitle="Configure your fundamental machine learning components"
                    iconClass="icon-gradient-violet"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelectField
                      name="framework"
                      label="ML Framework"
                      description="Your preferred machine learning framework"
                      options={options.framework || []}
                      placeholder="Select framework…"
                    />
                    <CustomSelectField
                      name="task_type"
                      label="Task Type"
                      description="The type of machine learning task"
                      options={options.task_type || []}
                      placeholder="Select task type…"
                    />
                  </div>
                  <CustomSelectField
                    name="experiment_tracking"
                    label="Experiment Tracking"
                    description="How you'll track and compare ML experiments"
                    options={options.experiment_tracking || []}
                    placeholder="Select experiment tracker…"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* ── Infrastructure ─────────────────────────── */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={GitBranch}
                    title="Infrastructure & Deployment"
                    subtitle="Orchestration, deployment, and monitoring setup"
                    iconClass="icon-gradient-cyan"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelectField
                      name="orchestration"
                      label="Orchestration"
                      description="Workflow orchestration for ML pipelines"
                      options={options.orchestration || []}
                      placeholder="Select orchestration…"
                    />
                    <CustomSelectField
                      name="deployment"
                      label="Deployment"
                      description="How to deploy your ML model"
                      options={options.deployment || []}
                      placeholder="Select deployment…"
                    />
                  </div>
                  <CustomSelectField
                    name="monitoring"
                    label="Monitoring"
                    description="Monitoring solution for your ML models in production"
                    options={options.monitoring || []}
                    placeholder="Select monitoring…"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* ── Cloud Deployment ───────────────────────── */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={Cloud}
                    title="Cloud Deployment"
                    subtitle="Optional — generate cloud-specific deployment templates"
                    iconClass="icon-gradient-emerald"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelectField
                      name="cloud_provider"
                      label="Cloud Provider"
                      description="Choose your cloud provider (optional)"
                      options={[
                        { value: "aws", label: "Amazon Web Services", description: "SageMaker, ECS, Lambda" },
                        { value: "gcp", label: "Google Cloud Platform", description: "Vertex AI, Cloud Run" },
                        { value: "azure", label: "Microsoft Azure", description: "ML Studio, Functions" }
                      ]}
                      placeholder="Select cloud provider…"
                    />
                    <FormField
                      control={form.control}
                      name="cloud_service"
                      render={({ field }) => {
                        const selectedProvider = formValues.cloud_provider
                        let serviceOptions: Array<{ value: string; label: string; description: string }> = []
                        if (selectedProvider === "aws") {
                          serviceOptions = [
                            { value: "sagemaker", label: "SageMaker", description: "AWS managed ML service" },
                            { value: "ecs", label: "ECS", description: "Elastic Container Service" },
                            { value: "lambda", label: "Lambda", description: "Serverless functions" }
                          ]
                        } else if (selectedProvider === "gcp") {
                          serviceOptions = [
                            { value: "vertex-ai", label: "Vertex AI", description: "GCP unified ML platform" },
                            { value: "cloud-run", label: "Cloud Run", description: "Serverless containers" },
                            { value: "ai-platform", label: "AI Platform", description: "GCP ML training & deployment" }
                          ]
                        } else if (selectedProvider === "azure") {
                          serviceOptions = [
                            { value: "ml-studio", label: "Azure ML Studio", description: "Azure ML workspace" },
                            { value: "container-instances", label: "Container Instances", description: "Azure container service" },
                            { value: "functions", label: "Functions", description: "Azure serverless functions" }
                          ]
                        }
                        return (
                          <CustomSelectField
                            name="cloud_service"
                            label="Cloud Service"
                            description="Choose the specific cloud service"
                            options={serviceOptions}
                            placeholder={selectedProvider ? "Select cloud service…" : "Select cloud provider first"}
                          />
                        )
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* ── Config & Templates ─────────────────────── */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={Database}
                    title="Configuration & Templates"
                    subtitle="Advanced configuration presets and template options"
                    iconClass="icon-gradient-amber"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelectField
                      name="preset_config"
                      label="Configuration Preset"
                      description="Use a predefined configuration preset (optional)"
                      options={[
                        { value: "quick-start", label: "Quick Start", description: "Basic setup for rapid prototyping" },
                        { value: "production-ready", label: "Production Ready", description: "Enterprise-grade configuration" },
                        { value: "research", label: "Research", description: "Optimized for ML research" },
                        { value: "enterprise", label: "Enterprise", description: "Full enterprise MLOps stack" }
                      ]}
                      placeholder="Select preset (optional)…"
                    />
                    <CustomSelectField
                      name="custom_template"
                      label="Custom Template"
                      description="Choose a custom template variant (optional)"
                      options={[
                        { value: "minimal", label: "Minimal", description: "Lightweight template with essentials" },
                        { value: "comprehensive", label: "Comprehensive", description: "Full-featured with all options" },
                        { value: "microservice", label: "Microservice", description: "Microservice-oriented template" }
                      ]}
                      placeholder="Select template (optional)…"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* ── Analytics Toggle ───────────────────────── */}
                <div className="space-y-4">
                  <SectionHeader
                    icon={TrendingUp}
                    title="Analytics & Insights"
                    subtitle="Enable project analytics and usage tracking"
                    iconClass="icon-gradient-rose"
                  />
                  <FormField
                    control={form.control}
                    name="enable_analytics"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 p-4 gap-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-semibold text-foreground cursor-pointer">Enable Analytics</FormLabel>
                            <FormDescription className="text-xs">
                              Track project generation metrics and get insights about your MLOps projects
                            </FormDescription>
                          </div>
                          <FormControl>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={!!field.value}
                              onClick={() => field.onChange(!field.value)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                field.value ? 'gradient-primary' : 'bg-muted'
                              }`}
                            >
                              <span
                                className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                  field.value ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* ── Project Details ────────────────────────── */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={FileText}
                    title="Project Details"
                    subtitle="Configure your project metadata and description"
                    iconClass="icon-gradient-pink"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="project_name"
                      render={({ field }) => (
                        <FormItem data-field="project_name">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <div className="w-5 h-5 rounded-lg icon-gradient-violet flex items-center justify-center">
                              <Info className="w-2.5 h-2.5 text-white" />
                            </div>
                            Project Name
                            <div className="group relative">
                              <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center cursor-help text-muted-foreground text-[10px] font-bold">?</div>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-xl shadow-xl border border-border opacity-0 group-hover:opacity-100 transition-opacity z-50 w-52 pointer-events-none">
                                Use lowercase, hyphens, and underscores only. Max 50 characters.
                              </div>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="my-ml-project"
                              className="font-mono text-sm h-11 rounded-xl border-border/70 focus:border-primary/50 focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">e.g. sentiment-analysis, image_classifier</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author_name"
                      render={({ field }) => (
                        <FormItem data-field="author_name">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <div className="w-5 h-5 rounded-lg icon-gradient-cyan flex items-center justify-center">
                              <User className="w-2.5 h-2.5 text-white" />
                            </div>
                            Author Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              className="font-medium text-sm h-11 rounded-xl border-border/70 focus:border-primary/50 focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">Your name or team name</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem data-field="description">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <div className="w-5 h-5 rounded-lg icon-gradient-emerald flex items-center justify-center">
                            <FileText className="w-2.5 h-2.5 text-white" />
                          </div>
                          Project Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A production-ready ML project for sentiment analysis using transformer models…"
                            className="min-h-[110px] resize-none text-sm rounded-xl border-border/70 focus:border-primary/50 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">Brief description of your ML project, its purpose, and key features</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ── Generation Progress ────────────────────── */}
                {isGenerating && (
                  <div className="glass-card rounded-2xl p-5 border-primary/20 animate-slide-in-up">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                          <div className="absolute -inset-1 gradient-primary rounded-xl opacity-20 animate-ping" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {progress < 25 && "🚀 Initializing project generation…"}
                            {progress >= 25 && progress < 50 && "📁 Creating project structure…"}
                            {progress >= 50 && progress < 75 && "⚙️ Configuring MLOps components…"}
                            {progress >= 75 && progress < 100 && "🔧 Finalizing setup…"}
                            {progress >= 100 && "✨ Project ready!"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">Building your production-ready MLOps project</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-primary tabular-nums">{progress}%</span>
                    </div>

                    <div className="relative mb-4">
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <ProgressStep label="Init" colorClass="bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300" active={progress >= 0} />
                      <ProgressStep label="Build" colorClass="bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300" active={progress >= 25} />
                      <ProgressStep label="Config" colorClass="bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300" active={progress >= 50} />
                      <ProgressStep label="Final" colorClass="bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300" active={progress >= 75} />
                    </div>
                  </div>
                )}

                {/* ── Project Summary ────────────────────────── */}
                {hasSummaryData && !isGenerating && (
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
                      {formValues.framework && <SummaryCard icon={Brain} label="ML Framework" value={formValues.framework} iconClass="icon-gradient-violet" />}
                      {formValues.task_type && <SummaryCard icon={BarChart} label="Task Type" value={formValues.task_type} iconClass="icon-gradient-cyan" />}
                      {formValues.experiment_tracking && <SummaryCard icon={Microscope} label="Experiment Tracking" value={formValues.experiment_tracking} iconClass="icon-gradient-emerald" />}
                      {formValues.orchestration && <SummaryCard icon={GitBranch} label="Orchestration" value={formValues.orchestration} iconClass="icon-gradient-amber" />}
                      {formValues.deployment && <SummaryCard icon={Rocket} label="Deployment" value={formValues.deployment} iconClass="icon-gradient-rose" />}
                      {formValues.monitoring && <SummaryCard icon={Shield} label="Monitoring" value={formValues.monitoring} iconClass="icon-gradient-pink" />}
                      {formValues.cloud_provider && <SummaryCard icon={Cloud} label="Cloud Provider" value={formValues.cloud_provider} iconClass="icon-gradient-cyan" />}
                      {formValues.cloud_service && <SummaryCard icon={Cloud} label="Cloud Service" value={formValues.cloud_service} iconClass="icon-gradient-emerald" />}
                      {formValues.preset_config && <SummaryCard icon={Database} label="Preset" value={formValues.preset_config} iconClass="icon-gradient-violet" />}
                      {formValues.custom_template && <SummaryCard icon={Palette} label="Template" value={formValues.custom_template} iconClass="icon-gradient-amber" />}
                    </div>

                    {(formValues.project_name || formValues.author_name) && (
                      <div className="glass-card rounded-2xl p-4 space-y-2">
                        {formValues.project_name && (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide w-24 shrink-0">Project</span>
                            <span className="text-sm font-semibold font-mono text-foreground">{formValues.project_name}</span>
                          </div>
                        )}
                        {formValues.author_name && (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide w-24 shrink-0">Author</span>
                            <span className="text-sm font-semibold text-foreground">{formValues.author_name}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Validation Error ───────────────────────── */}
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
                      <button
                        onClick={() => setValidationError(null)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-destructive/60 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Generate Button ────────────────────────── */}
                <Button
                  type="submit"
                  className="w-full h-14 text-base font-bold rounded-2xl gradient-primary btn-shine shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-0 text-white"
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Your Project…
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5 mr-2" />
                      Generate Project
                      <Sparkles className="h-4 w-4 ml-2 opacity-80" />
                    </>
                  )}
                </Button>

              </form>
            </Form>
          </div>
        </div>

        {/* ── About Creator ──────────────────────────────────── */}
        <div className="glass-card rounded-3xl overflow-hidden mt-8">
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 hover:scale-105">
                  <img
                    src="https://avatars.githubusercontent.com/NotHarshhaa"
                    alt="Harshhaa Reddy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg text-white text-xs font-black">
                  HR
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h4 className="text-lg font-bold text-foreground">HARSHHAA</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <Star className="w-3 h-3" />
                    Creator
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">MLOps Engineer · Open Source Contributor</p>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-lg">
                  Passionate about building scalable ML systems and developer tools.
                  Creating innovative solutions for the MLOps community.
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                  {[
                    { href: "https://github.com/NotHarshhaa", icon: Github, label: "GitHub", cls: "hover:bg-gray-100 dark:hover:bg-white/10 hover:text-foreground" },
                    { href: "https://linkedin.com/in/harsh-vaghela", icon: Linkedin, label: "LinkedIn", cls: "hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400" },
                    { href: "mailto:harshvaghela@example.com", icon: Mail, label: "Email", cls: "hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400" },
                  ].map(({ href, icon: Icon, label, cls }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/70 bg-card/50 text-muted-foreground text-sm font-medium transition-all duration-200 ${cls}`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <p className="text-center text-xs text-muted-foreground mt-8 mb-4">
          Built with ❤️ for the MLOps community · <span className="text-primary font-semibold">MLOps Project Generator</span>
        </p>

      </div>

      {/* ── Success Dialog ─────────────────────────────────── */}
      <Dialog open={showSuccessDialog} onOpenChange={(open) => {
        if (!open) { form.reset(); setShowSuccessDialog(false) }
        else setShowSuccessDialog(true)
      }}>
        <DialogContent className="sm:max-w-lg max-w-[95vw] glass-card border-0 rounded-3xl overflow-hidden p-0">
          {/* Rainbow top bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />

          <div className="p-6 sm:p-8">
            <DialogHeader className="pb-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/30 animate-glow-pulse">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">Project Generated! 🎉</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                    Your production-ready MLOps project is ready
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="glass-card rounded-2xl p-5 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/25 flex-shrink-0 animate-float">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-foreground mb-2">Congratulations!</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Your MLOps project has been generated with best practices, optimized for production deployment and scalability.
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {["Production Ready", "Best Practices", "Scalable", "Cloud Native", "CI/CD Ready"].map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 h-12 rounded-2xl gradient-primary btn-shine shadow-lg shadow-primary/25 border-0 text-white font-semibold"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Project
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-border/70 font-semibold hover:bg-muted/60"
                size="lg"
              >
                <Settings className="h-5 w-5 mr-2" />
                Generate Another
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
