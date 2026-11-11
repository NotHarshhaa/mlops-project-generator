"use client"

import { useFormContext } from "react-hook-form"
import { Dices } from "lucide-react"
import { toast } from "sonner"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RANDOM_PROJECT_SLUGS } from "../constants"
import { SectionHeader } from "../ui"
import type { FormValues } from "../schema"

export function ProjectDetails() {
  const form = useFormContext<FormValues>()

  const handleRandomizeSlug = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_PROJECT_SLUGS.length)
    const randomSlug = RANDOM_PROJECT_SLUGS[randomIndex]
    form.setValue("project_name", randomSlug, { shouldValidate: true })
    toast.success(`Generated project identifier: ${randomSlug}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        title="Project Metadata & Identifiers"
        subtitle="Identifiers stamped into pyproject.toml, README.md, and license manifests."
        step="LAYER 06 // METADATA"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="project_name"
          render={({ field }) => (
            <FormItem data-field="project_name" className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FormLabel className="font-mono text-[10px] tracking-tight uppercase text-black font-semibold">
                  Project Name / Slug
                </FormLabel>
                <button
                  type="button"
                  onClick={handleRandomizeSlug}
                  className="font-mono text-[9px] uppercase text-[#1925aa] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Generate a random production-ready project name"
                >
                  <Dices className="w-3 h-3" />
                  <span>[ Randomize ⟳ ]</span>
                </button>
              </div>
              <FormControl>
                <Input
                  placeholder="e.g. sentiment-classifier"
                  className="font-mono text-xs"
                  {...field}
                />
              </FormControl>
              <FormDescription className="font-mono text-[10px] text-black/60">
                Package root directory and module slug
              </FormDescription>
              <FormMessage className="font-mono text-[10px] text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author_name"
          render={({ field }) => (
            <FormItem data-field="author_name" className="space-y-1.5">
              <FormLabel className="font-mono text-[10px] tracking-tight uppercase text-black font-semibold">
                Author / Organization
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Acme ML Team"
                  className="font-mono text-xs"
                  {...field}
                />
              </FormControl>
              <FormDescription className="font-mono text-[10px] text-black/60">
                Author credit in setup and docstrings
              </FormDescription>
              <FormMessage className="font-mono text-[10px] text-red-600" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem data-field="description" className="space-y-1.5">
            <FormLabel className="font-mono text-[10px] tracking-tight uppercase text-black font-semibold">
              Project Description / Scope
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="A production-ready machine learning service for text classification with automated drift detection and MLflow experiment telemetry…"
                className="font-mono text-xs min-h-[90px]"
                {...field}
              />
            </FormControl>
            <FormDescription className="font-mono text-[10px] text-black/60">
              High-level abstract stamped into README.md
            </FormDescription>
            <FormMessage className="font-mono text-[10px] text-red-600" />
          </FormItem>
        )}
      />
    </div>
  )
}
