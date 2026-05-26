"use client"

import { Check, Layers, X } from "lucide-react"
import { STACK_PRESETS, type StackPreset } from "../presets"

interface StackPresetsProps {
  activePreset: string | null
  onApply: (preset: StackPreset) => void
  onClear: () => void
}

export function StackPresets({ activePreset, onApply, onClear }: StackPresetsProps) {
  return (
    <section className="mb-5 sm:mb-8">
      <div className="flex items-start sm:items-end justify-between gap-2 sm:gap-4 mb-3 sm:mb-5">
        <div className="min-w-0 flex-1">
          <p className="font-mono-label text-primary mb-0.5 sm:mb-1">Step 01</p>
          <h2 className="font-display text-lg sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-2 leading-tight">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
            Stack presets
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 leading-snug">
            Start from a curated MLOps stack — every field stays editable after you apply.
          </p>
        </div>
        {activePreset && (
          <button
            type="button"
            onClick={onClear}
            className="btn-ghost-panel inline-flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 -mx-0.5 px-0.5 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
        {STACK_PRESETS.map((preset) => {
          const Icon = preset.icon
          const isActive = activePreset === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => isActive ? onClear() : onApply(preset)}
              className={`preset-card snap-start min-w-[168px] sm:min-w-0 ${isActive ? "preset-card-active" : ""}`}
            >
              <div
                className={`absolute left-0 top-2 bottom-2 sm:top-3 sm:bottom-3 w-0.5 sm:w-1 rounded-full ${preset.iconBg} opacity-80`}
                aria-hidden
              />
              <div className="pl-2 sm:pl-3">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg ${preset.iconBg} flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" />
                  </div>
                  {isActive && (
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-primary/20 text-primary border border-primary/30">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm font-bold mb-0.5 leading-tight ${isActive ? "text-primary" : "text-foreground"}`}>
                  {preset.label}
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug mb-2 sm:mb-3 line-clamp-2">{preset.tagline}</p>
                <div className="flex flex-wrap gap-0.5 sm:gap-1">
                  {preset.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] sm:text-[10px] font-medium px-1 py-0.5 sm:px-1.5 rounded border border-border/80 bg-muted/40 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
