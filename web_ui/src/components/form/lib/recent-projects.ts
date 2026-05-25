import { RECENT_PROJECTS_MAX, RECENT_PROJECTS_STORAGE_KEY } from "../constants"

export interface RecentProject {
  id: string
  projectName: string
  framework: string
  taskType: string
  deployment: string
  downloadUrl: string
  generatedAt: string
  timestamp: number
}

export interface RecentProjectInput {
  projectName: string
  framework: string
  taskType: string
  deployment: string
  downloadUrl: string
}

export function loadRecentProjects(): RecentProject[] {
  try {
    const stored = localStorage.getItem(RECENT_PROJECTS_STORAGE_KEY)
    if (!stored) return []
    const projects = JSON.parse(stored) as RecentProject[]
    return projects
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, RECENT_PROJECTS_MAX)
  } catch {
    return []
  }
}

export function saveRecentProjects(projects: RecentProject[]): void {
  try {
    localStorage.setItem(RECENT_PROJECTS_STORAGE_KEY, JSON.stringify(projects.slice(0, RECENT_PROJECTS_MAX)))
  } catch (error) {
    console.error("Failed to save recent projects:", error)
  }
}

export function addRecentProject(input: RecentProjectInput): RecentProject[] {
  const newProject: RecentProject = {
    id: Date.now().toString(),
    projectName: input.projectName,
    framework: input.framework,
    taskType: input.taskType,
    deployment: input.deployment,
    downloadUrl: input.downloadUrl,
    generatedAt: new Date().toLocaleString(),
    timestamp: Date.now(),
  }
  const updated = [newProject, ...loadRecentProjects()].slice(0, RECENT_PROJECTS_MAX)
  saveRecentProjects(updated)
  return updated
}

export function removeRecentProject(projectId: string): RecentProject[] {
  const updated = loadRecentProjects().filter(p => p.id !== projectId)
  saveRecentProjects(updated)
  return updated
}

export function clearRecentProjects(): void {
  localStorage.removeItem(RECENT_PROJECTS_STORAGE_KEY)
}
