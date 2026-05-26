import { Boxes } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV_LINKS = [
  { href: "#mission", label: "Mission" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#generator", label: "Generate" },
] as const

export function FormNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-3 min-w-0 hover:opacity-90 transition-opacity">
          <div className="relative flex-shrink-0 w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Boxes className="w-5 h-5 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 hidden xs:block sm:block">
            <p className="font-display font-bold text-sm sm:text-base leading-tight truncate">
              MLOps <span className="text-gradient">Generator</span>
            </p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1" aria-label="Page sections">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="status-live hidden lg:inline-flex">Ready</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
