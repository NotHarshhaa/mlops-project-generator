"use client"

import { X, Check, Layers } from "lucide-react"
import { STACK_PRESETS, type StackPreset } from "./types"

interface Props {
  activePreset: string | null
  onApply: (preset: StackPreset) => void
  onClear: () => void
}

export function StackPresets({ activePreset, onApply, onClear }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Stack Presets
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick a ready-made stack — all fields pre-filled, fully editable
          </p>
        </div>
        {activePreset && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/60 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-muted/50"
          >
            <X className="w-3 h-3" /> Clear preset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STACK_PRESETS.map((preset) => {
          const Icon = preset.icon
          const isActive = activePreset === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => isActive ? onClear() : onApply(preset)}
              className={`relative group text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-transparent ring-2 ring-primary/40 bg-primary/8 dark:bg-primary/12 shadow-xl shadow-primary/20 dark:shadow-primary/30 transform scale-[1.02] backdrop-blur-sm"
                  : "border-border/60 bg-card/50 dark:bg-card/80 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 hover:bg-card dark:hover:bg-card/90"
              }`}
            >
              {/* Icon + check */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${preset.iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="w-[18px] h-[18px] text-white" />
                </div>
                {isActive && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/30 dark:bg-primary/40 shadow-lg shadow-primary/30 dark:shadow-primary/50 flex-shrink-0 ring-2 ring-primary/50 dark:ring-primary/60">
                    <Check className="w-3.5 h-3.5 text-primary font-semibold" />
                  </span>
                )}
              </div>

              <p className={`text-sm font-bold mb-0.5 leading-tight ${isActive ? "text-primary" : "text-foreground"}`}>
                {preset.label}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug mb-3">{preset.tagline}</p>

              <div className="flex flex-wrap gap-1">
                {preset.tags.map(tag => (
                  <span key={tag} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${preset.badgeColor}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
