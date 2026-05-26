# 🧠 MLOps Project Generator

<p align="center">
  <img src="https://raw.githubusercontent.com/NotHarshhaa/MLOps-Project-Generator/master/images/banner.png" alt="MLOps Project Generator Banner" width="800"/>
</p>

<p align="center">
  <strong>Generate production-ready MLOps project scaffolds — via Web UI or Python CLI.</strong><br/>
  Scikit-learn · PyTorch · TensorFlow · NLP (Hugging Face) · Multi-cloud · 40+ files per project
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

## 🎉 What's New (Web UI v1.2.0)

Recent improvements to the **Next.js Web UI** and **TypeScript generator**:

### Web experience
- **Observatory UI** — redesigned landing with mission, features, how-it-works, and generator sections
- **Mobile-first layout** — compact on phones; desktop layout unchanged from `sm` breakpoint up
- **Archive preview** — `GET /api/preview` (partial config, no strict validation) and `POST /api/preview?strict=true` before download
- **File tree preview** in the form — see 40+ paths before generating
- **Recent projects** — browser-local history with quick re-download

### Generator (TypeScript v1.2.0)
- **Legacy Jinja templates wired** — repo `templates/` synced into `web_ui/templates/` and rendered for classification / regression / timeseries
- **Hugging Face NLP** — `src/nlp/finetune.py`, `configs/nlp.yaml`, Trainer + optional FastAPI inference
- **Deployment artifacts** — root `Dockerfile`, `docker-compose.yml`, Kubernetes manifests (`k8s/`) when Docker/K8s is selected
- **Orchestration files** — Airflow DAG (`dags/ml_training_dag.py`), Kubeflow pipeline stub
- **Monitoring scripts** — Evidently drift report + custom metrics collector
- **Config presets & templates** — `preset_config` and `custom_template` now affect output (CI, notebooks, minimal/comprehensive/microservice bundles)
- **Stack presets** — also set preset + template fields when applied
- **`generation_insights.json`** — optional recommendations when analytics is enabled

### Template fixes (`templates/`)
- Unified `timeseries` naming (was mixed with `time-series`)
- Fixed `TimeSeriesModel` imports via `snippets/model_import.py.j2`
- Improved `requirements.txt.j2`, `config.yaml.j2`, README/Makefile/.env Jinja templates
- New `templates/nlp/` for Hugging Face fine-tuning (CLI + web sync)

---

## 🚀 Features

### 🏗️ Core generation
| Capability | Web UI | Python CLI |
|------------|--------|------------|
| Frameworks | sklearn, PyTorch, TensorFlow | Same |
| Task types | classification, regression, timeseries, nlp, computer-vision | Same |
| Stack presets | 6 curated stacks (form) | `init --preset` |
| ZIP download | Yes | Project folder |
| Generator runtime | Pure TypeScript (API routes) | Jinja2 + Python |

### 🔬 MLOps integration (generated into ZIP)
- **Experiment tracking** — MLflow, W&B, custom, or none
- **Orchestration** — Airflow DAG, Kubeflow pipeline YAML (not empty folders only)
- **Deployment** — FastAPI inference, Docker (+ compose), Kubernetes (deployment/service/configmap)
- **Monitoring** — Evidently drift script, custom metrics collector
- **Cloud packs** — AWS / GCP / Azure folders with Dockerfile, config, deploy scripts

### 📦 Template profiles (Web UI — optional fields)
| Preset config | Effect |
|---------------|--------|
| `quick-start` | Lean output (e.g. skips Makefile) |
| `production-ready` | CI workflow + stronger tests |
| `research` | Starter Jupyter notebook |
| `enterprise` | CI + pre-commit + notebook |

| Custom template | Effect |
|-----------------|--------|
| `minimal` | Essentials only |
| `comprehensive` | CI, pre-commit, notebook |
| `microservice` | API middleware patterns for FastAPI |

### 🎯 Stack presets (Web UI cards)

| Preset | Framework | Tracking | Orchestration | Deploy | Monitor |
|--------|-----------|----------|---------------|--------|---------|
| Quick Start | Sklearn | None | None | FastAPI | None |
| Data Science | Sklearn | MLflow | None | FastAPI | Custom |
| Deep Learning | PyTorch | W&B | None | Docker | None |
| Production MLOps | PyTorch | MLflow | Airflow | Docker | Evidently |
| Enterprise | TensorFlow | MLflow | Kubeflow | Kubernetes | Evidently |
| Research | PyTorch | W&B | None | FastAPI | None |

---

## 🌐 Web UI (Recommended)

The fastest path: open the app, pick a stack preset, configure options, preview files, generate, and download a ZIP.

### Run locally

```bash
cd web_ui
npm install
npm run dev
# Syncs templates/ from repo root, then starts Next.js
# → http://localhost:3000
```

### API routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/options` | Dropdown values for the form |
| `GET` | `/api/preview?framework=...&task_type=...` | File tree preview (defaults for missing fields) |
| `POST` | `/api/preview` | Preview with partial body |
| `POST` | `/api/preview?strict=true` | Preview with full validation |
| `POST` | `/api/generate` | Start async generation → `{ task_id }` |
| `GET` | `/api/status/[taskId]` | Poll progress |
| `GET` | `/api/download/[taskId]` | Download ZIP |

### Web UI tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | Tailwind CSS v4, Syne + DM Sans + JetBrains Mono |
| Forms | react-hook-form + Zod |
| Generator | TypeScript (`web_ui/src/lib/generator/`) |
| Templates | Jinja2 sources in `templates/` (synced on dev/build) |
| Archive | archiver (ZIP) |

### Deploy / self-host

```bash
cd web_ui
npm run build   # runs scripts/sync-templates.mjs then next build
npm start
```

Set the deploy root to **`web_ui`**. The generator runs in API routes — no separate Python server required.

---

## 📦 Python CLI

Install and use the classic Typer CLI (renders `templates/` with Jinja2):

```bash
pip install mlops-project-generator==2.1.0
# or from source:
pip install -e .
```

### Interactive

```bash
mlops-project-generator init
```

### With preset

```bash
mlops-project-generator init --preset production-mlops --project-name my-ml-platform
mlops-project-generator list-presets
```

### Non-interactive (CI/CD)

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

### Advanced CLI (v2.x)

```bash
mlops-project-generator clone <source> --name <target>
mlops-project-generator archive <project> --type zip
mlops-project-generator check_deps --update --security
mlops-project-generator profile --format json
mlops-project-generator migrate <old> <new-framework>
mlops-project-generator doctor --fix --deep
```

### `init` flags

| Flag | Values |
|------|--------|
| `--framework` / `-f` | `sklearn`, `pytorch`, `tensorflow` |
| `--task-type` / `-t` | `classification`, `regression`, `timeseries`, `nlp`, `computer-vision` |
| `--tracking` / `-r` | `mlflow`, `wandb`, `custom`, `none` |
| `--orchestration` / `-o` | `airflow`, `kubeflow`, `none` |
| `--deployment` / `-d` | `fastapi`, `docker`, `kubernetes` |
| `--monitoring` / `-m` | `evidently`, `custom`, `none` |

---

## 📁 Generated project structure

Typical output (varies by stack, preset, and template):

```
your-project/
├── src/
│   ├── train.py                 # or nlp/finetune.py for NLP
│   ├── inference.py
│   ├── data/                    # loaders (+ NLP/CV helpers)
│   ├── models/                  # task-specific model modules
│   └── nlp/                     # Hugging Face (NLP task)
├── configs/
│   ├── config.yaml
│   └── nlp.yaml                 # NLP only
├── dags/                        # Airflow (if selected)
│   └── ml_training_dag.py
├── pipelines/                   # Kubeflow (if selected)
├── k8s/                         # Kubernetes (if selected)
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── scripts/monitoring/          # Evidently / custom monitoring
├── cloud/                       # Optional cloud provider pack
│   └── <provider>/<service>/
├── Dockerfile                   # Docker / K8s deploy
├── docker-compose.yml           # Docker deploy
├── .github/workflows/ci.yml     # production-ready / enterprise preset
├── tests/
├── notebooks/
├── requirements.txt
├── Makefile
├── .env.example
├── generation_insights.json     # if analytics enabled
├── project_config.json
└── README.md
```

---

## 🛠️ Framework & task highlights

### Scikit-learn
- RandomForest / regression / time-series models via Jinja templates
- `DataLoader`, `FeatureEngineering`, joblib persistence

### PyTorch & TensorFlow
- Task-specific model templates (`classification_model`, `regression_model`, `timeseries_model`)
- Training loops with tracking hooks; FastAPI inference when selected

### NLP (Hugging Face)
- Fine-tune with `transformers` + `datasets` + `Trainer`
- Config-driven (`configs/nlp.yaml`), demo data if CSV missing
- FastAPI inference when deployment is FastAPI

### Computer vision
- Image dataset helper + OpenCV/Pillow in requirements

---

## 🚀 Deployment & monitoring (generated)

| Selection | Generated artifacts |
|-----------|---------------------|
| **FastAPI** | `src/inference.py` with `/health` and `/predict` |
| **Docker** | `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `scripts/run_docker.sh` |
| **Kubernetes** | `k8s/*.yaml`, `scripts/deploy_k8s.sh` |
| **Evidently** | `scripts/monitoring/drift_report.py` |
| **Custom monitoring** | `scripts/monitoring/metrics_collector.py` |

---

## 🏗️ Repository structure

```
MLOps-Project-Generator/
├── generator/                 # Python CLI (Typer, renderer, cloud deployer, …)
├── templates/                 # Jinja2 sources (shared by CLI + Web UI sync)
│   ├── common/               # README, requirements, config, snippets, tests
│   ├── sklearn/ | pytorch/ | tensorflow/
│   └── nlp/                  # Hugging Face NLP templates
├── web_ui/                    # Next.js application
│   ├── app/api/              # generate, status, download, options, preview
│   ├── src/
│   │   ├── components/       # MLOpsForm, marketing, form sections
│   │   └── lib/
│   │       ├── generator/    # TS generator + legacy Jinja loader
│   │       ├── server/       # validation, generation pipeline
│   │       └── tasks/        # in-memory task store
│   └── scripts/
│       └── sync-templates.mjs  # copies ../templates → web_ui/templates
├── tests/                     # Python CLI tests
├── pyproject.toml
└── README.md
```

---

## 🧪 Development

### Web UI

```bash
cd web_ui
npm install
npm run dev
npm run build
```

### Python CLI

```bash
pip install -e ".[dev]"
pytest tests/ -v
black generator/ tests/
flake8 generator/ tests/
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Update `templates/` and/or `web_ui/src/lib/generator/` as needed  
4. Run `cd web_ui && npm run build` and `pytest` for CLI changes  
5. Open a pull request  

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 🗺️ Roadmap

### Completed
- [x] Python CLI with interactive + non-interactive modes
- [x] Scikit-learn, PyTorch, TensorFlow templates
- [x] MLflow, W&B, Airflow, Kubeflow, Docker, K8s, Evidently scaffolds
- [x] Multi-cloud deployment templates (AWS, GCP, Azure)
- [x] **Web UI** — Next.js generator with ZIP download
- [x] **TypeScript generator** — no Python runtime on the server
- [x] **Legacy Jinja integration** — `templates/` rendered in Web UI for core ML tasks
- [x] **Hugging Face NLP** — fine-tune + inference stubs
- [x] **Archive preview API** — GET/POST `/api/preview`
- [x] **Deployment & orchestration files** — real DAGs, K8s manifests, Docker Compose
- [x] **Config preset + custom template** profiles in generated ZIPs
- [x] **UI redesign** — marketing sections, stack presets, mobile compact layout
- [x] **Template quality pass** — timeseries naming, model imports, requirements fixes

### Upcoming
- [ ] Shareable project config links
- [ ] Template marketplace
- [ ] Additional frameworks (XGBoost, LightGBM)
- [ ] Deeper NLP/CV model templates in Jinja (beyond stubs)

---

## 📞 Support

- [GitHub Issues](https://github.com/NotHarshhaa/MLOps-Project-Generator/issues)
- [GitHub Discussions](https://github.com/NotHarshhaa/MLOps-Project-Generator/discussions)

---

⭐ If this project helps you, consider starring the repo!

Generated with ❤️ by [MLOps Project Generator](https://github.com/NotHarshhaa/MLOps-Project-Generator)
