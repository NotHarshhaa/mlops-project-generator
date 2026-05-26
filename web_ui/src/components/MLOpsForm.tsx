"use client"

import { Form } from "@/components/ui/form"
import { useMLOpsGenerator } from "./form/hooks/useMLOpsGenerator"
import {
  AmbientBackground,
  ConfigProgressBar,
  FormCardHeader,
  FormLoadingSkeleton,
  FormNav,
  GenerateButton,
  ValidationErrorBanner,
} from "./form/layout"
import {
  FeaturesSection,
  GeneratorCTA,
  HowItWorksSection,
  LandingHero,
  MissionSection,
} from "./form/marketing"
import {
  AnalyticsToggle,
  CloudDeployment,
  ConfigTemplates,
  CoreMLStack,
  Infrastructure,
  ProjectDetails,
  StackPresets,
} from "./form/sections"
import { FilePreview, GenerationProgress, ProjectSummary, SuccessDialog } from "./form/feedback"
import { CreatorCard, RecentProjects } from "./form/chrome"
import type { FormValues } from "./form/schema"

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
}

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
    <div className="min-h-screen observatory-bg flex flex-col scroll-smooth">
      <AmbientBackground />
      <FormNav />

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-12">
        <LandingHero />
        <MissionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <GeneratorCTA />

        <section id="generator" className="scroll-mt-16 sm:scroll-mt-24">
          <StackPresets
            activePreset={activePreset}
            onApply={applyPreset}
            onClear={clearPreset}
          />

          {showConfigProgress && (
            <ConfigProgressBar completedCount={completedCount} completionPct={completionPct} />
          )}

          <div className="panel">
            <FormCardHeader presetLabel={presetLabel} onClearAll={clearAll} />

            <div className="p-3 sm:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-10">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8 xl:gap-10">
                    <CoreMLStack options={options} />
                    <Infrastructure options={options} />
                  </div>

                  <SectionDivider />

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8 xl:gap-10">
                    <CloudDeployment />
                    <ConfigTemplates />
                  </div>

                  <SectionDivider />

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8 xl:gap-10">
                    <AnalyticsToggle />
                    <ProjectDetails />
                  </div>

                  {isGenerating && <GenerationProgress progress={progress} />}

                  {summaryVisible && (
                    <ProjectSummary values={formValues as FormValues} />
                  )}

                  {summaryVisible && (
                    <FilePreview values={formValues as FormValues} />
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
        </section>

        <RecentProjects />
        <CreatorCard />
      </main>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={handleSuccessDialogChange}
        onDownload={handleDownload}
        onReset={resetAfterSuccess}
      />
    </div>
  )
}
