"use client"

import { useFormContext } from "react-hook-form"
import { TrendingUp } from "lucide-react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { SectionHeader } from "../ui"
import type { FormValues } from "../schema"

export function AnalyticsToggle() {
  const form = useFormContext<FormValues>()

  return (
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
                    field.value ? "gradient-primary" : "bg-muted"
                  }`}
                >
                  <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    field.value ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
