export function AmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
      <div className="mesh-blob w-[700px] h-[700px] -top-64 -left-64 text-violet-400/15 dark:text-violet-500/10 animate-mesh" />
      <div
        className="mesh-blob w-[600px] h-[600px] top-1/3 -right-64 text-cyan-400/15 dark:text-cyan-500/10"
        style={{ animation: "mesh-move 14s ease-in-out infinite reverse" }}
      />
      <div
        className="mesh-blob w-[500px] h-[500px] bottom-0 left-1/4 text-indigo-400/12 dark:text-indigo-500/8"
        style={{ animation: "mesh-move 16s ease-in-out infinite" }}
      />
    </div>
  )
}
