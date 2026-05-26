import type { GenerationProfile } from "../profiles"
import type { GeneratorConfig } from "../types"
import type { TemplateContext, VirtualFile } from "../types"

export function generateProfileFiles(
  cfg: GeneratorConfig,
  ctx: TemplateContext,
  profile: GenerationProfile,
): VirtualFile[] {
  const { project_name, framework, task_type, deployment, orchestration, monitoring } = ctx
  const files: VirtualFile[] = []

  if (profile.includeCi) {
    files.push({
      path: ".github/workflows/ci.yml",
      content: `name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11"]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Lint
        run: |
          flake8 src/ tests/ --max-line-length=120 || true
      - name: Test
        run: pytest tests/ -v
`,
    })
  }

  if (profile.includePreCommit) {
    files.push({
      path: ".pre-commit-config.yaml",
      content: `repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
`,
    })
  }

  if (profile.includeStarterNotebook) {
    files.push({
      path: "notebooks/01_exploration.ipynb",
      content: JSON.stringify({
        cells: [
          {
            cell_type: "markdown",
            metadata: {},
            source: [`# ${project_name} — Exploratory analysis\n`, "\n", "Generated starter notebook for research workflows."],
          },
          {
            cell_type: "code",
            execution_count: null,
            metadata: {},
            outputs: [],
            source: [
              "import pandas as pd\n",
              "import yaml\n",
              "\n",
              "with open('../configs/config.yaml') as f:\n",
              "    config = yaml.safe_load(f)\n",
              "\n",
              "print('Project:', config['project']['name'])\n",
              "print('Framework:', '" + framework + "')\n",
              "print('Task:', '" + task_type + "')\n",
            ],
          },
        ],
        metadata: {
          kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
        },
        nbformat: 4,
        nbformat_minor: 5,
      }, null, 2),
    })
  }

  if (profile.includeInsights) {
    files.push({
      path: "generation_insights.json",
      content: JSON.stringify(
        {
          project_name: cfg.project_name,
          stack: {
            framework: cfg.framework,
            task_type: cfg.task_type,
            experiment_tracking: cfg.experiment_tracking,
            orchestration: cfg.orchestration,
            deployment: cfg.deployment,
            monitoring: cfg.monitoring,
          },
          profiles: {
            preset_config: cfg.preset_config ?? null,
            custom_template: cfg.custom_template ?? null,
          },
          recommendations: buildRecommendations(cfg),
          generated_at: new Date().toISOString(),
        },
        null,
        2,
      ),
    })
  }

  return files
}

function buildRecommendations(cfg: GeneratorConfig): string[] {
  const tips: string[] = []
  if (cfg.experiment_tracking === "none") {
    tips.push("Consider enabling MLflow or W&B for experiment reproducibility.")
  }
  if (cfg.deployment === "fastapi" && !cfg.custom_template) {
    tips.push("Select the Microservice template for API middleware and health-check patterns.")
  }
  if (cfg.orchestration === "none" && cfg.deployment === "kubernetes") {
    tips.push("Kubernetes deployments pair well with Kubeflow orchestration.")
  }
  if (cfg.monitoring === "none" && cfg.preset_config === "production-ready") {
    tips.push("Enable Evidently monitoring for production drift detection.")
  }
  if (!cfg.cloud_provider) {
    tips.push("Add a cloud provider pack for managed deployment templates.")
  }
  if (tips.length === 0) {
    tips.push("Stack looks production-ready — run `make train` then `make inference` to validate locally.")
  }
  return tips
}
