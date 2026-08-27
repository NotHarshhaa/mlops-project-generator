"use client"

import { useState, useEffect, useRef, useId, useCallback } from "react"
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
  disabled?: boolean
}

export function CustomSelectField({
  name,
  label,
  description,
  options,
  placeholder,
  disabled = false,
}: CustomSelectFieldProps) {
  const form = useFormContext<FormValues>()
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listboxId = useId()
  const labelId = useId()

  const fieldValue = form.watch(name)
  const selectedOption = options.find(opt => opt.value === fieldValue)
  const isDisabled = disabled || options.length === 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleSelect = useCallback((value: string) => {
    form.setValue(name, value)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }, [form, name])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setIsOpen(true)
        const currentIndex = options.findIndex(o => o.value === fieldValue)
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
      }
      return
    }

    if (e.key === "Escape" || e.key === "Tab") {
      setIsOpen(false)
      setFocusedIndex(-1)
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1))
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (focusedIndex >= 0 && focusedIndex < options.length) {
        handleSelect(options[focusedIndex].value)
      }
    }
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem data-field={name} className="space-y-1.5 sm:space-y-2">
          <FormLabel id={labelId} className="font-mono-label text-foreground/90">{label}</FormLabel>
          <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
            <FormControl>
              <button
                ref={buttonRef}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={labelId}
                aria-controls={isOpen ? listboxId : undefined}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    setIsOpen(!isOpen)
                    if (!isOpen) {
                      const idx = options.findIndex(o => o.value === fieldValue)
                      setFocusedIndex(idx >= 0 ? idx : 0)
                    }
                  }
                }}
                className={`w-full min-h-9 sm:min-h-11 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between gap-2 border text-left ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-muted/20 border-border"
                    : fieldValue
                    ? "bg-card border-primary/50 shadow-[0_0_0_1px] shadow-primary/10 cursor-pointer"
                    : "bg-muted/30 border-border hover:border-primary/35 cursor-pointer"
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

            {isOpen && options.length > 0 && (
              <div
                id={listboxId}
                role="listbox"
                aria-labelledby={labelId}
                className="absolute top-full left-0 right-0 z-50 mt-1 sm:mt-1.5 rounded-lg overflow-hidden animate-slide-in-up border border-border bg-popover shadow-2xl shadow-black/30"
              >
                <div className="max-h-48 sm:max-h-56 overflow-y-auto">
                  {options.map((option, idx) => {
                    const isSelected = fieldValue === option.value
                    const isFocused = focusedIndex === idx
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        onClick={() => handleSelect(option.value)}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 transition-colors border-b border-border/40 last:border-0 ${
                          isSelected
                            ? "bg-primary/15"
                            : isFocused
                            ? "bg-muted/80"
                            : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className={`text-sm font-semibold block ${isSelected ? "text-primary font-bold" : "text-foreground"}`}>
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-xs text-muted-foreground mt-0.5 block truncate">{option.description}</span>
                            )}
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
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

