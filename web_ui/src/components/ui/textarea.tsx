import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground/60 selection:bg-[#1925aa] selection:text-[#ffffff] bg-[#ffffff] border border-black/20 flex min-h-20 w-full rounded-none px-3 py-2 text-sm text-[#000000] shadow-none transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#1925aa] focus-visible:ring-0",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
