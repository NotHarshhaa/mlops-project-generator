import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GenerateButtonProps {
  isGenerating: boolean
}

export function GenerateButton({ isGenerating }: GenerateButtonProps) {
  return (
    <div className="pt-6 border-t border-black/15">
      <Button
        type="submit"
        className="w-full h-14 text-sm font-mono tracking-widest uppercase bg-[#000000] text-[#e8e6e0] hover:bg-[#1925aa] hover:text-[#ffffff] transition-colors rounded-none border border-black shadow-none flex items-center justify-between px-6"
        disabled={isGenerating}
        size="lg"
      >
        {isGenerating ? (
          <div className="flex items-center gap-3 w-full justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-[#1925aa]" />
            <span className="font-mono text-xs">Compiling Production Archive…</span>
          </div>
        ) : (
          <>
            <span className="font-mono text-xs tracking-widest font-bold">
              [ EXECUTE COMPILATION // COMPILE MLOPS REPOSITORY ]
            </span>
            <span className="flex items-center gap-2 font-mono text-xs">
              DOWNLOAD ZIP ARCHIVE
              <ArrowRight className="h-4 w-4" />
            </span>
          </>
        )}
      </Button>

      <div className="mt-3 text-center">
        <p className="font-mono text-[10px] text-black/55 uppercase tracking-wider">
          STANDALONE REPOSITORY SCAFFOLD · DETERMINISTIC PYTHON 3.10+ OUTPUT · ZERO SERVER RETENTION
        </p>
      </div>
    </div>
  )
}
