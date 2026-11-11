import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  subtitle: string
  iconClass?: string
  step?: string
}

export function SectionHeader({
  title,
  subtitle,
  step,
}: SectionHeaderProps) {
  return (
    <div className="pb-3 mb-4 sm:mb-6 border-b border-black/15">
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-[#1925aa] font-bold mb-1">
        <span className="w-1.5 h-1.5 bg-[#1925aa]" />
        {step && <span>[ {step} ]</span>}
      </div>
      <h3 className="font-editorial text-xl sm:text-2xl font-normal text-[#000000] tracking-tight uppercase">
        {title}
      </h3>
      <p className="font-mono text-xs text-black/60 mt-0.5 leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}
