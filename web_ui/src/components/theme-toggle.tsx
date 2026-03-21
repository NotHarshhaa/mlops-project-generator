"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center">
        <Sun className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-9 h-9 rounded-xl bg-card/80 border border-border/60 hover:border-primary/30 hover:bg-primary/5 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md group"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 text-amber-500 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 text-indigo-400 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
    </button>
  )
}
