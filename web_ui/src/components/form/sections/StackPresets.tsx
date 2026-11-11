"use client"

import { useState, useMemo } from "react"
import { Check, X, Columns3 } from "lucide-react"
import { STACK_PRESETS, type StackPreset } from "../presets"
import { PresetComparisonDialog } from "./PresetComparisonDialog"

interface StackPresetsProps {
  activePreset: string | null
  onApply: (preset: StackPreset) => void
  onClear: () => void
}

type PresetCategory = "all" | "classic" | "deep-learning" | "nlp" | "enterprise"

export function StackPresets({ activePreset, onApply, onClear }: StackPresetsProps) {
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory>("all")
  const [comparisonOpen, setComparisonOpen] = useState(false)

  const filteredPresets = useMemo(() => {
    if (selectedCategory === "all") return STACK_PRESETS
    if (selectedCategory === "classic") {
      return STACK_PRESETS.filter((p) => p.fields.framework === "sklearn" || p.id === "quick-start")
    }
    if (selectedCategory === "deep-learning") {
      return STACK_PRESETS.filter((p) => p.fields.framework === "pytorch" && p.id !== "genai-nlp")
    }
    if (selectedCategory === "nlp") {
      return STACK_PRESETS.filter((p) => p.id === "genai-nlp" || p.fields.task_type === "nlp")
    }
    if (selectedCategory === "enterprise") {
      return STACK_PRESETS.filter((p) => p.id === "enterprise" || p.id === "production-mlops")
    }
    return STACK_PRESETS
  }, [selectedCategory])

  return (
    <section className="mb-8 sm:mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 mb-4 border-b border-black/15">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold mb-1">
            [ STEP 01 // ARCHITECTURAL BLUEPRINTS ]
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-[#000000] uppercase tracking-tight">
            Curated Stack Presets
          </h2>
          <p className="font-mono text-xs text-black/60 mt-1">
            Apply an industry stack pattern. All parameters remain completely editable after applying.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setComparisonOpen(true)}
            className="btn-monograph-outline text-[10px] py-1.5 px-3 self-start sm:self-auto flex items-center gap-1.5"
          >
            <Columns3 className="w-3.5 h-3.5 text-[#1925aa]" />
            <span>Compare Blueprints Matrix</span>
          </button>

          {activePreset && (
            <button
              type="button"
              onClick={onClear}
              className="btn-monograph-outline text-[10px] py-1.5 px-3 self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Preset Selection</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
        {(
          [
            { id: "all", label: "ALL PRESETS (8)" },
            { id: "classic", label: "CLASSIC ML & TABULAR" },
            { id: "deep-learning", label: "DEEP LEARNING (PYTORCH)" },
            { id: "nlp", label: "GENAI & NLP (LLMS)" },
            { id: "enterprise", label: "ENTERPRISE & K8S" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 font-mono text-[10px] tracking-wider transition-colors cursor-pointer border whitespace-nowrap ${
              selectedCategory === tab.id
                ? "bg-[#1925aa] text-white border-[#1925aa] font-bold"
                : "bg-white hover:bg-black/5 text-black border-black/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Flat Monograph Plates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredPresets.map((preset, index) => {
          const isActive = activePreset === preset.id
          const indexStr = String(index + 1).padStart(2, "0")

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => (isActive ? onClear() : onApply(preset))}
              className={`text-left p-4 transition-all duration-150 relative cursor-pointer ${
                isActive
                  ? "bg-white border-2 border-[#1925aa] text-black"
                  : "bg-white/60 hover:bg-white border border-black/15 text-black hover:border-black/30"
              }`}
            >
              {/* Top Meta Line */}
              <div className="flex items-center justify-between font-mono text-[10px] mb-3 text-black/50">
                <span>[ {indexStr} ]</span>
                {isActive ? (
                  <span className="flex items-center gap-1 font-bold text-[#1925aa]">
                    <Check className="w-3 h-3" /> ACTIVE
                  </span>
                ) : (
                  <span>PRESET</span>
                )}
              </div>

              {/* Title & Tagline */}
              <h3 className="font-editorial text-base font-semibold text-[#000000] mb-1 leading-snug">
                {preset.label}
              </h3>
              <p className="font-mono text-[11px] text-black/70 mb-4 line-clamp-2 leading-relaxed">
                {preset.tagline}
              </p>

              {/* Technical Mono Tags */}
              <div className="flex flex-wrap gap-1 pt-2 border-t border-black/10">
                {preset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] px-1.5 py-0.5 border border-black/15 bg-[#e8e6e0]/60 text-black/80 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      <PresetComparisonDialog
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        onApply={onApply}
        activePreset={activePreset}
      />
    </section>
  )
}
