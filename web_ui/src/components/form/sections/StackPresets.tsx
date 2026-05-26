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
    <section className="mb-8">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="font-mono-label text-primary mb-1">Step 01</p>
          <h2 className="font-display text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Stack presets
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Start from a curated MLOps stack — every field stays editable after you apply.
          </p>
        </div>
        {activePreset && (
          <button
            type="button"
            onClick={onClear}
            className="btn-ghost-panel inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
        {STACK_PRESETS.map((preset) => {
          const Icon = preset.icon
          const isActive = activePreset === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => isActive ? onClear() : onApply(preset)}
              className={`preset-card snap-start min-w-[200px] sm:min-w-0 ${isActive ? "preset-card-active" : ""}`}
            >
              <div
                className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${preset.iconBg} opacity-80`}
                aria-hidden
              />
              <div className="pl-3">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${preset.iconBg} flex items-center justify-center shadow-md`}>
                    <Icon className="w-[18px] h-[18px] text-white" />
                  </div>
                  {isActive && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/20 text-primary border border-primary/30">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <p className={`text-sm font-bold mb-0.5 ${isActive ? "text-primary" : "text-foreground"}`}>
                  {preset.label}
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug mb-3">{preset.tagline}</p>
                <div className="flex flex-wrap gap-1">
                  {preset.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-border/80 bg-muted/40 text-muted-foreground"
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
