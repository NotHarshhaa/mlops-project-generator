"use client"

import { useState, useEffect } from "react"
import { Download, Clock, FileText, Trash2, ExternalLink, FolderOpen } from "lucide-react"

interface RecentProject {
  id: string
  projectName: string
  framework: string
  taskType: string
  deployment: string
  downloadUrl: string
  generatedAt: string
  timestamp: number
}

export function RecentProjects() {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  // Load recent projects from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentMLOpsProjects')
    if (stored) {
      try {
        const projects = JSON.parse(stored)
        // Sort by timestamp (most recent first) and limit to 10
        const sortedProjects = projects
          .sort((a: RecentProject, b: RecentProject) => b.timestamp - a.timestamp)
          .slice(0, 10)
        setRecentProjects(sortedProjects)
      } catch (error) {
        console.error('Failed to load recent projects:', error)
      }
    }
  }, [])

  // Save to localStorage whenever projects change
  const saveToLocalStorage = (projects: RecentProject[]) => {
    try {
      localStorage.setItem('recentMLOpsProjects', JSON.stringify(projects))
    } catch (error) {
      console.error('Failed to save recent projects:', error)
    }
  }

  // Add a new project to recent projects
  const addRecentProject = (projectData: {
    projectName: string
    framework: string
    taskType: string
    deployment: string
    downloadUrl: string
  }) => {
    const newProject: RecentProject = {
      id: Date.now().toString(),
      projectName: projectData.projectName,
      framework: projectData.framework,
      taskType: projectData.taskType,
      deployment: projectData.deployment,
      downloadUrl: projectData.downloadUrl,
      generatedAt: new Date().toLocaleString(),
      timestamp: Date.now()
    }

    const updatedProjects = [newProject, ...recentProjects].slice(0, 10)
    setRecentProjects(updatedProjects)
    saveToLocalStorage(updatedProjects)
  }

  // Remove a project from recent projects
  const removeProject = (projectId: string) => {
    const updatedProjects = recentProjects.filter(p => p.id !== projectId)
    setRecentProjects(updatedProjects)
    saveToLocalStorage(updatedProjects)
  }

  // Clear all recent projects
  const clearAllProjects = () => {
    setRecentProjects([])
    localStorage.removeItem('recentMLOpsProjects')
  }

  // Format framework display name
  const formatFramework = (framework: string) => {
    return framework.charAt(0).toUpperCase() + framework.slice(1)
  }

  // Get relative time
  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  if (recentProjects.length === 0) {
    // Show demo state for development/testing
    return (
      <div className="mt-12 glass-card rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-primary/3 dark:from-primary/8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl icon-gradient-emerald flex items-center justify-center shadow-md">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">Recently Generated Projects</h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Your recently generated projects will appear here for quick download
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="p-4 sm:p-8 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">No Recent Projects Yet</h4>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-3 sm:mb-6">
            Generate your first MLOps project and it will appear here for quick access and download.
          </p>
          <div className="text-xs text-muted-foreground hidden sm:block">
            💡 Projects are stored locally in your browser and will remain available even after you close the tab.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 glass-card rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-primary/3 dark:from-primary/8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl icon-gradient-emerald flex items-center justify-center shadow-md">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">Recently Generated Projects</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {recentProjects.length} recent project{recentProjects.length > 1 ? 's' : ''} available for download
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {recentProjects.length > 0 && (
              <button
                onClick={clearAllProjects}
                className="px-2 sm:px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/5"
              >
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 sm:px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
            >
              {isExpanded ? 'Show Less' : 'Show All'}
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-4 sm:p-6 sm:p-8">
        <div className="space-y-3 sm:space-y-4">
          {recentProjects.slice(0, isExpanded ? recentProjects.length : 3).map((project) => (
            <div
              key={project.id}
              className="group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border/50 bg-card/50 hover:bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{project.projectName}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {formatFramework(project.framework)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mb-2 sm:mb-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span className="hidden sm:inline">{project.taskType}</span>
                      <span className="sm:hidden">{project.taskType.length > 10 ? project.taskType.slice(0, 10) + '...' : project.taskType}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline">{project.deployment}</span>
                      <span className="sm:hidden">{project.deployment.length > 10 ? project.deployment.slice(0, 10) + '...' : project.deployment}</span>
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

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => window.open(project.downloadUrl, '_blank')}
                    className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors group-hover:scale-105"
                    title="Download Project"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => removeProject(project.id)}
                    className="p-1.5 sm:p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from Recent"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {recentProjects.length > 3 && !isExpanded && (
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Show {recentProjects.length - 3} More Project{recentProjects.length - 3 > 1 ? 's' : ''}</span>
              <span className="sm:hidden">+{recentProjects.length - 3} More</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Export a function to add projects from other components
export function addRecentProject(projectData: {
  projectName: string
  framework: string
  taskType: string
  deployment: string
  downloadUrl: string
}) {
  // This function will be called from the main form component
  const event = new CustomEvent('addRecentProject', { detail: projectData })
  window.dispatchEvent(event)
}
