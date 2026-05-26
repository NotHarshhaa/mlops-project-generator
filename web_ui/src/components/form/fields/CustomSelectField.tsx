"use client"

import { useState, useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ChevronDown, Check } from "lucide-react"
import type { FormValues } from "../schema"

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface CustomSelectFieldProps {
  name: keyof FormValues
  label: string
  description: string
  options: SelectOption[]
  placeholder: string
}

export function CustomSelectField({ name, label, description, options, placeholder }: CustomSelectFieldProps) {
  const form = useFormContext<FormValues>()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fieldValue = form.watch(name)
  const selectedOption = options.find(opt => opt.value === fieldValue)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleSelect = (value: string) => {
    form.setValue(name, value)
    setIsOpen(false)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem data-field={name} className="space-y-1.5 sm:space-y-2">
          <FormLabel className="font-mono-label text-foreground/90">{label}</FormLabel>
          <div className="relative" ref={dropdownRef}>
            <FormControl>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full min-h-9 sm:min-h-11 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between gap-2 border text-left ${
                  fieldValue
                    ? "bg-card border-primary/50 shadow-[0_0_0_1px] shadow-primary/10"
                    : "bg-muted/30 border-border hover:border-primary/35"
                }`}
              >
                <span className={`text-xs sm:text-sm font-medium truncate ${!fieldValue ? "text-muted-foreground" : "text-foreground"}`}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {fieldValue && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/15 text-primary">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>
            </FormControl>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 sm:mt-1.5 rounded-lg overflow-hidden animate-slide-in-up border border-border bg-popover shadow-2xl shadow-black/30">
                <div className="max-h-48 sm:max-h-56 overflow-y-auto">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 transition-colors border-b border-border/40 last:border-0 ${
                        fieldValue === option.value
                          ? "bg-primary/10"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className={`text-sm font-semibold block ${fieldValue === option.value ? "text-primary" : "text-foreground"}`}>
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="text-xs text-muted-foreground mt-0.5 block truncate">{option.description}</span>
                          )}
                        </div>
                        {fieldValue === option.value && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <FormDescription className="text-xs text-muted-foreground">{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
