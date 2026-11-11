"use client"

import { useState } from "react"
import { Download, Trash2, ArrowUpRight } from "lucide-react"
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
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function RecentProjectsEmpty() {
  return (
    <div className="p-8 text-center bg-white border border-black/15">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#1925aa] font-bold mb-1">
        [ ARCHIVE INDEX EMPTY ]
      </p>
      <h4 className="font-display text-xl text-black uppercase mb-2">No Past Compilations</h4>
      <p className="font-mono text-xs text-black/60 max-w-md mx-auto leading-relaxed">
        Generated repositories will be indexed in browser storage for instant re-download and stack restoration.
      </p>
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
  const handleLoadStack = () => {
    const configToLoad = project.formValues ?? {
      project_name: project.projectName,
      framework: project.framework,
      task_type: project.taskType,
      deployment: project.deployment,
    }
    window.dispatchEvent(new CustomEvent("loadMLOpsConfig", { detail: configToLoad }))
  }

  return (
    <div className="p-4 bg-white border border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#1925aa]">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="font-mono text-sm font-bold text-black truncate">{project.projectName}</h4>
          <span className="font-mono text-[9px] px-1.5 py-0.2 border border-black/20 bg-[#e8e6e0]/60 text-black uppercase">
            {formatFramework(project.framework)}
          </span>
          <span className="font-mono text-[9px] text-black/50 uppercase">
            {project.taskType} · {project.deployment}
          </span>
        </div>
        <p className="font-mono text-[10px] text-black/50">
          Compiled: {project.generatedAt} ({getRelativeTime(project.timestamp)})
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleLoadStack}
          className="btn-monograph-outline text-[10px] py-1.5 px-3"
          title="Restore stack matrix in generator"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-[#1925aa]" />
          <span>Restore Stack</span>
        </button>
        <button
          type="button"
          onClick={() => window.open(project.downloadUrl, "_blank")}
          className="btn-monograph text-[10px] py-1.5 px-3"
          title="Download Project Archive ZIP"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
        <button
          type="button"
          onClick={() => onRemove(project.id)}
          className="p-2 border border-black/15 hover:border-red-600 hover:text-red-600 text-black/40 transition-colors"
          title="Remove from history"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export function RecentProjects() {
  const { projects, removeProject, clearAll } = useRecentProjects()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-end justify-between gap-4 pb-3 mb-4 border-b border-black/15">
        <div>
          <p className="font-mono text-[10px] text-[#1925aa] uppercase tracking-wider font-bold mb-1">
            [ ARCHIVAL RECORD ]
          </p>
          <h3 className="font-display text-2xl text-black uppercase tracking-tight">
            Recent Compilations
          </h3>
          <p className="font-mono text-xs text-black/60 mt-0.5">
            {projects.length === 0
              ? "Archived builds will be preserved locally in your client environment."
              : `${projects.length} repository archive${projects.length > 1 ? "s" : ""} cached locally.`}
          </p>
        </div>

        {projects.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="font-mono text-[10px] text-black/50 hover:text-red-700 uppercase"
            >
              [ Clear All ]
            </button>
            {projects.length > 3 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="font-mono text-[10px] text-[#1925aa] hover:underline uppercase"
              >
                [ {isExpanded ? "Show Fewer" : `Show All (${projects.length})`} ]
              </button>
            )}
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <RecentProjectsEmpty />
      ) : (
        <div className="space-y-2">
          {projects.slice(0, isExpanded ? projects.length : 3).map((project) => (
            <RecentProjectRow key={project.id} project={project} onRemove={removeProject} />
          ))}
        </div>
      )}
    </section>
  )
}
