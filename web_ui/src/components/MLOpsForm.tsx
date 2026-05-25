"use client"

import { Form } from "@/components/ui/form"
import { useMLOpsGenerator } from "./form/hooks/useMLOpsGenerator"
import {
  AmbientBackground,
  ConfigProgressBar,
  FormCardHeader,
  FormHero,
  FormLoadingSkeleton,
  GenerateButton,
  ValidationErrorBanner,
} from "./form/layout"
import {
  AnalyticsToggle,
  CloudDeployment,
  ConfigTemplates,
  CoreMLStack,
  Infrastructure,
  ProjectDetails,
  StackPresets,
} from "./form/sections"
import { GenerationProgress, ProjectSummary, SuccessDialog } from "./form/feedback"
import { CreatorCard, RecentProjects } from "./form/chrome"
import type { FormValues } from "./form/schema"

export default function MLOpsForm() {
  const {
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
  } = useMLOpsGenerator()

  if (!options) {
    return <FormLoadingSkeleton />
  }

  return (
    <div className="min-h-screen hero-gradient overflow-x-hidden">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12">
        <FormHero />

        <StackPresets
          activePreset={activePreset}
          onApply={applyPreset}
          onClear={clearPreset}
        />

        {showConfigProgress && (
          <ConfigProgressBar completedCount={completedCount} completionPct={completionPct} />
        )}

        <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden">
          <FormCardHeader presetLabel={presetLabel} onClearAll={clearAll} />

          <div className="p-4 sm:p-6 lg:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 lg:space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <CoreMLStack options={options} />
                  <Infrastructure options={options} />
                </div>
                <div className="border-t border-border/50" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <CloudDeployment />
                  <ConfigTemplates />
                </div>
                <div className="border-t border-border/50" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <AnalyticsToggle />
                  <ProjectDetails />
                </div>

                {isGenerating && <GenerationProgress progress={progress} />}

                {summaryVisible && (
                  <ProjectSummary values={formValues as FormValues} />
                )}

                {validationError && (
                  <ValidationErrorBanner
                    message={validationError}
                    onDismiss={dismissValidationError}
                  />
                )}

                <GenerateButton isGenerating={isGenerating} />
              </form>
            </Form>
          </div>
        </div>

        <RecentProjects />
        <CreatorCard />
      </div>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={handleSuccessDialogChange}
        onDownload={handleDownload}
        onReset={resetAfterSuccess}
      />
    </div>
  )
}
