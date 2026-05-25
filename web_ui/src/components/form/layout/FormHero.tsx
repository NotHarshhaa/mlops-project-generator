import { Cloud, Database, Palette, Rocket, Sparkles, TrendingUp, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const FEATURE_BADGES = [
  { icon: Cloud, label: "Cloud Deployment", cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60" },
  { icon: Database, label: "Config Presets", cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60" },
  { icon: TrendingUp, label: "Analytics", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60" },
  { icon: Palette, label: "Custom Templates", cls: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60" },
  { icon: Zap, label: "Instant Download", cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60" },
] as const

export function FormHero() {
  return (
    <div className="text-center mb-6 sm:mb-10 relative">
      <div className="absolute top-0 right-0"><ThemeToggle /></div>

      <div className="flex justify-center mb-3 sm:mb-5">
        <div className="relative inline-flex">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl gradient-primary flex items-center justify-center shadow-2xl animate-glow-pulse animate-float">
            <Rocket className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 dark:bg-amber-300 flex items-center justify-center shadow-lg">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-900" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3">
        <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
          MLOps Project
        </span>
        <br />
        <span className="text-foreground">Generator</span>
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-7 px-2">
        Generate <span className="font-semibold text-foreground">production-ready</span> MLOps project templates with cloud deployment, experiment tracking, and modern ML workflows — in seconds.
      </p>

      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 px-2">
        {FEATURE_BADGES.map(({ icon: Icon, label, cls }, i) => (
          <span
            key={label}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold border ${cls} animate-badge-pop`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(" ")[0]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
