"use client"

import { CheckCircle2, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
  onReset: () => void
}

const TAGS = ["Production ready", "Best practices", "Scalable", "Cloud native", "CI/CD ready"]

export function SuccessDialog({ open, onOpenChange, onDownload, onReset }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[95vw] panel border-0 p-0 gap-0 overflow-hidden">
        <div className="p-6 sm:p-8">
          <DialogHeader className="text-left space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-mono-label text-primary">Complete</p>
                <DialogTitle className="font-display text-xl font-bold">Project generated</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                  Your MLOps scaffold is packaged and ready to download.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-4 mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              The archive includes training scripts, configs, deployment templates, and tooling
              aligned with your selected stack.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono-label border border-primary/25 bg-primary/8 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onDownload}
              className="flex-1 h-11 rounded-lg gradient-primary btn-shine border-0 text-primary-foreground font-semibold"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download ZIP
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 h-11 rounded-lg btn-ghost-panel font-semibold"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
