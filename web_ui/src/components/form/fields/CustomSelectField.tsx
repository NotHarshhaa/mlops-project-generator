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
  const selectedOption = options.find((opt) => opt.value === fieldValue)
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

  const handleSelect = useCallback(
    (value: string) => {
      form.setValue(name, value)
      setIsOpen(false)
      setFocusedIndex(-1)
      buttonRef.current?.focus()
    },
    [form, name]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setIsOpen(true)
        const currentIndex = options.findIndex((o) => o.value === fieldValue)
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
      setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
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
        <FormItem data-field={name} className="space-y-1.5">
          <FormLabel id={labelId} className="font-mono text-[10px] tracking-tight uppercase text-black font-semibold flex items-center justify-between">
            <span>{label}</span>
            {fieldValue && (
              <span className="font-mono text-[9px] text-[#1925aa] font-bold">[ SPECIFIED ]</span>
            )}
          </FormLabel>

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
                      const idx = options.findIndex((o) => o.value === fieldValue)
                      setFocusedIndex(idx >= 0 ? idx : 0)
                    }
                  }
                }}
                className={`w-full min-h-10 px-3 py-2 text-left flex items-center justify-between gap-2 border transition-colors cursor-pointer select-none ${
                  isDisabled
                    ? "opacity-40 cursor-not-allowed bg-black/5 border-black/10"
                    : fieldValue
                    ? "bg-white border-[#1925aa] text-black"
                    : "bg-white border-black/20 hover:border-black/40 text-black"
                }`}
              >
                <span
                  className={`text-xs font-mono truncate ${
                    !fieldValue ? "text-black/40" : "text-black font-medium"
                  }`}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {fieldValue && (
                    <span className="w-4 h-4 flex items-center justify-center bg-[#1925aa] text-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-black/60 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
            </FormControl>

            {isOpen && options.length > 0 && (
              <div
                id={listboxId}
                role="listbox"
                aria-labelledby={labelId}
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-black/30 shadow-none animate-monograph-in"
              >
                <div className="max-h-60 overflow-y-auto">
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
                        className={`w-full text-left px-3 py-2.5 border-b border-black/10 last:border-b-0 transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#1925aa]/10 text-black"
                            : isFocused
                            ? "bg-black/5 text-black"
                            : "hover:bg-black/5 text-black"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span
                              className={`text-xs font-mono block ${
                                isSelected ? "text-[#1925aa] font-bold" : "text-black"
                              }`}
                            >
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-[10px] font-mono text-black/55 mt-0.5 block truncate">
                                {option.description}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <span className="w-3.5 h-3.5 flex items-center justify-center bg-[#1925aa] text-white shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <FormDescription className="font-mono text-[10px] text-black/60 leading-tight">
            {description}
          </FormDescription>
          <FormMessage className="font-mono text-[10px] text-red-600" />
        </FormItem>
      )}
    />
  )
}
