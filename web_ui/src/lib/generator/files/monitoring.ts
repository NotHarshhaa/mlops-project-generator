import type { GeneratorConfig } from "../types"
import type { TemplateContext, VirtualFile } from "../types"

export function generateMonitoringFiles(cfg: GeneratorConfig, ctx: TemplateContext): VirtualFile[] {
  const { monitoring, project_name } = cfg
  const { framework, task_type } = ctx
  const files: VirtualFile[] = []

  if (monitoring === "evidently") {
    files.push({
      path: "scripts/monitoring/drift_report.py",
      content: `#!/usr/bin/env python3
"""Evidently drift & quality report for ${project_name}"""
import argparse
from pathlib import Path

import pandas as pd
from evidently import ColumnMapping
from evidently.metric_preset import DataDriftPreset, DataQualityPreset
from evidently.report import Report


def load_reference(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


def load_current(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


def main():
    parser = argparse.ArgumentParser(description="Generate Evidently monitoring report")
    parser.add_argument("--reference", default="data/processed/reference.csv")
    parser.add_argument("--current", default="data/processed/current.csv")
    parser.add_argument("--output", default="reports/evidently_report.html")
    args = parser.parse_args()

    ref = load_reference(args.reference)
    cur = load_current(args.current)

    target = "target" if "target" in ref.columns else ref.columns[-1]
    mapping = ColumnMapping(target=target, task="${task_type === "classification" ? "classification" : "regression"}")

    report = Report(metrics=[DataDriftPreset(), DataQualityPreset()])
    report.run(reference_data=ref, current_data=cur, column_mapping=mapping)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    report.save_html(str(out))
    print(f"Report saved to {out}")


if __name__ == "__main__":
    main()
`,
    })
    files.push({
      path: "scripts/monitoring/schedule_checks.sh",
      content: `#!/bin/bash
# Example cron: 0 6 * * * /path/to/schedule_checks.sh
set -e
python scripts/monitoring/drift_report.py --reference data/processed/reference.csv --current data/processed/current.csv
`,
    })
  }

  if (monitoring === "custom") {
    files.push({
      path: "scripts/monitoring/metrics_collector.py",
      content: `#!/usr/bin/env python3
"""Custom metrics collector for ${project_name}"""
import json
import logging
from datetime import datetime, timezone
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def collect_metrics(predictions_path: str, output_path: str = "reports/metrics.json") -> dict:
    """Aggregate prediction outputs into a metrics payload."""
    path = Path(predictions_path)
    if not path.exists():
        logger.warning("Predictions file not found: %s", path)
        return {"status": "no_data", "timestamp": datetime.now(timezone.utc).isoformat()}

    payload = {
        "project": "${project_name}",
        "framework": "${framework}",
        "task_type": "${task_type}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "predictions_file": str(path),
        "status": "ok",
    }

    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2))
    logger.info("Metrics written to %s", out)
    return payload


if __name__ == "__main__":
    collect_metrics("data/processed/predictions.csv")
`,
    })
  }

  return files
}
