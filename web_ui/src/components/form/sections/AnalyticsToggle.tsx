"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { SectionHeader } from "../ui"
import type { FormValues } from "../schema"

export function AnalyticsToggle() {
  const form = useFormContext<FormValues>()

  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        title="Telemetry & Diagnostics"
        subtitle="Optional compilation metrics and scaffold insights."
        step="LAYER 05 // TELEMETRY"
      />
      <FormField
        control={form.control}
        name="enable_analytics"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between p-4 bg-white border border-black/15 gap-4">
              <div className="space-y-0.5">
                <FormLabel className="font-mono text-xs uppercase tracking-tight text-black font-semibold cursor-pointer">
                  Enable Project Generation Analytics
                </FormLabel>
                <FormDescription className="font-mono text-[11px] text-black/60">
                  Embeds anonymous generation timestamp and configuration hashes into project metadata.
                </FormDescription>
              </div>
              <FormControl>
                {/* Architectural Square Toggle from DESIGN.md (0px radius) */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`w-12 h-6 border cursor-pointer select-none relative transition-colors ${
                    field.value
                      ? "bg-[#1925aa] border-[#1925aa]"
                      : "bg-[#e8e6e0] border-black/30"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white transition-transform ${
                      field.value ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
