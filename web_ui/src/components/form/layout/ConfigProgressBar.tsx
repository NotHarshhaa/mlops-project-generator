import { REQUIRED_STACK_FIELDS } from "../constants"

interface ConfigProgressBarProps {
  completedCount: number
  completionPct: number
}

export function ConfigProgressBar({ completedCount, completionPct }: ConfigProgressBarProps) {
  return (
    <div className="bg-white border border-black/15 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-black/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#1925aa]" />
          <span>
            STACK SPECIFICATION PROGRESS: {completedCount} / {REQUIRED_STACK_FIELDS.length} REQUIRED MODULES
          </span>
        </div>
        <span className="font-bold text-[#1925aa] text-xs">
          {completionPct}% COMPILED
        </span>
      </div>

      {/* Flat Sharp Progress Bar */}
      <div className="h-1.5 bg-black/10 w-full overflow-hidden">
        <div
          className="h-full bg-[#1925aa] transition-all duration-300"
          style={{ width: `${completionPct}%` }}
        />
      </div>
    </div>
  )
}
