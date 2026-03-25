# 🧠 MLOps Project Generator

<p align="center">
  <img src="https://raw.githubusercontent.com/NotHarshhaa/MLOps-Project-Generator/master/images/banner.png" alt="MLOps Project Generator Banner" width="800"/>
</p>

<p align="center">
  <strong>Generate production-ready MLOps project templates — via Web UI or CLI.</strong><br/>
  Scikit-learn · PyTorch · TensorFlow · Multi-cloud · Zero setup required.
</p>

<p align="center">
  <a href="https://github.com/NotHarshhaa/MLOps-Project-Generator/stargazers"><img src="https://img.shields.io/github/stars/NotHarshhaa/MLOps-Project-Generator?style=flat-square" alt="Stars"/></a>
  <a href="https://pypi.org/project/mlops-project-generator/"><img src="https://img.shields.io/pypi/v/mlops-project-generator?style=flat-square" alt="PyPI"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/></a>
</p>

This stack supports the **full MLOps lifecycle:**

```
Data → Train → Track → Orchestrate → Deploy → Monitor → Improve
```

---

## 🎉 What's New in v1.0.8

🆕 **Stack Presets** - 6 pre-configured MLOps stacks for common use cases:
- ⚡ Quick Start - Zero friction setup
- 🧪 Data Science - Exploration focused
- 🧠 Deep Learning - PyTorch + W&B
- 📡 Production MLOps - Full observability
- 🏢 Enterprise - Maximum scale
- 🔬 Research - Experimentation optimized

🚀 **New CLI Commands:**
```bash
mlops-project-generator init --preset quick-start
mlops-project-generator list-presets
```

---

## 🚀 Features

- **🔧 Framework Support**: Scikit-learn, PyTorch, TensorFlow/Keras
- **📊 Task Types**: Classification, Regression, Time-Series, NLP, Computer Vision
- **🔬 Experiment Tracking**: MLflow, W&B, Custom solutions
- **🎯 Orchestration**: Airflow, Kubeflow
- **🚀 Deployment**: FastAPI, Docker, Kubernetes, Cloud platforms
- **📈 Monitoring**: Evidently AI, Custom solutions
- **☁️ Cloud Deployment**: Multi-cloud templates (AWS, GCP, Azure)
- **🌐 Web UI**: Browser-based generator — no install needed
- **🤖 CI/CD Ready**: Non-interactive CLI mode for DevOps pipelines
- **⚙️ Config Presets**: Save, load, and reuse project configurations
- **🎨 Custom Templates**: Create and manage framework templates

---

## � MLOps Presets

Choose from 6 pre-configured MLOps stacks tailored for different use cases:

| Preset | Framework | Tracking | Orchestration | Deploy | Monitor |
|--------|-----------|----------|---------------|-------|---------|
| ⚡ Quick Start | Sklearn | None | None | FastAPI | None |
| 🧪 Data Science | Sklearn | MLflow | None | FastAPI | Custom |
| 🧠 Deep Learning | PyTorch | W&B | None | Docker | None |
| 📡 Production MLOps | PyTorch | MLflow | Airflow | Docker | Evidently |
| 🏢 Enterprise | TensorFlow | MLflow | Kubeflow | Kubernetes | Evidently |
| 🔬 Research | PyTorch | W&B | None | FastAPI | None |

Use presets via CLI: `mlops-project-generator init --preset <name>` or select them in the Web UI.

---

## �🌐 Web UI (Recommended)

The fastest way to generate a project — open it in your browser, fill in the form, and download a ready-to-use ZIP.

### Run locally

```bash
cd web_ui
npm install
npm run dev
# → http://localhost:3000
```

### Self-host / Deploy

The web UI is a **Next.js 15 app with no external backend dependency**. The generator runs entirely as Next.js API routes — deploy to Vercel, Netlify, Railway, or any Node.js host:

```bash
cd web_ui
npm run build
npm start
```

> **Vercel one-click deploy:** set the root directory to `web_ui` and it works out of the box.

### Web UI Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + Glassmorphism |
| Forms | react-hook-form + zod |
| Generator | Pure TypeScript (no Python runtime needed) |
| ZIP output | archiver |

---

## 📦 CLI Installation

Prefer the command line? Install the Python package:

### From PyPI

```bash
pip install mlops-project-generator==1.0.8
```

### From Source

```bash
git clone https://github.com/NotHarshhaa/MLOps-Project-Generator.git
cd MLOps-Project-Generator
pip install -e .
```

### Development Install

```bash
pip install -e ".[dev]"
```

---

## 🎯 CLI Quick Start

### Interactive mode (recommended for beginners)

```bash
mlops-project-generator init
```

### Using Stack Presets (NEW!)

```bash
# Quick start with preset
mlops-project-generator init --preset quick-start

# Enterprise stack with custom project name
mlops-project-generator init --preset enterprise --project-name my-platform

# Override preset values
mlops-project-generator init --preset production-mlops --deployment kubernetes

# List all available presets
mlops-project-generator list-presets
```

### Non-interactive mode (CI/CD)

```bash
mlops-project-generator init \
  --framework pytorch \
  --task-type classification \
  --tracking mlflow \
  --orchestration airflow \
  --deployment docker \
  --monitoring evidently \
  --project-name enterprise-ml \
  --author-name "ML Team" \
  --description "Production ML pipeline"
```

### Available CLI Commands

#### Core
| Command | Description |
|---|---|
| `init` | Generate a new MLOps project |
| `validate` | Validate an existing project structure |
| `version` | Show version |

#### Configuration Management
| Command | Description |
|---|---|
| `save-preset <name>` | Save current config as a preset |
| `list-presets` | List all presets |
| `load-preset <name>` | Load a preset |
| `delete-preset <name>` | Delete a preset |

#### Template Management
| Command | Description |
|---|---|
| `create-template <name> <framework>` | Create a custom template |
| `list-templates` | List custom templates |
| `delete-template <name>` | Delete a template |
| `add-template-file <template> <path>` | Add a file to a template |

#### Analytics & Cloud
| Command | Description |
|---|---|
| `stats` | Show generation statistics |
| `analyze <path>` | Analyze a generated project |
| `cloud-services` | List available cloud services |
| `cloud-deploy <provider> <service>` | Generate cloud deployment templates |

### `init` Flag Reference

| Flag | Short | Values |
|---|---|---|
| `--framework` | `-f` | `sklearn`, `pytorch`, `tensorflow` |
| `--task-type` | `-t` | `classification`, `regression`, `timeseries`, `nlp`, `computer-vision` |
| `--tracking` | `-r` | `mlflow`, `wandb`, `custom`, `none` |
| `--orchestration` | `-o` | `airflow`, `kubeflow`, `none` |
| `--deployment` | `-d` | `fastapi`, `docker`, `kubernetes` |
| `--monitoring` | `-m` | `evidently`, `custom`, `none` |
| `--project-name` | `-p` | Any valid identifier |
| `--author-name` | `-a` | Any string |
| `--description` | `--desc` | Any string |

---

## 🖼️ Screenshots

### CLI Commands

<p align="center">
  <img src="https://raw.githubusercontent.com/NotHarshhaa/MLOps-Project-Generator/master/images/cli-commands.png" alt="CLI Commands" width="700"/>
</p>

### Scikit-learn Generation

<p align="center">
  <img src="https://raw.githubusercontent.com/NotHarshhaa/MLOps-Project-Generator/master/images/sklearn-generation.png" alt="Scikit-learn Generation" width="700"/>
</p>

### PyTorch Generation

<p align="center">
  <img src="https://raw.githubusercontent.com/NotHarshhaa/MLOps-Project-Generator/master/images/pytorch-generation.png" alt="PyTorch Generation" width="700"/>
</p>

### TensorFlow Generation

<p align="center">
  <img src="https://raw.githubusercontent.com/NotHarshhaa/MLOps-Project-Generator/master/images/tensorflow-generation.png" alt="TensorFlow Generation" width="700"/>
</p>

---

## 📁 Generated Project Structure

```
your-project/
├── src/
│   ├── data/              # Data loading utilities
│   ├── models/            # Model implementations
│   ├── features/          # Feature engineering (sklearn)
│   ├── utils/             # Training utilities (pytorch/tensorflow)
│   ├── train.py           # Training entry point
│   └── inference.py       # Inference / FastAPI server
├── configs/
│   └── config.yaml        # Project configuration
├── data/
│   ├── raw/
│   ├── processed/
│   └── external/
├── models/
│   ├── checkpoints/
│   └── production/
├── notebooks/
├── tests/
│   └── test_model.py
├── cloud/                 # Cloud deployment files (if selected)
│   └── <provider>/<service>/
│       ├── Dockerfile
│       ├── cloud-config.yaml
│       └── deploy.sh
├── requirements.txt
├── Makefile
├── .gitignore
├── .env.example
├── project_config.json
└── README.md
```

---

## 🛠️ Framework-Specific Features

### Scikit-learn
- RandomForest / Ridge with cross-validation and joblib serialization
- `DataLoader` + `FeatureEngineer` classes ready to extend
- FastAPI inference server included when `--deployment fastapi`

### PyTorch
- Configurable `nn.Sequential` model with Dropout
- Full training loop with `DataLoader`, early stopping
- `torch.save` / `torch.load` model persistence

### TensorFlow / Keras
- `keras.Sequential` with BatchNorm and Dropout
- `EarlyStopping` callback pre-configured
- `model.save()` / `tf.keras.models.load_model()` persistence

---

## 📊 Experiment Tracking

### MLflow
```python
mlflow.set_tracking_uri("http://localhost:5000")
with mlflow.start_run():
    mlflow.log_params(config["model"])
    mlflow.log_metrics({"accuracy": 0.95})
```

### W&B
```python
wandb.init(project="my-project")
wandb.log({"loss": 0.12, "accuracy": 0.95})
wandb.finish()
```

---

## 🚀 Deployment Options

### FastAPI
```bash
uvicorn src.inference:app --reload
# → http://localhost:8000/docs
```

### Docker
```bash
docker build -t my-ml-project .
docker run -p 8000:8000 my-ml-project
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

---

## 📈 Monitoring

### Evidently AI
```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(current_data=current, reference_data=reference)
```

---

## 🤖 CI/CD Integration

### GitHub Actions

```yaml
name: Generate ML Project
on:
  workflow_dispatch:
    inputs:
      framework:
        type: choice
        options: [sklearn, pytorch, tensorflow]
      project_name:
        type: string
        default: ml-project

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install mlops-project-generator
      - run: |
          mlops-project-generator init \
            --framework ${{ github.event.inputs.framework }} \
            --project-name ${{ github.event.inputs.project_name }} \
            --tracking mlflow \
            --deployment docker
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ github.event.inputs.project_name }}
          path: ${{ github.event.inputs.project_name }}/
```

### GitLab CI

```yaml
generate_ml_project:
  image: python:3.11
  script:
    - pip install mlops-project-generator
    - mlops-project-generator init \
        --framework $FRAMEWORK \
        --project-name $PROJECT_NAME \
        --tracking mlflow \
        --deployment docker
  artifacts:
    paths: [$PROJECT_NAME/]
    expire_in: 1 week
```

---

## 🏗️ Repository Structure

```
MLOps-Project-Generator/
├── generator/              # Python CLI source
│   ├── cli.py             # Typer CLI entry point
│   ├── renderer.py        # Jinja2 template renderer
│   ├── validators.py      # Input validation
│   ├── cloud_deployer.py  # Cloud template generation
│   └── ...
├── templates/              # Jinja2 project templates
│   ├── common/            # Shared across all frameworks
│   ├── sklearn/
│   ├── pytorch/
│   └── tensorflow/
├── web_ui/                 # Next.js web application
│   ├── app/
│   │   └── api/           # Next.js API routes (generator backend)
│   │       ├── generate/  # POST — start generation
│   │       ├── status/    # GET  — poll task status
│   │       ├── download/  # GET  — download ZIP
│   │       └── options/   # GET  — dropdown options
│   └── src/
│       └── lib/
│           ├── generator/ # Pure TS generator (no Python needed)
│           └── task-store.ts
├── tests/                  # Python CLI tests
├── pyproject.toml
└── README.md
```

---

## 🧪 Testing (CLI)

```bash
pytest tests/ -v
pytest tests/ --cov=generator --cov-report=html
```

## 🛠️ Development (CLI)

```bash
git clone https://github.com/NotHarshhaa/MLOps-Project-Generator.git
cd MLOps-Project-Generator
pip install -e ".[dev]"
black generator/ tests/
isort generator/ tests/
flake8 generator/ tests/
mypy generator/
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Typer** · Beautiful Python CLI framework
- **Next.js** · React framework powering the Web UI
- **Rich** · Stunning terminal output
- **archiver** · ZIP generation for project downloads

---

## 📞 Support

- 🐛 [GitHub Issues](https://github.com/NotHarshhaa/MLOps-Project-Generator/issues)
- 💬 [GitHub Discussions](https://github.com/NotHarshhaa/MLOps-Project-Generator/discussions)

---

## 🗺️ Roadmap

### ✅ Completed

- [x] Python CLI with interactive + non-interactive modes
- [x] Scikit-learn, PyTorch, TensorFlow project templates
- [x] MLflow, W&B experiment tracking integration
- [x] Multi-cloud deployment templates (AWS, GCP, Azure)
- [x] Configuration presets and template customization
- [x] Project analytics and validation
- [x] **Web UI** — Next.js app with glassmorphism UI (v1.0.8)
- [x] **Backend migration** — generator ported to pure TypeScript, no Python runtime needed on the server (v1.0.8)
- [x] **Stack Presets** — 6 pre-configured MLOps stacks (Quick Start, Data Science, Deep Learning, Production MLOps, Enterprise, Research) (v1.0.8)

### 🚀 Upcoming

- [ ] Additional frameworks (XGBoost, LightGBM, HuggingFace)
- [ ] Shareable project config links
- [ ] Template marketplace
- [ ] Team collaboration features

---

⭐ If you find this useful, please give it a star on GitHub!

Generated with ❤️ by [MLOps Project Generator](https://github.com/NotHarshhaa/MLOps-Project-Generator)
