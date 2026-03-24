/**
 * Pure TypeScript MLOps project generator.
 * Replaces the Python CLI — runs natively in Next.js / Vercel edge runtimes.
 */

export interface GeneratorConfig {
  framework: "sklearn" | "pytorch" | "tensorflow"
  task_type: string
  experiment_tracking: string
  orchestration: string
  deployment: string
  monitoring: string
  project_name: string
  author_name: string
  description: string
  cloud_provider?: string
  cloud_service?: string
  preset_config?: string
  custom_template?: string
  enable_analytics?: boolean
}

/** A virtual file ready to be written into a ZIP */
export interface VirtualFile {
  path: string    // relative to project root
  content: string
}

// ─── Tiny Jinja2-compatible template engine ───────────────────────────────────
// Supports: {{ var }}, {{ var|title }}, {{ var|upper }}, {{ var|lower }}
// {% if expr %} … {% elif expr %} … {% else %} … {% endif %}
// {% if x in [a,b,c] %}, {% if x != y %}, {% if x == y %}

function renderTemplate(template: string, ctx: Record<string, any>): string {
  // 1. Process {% if / elif / else / endif %} blocks
  let result = processBlocks(template, ctx)
  // 2. Replace {{ var }} expressions
  result = result.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, expr) => {
    return evalExpr(expr.trim(), ctx)
  })
  return result
}

function evalExpr(expr: string, ctx: Record<string, any>): string {
  // Filters: {{ var|title }}, {{ var|upper }}, {{ var|lower }}
  const [rawVar, ...filters] = expr.split("|").map(s => s.trim())
  // Support method calls like author_name.lower().replace(' ', '_')
  let val = resolveVar(rawVar, ctx)
  for (const f of filters) {
    if (f === "title") val = toTitle(String(val))
    else if (f === "upper") val = String(val).toUpperCase()
    else if (f === "lower") val = String(val).toLowerCase()
  }
  return val === undefined || val === null ? "" : String(val)
}

function resolveVar(expr: string, ctx: Record<string, any>): any {
  // Handle method chains: author_name.lower().replace(' ', '_')
  try {
    const parts = expr.split(".")
    const base = ctx[parts[0]]
    if (parts.length === 1) return base
    // Simple chain evaluation
    let val = String(base ?? "")
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]
      if (part === "lower()") val = val.toLowerCase()
      else if (part === "upper()") val = val.toUpperCase()
      else if (part === "title()") val = toTitle(val)
      else if (part.startsWith("replace(")) {
        const m = part.match(/replace\(['"](.+?)['"],\s*['"](.+?)['"]\)/)
        if (m) val = val.split(m[1]).join(m[2])
      }
    }
    return val
  } catch {
    return ""
  }
}

function toTitle(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase())
}

function processBlocks(tmpl: string, ctx: Record<string, any>): string {
  // Split into tokens: text | {% tag %} 
  const tokenRe = /\{%[-\s]*([\s\S]*?)[-\s]*%\}/g
  const tokens: Array<{ type: "text" | "tag"; value: string }> = []
  let last = 0

  for (const match of tmpl.matchAll(tokenRe)) {
    if (match.index! > last) tokens.push({ type: "text", value: tmpl.slice(last, match.index) })
    tokens.push({ type: "tag", value: match[1].trim() })
    last = match.index! + match[0].length
  }
  if (last < tmpl.length) tokens.push({ type: "text", value: tmpl.slice(last) })

  return processTokens(tokens, 0, ctx).result
}

function processTokens(
  tokens: Array<{ type: "text" | "tag"; value: string }>,
  start: number,
  ctx: Record<string, any>
): { result: string; nextIndex: number } {
  let out = ""
  let i = start

  while (i < tokens.length) {
    const tok = tokens[i]

    if (tok.type === "text") {
      out += tok.value
      i++
      continue
    }

    // It's a tag
    if (tok.value.startsWith("if ")) {
      const cond = tok.value.slice(3).trim()
      i++
      // Collect branches: if / elif* / else? / endif
      const branches: Array<{ cond: string | null; body: string }> = []
      let currentCond: string | null = cond
      let bodyTokens: typeof tokens = []

      while (i < tokens.length) {
        const t = tokens[i]
        if (t.type === "tag" && t.value === "endif") {
          branches.push({ cond: currentCond, body: processTokens(bodyTokens, 0, ctx).result })
          i++
          break
        } else if (t.type === "tag" && (t.value.startsWith("elif ") || t.value === "else")) {
          branches.push({ cond: currentCond, body: processTokens(bodyTokens, 0, ctx).result })
          currentCond = t.value.startsWith("elif ") ? t.value.slice(5).trim() : null
          bodyTokens = []
          i++
        } else {
          bodyTokens.push(t)
          i++
        }
      }

      // Evaluate branches
      for (const branch of branches) {
        if (branch.cond === null || evalCondition(branch.cond, ctx)) {
          out += branch.body
          break
        }
      }
      continue
    }

    if (tok.value === "endif" || tok.value.startsWith("elif ") || tok.value === "else") {
      break // handled above
    }

    // Unknown tag — ignore
    i++
  }

  return { result: out, nextIndex: i }
}

function evalCondition(cond: string, ctx: Record<string, any>): boolean {
  // {% if x in ["a","b","c"] %} or with single quotes
  const inMatch = cond.match(/^(\w+)\s+in\s+\[([^\]]+)\]$/)
  if (inMatch) {
    const val = String(ctx[inMatch[1]] ?? "")
    const list = inMatch[2].split(",").map(s => s.trim().replace(/^['"]|['"]$/g, ""))
    return list.includes(val)
  }
  // {% if x not in ["a","b"] %}
  const notInMatch = cond.match(/^(\w+)\s+not\s+in\s+\[([^\]]+)\]$/)
  if (notInMatch) {
    const val = String(ctx[notInMatch[1]] ?? "")
    const list = notInMatch[2].split(",").map(s => s.trim().replace(/^['"]|['"]$/g, ""))
    return !list.includes(val)
  }
  // {% if x == "y" %}
  const eqMatch = cond.match(/^(\w+)\s*==\s*['"]([^'"]+)['"]$/)
  if (eqMatch) return String(ctx[eqMatch[1]] ?? "") === eqMatch[2]
  // {% if x != "y" %}
  const neMatch = cond.match(/^(\w+)\s*!=\s*['"]([^'"]+)['"]$/)
  if (neMatch) return String(ctx[neMatch[1]] ?? "") !== neMatch[2]
  // {% if x %} — truthy
  const varName = cond.trim()
  const val = ctx[varName]
  return Boolean(val && val !== "none" && val !== "")
}

// ─── Template context ─────────────────────────────────────────────────────────

function buildContext(cfg: GeneratorConfig): Record<string, any> {
  const projectSlug = cfg.project_name.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-")
  return {
    ...cfg,
    project_slug: projectSlug,
    python_version: "3.11",
    year: new Date().getFullYear().toString(),
    framework_display: toTitle(cfg.framework),
    task_display: toTitle(cfg.task_type),
    framework: cfg.framework,
    task_type: cfg.task_type,
    experiment_tracking: cfg.experiment_tracking,
    orchestration: cfg.orchestration,
    deployment: cfg.deployment,
    monitoring: cfg.monitoring,
  }
}

// ─── File generation ──────────────────────────────────────────────────────────

export function generateProject(cfg: GeneratorConfig): VirtualFile[] {
  const ctx = buildContext(cfg)
  const files: VirtualFile[] = []

  // Common files
  files.push(...generateCommonFiles(ctx))

  // Framework-specific files
  files.push(...generateFrameworkFiles(cfg.framework, ctx))

  // Additional empty placeholder dirs (represented as .gitkeep)
  const dirs = [
    "data/raw", "data/processed", "data/external",
    "models/checkpoints", "models/production",
    "notebooks", "scripts", "configs", "tests", "logs",
  ]
  if (cfg.framework === "pytorch" || cfg.framework === "tensorflow") {
    dirs.push("src/data", "src/models", "src/training", "src/utils")
  } else {
    dirs.push("src/data", "src/models", "src/features", "src/utils")
  }
  if (cfg.experiment_tracking === "mlflow") dirs.push("mlruns")
  if (cfg.experiment_tracking === "wandb")  dirs.push("wandb")
  if (cfg.orchestration === "airflow")      dirs.push("dags")
  if (cfg.orchestration === "kubeflow")     dirs.push("pipelines")

  for (const dir of dirs) {
    files.push({ path: `${dir}/.gitkeep`, content: "" })
  }

  // Cloud templates
  if (cfg.cloud_provider && cfg.cloud_service) {
    files.push(...generateCloudFiles(cfg.cloud_provider, cfg.cloud_service, ctx))
  }

  // Project config
  files.push({
    path: "project_config.json",
    content: JSON.stringify({
      ...cfg,
      generator_version: "1.0.8",
      generated_at: new Date().toISOString(),
    }, null, 2),
  })

  return files
}

// ─── Common files ─────────────────────────────────────────────────────────────

function generateCommonFiles(ctx: Record<string, any>): VirtualFile[] {
  const { project_name, framework, task_type, experiment_tracking, orchestration, deployment, monitoring, author_name, description, python_version } = ctx

  return [
    {
      path: ".gitignore",
      content: `# Python
__pycache__/
*.py[cod]
*.pyo
.Python
build/
dist/
*.egg-info/
.eggs/
.venv/
venv/
env/

# Data
data/raw/*
data/processed/*
data/external/*
!data/**/.gitkeep

# Models
models/checkpoints/*
models/production/*
!models/**/.gitkeep

# Experiment tracking
${experiment_tracking === "mlflow" ? "mlruns/" : ""}
${experiment_tracking === "wandb"  ? "wandb/"  : ""}

# Logs & temp
logs/
*.log
.DS_Store
Thumbs.db
.env
.env.*
!.env.example

# IDE
.vscode/
.idea/
`,
    },
    {
      path: "README.md",
      content: `# ${project_name}

${description}

## 🚀 Quick Start

### Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Usage

\`\`\`bash
# Train the model
python src/train.py

# Run inference
python src/inference.py
\`\`\`

## 📊 Project Structure

\`\`\`
${project_name}/
├── src/
│   ├── data/
│   ├── models/
│   ├── train.py
│   └── inference.py
├── configs/
│   └── config.yaml
├── data/
│   ├── raw/
│   └── processed/
├── models/
│   ├── checkpoints/
│   └── production/
├── notebooks/
├── tests/
├── requirements.txt
└── README.md
\`\`\`

## 🛠️ Development

\`\`\`bash
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
pytest tests/
\`\`\`

## 📈 Framework: ${toTitle(framework)}
${experiment_tracking && experiment_tracking !== "none" ? `\n## 🔬 Experiment Tracking: ${toTitle(experiment_tracking)}` : ""}
${orchestration && orchestration !== "none" ? `\n## 🔄 Orchestration: ${toTitle(orchestration)}` : ""}
${deployment ? `\n## 🚀 Deployment: ${toTitle(deployment)}` : ""}
${monitoring && monitoring !== "none" ? `\n## 📊 Monitoring: ${toTitle(monitoring)}` : ""}

## 📝 License

MIT License

## 👥 Author

**${author_name}**

---

Generated with [MLOps Project Generator](https://github.com/NotHarshhaa/MLOps-Project-Generator)
`,
    },
    {
      path: "requirements.txt",
      content: generateRequirements(ctx),
    },
    {
      path: "Makefile",
      content: `# MLOps Project Makefile

.PHONY: install train inference test lint format clean

install:
\tpip install -r requirements.txt

train:
\tpython src/train.py --config configs/config.yaml

inference:
\tpython src/inference.py

test:
\tpytest tests/ -v --cov=src

lint:
\tflake8 src/ tests/
\tmypy src/

format:
\tblack src/ tests/
\tisort src/ tests/

clean:
\trm -rf __pycache__ .pytest_cache .mypy_cache
\tfind . -name "*.pyc" -delete
`,
    },
    {
      path: "configs/config.yaml",
      content: generateConfigYaml(ctx),
    },
    {
      path: "tests/__init__.py",
      content: "",
    },
    {
      path: "tests/test_model.py",
      content: `"""Basic tests for ${project_name}"""
import pytest


def test_placeholder():
    """Placeholder test — replace with real tests"""
    assert True
`,
    },
    {
      path: ".env.example",
      content: `# Copy to .env and fill in your values
${experiment_tracking === "mlflow" ? "MLFLOW_TRACKING_URI=http://localhost:5000\n" : ""}${experiment_tracking === "wandb" ? "WANDB_API_KEY=your_api_key_here\n" : ""}PROJECT_NAME=${project_name}
`,
    },
  ]
}

function generateRequirements(ctx: Record<string, any>): string {
  const { framework, task_type, experiment_tracking, orchestration, deployment, monitoring } = ctx
  const lines: string[] = ["# Core dependencies"]

  if (framework === "sklearn") {
    lines.push("scikit-learn>=1.3.0", "pandas>=2.0.0", "numpy>=1.24.0", "joblib>=1.3.0")
  } else if (framework === "pytorch") {
    lines.push("torch>=2.0.0", "torchvision>=0.15.0", "pandas>=2.0.0", "numpy>=1.24.0")
  } else if (framework === "tensorflow") {
    lines.push("tensorflow>=2.13.0", "pandas>=2.0.0", "numpy>=1.24.0")
  }

  if (task_type === "nlp") lines.push("transformers>=4.30.0", "tokenizers>=0.13.0")
  if (task_type === "computer-vision") lines.push("pillow>=10.0.0", "opencv-python>=4.8.0")
  if (task_type === "timeseries") lines.push("statsmodels>=0.14.0")

  lines.push("\n# Configuration")
  lines.push("pyyaml>=6.0.0", "python-dotenv>=1.0.0")

  if (experiment_tracking === "mlflow") lines.push("\n# Experiment tracking\nmlflow>=2.5.0")
  if (experiment_tracking === "wandb")  lines.push("\n# Experiment tracking\nwandb>=0.15.0")

  if (orchestration === "airflow")  lines.push("\n# Orchestration\napache-airflow>=2.6.0")
  if (orchestration === "kubeflow") lines.push("\n# Orchestration\nkfp>=2.0.0")

  if (deployment === "fastapi") lines.push("\n# Deployment\nfastapi>=0.100.0\nuvicorn>=0.23.0\npydantic>=2.0.0")

  if (monitoring === "evidently") lines.push("\n# Monitoring\nevidently>=0.4.0")

  lines.push("\n# Development")
  lines.push("pytest>=7.4.0", "pytest-cov>=4.1.0", "black>=23.0.0", "isort>=5.12.0", "flake8>=6.0.0", "mypy>=1.4.0")
  lines.push("\n# Notebooks & visualization")
  lines.push("jupyter>=1.0.0", "matplotlib>=3.7.0", "seaborn>=0.12.0", "plotly>=5.15.0")

  return lines.join("\n") + "\n"
}

function generateConfigYaml(ctx: Record<string, any>): string {
  const { project_name, author_name, framework, task_type, experiment_tracking, deployment, monitoring, python_version } = ctx
  const modelType = framework === "sklearn"
    ? (task_type === "classification" ? "RandomForestClassifier" : task_type === "regression" ? "RandomForestRegressor" : "ARIMA")
    : "NeuralNetwork"

  return `# Configuration for ${project_name}

project:
  name: "${project_name}"
  author: "${author_name}"
  version: "0.1.0"

data:
  raw_data_path: "data/raw"
  processed_data_path: "data/processed"
  test_size: 0.2
  random_state: 42

model:
  type: "${modelType}"
${framework === "sklearn" ? `  n_estimators: 100\n  max_depth: 10` : `  hidden_layers: [128, 64, 32]\n  dropout: 0.2`}

training:
${framework !== "sklearn" ? `  batch_size: 32\n  learning_rate: 0.001\n  epochs: 100` : `  cross_validation: 5`}
  early_stopping: true
  patience: 10

evaluation:
  metrics:
${task_type === "classification" ? `    - accuracy\n    - precision\n    - recall\n    - f1_score` : `    - mse\n    - rmse\n    - mae\n    - r2_score`}
  save_predictions: true

experiment_tracking:
  tool: "${experiment_tracking}"
${experiment_tracking === "mlflow" ? `  tracking_uri: "http://localhost:5000"\n  experiment_name: "${project_name}"` : ""}
${experiment_tracking === "wandb"  ? `  project: "${project_name}"` : ""}

deployment:
  method: "${deployment}"
${deployment === "fastapi" ? `  host: "0.0.0.0"\n  port: 8000` : ""}

monitoring:
  tool: "${monitoring}"

logging:
  level: "INFO"
  file: "logs/${project_name}.log"
  console: true

paths:
  data_dir: "data"
  models_dir: "models"
  notebooks_dir: "notebooks"
  logs_dir: "logs"
`
}

// ─── Framework files ──────────────────────────────────────────────────────────

function generateFrameworkFiles(framework: string, ctx: Record<string, any>): VirtualFile[] {
  if (framework === "sklearn")    return generateSklearnFiles(ctx)
  if (framework === "pytorch")    return generatePytorchFiles(ctx)
  if (framework === "tensorflow") return generateTensorflowFiles(ctx)
  return []
}

function generateSklearnFiles(ctx: Record<string, any>): VirtualFile[] {
  const { task_type, experiment_tracking, framework_display, task_display } = ctx
  const isDL = false

  return [
    { path: "src/__init__.py", content: "" },
    { path: "src/data/__init__.py", content: "from .data_loader import DataLoader\n" },
    {
      path: "src/data/data_loader.py",
      content: `"""Data loading utilities for ${framework_display} project"""
import pandas as pd
import numpy as np
from sklearn.datasets import make_classification, make_regression
from typing import Tuple


class DataLoader:
    def __init__(self, config: dict):
        self.config = config

    def load_sample_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Load sample data for demonstration"""
        ${task_type === "classification"
          ? "return make_classification(n_samples=1000, n_features=20, random_state=42)"
          : task_type === "regression"
          ? "return make_regression(n_samples=1000, n_features=20, random_state=42)"
          : "# Time series sample\n        t = np.linspace(0, 10, 1000)\n        X = t.reshape(-1, 1)\n        y = np.sin(t)\n        return X, y"}

    def load_from_file(self, path: str) -> Tuple[pd.DataFrame, pd.Series]:
        """Load data from CSV file"""
        df = pd.read_csv(path)
        target = self.config["data"].get("target_column", "target")
        X = df.drop(columns=[target])
        y = df[target]
        return X.values, y.values
`,
    },
    { path: "src/features/__init__.py", content: "from .feature_engineering import FeatureEngineer\n" },
    {
      path: "src/features/feature_engineering.py",
      content: `"""Feature engineering for ${framework_display} project"""
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from typing import Optional


class FeatureEngineer:
    def __init__(self, config: dict):
        self.config = config
        self.scaler = StandardScaler()
        self.imputer = SimpleImputer(strategy="mean")
        self._fitted = False

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        X = self.imputer.fit_transform(X)
        X = self.scaler.fit_transform(X)
        self._fitted = True
        return X

    def transform(self, X: np.ndarray) -> np.ndarray:
        if not self._fitted:
            raise RuntimeError("Call fit_transform first")
        X = self.imputer.transform(X)
        return self.scaler.transform(X)
`,
    },
    { path: "src/models/__init__.py", content: "" },
    {
      path: "src/models/model.py",
      content: `"""${framework_display} ${task_display} model"""
import joblib
import numpy as np
from pathlib import Path
${task_type === "classification"
  ? "from sklearn.ensemble import RandomForestClassifier"
  : task_type === "regression"
  ? "from sklearn.ensemble import RandomForestRegressor"
  : "from sklearn.linear_model import Ridge"}


class MLModel:
    def __init__(self, config: dict):
        self.config = config
        model_cfg = config.get("model", {})
        ${task_type === "classification"
          ? "self.model = RandomForestClassifier(\n            n_estimators=model_cfg.get('n_estimators', 100),\n            max_depth=model_cfg.get('max_depth', 10),\n            random_state=42,\n        )"
          : task_type === "regression"
          ? "self.model = RandomForestRegressor(\n            n_estimators=model_cfg.get('n_estimators', 100),\n            max_depth=model_cfg.get('max_depth', 10),\n            random_state=42,\n        )"
          : "self.model = Ridge()"}

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)

    def predict(self, X):
        return self.model.predict(X)

    def save(self, path: str):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, path)

    def load(self, path: str):
        self.model = joblib.load(path)
`,
    },
    {
      path: "src/train.py",
      content: generateSklearnTrain(ctx),
    },
    {
      path: "src/inference.py",
      content: generateSklearnInference(ctx),
    },
  ]
}

function generateSklearnTrain(ctx: Record<string, any>): string {
  const { task_type, experiment_tracking, framework_display, task_display } = ctx
  return `#!/usr/bin/env python3
"""Training script for ${framework_display} ${task_display} model"""

import logging
import argparse
from pathlib import Path
import numpy as np
import yaml
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_squared_error, mean_absolute_error, r2_score
)
${experiment_tracking === "mlflow" ? "import mlflow\nimport mlflow.sklearn" : ""}
${experiment_tracking === "wandb"  ? "import wandb" : ""}

from src.models.model import MLModel
from src.data.data_loader import DataLoader
from src.features.feature_engineering import FeatureEngineer

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


def load_config(path: str) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def evaluate(model, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)
    ${task_type === "classification" ? `return {
        "accuracy":  accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, average="weighted", zero_division=0),
        "recall":    recall_score(y_test, y_pred, average="weighted", zero_division=0),
        "f1_score":  f1_score(y_test, y_pred, average="weighted", zero_division=0),
    }` : `return {
        "mse":      mean_squared_error(y_test, y_pred),
        "rmse":     float(np.sqrt(mean_squared_error(y_test, y_pred))),
        "mae":      mean_absolute_error(y_test, y_pred),
        "r2_score": r2_score(y_test, y_pred),
    }`}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="configs/config.yaml")
    args = parser.parse_args()

    config = load_config(args.config)
    data_cfg = config["data"]

    loader = DataLoader(config)
    X, y = loader.load_sample_data()

    engineer = FeatureEngineer(config)
    X = engineer.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=data_cfg["test_size"], random_state=data_cfg["random_state"]
    )

    ${experiment_tracking === "mlflow" ? `mlflow.set_tracking_uri(config["experiment_tracking"]["tracking_uri"])
    mlflow.set_experiment(config["experiment_tracking"]["experiment_name"])
    with mlflow.start_run():` : "if True:"}
        model = MLModel(config)
        model.train(X_train, y_train)

        metrics = evaluate(model, X_test, y_test)
        logger.info("Metrics: %s", metrics)

        cv = cross_val_score(model.model, X_train, y_train, cv=config["training"]["cross_validation"])
        logger.info("CV mean: %.4f ± %.4f", cv.mean(), cv.std())

        model.save("models/production/model.joblib")
        logger.info("Model saved.")

        ${experiment_tracking === "mlflow" ? `mlflow.log_params(config["model"])
        mlflow.log_metrics(metrics)
        mlflow.log_metric("cv_mean", float(cv.mean()))` : ""}
        ${experiment_tracking === "wandb" ? `wandb.init(project=config["experiment_tracking"]["project"])
        wandb.log(metrics)
        wandb.finish()` : ""}

if __name__ == "__main__":
    main()
`
}

function generateSklearnInference(ctx: Record<string, any>): string {
  const { task_type, deployment, framework_display } = ctx
  const useFastapi = deployment === "fastapi"
  return `#!/usr/bin/env python3
"""Inference script for ${framework_display} model"""

import numpy as np
import joblib
${useFastapi ? "from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport uvicorn" : ""}

MODEL_PATH = "models/production/model.joblib"

${useFastapi ? `app = FastAPI(title="${framework_display} Inference API")

class PredictRequest(BaseModel):
    features: list[float]

class PredictResponse(BaseModel):
    prediction: float | int | str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    model = joblib.load(MODEL_PATH)
    X = np.array(req.features).reshape(1, -1)
    pred = model.predict(X)[0]
    return PredictResponse(prediction=pred)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
` : `def predict(features: list) -> float:
    model = joblib.load(MODEL_PATH)
    X = np.array(features).reshape(1, -1)
    return model.predict(X)[0]

if __name__ == "__main__":
    sample = [0.1] * 20
    result = predict(sample)
    print(f"Prediction: {result}")
`}
`
}

function generatePytorchFiles(ctx: Record<string, any>): VirtualFile[] {
  const { task_type, experiment_tracking, deployment, framework_display, task_display } = ctx
  return [
    { path: "src/__init__.py", content: "" },
    { path: "src/models/__init__.py", content: "" },
    { path: "src/utils/__init__.py", content: "" },
    {
      path: "src/models/model.py",
      content: `"""PyTorch ${task_display} model"""
import torch
import torch.nn as nn


class MLModel(nn.Module):
    def __init__(self, input_dim: int = 20, hidden: list = [128, 64, 32], output_dim: int = ${task_type === "classification" ? "2" : "1"}):
        super().__init__()
        layers = []
        prev = input_dim
        for h in hidden:
            layers += [nn.Linear(prev, h), nn.ReLU(), nn.Dropout(0.2)]
            prev = h
        layers.append(nn.Linear(prev, output_dim))
        ${task_type === "classification" ? "layers.append(nn.Softmax(dim=1))" : ""}
        self.net = nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)
`,
    },
    {
      path: "src/train.py",
      content: `#!/usr/bin/env python3
"""Training script for ${framework_display} ${task_display} model"""
import yaml, logging
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.datasets import make_${task_type === "classification" ? "classification" : "regression"}
from sklearn.model_selection import train_test_split
import numpy as np
${experiment_tracking === "mlflow" ? "import mlflow" : ""}
${experiment_tracking === "wandb"  ? "import wandb" : ""}
from src.models.model import MLModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    with open("configs/config.yaml") as f:
        config = yaml.safe_load(f)
    train_cfg = config["training"]

    X, y = make_${task_type === "classification" ? "classification" : "regression"}(n_samples=1000, n_features=20, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    X_train_t = torch.FloatTensor(X_train)
    y_train_t = torch.${task_type === "classification" ? "LongTensor(y_train)" : "FloatTensor(y_train).unsqueeze(1)"}
    loader = DataLoader(TensorDataset(X_train_t, y_train_t), batch_size=train_cfg["batch_size"], shuffle=True)

    model = MLModel(input_dim=20)
    optimizer = torch.optim.Adam(model.parameters(), lr=train_cfg["learning_rate"])
    criterion = nn.${task_type === "classification" ? "CrossEntropyLoss()" : "MSELoss()"}

    ${experiment_tracking === "mlflow" ? `mlflow.set_experiment(config["experiment_tracking"]["experiment_name"])
    with mlflow.start_run():` : "if True:"}
        for epoch in range(train_cfg["epochs"]):
            model.train()
            for xb, yb in loader:
                optimizer.zero_grad()
                loss = criterion(model(xb), yb)
                loss.backward()
                optimizer.step()
            if epoch % 10 == 0:
                logger.info("Epoch %d loss=%.4f", epoch, loss.item())

        torch.save(model.state_dict(), "models/production/model.pt")
        logger.info("Model saved.")

if __name__ == "__main__":
    main()
`,
    },
    {
      path: "src/inference.py",
      content: `#!/usr/bin/env python3
"""Inference for ${framework_display} model"""
import torch
import numpy as np
${deployment === "fastapi" ? "from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport uvicorn" : ""}
from src.models.model import MLModel

${deployment === "fastapi" ? `app = FastAPI(title="PyTorch Inference API")

class PredictRequest(BaseModel):
    features: list[float]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: PredictRequest):
    model = MLModel(input_dim=len(req.features))
    model.load_state_dict(torch.load("models/production/model.pt", map_location="cpu"))
    model.eval()
    with torch.no_grad():
        x = torch.FloatTensor(req.features).unsqueeze(0)
        pred = model(x).numpy().tolist()
    return {"prediction": pred}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
` : `def predict(features: list):
    model = MLModel(input_dim=len(features))
    model.load_state_dict(torch.load("models/production/model.pt", map_location="cpu"))
    model.eval()
    with torch.no_grad():
        x = torch.FloatTensor(features).unsqueeze(0)
        return model(x).numpy().tolist()

if __name__ == "__main__":
    print(predict([0.1] * 20))
`}
`,
    },
  ]
}

function generateTensorflowFiles(ctx: Record<string, any>): VirtualFile[] {
  const { task_type, experiment_tracking, deployment, framework_display, task_display } = ctx
  return [
    { path: "src/__init__.py", content: "" },
    { path: "src/models/__init__.py", content: "" },
    { path: "src/utils/__init__.py", content: "" },
    {
      path: "src/models/model.py",
      content: `"""TensorFlow/Keras ${task_display} model"""
import tensorflow as tf
from tensorflow import keras


def build_model(input_dim: int = 20, output_dim: int = ${task_type === "classification" ? "2" : "1"}) -> keras.Model:
    model = keras.Sequential([
        keras.layers.Dense(128, activation="relu", input_shape=(input_dim,)),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(64, activation="relu"),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(32, activation="relu"),
        keras.layers.Dense(output_dim, activation="${task_type === "classification" ? "softmax" : "linear"}"),
    ])
    model.compile(
        optimizer="adam",
        loss="${task_type === "classification" ? "sparse_categorical_crossentropy" : "mse"}",
        metrics=["${task_type === "classification" ? "accuracy" : "mae"}"],
    )
    return model
`,
    },
    {
      path: "src/train.py",
      content: `#!/usr/bin/env python3
"""Training for ${framework_display} ${task_display} model"""
import yaml, logging
import numpy as np
from sklearn.datasets import make_${task_type === "classification" ? "classification" : "regression"}
from sklearn.model_selection import train_test_split
${experiment_tracking === "mlflow" ? "import mlflow\nimport mlflow.tensorflow" : ""}
${experiment_tracking === "wandb"  ? "import wandb\nfrom wandb.keras import WandbCallback" : ""}
from src.models.model import build_model

logging.basicConfig(level=logging.INFO)

def main():
    with open("configs/config.yaml") as f:
        config = yaml.safe_load(f)
    train_cfg = config["training"]

    X, y = make_${task_type === "classification" ? "classification" : "regression"}(n_samples=1000, n_features=20, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = build_model()
    callbacks = [
        __import__("tensorflow").keras.callbacks.EarlyStopping(patience=train_cfg["patience"], restore_best_weights=True)
    ]
    ${experiment_tracking === "wandb" ? `wandb.init(project=config["experiment_tracking"]["project"])
    callbacks.append(WandbCallback())` : ""}

    ${experiment_tracking === "mlflow" ? `with mlflow.start_run():` : "if True:"}
        model.fit(X_train, y_train, validation_split=0.1,
                  epochs=train_cfg["epochs"], batch_size=train_cfg["batch_size"], callbacks=callbacks)
        results = model.evaluate(X_test, y_test, verbose=0)
        logging.info("Test results: %s", results)
        model.save("models/production/model.keras")
        ${experiment_tracking === "mlflow" ? "mlflow.tensorflow.log_model(model, 'model')" : ""}
        ${experiment_tracking === "wandb" ? "wandb.finish()" : ""}

if __name__ == "__main__":
    main()
`,
    },
    {
      path: "src/inference.py",
      content: `#!/usr/bin/env python3
"""Inference for ${framework_display} model"""
import numpy as np
import tensorflow as tf
${deployment === "fastapi" ? "from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport uvicorn" : ""}

MODEL_PATH = "models/production/model.keras"

${deployment === "fastapi" ? `app = FastAPI(title="TensorFlow Inference API")

class PredictRequest(BaseModel):
    features: list[float]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: PredictRequest):
    model = tf.keras.models.load_model(MODEL_PATH)
    x = np.array(req.features).reshape(1, -1)
    pred = model.predict(x).tolist()
    return {"prediction": pred}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
` : `def predict(features: list) -> list:
    model = tf.keras.models.load_model(MODEL_PATH)
    x = np.array(features).reshape(1, -1)
    return model.predict(x).tolist()

if __name__ == "__main__":
    print(predict([0.1] * 20))
`}
`,
    },
  ]
}

// ─── Cloud deployment files ───────────────────────────────────────────────────

function generateCloudFiles(provider: string, service: string, ctx: Record<string, any>): VirtualFile[] {
  const { project_name, framework, task_type, deployment, monitoring } = ctx
  const base = `cloud/${provider}/${service}`
  const files: VirtualFile[] = []

  // Shared Dockerfile for any cloud target
  const dockerfile = `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
COPY models/ ./models/
COPY configs/ ./configs/
ENV PYTHONPATH=/app
EXPOSE 8000
CMD ["python", "src/inference.py"]
`

  files.push({ path: `${base}/Dockerfile`, content: dockerfile })

  // cloud-config.yaml
  files.push({
    path: `${base}/cloud-config.yaml`,
    content: `# Cloud Deployment Configuration
provider: ${provider}
service: ${service}
project_name: ${project_name}
framework: ${framework}
task_type: ${task_type}
deployment: ${deployment}
monitoring: ${monitoring}
`,
  })

  // Provider-specific extras
  if (provider === "aws" && service === "sagemaker") {
    files.push({ path: `${base}/train.py`, content: `# SageMaker training entry point\nimport subprocess, sys\nsubprocess.run([sys.executable, "src/train.py"] + sys.argv[1:], check=True)\n` })
  }
  if (provider === "gcp" && service === "cloud-run") {
    files.push({ path: `${base}/cloudbuild.yaml`, content: `steps:\n  - name: gcr.io/cloud-builders/docker\n    args: [build, -t, "gcr.io/$PROJECT_ID/${project_name}", .]\n  - name: gcr.io/cloud-builders/docker\n    args: [push, "gcr.io/$PROJECT_ID/${project_name}"]\n  - name: gcr.io/google.com/cloudsdktool/cloud-sdk\n    entrypoint: gcloud\n    args: [run, deploy, ${project_name}, --image, "gcr.io/$PROJECT_ID/${project_name}", --region, us-central1, --allow-unauthenticated]\n` })
  }
  if (provider === "azure") {
    files.push({ path: `${base}/conda.yml`, content: `name: ${project_name}-env\ndependencies:\n  - python=3.11\n  - pip:\n    - -r requirements.txt\n` })
  }

  // deploy.sh
  const deployCommands: Record<string, Record<string, string>> = {
    aws: {
      sagemaker: "aws sagemaker create-training-job --training-job-name \"${PROJECT_NAME}-$(date +%s)\" ...",
      ecs: "aws ecs update-service --cluster ml-cluster --service ${PROJECT_NAME} --force-new-deployment",
      lambda: "aws lambda update-function-code --function-name ${PROJECT_NAME} --zip-file fileb://function.zip",
    },
    gcp: {
      "cloud-run": "gcloud run deploy ${PROJECT_NAME} --image gcr.io/${PROJECT_ID}/${PROJECT_NAME} --region us-central1",
      "vertex-ai": "gcloud ai custom-jobs create --display-name=${PROJECT_NAME} ...",
      "ai-platform": "gcloud ml-engine jobs submit training ${PROJECT_NAME}_train ...",
    },
    azure: {
      "ml-studio": "az ml model create -n ${PROJECT_NAME} -p ./model && az ml endpoint create ...",
      "container-instances": "az container create --resource-group myRG --name ${PROJECT_NAME} ...",
      functions: "func azure functionapp publish ${PROJECT_NAME}",
    },
  }

  const cmd = deployCommands[provider]?.[service] ?? "# Add your deployment commands here"
  files.push({
    path: `${base}/deploy.sh`,
    content: `#!/bin/bash
# Deployment script for ${provider.toUpperCase()} ${service}
set -e

PROJECT_NAME="${project_name}"
echo "🚀 Deploying \${PROJECT_NAME} to ${provider.toUpperCase()} ${service}..."

${cmd}

echo "✅ Deployment completed successfully!"
`,
  })

  return files
}
