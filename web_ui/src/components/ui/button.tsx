import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-mono tracking-wider uppercase transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-1 focus-visible:outline-[#1925aa] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-[#000000] text-[#e8e6e0] hover:bg-[#1925aa] hover:text-[#ffffff]",
        indigo: "bg-[#1925aa] text-[#ffffff] hover:bg-[#0d1355]",
        paper: "bg-[#ffffff] text-[#000000] border border-black/20 hover:border-[#1925aa] hover:text-[#1925aa]",
        destructive: "bg-[#b91c1c] text-[#ffffff] hover:bg-black",
        outline: "border border-black/20 bg-transparent text-[#000000] hover:border-[#1925aa] hover:text-[#1925aa] hover:bg-[#1925aa]/5",
        ghost: "hover:bg-black/5 text-[#000000] hover:text-[#1925aa]",
        link: "text-[#1925aa] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-6 text-sm",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
