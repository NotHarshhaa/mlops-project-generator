export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-30 dark:opacity-20"
        style={{ background: "radial-gradient(circle, var(--glow-amber), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full opacity-25 dark:opacity-15"
        style={{ background: "radial-gradient(circle, var(--glow-cyan), transparent 70%)" }}
      />
    </div>
  )
}
