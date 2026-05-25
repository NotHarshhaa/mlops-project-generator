"use client"

import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { DEFAULT_FORM_VALUES, REQUIRED_STACK_FIELDS } from "../constants"
import { fetchOptions, fetchTaskStatus, startGeneration } from "../lib/api"
import { addRecentProject } from "../lib/recent-projects"
import {
  formatMissingFieldsMessage,
  getMissingFields,
  hasSummaryData,
  highlightMissingFields,
} from "../lib/validation"
import { STACK_PRESETS, type StackPreset } from "../presets"
import type { FormValues, Options } from "../types"

export function useMLOpsGenerator() {
  const [options, setOptions] = useState<Options | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const form = useForm<FormValues>({ defaultValues: DEFAULT_FORM_VALUES })
  const formValues = form.watch()

  const completedCount = REQUIRED_STACK_FIELDS.filter(f => !!formValues[f]).length
  const completionPct = Math.round((completedCount / REQUIRED_STACK_FIELDS.length) * 100)
  const showConfigProgress = completedCount > 0 && completedCount < REQUIRED_STACK_FIELDS.length
  const summaryVisible = hasSummaryData(formValues) && !isGenerating
  const presetLabel = STACK_PRESETS.find(p => p.id === activePreset)?.label

  const loadOptions = useCallback(async () => {
    try {
      setOptions(await fetchOptions())
    } catch {
      toast.error("Failed to load options.")
    }
  }, [])

  useEffect(() => {
    loadOptions()
  }, [loadOptions])

  useEffect(() => {
    const sub = form.watch((_, { name }) => {
      if (name === "cloud_provider") form.setValue("cloud_service", "")
    })
    return () => sub.unsubscribe()
  }, [form])

  const applyPreset = useCallback((preset: StackPreset) => {
    Object.entries(preset.fields).forEach(([key, val]) => {
      form.setValue(key as keyof FormValues, val)
    })
    setActivePreset(preset.id)
    toast.success(`"${preset.label}" stack applied — customize as needed`)
    setTimeout(() => {
      document.getElementById("project-config-card")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 150)
  }, [form])

  const clearPreset = useCallback(() => {
    REQUIRED_STACK_FIELDS.forEach(f => form.setValue(f, ""))
    setActivePreset(null)
    toast.success("Preset cleared")
  }, [form])

  const clearAll = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES)
    setActivePreset(null)
    toast.success("All selections cleared")
  }, [form])

  const pollTaskStatus = useCallback(async (taskId: string, values: FormValues) => {
    try {
      const task = await fetchTaskStatus(taskId)

      if (task.status === "processing") {
        setProgress(p => (p < 80 ? p + 20 : p + 5))
        setTimeout(() => pollTaskStatus(taskId, values), 2000)
        return
      }

      if (task.status === "completed") {
        setProgress(100)
        setDownloadUrl(task.download_url ?? null)
        setShowSuccessDialog(true)
        toast.success("Project generated successfully!")
        setIsGenerating(false)

        if (task.download_url) {
          addRecentProject({
            projectName: values.project_name || "Untitled Project",
            framework: values.framework ?? "",
            taskType: values.task_type ?? "",
            deployment: values.deployment ?? "",
            downloadUrl: task.download_url,
          })
          window.dispatchEvent(new CustomEvent("recentProjectsUpdated"))
        }
        return
      }

      if (task.status === "failed") {
        toast.error(`Generation failed: ${task.message ?? "Unknown error"}`)
        setIsGenerating(false)
        setProgress(0)
      }
    } catch {
      toast.error("Failed to check task status")
      setIsGenerating(false)
      setProgress(0)
    }
  }, [])

  const onSubmit = useCallback(async (values: FormValues) => {
    const missing = getMissingFields(values)

    if (missing.length > 0) {
      setValidationError(formatMissingFieldsMessage(missing))
      setTimeout(() => setValidationError(null), 8000)
      setTimeout(() => highlightMissingFields(missing), 100)
      return
    }

    setValidationError(null)
    setIsGenerating(true)
    setProgress(5)
    await new Promise(r => setTimeout(r, 500))
    setProgress(15)

    try {
      const task = await startGeneration(values)
      setProgress(30)
      toast.success("Project generation started!")
      setTimeout(() => pollTaskStatus(task.task_id, values), 1000)
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      toast.error(message || "Failed to generate project")
      setIsGenerating(false)
      setProgress(0)
    }
  }, [pollTaskStatus])

  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank")
      setShowSuccessDialog(false)
    }
  }, [downloadUrl])

  const resetAfterSuccess = useCallback(async () => {
    setShowSuccessDialog(false)
    setDownloadUrl(null)
    setProgress(0)
    setActivePreset(null)
    form.reset(DEFAULT_FORM_VALUES)
    toast.success("Form reset — Ready for a new project!")
    await loadOptions()
    setTimeout(() => {
      (document.querySelector('input[type="text"]') as HTMLInputElement | null)?.focus()
    }, 100)
  }, [form, loadOptions])

  const dismissValidationError = useCallback(() => setValidationError(null), [])

  const handleSuccessDialogChange = useCallback((open: boolean) => {
    if (!open) {
      form.reset(DEFAULT_FORM_VALUES)
      setShowSuccessDialog(false)
    } else {
      setShowSuccessDialog(true)
    }
  }, [form])

  return {
    options,
    form,
    formValues,
    isGenerating,
    progress,
    showSuccessDialog,
    validationError,
    activePreset,
    presetLabel,
    completedCount,
    completionPct,
    showConfigProgress,
    summaryVisible,
    applyPreset,
    clearPreset,
    clearAll,
    onSubmit,
    handleDownload,
    resetAfterSuccess,
    dismissValidationError,
    handleSuccessDialogChange,
  }
}
