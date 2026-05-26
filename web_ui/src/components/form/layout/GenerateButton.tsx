import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GenerateButtonProps {
  isGenerating: boolean
}

export function GenerateButton({ isGenerating }: GenerateButtonProps) {
  return (
    <div className="pt-0 sm:pt-2">
      <Button
        type="submit"
        className="w-full h-11 sm:h-14 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl gradient-primary btn-shine border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-primary-foreground"
        disabled={isGenerating}
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
            Generating archive…
          </>
        ) : (
          <>
            Generate project
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          </>
        )}
      </Button>
      <p className="text-center font-mono-label text-muted-foreground mt-2 sm:mt-3 text-[10px] sm:text-[inherit]">
        Builds a downloadable ZIP with your full MLOps scaffold
      </p>
    </div>
  )
}
