"use client"

import { Loader2 } from "lucide-react"
import { ProgressStep } from "../ui"

interface GenerationProgressProps {
  progress: number
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border-primary/20 animate-slide-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="absolute -inset-1 gradient-primary rounded-xl opacity-20 animate-ping" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {progress < 25 && "🚀 Initializing project generation…"}
              {progress >= 25 && progress < 50 && "📁 Creating project structure…"}
              {progress >= 50 && progress < 75 && "⚙️ Configuring MLOps components…"}
              {progress >= 75 && progress < 100 && "🔧 Finalizing setup…"}
              {progress >= 100 && "✨ Project ready!"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Building your production-ready MLOps project</p>
          </div>
        </div>
        <span className="text-2xl font-black text-primary tabular-nums">{progress}%</span>
      </div>

      <div className="relative mb-4">
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <ProgressStep label="Init" colorClass="bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300" active={progress >= 0} />
        <ProgressStep label="Build" colorClass="bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300" active={progress >= 25} />
        <ProgressStep label="Config" colorClass="bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300" active={progress >= 50} />
        <ProgressStep label="Final" colorClass="bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300" active={progress >= 75} />
      </div>
    </div>
  )
}
