"use client"

import { useState, useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ChevronDown, Check } from "lucide-react"

interface Props {
  name: string
  label: string
  description: string
  options: Array<{ value: string; label: string; description?: string }>
  placeholder: string
}

export function CustomSelectField({ name, label, description, options, placeholder }: Props) {
  const form = useFormContext()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fieldValue = form.watch(name)
  const selectedOption = options.find(opt => opt.value === fieldValue)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
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
        <FormItem data-field={name}>
          <FormLabel className="text-sm font-semibold text-foreground">{label}</FormLabel>
          <div className="relative" ref={dropdownRef}>
            <FormControl>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-12 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between border ${
                  fieldValue
                    ? "bg-card dark:bg-card border-primary/50 dark:border-primary/40 shadow-sm shadow-primary/10"
                    : "bg-card dark:bg-card border-border hover:border-primary/40"
                }`}
              >
                <span className={`text-sm font-medium ${!fieldValue ? "text-muted-foreground" : "text-foreground"}`}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-2">
                  {fieldValue && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 dark:bg-primary/20">
                      <Check className="w-3 h-3 text-primary" />
                    </span>
                  )}
                  <div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </FormControl>

            {isOpen && (
              <div
                className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl overflow-hidden animate-slide-in-up border border-border shadow-xl shadow-black/20 dark:shadow-black/50"
                style={{ background: "var(--popover)" }}
              >
                <div className="max-h-60 overflow-y-auto" style={{ background: "var(--popover)" }}>
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-border/50 last:border-b-0 ${
                        fieldValue === option.value
                          ? "bg-primary/10 dark:bg-primary/20"
                          : "hover:bg-muted dark:hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${fieldValue === option.value ? "text-primary" : "text-foreground"}`}>
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="text-xs mt-0.5 text-muted-foreground">{option.description}</span>
                          )}
                        </div>
                        {fieldValue === option.value && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
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
