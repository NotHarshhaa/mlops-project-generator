"use client"

import { Loader2 } from "lucide-react"

interface GenerationProgressProps {
  progress: number
}

const PHASES = [
  { threshold: 0, label: "01 / INIT", message: "Initializing compilation pipeline…" },
  { threshold: 25, label: "02 / BUILD", message: "Synthesizing directory layout & modules…" },
  { threshold: 50, label: "03 / CONFIG", message: "Binding experiment trackers & Docker targets…" },
  { threshold: 75, label: "04 / PACK", message: "Compressing repository into ZIP archive…" },
] as const

function getPhase(progress: number) {
  const phase = [...PHASES].reverse().find((p) => progress >= p.threshold) ?? PHASES[0]
  if (progress >= 100) return { label: "DONE", message: "Archive successfully compiled. Ready for download." }
  return phase
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  const { message } = getPhase(progress)

  return (
    <div className="bg-white border border-black/25 p-5 animate-monograph-in">
      {/* Top Status */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center bg-[#1925aa] text-white shrink-0">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#1925aa] uppercase tracking-wider font-bold">
              COMPILER ACTIVE
            </p>
            <p className="font-mono text-xs text-black/90 truncate">{message}</p>
          </div>
        </div>
        <span className="font-display text-3xl font-normal text-[#1925aa] tabular-nums shrink-0">
          {progress}%
        </span>
      </div>

      {/* Flat Sharp Progress Bar */}
      <div className="h-2 bg-black/10 w-full mb-4">
        <div
          className="h-full bg-[#1925aa] transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Phase Grid */}
      <div className="grid grid-cols-4 gap-2">
        {PHASES.map((p) => {
          const isActive = progress >= p.threshold
          return (
            <div
              key={p.label}
              className={`p-2 text-center border font-mono text-[10px] transition-colors ${
                isActive
                  ? "bg-[#1925aa] text-white border-[#1925aa] font-bold"
                  : "bg-black/5 text-black/50 border-black/10"
              }`}
            >
              {p.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
