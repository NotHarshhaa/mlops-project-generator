import { toTitle } from "@/lib/generator/template/helpers"
import type { TemplateContext, VirtualFile } from "@/lib/generator/types"

export function generateCommonFiles(ctx: TemplateContext): VirtualFile[] {
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

function generateRequirements(ctx: TemplateContext): string {
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

function generateConfigYaml(ctx: TemplateContext): string {
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
