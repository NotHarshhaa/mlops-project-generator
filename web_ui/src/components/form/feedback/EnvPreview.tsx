"use client"

import { useState, useMemo } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import type { FormValues } from "../schema"

interface EnvPreviewProps {
  values: FormValues
}

export function EnvPreview({ values }: EnvPreviewProps) {
  const [copied, setCopied] = useState(false)

  const envContent = useMemo(() => {
    const lines: string[] = [
      `# ─── Environment Specification for ${values.project_name || "mlops-project"} ───`,
      `PROJECT_NAME=${values.project_name || "mlops-project"}`,
      `ENVIRONMENT=production`,
      `LOG_LEVEL=INFO`,
      `PYTHONPATH=./src`,
    ]

    if (values.experiment_tracking === "mlflow") {
      lines.push(
        "",
        "# ─── MLflow Tracking Server ───",
        "MLFLOW_TRACKING_URI=http://localhost:5000",
        `MLFLOW_EXPERIMENT_NAME=${values.project_name || "mlops"}-experiment`,
      )
    } else if (values.experiment_tracking === "wandb") {
      lines.push(
        "",
        "# ─── Weights & Biases ───",
        "WANDB_API_KEY=your_wandb_api_key_here",
        `WANDB_PROJECT=${values.project_name || "mlops"}-project`,
        "WANDB_WATCH=all",
      )
    }

    if (values.deployment === "fastapi" || values.deployment === "docker") {
      lines.push(
        "",
        "# ─── Serving & API ───",
        "API_HOST=0.0.0.0",
        "API_PORT=8000",
        "WORKERS_COUNT=4",
        "TIMEOUT_KEEP_ALIVE=65",
      )
    }

    if (values.orchestration === "airflow") {
      lines.push(
        "",
        "# ─── Apache Airflow DAG ───",
        "AIRFLOW_HOME=./airflow",
        "AIRFLOW__CORE__LOAD_EXAMPLES=False",
      )
    }

    if (values.monitoring === "evidently") {
      lines.push(
        "",
        "# ─── Evidently AI Drift Monitoring ───",
        "EVIDENTLY_WORKSPACE_PATH=./workspace",
        "DRIFT_CONFIDENCE_THRESHOLD=0.95",
      )
    }

    if (values.cloud_provider === "aws") {
      lines.push(
        "",
        "# ─── Amazon Web Services ───",
        "AWS_DEFAULT_REGION=us-east-1",
        "AWS_ACCESS_KEY_ID=your_access_key",
        "AWS_SECRET_ACCESS_KEY=your_secret_key",
        `SAGEMAKER_ROLE_ARN=arn:aws:iam::123456789012:role/SageMakerExecutionRole`,
      )
    } else if (values.cloud_provider === "gcp") {
      lines.push(
        "",
        "# ─── Google Cloud Platform ───",
        "GCP_PROJECT_ID=your-gcp-project-id",
        "GCP_REGION=us-central1",
        "GOOGLE_APPLICATION_CREDENTIALS=./secrets/gcp_service_account.json",
      )
    } else if (values.cloud_provider === "azure") {
      lines.push(
        "",
        "# ─── Microsoft Azure ───",
        "AZURE_SUBSCRIPTION_ID=your-subscription-id",
        "AZURE_RESOURCE_GROUP=your-resource-group",
        "AZURE_WORKSPACE_NAME=your-ml-workspace",
      )
    }

    return lines.join("\n")
  }, [values])

  const handleCopy = () => {
    navigator.clipboard.writeText(envContent)
    setCopied(true)
    toast.success("Environment variable specification (.env) copied.")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-black/20 p-5 sm:p-6 animate-monograph-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-black/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1925aa]" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
              [ SECRETS & RUNTIME ENVIRONMENT SPECIFICATION ]
            </p>
          </div>
          <h3 className="font-editorial text-lg text-black uppercase font-semibold mt-0.5">
            Generated .env.example Manifest
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="btn-monograph text-[10px] py-1.5 px-3 self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy .env Specification"}</span>
        </button>
      </div>

      <pre className="p-4 bg-[#e8e6e0]/35 border border-black/15 font-mono text-xs leading-relaxed text-black overflow-x-auto max-h-56">
        <code>{envContent}</code>
      </pre>
    </div>
  )
}
