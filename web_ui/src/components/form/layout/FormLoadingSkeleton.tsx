import { Loader2 } from "lucide-react"

export function FormLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#e8e6e0] flex flex-col">
      <div className="h-12 border-b border-black/15 bg-[#e8e6e0]" />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-black/20 p-8 sm:p-12 max-w-md w-full text-center space-y-4">
          <div className="w-10 h-10 bg-[#1925aa] text-white flex items-center justify-center mx-auto">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
              [ INITIALIZING SYSTEM ]
            </p>
            <h3 className="font-display text-xl text-black uppercase mt-1">
              Loading Configuration Matrix
            </h3>
            <p className="font-mono text-xs text-black/60 mt-1">
              Fetching framework schemas and deployment templates…
            </p>
          </div>
          <div className="h-1 bg-black/10 w-full overflow-hidden">
            <div className="h-full bg-[#1925aa] w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
