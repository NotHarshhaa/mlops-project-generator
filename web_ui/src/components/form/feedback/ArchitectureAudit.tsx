"use client"

import { useMemo } from "react"
import { Check, AlertTriangle, ShieldCheck, Info } from "lucide-react"
import type { FormValues } from "../schema"

interface ArchitectureAuditProps {
  values: FormValues
}

export function ArchitectureAudit({ values }: ArchitectureAuditProps) {
  const audit = useMemo(() => {
    let score = 0
    const checks = [
      { name: "Model Engine (Framework)", passed: !!values.framework, weight: 20 },
      { name: "Task Specification (Objective)", passed: !!values.task_type, weight: 15 },
      { name: "Artifact Lineage (Tracking)", passed: !!values.experiment_tracking && values.experiment_tracking !== "none", weight: 20 },
      { name: "Automated DAGs (Orchestration)", passed: !!values.orchestration && values.orchestration !== "none", weight: 15 },
      { name: "Inference Serving (Deployment)", passed: !!values.deployment, weight: 20 },
      { name: "Drift Defense (Monitoring)", passed: !!values.monitoring && values.monitoring !== "none", weight: 10 },
    ]

    checks.forEach((c) => {
      if (c.passed) score += c.weight
    })

    let grade = "INCOMPLETE SPECIFICATION"
    let gradeColor = "text-black/50"
    if (score >= 90) {
      grade = "ENTERPRISE GRADE MLOPS"
      gradeColor = "text-[#1925aa] font-bold"
    } else if (score >= 70) {
      grade = "PRODUCTION DEPLOYABLE"
      gradeColor = "text-black font-bold"
    } else if (score >= 45) {
      grade = "RESEARCH / PROTOTYPE"
      gradeColor = "text-black"
    }

    const recommendations: string[] = []
    if (!values.experiment_tracking || values.experiment_tracking === "none") {
      recommendations.push("Configuring MLflow or W&B enables automated parameter logging, loss curves, and artifact versioning.")
    }
    if (!values.monitoring || values.monitoring === "none") {
      recommendations.push("Enabling Evidently AI integrates statistical data drift tests and target distribution monitoring.")
    }
    if (!values.orchestration || values.orchestration === "none") {
      recommendations.push("Adding Apache Airflow or Kubeflow provides scheduled retraining DAGs with retry policies.")
    }
    if (values.cloud_provider && !values.cloud_service) {
      recommendations.push("Select a specific cloud service (e.g. SageMaker, Vertex AI) to include cloud-native infrastructure scripts.")
    }

    return { score, checks, grade, gradeColor, recommendations }
  }, [values])

  return (
    <div className="bg-white border border-black/20 p-5 sm:p-6 animate-monograph-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-black/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1925aa]" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
              [ ARCHITECTURAL READINESS AUDIT ]
            </p>
          </div>
          <h3 className="font-editorial text-lg text-black uppercase font-semibold mt-0.5">
            Production Maturity Index
          </h3>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span className="text-xs uppercase text-black/60">Rating:</span>
          <span className={`text-xs uppercase tracking-wider ${audit.gradeColor}`}>
            {audit.grade}
          </span>
          <span className="font-display text-2xl text-[#1925aa] tabular-nums">
            {audit.score}%
          </span>
        </div>
      </div>

      {/* Pillar Checklist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {audit.checks.map((check) => (
          <div
            key={check.name}
            className={`p-2.5 border font-mono text-[11px] flex items-center justify-between gap-2 ${
              check.passed
                ? "bg-[#e8e6e0]/40 border-black/20 text-black"
                : "bg-black/5 border-dashed border-black/20 text-black/40"
            }`}
          >
            <span className="truncate">{check.name}</span>
            {check.passed ? (
              <span className="w-4 h-4 flex items-center justify-center bg-[#1925aa] text-white shrink-0">
                <Check className="w-2.5 h-2.5" />
              </span>
            ) : (
              <span className="text-[10px] text-black/40">[--]</span>
            )}
          </div>
        ))}
      </div>

      {/* Advisory Notes */}
      {audit.recommendations.length > 0 && (
        <div className="p-3 bg-[#e8e6e0]/30 border border-black/10 space-y-1.5 font-mono text-xs">
          <p className="text-[10px] text-black/60 font-bold uppercase tracking-wider">
            [ ARCHITECTURAL ADVISORY NOTES ]
          </p>
          <ul className="space-y-1 text-black/75">
            {audit.recommendations.slice(0, 2).map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#1925aa] font-bold">→</span>
                <span className="text-[11px] leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
