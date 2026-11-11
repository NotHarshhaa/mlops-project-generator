interface ProgressStepProps {
  label: string
  active: boolean
}

export function ProgressStep({ label, active }: ProgressStepProps) {
  return (
    <div
      className={`text-center py-2 px-1 border transition-colors ${
        active
          ? "border-[#1925aa] bg-[#1925aa] text-white font-bold"
          : "border-black/15 bg-white text-black/50"
      }`}
    >
      <p className="font-mono text-[9px] uppercase tracking-wider">{label}</p>
    </div>
  )
}
