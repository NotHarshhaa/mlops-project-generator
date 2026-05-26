"use client"

import { Loader2 } from "lucide-react"
import { ProgressStep } from "../ui"

interface GenerationProgressProps {
  progress: number
}

const PHASES = [
  { threshold: 0, label: "Init", message: "Initializing pipeline…" },
  { threshold: 25, label: "Build", message: "Creating project structure…" },
  { threshold: 50, label: "Config", message: "Configuring MLOps stack…" },
  { threshold: 75, label: "Pack", message: "Packaging archive…" },
] as const

function getPhase(progress: number) {
  const phase = [...PHASES].reverse().find(p => progress >= p.threshold) ?? PHASES[0]
  if (progress >= 100) return { label: "Done", message: "Archive ready for download" }
  return phase
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  const { message } = getPhase(progress)

  return (
    <div className="panel p-3 sm:p-5 border-primary/30 animate-slide-in-up">
      <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2.5 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground animate-spin" />
          </div>
          <div className="min-w-0">
            <p className="font-mono-label text-primary">Generating</p>
            <p className="text-xs sm:text-sm font-medium text-foreground truncate">{message}</p>
          </div>
        </div>
        <span className="font-display text-xl sm:text-3xl font-bold text-gradient tabular-nums flex-shrink-0">{progress}%</span>
      </div>

      <div className="progress-track h-1.5 sm:h-2 mb-2.5 sm:mb-4">
        <div className="progress-fill relative overflow-hidden" style={{ width: `${progress}%` }}>
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        <ProgressStep label="Init" active={progress >= 0} />
        <ProgressStep label="Build" active={progress >= 25} />
        <ProgressStep label="Config" active={progress >= 50} />
        <ProgressStep label="Pack" active={progress >= 75} />
      </div>
    </div>
  )
}
