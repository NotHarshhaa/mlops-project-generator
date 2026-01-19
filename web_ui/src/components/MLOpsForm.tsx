"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { OptionCards } from "@/components/OptionCards"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Loader2, Download, Rocket, Settings, Info, User, FileText } from "lucide-react"

const formSchema = z.object({
  framework: z.string().optional(),
  task_type: z.string().optional(),
  experiment_tracking: z.string().optional(),
  orchestration: z.string().optional(),
  deployment: z.string().optional(),
  monitoring: z.string().optional(),
  project_name: z.string().min(1, "Project name is required").max(50, "Project name must be 50 characters or less"),
  author_name: z.string().min(1, "Author name is required").max(100, "Author name must be 100 characters or less"),
  description: z.string().min(1, "Description is required")
}).refine((data) => {
  // Custom validation: all option fields must be selected before submission
  const requiredFields = ['framework', 'task_type', 'experiment_tracking', 'orchestration', 'deployment', 'monitoring'] as const
  const missingFields = requiredFields.filter(field => !data[field])
  return missingFields.length === 0
}, {
  message: "Please select an option for all categories before generating your project",
  path: ["framework"] // Show error on first field
})

type FormValues = z.infer<typeof formSchema>

interface Option {
  value: string
  label: string
  description: string
}

interface Options {
  framework: Option[]
  task_type: Option[]
  experiment_tracking: Option[]
  orchestration: Option[]
  deployment: Option[]
  monitoring: Option[]
}

export default function MLOpsForm() {
  const [options, setOptions] = useState<Options | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: "",
      task_type: "",
      experiment_tracking: "",
      orchestration: "",
      deployment: "",
      monitoring: "",
      project_name: "",
      author_name: "ML Engineer",
      description: "A production-ready ML project"
    }
  })

  // Fetch options on component mount
  useState(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/options")
        setOptions(response.data)
      } catch (error) {
        toast.error("Failed to load options. Please ensure the backend is running.")
      }
    }
    fetchOptions()
  })

  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/status/${taskId}`)
      const task = response.data
      
      if (task.status === "processing") {
        setProgress(50)
        setTimeout(() => checkTaskStatus(taskId), 2000)
      } else if (task.status === "completed") {
        setProgress(100)
        setDownloadUrl(`http://localhost:8000${task.download_url}`)
        toast.success("Project generated successfully!")
        setIsGenerating(false)
      } else if (task.status === "failed") {
        toast.error(`Generation failed: ${task.message}`)
        setIsGenerating(false)
        setProgress(0)
      }
    } catch (error) {
      toast.error("Failed to check task status")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true)
    setProgress(10)
    
    try {
      const response = await axios.post("http://localhost:8000/api/generate", values)
      const task = response.data
      
      setTaskId(task.task_id)
      setProgress(25)
      toast.success("Project generation started!")
      
      // Start polling for status
      setTimeout(() => checkTaskStatus(task.task_id), 1000)
      
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to generate project")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleDownload = () => {
    if (downloadUrl && taskId) {
      window.open(`${downloadUrl}?filename=${taskId}.zip`, "_blank")
    }
  }

  if (!options) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">MLOps Project Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate production-ready MLOps project templates with best practices built-in
          </p>
        </div>

        {/* Main Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Project Configuration
            </CardTitle>
            <CardDescription>
              Choose your ML stack and deployment preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8">
                  {/* Framework Selection */}
                  <FormField
                    control={form.control}
                    name="framework"
                    render={({ field }) => (
                      <FormItem>
                        <OptionCards
                          options={options.framework}
                          value={field.value}
                          onChange={field.onChange}
                          title="ML Framework"
                          description="Choose the machine learning framework for your project"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Task Type */}
                  <FormField
                    control={form.control}
                    name="task_type"
                    render={({ field }) => (
                      <FormItem>
                        <OptionCards
                          options={options.task_type}
                          value={field.value}
                          onChange={field.onChange}
                          title="Task Type"
                          description="Select the type of machine learning task"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Experiment Tracking */}
                  <FormField
                    control={form.control}
                    name="experiment_tracking"
                    render={({ field }) => (
                      <FormItem>
                        <OptionCards
                          options={options.experiment_tracking}
                          value={field.value}
                          onChange={field.onChange}
                          title="Experiment Tracking"
                          description="Choose how to track your ML experiments"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Orchestration */}
                  <FormField
                    control={form.control}
                    name="orchestration"
                    render={({ field }) => (
                      <FormItem>
                        <OptionCards
                          options={options.orchestration}
                          value={field.value}
                          onChange={field.onChange}
                          title="Orchestration"
                          description="Select workflow orchestration for your ML pipelines"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deployment */}
                  <FormField
                    control={form.control}
                    name="deployment"
                    render={({ field }) => (
                      <FormItem>
                        <OptionCards
                          options={options.deployment}
                          value={field.value}
                          onChange={field.onChange}
                          title="Deployment"
                          description="Choose how to deploy your ML model"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Monitoring */}
                  <FormField
                    control={form.control}
                    name="monitoring"
                    render={({ field }) => (
                      <FormItem>
                        <OptionCards
                          options={options.monitoring}
                          value={field.value}
                          onChange={field.onChange}
                          title="Monitoring"
                          description="Select monitoring solution for your ML models"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Enhanced Separator */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
                      <p className="text-sm text-gray-600">Configure your project metadata</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Project Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="project_name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Info className="w-3 h-3 text-blue-600" />
                            </div>
                            <span>Project Name</span>
                            <div className="group relative">
                              <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center cursor-help">
                                <span className="text-xs text-gray-600">?</span>
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                Use lowercase, hyphens, and underscores only. Max 50 characters.
                              </div>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="my-ml-project" 
                              className="font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Examples: sentiment-analysis, image_classifier, sales-forecast
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author_name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-lg bg-green-100 flex items-center justify-center">
                              <User className="w-3 h-3 text-green-600" />
                            </div>
                            <span>Author Name</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your Name" 
                              className="font-medium border-gray-200 focus:border-green-500 focus:ring-green-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Your name or team name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-lg bg-purple-100 flex items-center justify-center">
                            <FileText className="w-3 h-3 text-purple-600" />
                          </div>
                          <span>Project Description</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A production-ready ML project for sentiment analysis using transformer models..."
                            className="min-h-[120px] resize-none border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Brief description of your ML project, its purpose, and key features
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Progress */}
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating project...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Download Button */}
                {downloadUrl && (
                  <Button 
                    type="button" 
                    onClick={handleDownload}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Project
                  </Button>
                )}

                {/* Generate Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Generate Project
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
