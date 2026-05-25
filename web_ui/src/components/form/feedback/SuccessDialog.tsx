"use client"

import { CheckCircle, Download, Rocket, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
  onReset: () => void
}

export function SuccessDialog({ open, onOpenChange, onDownload, onReset }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] glass-card border-0 rounded-3xl overflow-hidden p-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />

        <div className="p-6 sm:p-8">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/30 animate-glow-pulse">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">Project Generated! 🎉</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                  Your production-ready MLOps project is ready
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="glass-card rounded-2xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/25 flex-shrink-0 animate-float">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">Congratulations!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Your MLOps project has been generated with best practices, optimized for production deployment and scalability.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {["Production Ready", "Best Practices", "Scalable", "Cloud Native", "CI/CD Ready"].map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onDownload}
              className="flex-1 h-12 rounded-2xl gradient-primary btn-shine shadow-lg shadow-primary/25 border-0 text-white font-semibold"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Project
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-border/70 font-semibold hover:bg-muted/60"
              size="lg"
            >
              <Settings className="h-5 w-5 mr-2" />
              Generate Another
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
