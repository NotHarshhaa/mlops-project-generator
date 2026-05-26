import type { GeneratorConfig } from "../types"
import type { TemplateContext, VirtualFile } from "../types"

export function generateOrchestrationFiles(cfg: GeneratorConfig, ctx: TemplateContext): VirtualFile[] {
  const { project_name, orchestration } = cfg
  const { framework_display } = ctx
  const files: VirtualFile[] = []

  if (orchestration === "airflow") {
    files.push({
      path: "dags/ml_training_dag.py",
      content: `"""Airflow DAG — train ${project_name} (${framework_display})"""
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator

default_args = {
    "owner": "mlops",
    "depends_on_past": False,
    "email_on_failure": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="${project_name.replace(/-/g, "_")}_training",
    default_args=default_args,
    description="Train and package ${project_name} model",
    schedule_interval="@weekly",
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["mlops", "${project_name}"],
) as dag:
    train = BashOperator(
        task_id="train_model",
        bash_command="python src/train.py --config configs/config.yaml",
    )
    validate = BashOperator(
        task_id="validate_artifacts",
        bash_command="test -f models/production/model.pt || test -f models/production/model.pkl || test -f models/production/model.joblib",
    )
    train >> validate
`,
    })
    files.push({
      path: "dags/README.md",
      content: `# Airflow DAGs

Copy \`ml_training_dag.py\` to your Airflow \`dags/\` folder or set \`AIRFLOW__CORE__DAGS_FOLDER\` to this directory.

\`\`\`bash
airflow dags test ${project_name.replace(/-/g, "_")}_training $(date +%Y-%m-%d)
\`\`\`
`,
    })
  }

  if (orchestration === "kubeflow") {
    files.push({
      path: "pipelines/train_pipeline.py",
      content: `"""Kubeflow Pipelines — ${project_name} training"""
from kfp import dsl
from kfp.dsl import component, Input, Output, Model


@component(
    base_image="python:3.11-slim",
    packages_to_install=["pyyaml"],
)
def train_component(config_path: str) -> str:
    import subprocess
    import sys
    subprocess.run([sys.executable, "src/train.py", "--config", config_path], check=True)
    return "models/production"


@dsl.pipeline(
    name="${project_name}-train-pipeline",
    description="Train ${project_name} and publish model artifact",
)
def train_pipeline(config_path: str = "configs/config.yaml"):
    train = train_component(config_path=config_path)
    train.set_caching_options(enable_caching=True)


if __name__ == "__main__":
    from kfp.compiler import Compiler
    Compiler().compile(train_pipeline, package_path="pipelines/train_pipeline.yaml")
    print("Compiled pipelines/train_pipeline.yaml")
`,
    })
    files.push({
      path: "pipelines/README.md",
      content: `# Kubeflow Pipelines

\`\`\`bash
python pipelines/train_pipeline.py
# Upload pipelines/train_pipeline.yaml to your KFP UI
\`\`\`
`,
    })
  }

  return files
}
