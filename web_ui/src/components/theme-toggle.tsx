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
    return <div className="w-9 h-9 rounded-lg border border-border bg-muted/50" />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative btn-ghost-panel w-9 h-9 rounded-lg flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 text-primary rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 text-accent rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}
