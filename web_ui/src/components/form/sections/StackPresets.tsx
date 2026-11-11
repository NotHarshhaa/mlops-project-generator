"use client"

import { Check, X } from "lucide-react"
import { STACK_PRESETS, type StackPreset } from "../presets"

interface StackPresetsProps {
  activePreset: string | null
  onApply: (preset: StackPreset) => void
  onClear: () => void
}

export function StackPresets({ activePreset, onApply, onClear }: StackPresetsProps) {
  return (
    <section className="mb-8 sm:mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 mb-6 border-b border-black/15">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold mb-1">
            [ STEP 01 // ARCHITECTURAL BLUEPRINTS ]
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-[#000000] uppercase tracking-tight">
            Curated Stack Presets
          </h2>
          <p className="font-mono text-xs text-black/60 mt-1">
            Apply a proven industry stack pattern. All parameters remain completely editable after applying.
          </p>
        </div>

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

      {/* Grid of Flat Monograph Plates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STACK_PRESETS.map((preset, index) => {
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
    </section>
  )
}
