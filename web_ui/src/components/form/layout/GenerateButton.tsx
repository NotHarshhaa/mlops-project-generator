import { Loader2, Rocket, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GenerateButtonProps {
  isGenerating: boolean
}

export function GenerateButton({ isGenerating }: GenerateButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl gradient-primary btn-shine shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-0 text-white"
      disabled={isGenerating}
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
          Generating Your Project…
        </>
      ) : (
        <>
          <Rocket className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Generate Project
          <Sparkles className="h-3.5 h-3.5 sm:h-4 sm:w-4 ml-2 opacity-80" />
        </>
      )}
    </Button>
  )
}
