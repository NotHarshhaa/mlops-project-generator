"use client"

import { useFormContext } from "react-hook-form"
import { FileText, Info, User } from "lucide-react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SectionHeader } from "./UIHelpers"

export function ProjectDetails() {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={FileText}
        title="Project Details"
        subtitle="Configure your project metadata and description"
        iconClass="icon-gradient-pink"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Project Name */}
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

        {/* Author Name */}
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

      {/* Description */}
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
  )
}
