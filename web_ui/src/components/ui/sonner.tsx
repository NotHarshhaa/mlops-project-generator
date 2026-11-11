"use client"

import {
  CheckIcon,
  InfoIcon,
  Loader2Icon,
  XIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group font-mono text-xs"
      icons={{
        success: <CheckIcon className="size-3.5 text-[#1925aa]" />,
        info: <InfoIcon className="size-3.5 text-[#1925aa]" />,
        warning: <AlertTriangleIcon className="size-3.5 text-amber-700" />,
        error: <XIcon className="size-3.5 text-red-600" />,
        loading: <Loader2Icon className="size-3.5 animate-spin text-[#1925aa]" />,
      }}
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#000000",
          border: "1px solid rgba(0, 0, 0, 0.25)",
          borderRadius: "0px",
          fontFamily: "var(--font-gt-america-mono), monospace",
          fontSize: "12px",
          boxShadow: "none",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
