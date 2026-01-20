"use client"

import { Brain, BarChart, Microscope, GitBranch, Rocket, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Option {
  value: string
  label: string
  description: string
}

interface OptionCardsProps {
  options: Option[]
  value: string | undefined
  onChange: (value: string) => void
  title: string
  description?: string
}

const getIcon = (title: string, value: string) => {
  switch (title) {
    case "ML Framework":
      switch (value) {
        case "sklearn": return Brain
        case "pytorch": return Rocket
        case "tensorflow": return Shield
        default: return Brain
      }
    case "Task Type":
      switch (value) {
        case "classification": return BarChart
        case "regression": return Brain
        case "timeseries": return Microscope
        default: return BarChart
      }
    case "Experiment Tracking":
      return Microscope
    case "Orchestration":
      return GitBranch
    case "Deployment":
      return Rocket
    case "Monitoring":
      return Shield
    default:
      return Brain
  }
}

const getSectionIcon = (title: string) => {
  switch (title) {
    case "ML Framework":
      return Brain
    case "Task Type":
      return BarChart
    case "Experiment Tracking":
      return Microscope
    case "Orchestration":
      return GitBranch
    case "Deployment":
      return Rocket
    case "Monitoring":
      return Shield
    default:
      return Brain
  }
}

export function OptionCards({ options, value, onChange, title, description }: OptionCardsProps) {
  const handleOptionClick = (optionValue: string) => {
    // Toggle: if already selected, deselect; otherwise select
    if (value === optionValue) {
      onChange("") // Deselect
    } else {
      onChange(optionValue) // Select
    }
  }

  const SectionIcon = getSectionIcon(title)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-200 dark:border-zinc-700">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center flex-shrink-0">
          <SectionIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-zinc-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {options.map((option) => {
          const Icon = getIcon(title, option.value)
          return (
            <OptionCard
              key={option.value}
              option={option}
              Icon={Icon}
              isSelected={value === option.value}
              onClick={() => handleOptionClick(option.value)}
            />
          )
        })}
      </div>
    </div>
  )
}

interface OptionCardProps {
  option: Option
  Icon: any
  isSelected: boolean
  onClick: () => void
}

function OptionCard({ option, Icon, isSelected, onClick }: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-3 sm:p-4 pr-12 sm:pr-14 rounded-lg cursor-pointer transition-all duration-200 group block",
        isSelected
          ? "border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
          : "border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-transparent hover:border-zinc-400 dark:hover:border-zinc-600"
      )}
    >
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected
            ? "border-white dark:border-zinc-900 bg-white dark:bg-zinc-900"
            : "border-zinc-400 dark:border-zinc-600 bg-transparent"
        )}>
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
          )}
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3 pr-8">
        <div className="flex items-center space-x-2">
          <Icon className={cn(
            "w-4 h-4 sm:w-5 sm:h-5 transition-colors flex-shrink-0",
            isSelected 
              ? "text-white dark:text-zinc-900" 
              : "text-zinc-500 dark:text-zinc-500"
          )} />
          <h4 className={cn(
            "text-sm sm:text-base font-semibold transition-colors break-words",
            isSelected 
              ? "text-white dark:text-zinc-900" 
              : "text-zinc-900 dark:text-zinc-200"
          )}>
            {option.label}
          </h4>
        </div>
        <p className={cn(
          "text-xs sm:text-sm leading-relaxed transition-colors",
          isSelected 
            ? "text-zinc-200 dark:text-zinc-700" 
            : "text-zinc-600 dark:text-zinc-400"
        )}>
          {option.description}
        </p>
      </div>
    </div>
  )
}
