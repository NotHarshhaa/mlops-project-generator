"use client"

import { useCallback, useEffect, useState } from "react"
import {
  addRecentProject as persistRecentProject,
  clearRecentProjects,
  loadRecentProjects,
  removeRecentProject,
  type RecentProject,
  type RecentProjectInput,
} from "../lib/recent-projects"

export function useRecentProjects() {
  const [projects, setProjects] = useState<RecentProject[]>([])

  const reload = useCallback(() => {
    setProjects(loadRecentProjects())
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    const handleUpdate = () => reload()
    window.addEventListener("recentProjectsUpdated", handleUpdate)
    return () => window.removeEventListener("recentProjectsUpdated", handleUpdate)
  }, [reload])

  const addProject = useCallback((input: RecentProjectInput) => {
    setProjects(persistRecentProject(input))
  }, [])

  const removeProject = useCallback((projectId: string) => {
    setProjects(removeRecentProject(projectId))
  }, [])

  const clearAll = useCallback(() => {
    clearRecentProjects()
    setProjects([])
  }, [])

  return { projects, addProject, removeProject, clearAll, reload }
}
