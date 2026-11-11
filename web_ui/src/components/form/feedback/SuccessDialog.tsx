"use client"

import { Check, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
  onReset: () => void
}

const SPEC_TAGS = [
  "PRODUCTION READY",
  "DETERMINISTIC BLUEPRINT",
  "DOCKERIZED TOPS",
  "CI/CD PIPELINES",
  "OBSERVABILITY HOOKS",
]

export function SuccessDialog({ open, onOpenChange, onDownload, onReset }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] bg-[#ffffff] border border-black/30 p-6 sm:p-8 rounded-none shadow-none">
        <DialogHeader className="pb-4 border-b border-black/15">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#1925aa] text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#1925aa] uppercase tracking-wider font-bold">
                [ COMPILATION SUCCESSFUL ]
              </p>
              <DialogTitle className="font-display text-2xl font-normal text-black uppercase mt-0.5">
                Repository Package Compiled
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-black/60 mt-1">
                Your standalone MLOps project scaffold is packaged and ready for deployment.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-[#e8e6e0]/50 border border-black/10">
            <p className="font-mono text-xs text-black/80 leading-relaxed mb-3">
              The archive contains training pipelines, serving endpoints, experiment logging configurations, and testing suites structured according to production MLOps engineering standards.
            </p>
            <div className="flex flex-wrap gap-1">
              {SPEC_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 border border-black/15 bg-white font-mono text-[9px] uppercase tracking-tight text-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={onDownload}
              className="flex-1 h-12 bg-[#000000] text-[#e8e6e0] hover:bg-[#1925aa] hover:text-white rounded-none font-mono text-xs uppercase tracking-wider"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download ZIP Archive
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 h-12 rounded-none font-mono text-xs uppercase tracking-wider border-black/30 hover:border-[#1925aa]"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
