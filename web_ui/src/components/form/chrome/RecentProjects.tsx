"use client"

import { useState } from "react"
import { Download, Clock, FileText, Trash2, ExternalLink, FolderOpen } from "lucide-react"
import { useRecentProjects } from "../hooks/useRecentProjects"
import type { RecentProject } from "../lib/recent-projects"

function formatFramework(framework: string) {
  return framework.charAt(0).toUpperCase() + framework.slice(1)
}

function getRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  return `${days} day${days > 1 ? "s" : ""} ago`
}

function RecentProjectsEmpty() {
  return (
    <div className="p-5 sm:p-10 text-center">
      <div className="icon-chip icon-chip-cyan w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl mx-auto mb-3 sm:mb-4">
        <FolderOpen className="w-5 h-5 sm:w-7 sm:h-7" />
      </div>
      <h4 className="font-display text-base sm:text-lg font-bold text-foreground mb-1.5 sm:mb-2">No archives yet</h4>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-2 sm:mb-6 leading-snug">
        Generate your first MLOps project and it will appear here for quick access and download.
      </p>
      <div className="text-xs text-muted-foreground hidden sm:block">
        💡 Projects are stored locally in your browser and will remain available even after you close the tab.
      </div>
    </div>
  )
}

function RecentProjectRow({
  project,
  onRemove,
}: {
  project: RecentProject
  onRemove: (id: string) => void
}) {
  return (
    <div className="group relative p-3 sm:p-4 rounded-lg border border-border/60 bg-muted/15 hover:bg-muted/30 transition-all duration-200 hover:border-primary/35">
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{project.projectName}</h4>
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {formatFramework(project.framework)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-3">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">{project.taskType}</span>
              <span className="sm:hidden">{project.taskType.length > 10 ? `${project.taskType.slice(0, 10)}...` : project.taskType}</span>
            </span>
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">{project.deployment}</span>
              <span className="sm:hidden">{project.deployment.length > 10 ? `${project.deployment.slice(0, 10)}...` : project.deployment}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getRelativeTime(project.timestamp)}
            </span>
          </div>

          <div className="text-xs text-muted-foreground hidden sm:block">
            Generated: {project.generatedAt}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => window.open(project.downloadUrl, "_blank")}
            className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors group-hover:scale-105"
            title="Download Project"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(project.id)}
            className="p-1.5 sm:p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
            title="Remove from Recent"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function RecentProjects() {
  const { projects, removeProject, clearAll } = useRecentProjects()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="mt-6 sm:mt-12 panel overflow-hidden">
      <div className="px-3 sm:px-8 py-3.5 sm:py-5 border-b border-border/80">
        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="icon-chip icon-chip-emerald flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-mono-label text-muted-foreground mb-0.5">History</p>
              <h3 className="font-display text-base sm:text-xl font-bold text-foreground leading-tight">Recent archives</h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 leading-snug">
                {projects.length === 0
                  ? "Your recently generated projects will appear here for quick download"
                  : `${projects.length} recent project${projects.length > 1 ? "s" : ""} available for download`}
              </p>
            </div>
          </div>
          {projects.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={clearAll}
                className="font-mono-label text-muted-foreground hover:text-destructive transition-colors px-1.5 sm:px-2 py-1 rounded hover:bg-destructive/5"
              >
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="font-mono-label text-primary border border-primary/30 rounded-lg px-1.5 sm:px-2 py-1 hover:bg-primary/8 transition-colors"
              >
                {isExpanded ? "Less" : "All"}
              </button>
            </div>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <RecentProjectsEmpty />
      ) : (
        <div className="p-3 sm:p-8">
          <div className="space-y-2 sm:space-y-4">
            {projects.slice(0, isExpanded ? projects.length : 3).map((project) => (
              <RecentProjectRow key={project.id} project={project} onRemove={removeProject} />
            ))}
          </div>

          {projects.length > 3 && !isExpanded && (
            <div className="mt-3 sm:mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">
                  Show {projects.length - 3} More Project{projects.length - 3 > 1 ? "s" : ""}
                </span>
                <span className="sm:hidden">+{projects.length - 3} More</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
