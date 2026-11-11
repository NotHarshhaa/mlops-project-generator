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
  RuntimeGovernance,
  StackPresets,
} from "./form/sections"
import {
  ArchitectureAudit,
  ArchitectureVisualizer,
  EnvPreview,
  FilePreview,
  GenerationProgress,
  ProjectSummary,
  SuccessDialog,
} from "./form/feedback"
import { CreatorCard, RecentProjects } from "./form/chrome"
import type { FormValues } from "./form/schema"

function SectionDivider() {
  return <div className="h-px bg-black/15 my-6 sm:my-8" />
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
    <div className="min-h-screen bg-[#e8e6e0] text-[#000000] flex flex-col font-sans selection:bg-[#1925aa] selection:text-white">
      <AmbientBackground />
      <FormNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <LandingHero />
        <MissionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <GeneratorCTA />

        {/* The Generator Architectural Matrix Section */}
        <section id="generator" className="scroll-mt-14 sm:scroll-mt-20 pt-4">
          <StackPresets
            activePreset={activePreset}
            onApply={applyPreset}
            onClear={clearPreset}
          />

          {showConfigProgress && (
            <ConfigProgressBar completedCount={completedCount} completionPct={completionPct} />
          )}

          {/* Form Broadsheet Plate */}
          <div className="bg-white border border-black/20 p-5 sm:p-10 mb-8 sm:mb-12">
            <FormCardHeader presetLabel={presetLabel} onClearAll={clearAll} />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-10">
                {/* Layer 01 & Layer 02 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                  <CoreMLStack options={options} />
                  <Infrastructure options={options} />
                </div>

                <SectionDivider />

                {/* Layer 03 & Layer 04 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                  <CloudDeployment />
                  <ConfigTemplates />
                </div>

                <SectionDivider />

                {/* Layer 05: Runtime Governance & Layer 06: Project Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                  <RuntimeGovernance />
                  <ProjectDetails />
                </div>

                <SectionDivider />

                {/* Telemetry Toggle */}
                <AnalyticsToggle />

                <SectionDivider />

                {/* Real-time Architecture Pipeline Visualizer */}
                <ArchitectureVisualizer values={formValues as FormValues} />

                {/* Production Readiness & Compatibility Audit */}
                <ArchitectureAudit values={formValues as FormValues} />

                {isGenerating && <GenerationProgress progress={progress} />}

                {summaryVisible && (
                  <ProjectSummary values={formValues as FormValues} />
                )}

                {/* Generated .env.example Specification Preview */}
                <EnvPreview values={formValues as FormValues} />

                {/* Live Code Inspector & File Matrix */}
                <FilePreview values={formValues as FormValues} />

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
