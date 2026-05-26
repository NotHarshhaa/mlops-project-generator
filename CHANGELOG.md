# 📋 Changelog

All notable changes to MLOps Project Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-05-26

### Added
- **NLP templates** (`templates/nlp/`) — Hugging Face fine-tune config and `Trainer` entrypoint
- **Shared model import snippet** (`templates/common/snippets/model_import.py.j2`) — fixes `TimeSeriesModel` naming
- **Improved common templates** — `.env.example`, smoke tests, Makefile/README Jinja updates
- **Renderer** — loads NLP template dir when `task_type` is `nlp`; skips `snippets/` from standalone output
- **Context** — `author_slug`, Python 3.11 default in generated projects

### Changed
- **Unified `timeseries`** task naming (replaced mixed `time-series` in templates)
- **requirements.txt.j2** — deduplicated deps, fixed Docker deploy condition, NLP/CV packages
- **config.yaml.j2** — NLP/CV/timeseries blocks, `author_slug` for W&B entity
- **Train/inference templates** — use `TaskModel` via shared snippet (PyTorch, TensorFlow, sklearn)
- **sklearn `model.py.j2`** — removed invalid inline Jinja expression for default model type
- **sklearn `data_loader.py.j2`** — sample data for NLP and computer-vision tasks

### Fixed
- **Version consistency** — CLI, `__init__.py`, and `project_config.json` use `2.1.0`

### PyPI
- Install: `pip install mlops-project-generator==2.1.0`

---

## [2.0.1] - 2026-04-04

### 🔧 **BUG FIXES**
- **Version Consistency**: Fixed version display across all components
- **PyPI Compatibility**: Resolved filename reuse issue with v2.0.1 release
- **Test Fixes**: Updated version tests to match current version

### 📦 **PYPI RELEASE**
- **Version 2.0.1**: Corrected enterprise release with proper versioning
- **Installation**: `pip install mlops-project-generator==2.0.1`

---

## [2.0.0] - 2026-04-04

### 🎉 **MAJOR ENTERPRISE RELEASE**

#### 🚀 **Advanced CLI Commands**
- **clone**: Smart project cloning with configuration preservation
- **archive**: Selective project archiving (exclude data/models)
- **check_deps**: Dependency management with security vulnerability scanning
- **profile**: Performance profiling and resource usage analysis
- **migrate**: Framework migration with automated code conversion
- **doctor**: Comprehensive health checks with auto-fix capabilities

#### 📊 **Enhanced Analytics System**
- **AI-Powered Insights**: Actionable recommendations based on project patterns
- **Trending Analysis**: Framework usage, complexity trends, deployment patterns
- **Benchmarking**: Compare projects against historical data
- **Productivity Metrics**: Projects per month, file/line generation statistics
- **Export Reports**: Comprehensive analytics reports in JSON format

#### ⚙️ **Advanced Configuration Management**
- **Environment Configs**: Development/staging/production configurations
- **Configuration Templates**: Reusable templates for different use cases
- **Configuration Pipelines**: Multi-stage deployment configurations
- **Diff & Merge**: Configuration comparison and merging capabilities
- **Backup & Restore**: Configuration backup and restoration system

#### ☁️ **Production-Ready Cloud Deployment**
- **Real AWS Templates**: Multi-stage Dockerfiles, proper error handling, security best practices
- **GitHub Actions CI/CD**: Testing, security scanning, automated deployment
- **CloudWatch Monitoring**: Dashboards, alerting configurations
- **Security Best Practices**: IAM roles, VPC configuration, encryption
- **Production Configs**: Resource limits, scaling policies, security configurations

#### 🔒 **Security-First Approach**
- **Vulnerability Scanning**: Automated security checks for dependencies
- **Compliance Templates**: SOC2, GDPR, HIPAA-ready configurations
- **Security Best Practices**: IAM roles, VPC, encryption by default
- **Automated Security Updates**: Dependency security patching
- **Security Reporting**: Comprehensive security analysis reports

#### 🔄 **Project Lifecycle Management**
- **Smart Cloning**: Preserve configuration while excluding unnecessary files
- **Framework Migration**: Automated code conversion between ML frameworks
- **Health Checks**: Comprehensive project validation with auto-fix
- **Performance Profiling**: Resource usage analysis, optimization recommendations
- **Dependency Management**: Security scanning, version pinning, conflict resolution

### 🔧 **TECHNICAL IMPROVEMENTS**

#### **Enterprise Architecture**
- **Modular Design**: Separate concerns for scalability
- **Production Error Handling**: Enterprise-grade error management
- **Security Integration**: Security scanning throughout the pipeline
- **Performance Optimization**: Resource usage optimization
- **Real-world Integrations**: Actual cloud services and tools

#### **No Dummy Content**
- **Real Dockerfiles**: Multi-stage builds with security best practices
- **Production Code**: Proper error handling, logging, monitoring integration
- **Real Cloud Templates**: Actual CloudFormation, Terraform-ready configurations
- **Security Best Practices**: IAM roles, VPC configuration, encryption
- **Monitoring Integration**: Real metrics, alerts, dashboard configurations

### 📚 **DOCUMENTATION & EXAMPLES**

#### **Enhanced Documentation**
- **README Updates**: Complete v2.0.0 feature documentation
- **Enterprise Features**: Security, monitoring, CI/CD documentation
- **CLI Examples**: Comprehensive examples for all new commands
- **Best Practices**: Production deployment guides
- **Security Guides**: Security configuration and compliance

#### **Usage Examples**
```bash
# Clone project with configuration preservation
mlops-project-generator clone existing-project --name new-project --exclude-data

# Check dependencies with security scanning
mlops-project-generator check_deps --update --security --fix

# Profile project performance
mlops-project-generator profile --project my-ml-platform --format json

# Migrate between frameworks
mlops-project-generator migrate sklearn-project pytorch --auto-convert

# Comprehensive health check
mlops-project-generator doctor --fix --deep --generate-report

# Export analytics report
mlops-project-generator export-analytics --format json --output report.json
```

### 🧪 **TESTING**
- **Enterprise Test Suite**: Comprehensive testing for all new features
- **Security Testing**: Vulnerability scanning and security validation
- **Performance Testing**: Resource usage and optimization testing
- **Integration Testing**: End-to-end testing of enterprise workflows
- **CI/CD Testing**: Complete pipeline testing with real deployments

### 🔄 **BACKWARD COMPATIBILITY**
- **Fully Compatible**: All existing v1.x functionality preserved
- **Seamless Upgrade**: No breaking changes from v1.0.8
- **Optional Features**: New enterprise features are completely optional
- **Migration Path**: Clear upgrade path for existing projects

### 📦 **PYPI RELEASE**
- **Version 2.0.0**: Enterprise-ready release
- **Package Validation**: All security and quality checks passed
- **Installation**: `pip install mlops-project-generator==2.0.0`

---

## [1.0.8] - 2026-03-25

### 🎉 **MAJOR NEW FEATURES**

#### 📦 **Stack Presets System**
- **6 Pre-configured Stacks**: Ready-to-use MLOps configurations for common use cases
- **Quick Start**: Zero friction setup with Scikit-learn + FastAPI
- **Data Science**: Exploration focused with Scikit-learn + MLflow + FastAPI
- **Deep Learning**: PyTorch-first setup with Weights & Biases tracking
- **Production MLOps**: Full observability with PyTorch + MLflow + Airflow + Docker + Evidently
- **Enterprise**: Maximum scale with TensorFlow + MLflow + Kubeflow + Kubernetes + Evidently
- **Research**: Experimentation optimized with PyTorch + W&B + FastAPI

#### 🚀 **Enhanced CLI Experience**
- **New `--preset` Flag**: Generate projects with pre-configured stacks
- **Preset Override Support**: Individual flags can override preset values
- **Enhanced `list-presets`**: Beautiful table display of all stack presets
- **Case-Insensitive Preset Names**: Flexible preset selection
- **Comprehensive Error Handling**: Clear messages for invalid presets

### 🔧 **TECHNICAL IMPROVEMENTS**

#### **New Stack Presets Module**
- **`generator/stack_presets.py`**: Centralized preset configuration management
- **Preset Validation**: Ensures all preset values are valid options
- **Flexible Override System**: Individual flags can modify preset values
- **Comprehensive Testing**: Full test coverage for preset functionality

#### **CLI Enhancements**
- **Updated `init` Command**: Added `--preset` parameter with full integration
- **Enhanced Help System**: Updated command documentation and examples
- **Better Error Messages**: Improved user feedback for invalid inputs
- **Version Consistency**: Updated version across all modules (v1.0.8)

### 📚 **DOCUMENTATION & EXAMPLES**

#### **Updated Documentation**
- **README Updates**: New "What's New in v1.0.8" section
- **CLI Examples**: Comprehensive preset usage examples
- **Installation Guide**: Updated to show specific version (1.0.8)
- **Feature Highlights**: Stack presets prominently featured

#### **Usage Examples**
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

### 🧪 **TESTING**
- **New Test Suite**: `tests/test_stack_presets.py` with comprehensive coverage
- **Preset Validation Tests**: All 6 presets tested for correctness
- **Override Functionality Tests**: Verify preset override behavior
- **Error Handling Tests**: Invalid preset name and edge cases
- **Integration Tests**: End-to-end preset workflow testing

### 🔄 **BACKWARD COMPATIBILITY**
- **Fully Compatible**: All existing functionality preserved
- **Seamless Upgrade**: No breaking changes from v1.0.7
- **Optional Feature**: Presets are completely optional, existing workflows unchanged

### 📦 **PYPI RELEASE**
- **Version 1.0.8**: Successfully published to PyPI
- **Package Validation**: All checks passed before upload
- **Installation**: `pip install mlops-project-generator==1.0.8`

---

## [1.0.7] - 2026-01-26

### 🚀 **MAJOR NEW FEATURES**

#### ⚙️ **Configuration Management System**
- **Save/Load Presets**: Store and reuse project configurations across teams
- **Built-in Templates**: Quick-start, production-ready, research, and enterprise presets
- **Import/Export**: Share configurations as JSON files
- **Configuration Validation**: Ensure configuration integrity and compatibility
- **New Commands**: `save-preset`, `list-presets`, `load-preset`, `delete-preset`

#### 🎨 **Template Customization System**
- **Custom Templates**: Create templates based on existing frameworks (sklearn, pytorch, tensorflow)
- **File Management**: Add/remove custom files from templates
- **Template Validation**: Check template integrity and Jinja2 syntax
- **Import/Export**: Share custom templates with your team
- **Template Metadata**: Track template creation, base framework, and modifications
- **New Commands**: `create-template`, `list-templates`, `delete-template`, `add-template-file`

#### 📊 **Project Analytics & Metrics**
- **Usage Tracking**: Automatic tracking of all project generations with metadata
- **Statistics Dashboard**: Framework usage, deployment patterns, complexity analysis
- **Project Analysis**: Detailed analysis of generated projects (files, lines, structure)
- **Smart Recommendations**: Get suggestions based on project configuration
- **Project History**: Track all generated projects with timestamps and configurations
- **New Commands**: `stats`, `analyze`

#### ☁️ **Multi-Cloud Deployment Templates**
- **AWS Support**: SageMaker, ECS, Lambda deployment templates with CloudFormation
- **GCP Support**: Vertex AI, Cloud Run, AI Platform templates with Cloud Build
- **Azure Support**: Azure ML, Container Instances, Functions templates
- **Auto-Generation**: Create cloud-specific deployment files automatically
- **Cloud Configuration**: Provider-specific settings and best practices
- **New Commands**: `cloud-services`, `cloud-deploy`

#### 🔍 **Interactive Project Browser**
- **Project Navigation**: Browse and explore generated projects interactively
- **Search & Filter**: Find projects by framework, task type, deployment method
- **Project Comparison**: Compare multiple projects side-by-side
- **File Explorer**: Navigate project directories and view file contents
- **Export/Import**: Share project lists with team members
- **New Commands**: `browse`, `export-projects`, `import-projects`

### 🔧 **ENHANCEMENTS**

#### **CLI Expansion**
- **15+ New Commands**: Expanded from 3 to 18 CLI commands
- **Command Categories**: Organized into Core, Configuration, Templates, Analytics, Cloud, Browser
- **Enhanced Help**: Comprehensive help documentation for all commands
- **Better UX**: Improved command structure and argument handling

#### **Renderer Improvements**
- **Cloud Template Support**: Automatic generation of cloud deployment templates
- **Project Configuration**: Save project configuration as JSON for reuse
- **Analytics Integration**: Automatic tracking of project generations
- **Enhanced Context**: Additional template variables for cloud deployments

#### **Enhanced Framework Support**
- **Extended Task Types**: Added NLP and Computer Vision task types
- **Better Detection**: Improved framework detection in project analysis
- **Cloud Integration**: Framework-specific cloud deployment optimizations

### 🧪 **TESTING**
- **15 New Test Cases**: Comprehensive testing for all new features
- **Integration Tests**: End-to-end testing of new workflows
- **Mock Testing**: Proper mocking for external dependencies
- **Coverage**: Maintained high test coverage with new features

### 📚 **DOCUMENTATION**
- **Updated README**: Comprehensive documentation of all new features
- **Command Reference**: Complete CLI command reference with examples
- **Usage Examples**: Real-world examples for all major features
- **Updated Roadmap**: Reflects completed and upcoming features

### 🔄 **BACKWARD COMPATIBILITY**
- **Fully Compatible**: All existing functionality preserved
- **Migration Path**: Seamless upgrade from v1.0.6
- **Configuration**: Existing projects continue to work unchanged

---

## [1.0.6] - 2026-01-18

### ✨ **NEW FEATURES**
- **🔍 Project Validation Command**: New `mlops-project-generator validate` command
- **📋 Comprehensive Validation**: Checks project structure, configuration, and deployment readiness
- **🎯 Framework-Specific Validation**: Validates sklearn, PyTorch, and TensorFlow projects
- **🚀 Deployment Readiness**: Validates Docker, FastAPI, and deployment configurations
- **🔬 MLflow Configuration**: Validates experiment tracking setup
- **📁 Data Folder Safety**: Checks data directory structure and .gitignore files
- **📚 Documentation Validation**: Ensures proper documentation exists

### 🎯 **VALIDATION FEATURES**
- **Smart Framework Detection**: Automatically detects ML framework from project files
- **Detailed Reporting**: Beautiful Rich UI with pass/warn/fail status
- **Professional Output**: Summary panel, detailed results table, and recommendations
- **Flexible Path Support**: Validate any project path with `--path` option
- **Exit Codes**: Proper exit codes for CI/CD integration

### 🔧 **TECHNICAL IMPROVEMENTS**
- **Modular Design**: Separate validator module for easy extension
- **Rich UI Integration**: Beautiful terminal output with tables and panels
- **Comprehensive Testing**: Full test coverage for validation functionality
- **Error Handling**: Graceful error handling and user feedback

### 📋 **VALIDATION CHECKS**
- **Project Structure**: Required directories (src, configs, data, models, scripts)
- **Configuration Files**: config.yaml, requirements.txt, Makefile, .gitignore
- **Framework Files**: Framework-specific files (model.py, train.py, etc.)
- **Deployment Files**: Dockerfile, FastAPI, docker-compose.yml
- **MLflow Setup**: mlruns directory, MLflow configuration
- **Data Safety**: Data directories with proper .gitignore files
- **Dependencies**: Python packages and ML framework detection
- **Documentation**: README.md, CHANGELOG.md, docs/ directory

### 🚀 **USAGE EXAMPLES**
```bash
# Validate current directory
mlops-project-generator validate

# Validate specific project
mlops-project-generator validate --path /path/to/project

# CI/CD integration
mlops-project-generator validate --path . || exit 1
```

---

## [1.0.5] - 2026-01-18

### ✨ **NEW FEATURES**
- **🤖 Non-Interactive CLI Mode**: Generate projects with command-line flags
- **🚀 CI/CD Ready**: Perfect for automation and DevOps pipelines
- **📋 Complete CLI Flags**: Full configuration via command-line options
- **⚡ Smart Defaults**: Automatic fallbacks for unspecified options

### 🎯 **USE CASES ENABLED**
- **GitHub Actions Integration**: Automated project generation
- **GitLab CI/CD**: Pipeline-based project creation
- **Jenkins Integration**: Enterprise automation
- **Docker Workflows**: Container-based generation

### 🔧 **TECHNICAL IMPROVEMENTS**
- **Zero Breaking Changes**: Existing workflows preserved
- **Smart Mode Detection**: Auto-switch between interactive/non-interactive
- **Clean Output**: Log-friendly messages for CI/CD
- **Enhanced Testing**: Comprehensive test coverage for new features

### 📚 **DOCUMENTATION**
- **Updated README**: Complete CLI reference and examples
- **CI/CD Integration**: Ready-to-use pipeline templates
- **Use Case Examples**: Real-world implementation guides

### 🚀 **CLI FLAGS ADDED**
- `--framework, -f`: ML framework (sklearn, pytorch, tensorflow)
- `--task-type, -t`: Task type (classification, regression, time-series, nlp, computer-vision)
- `--tracking, -r`: Experiment tracking (mlflow, wandb, custom, none)
- `--orchestration, -o`: Orchestration (airflow, kubeflow, none)
- `--deployment, -d`: Deployment (fastapi, docker, kubernetes)
- `--monitoring, -m`: Monitoring (evidently, custom, none)
- `--project-name, -p`: Project name
- `--author-name, -a`: Author name
- `--description, --desc`: Project description

### 📦 **EXAMPLES**
```bash
# Quick start with defaults
mlops-project-generator init --framework sklearn --project-name my-project

# Full configuration
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

---

## [1.0.2] - 2026-01-17

### 🛠️ **STABILITY & COMPATIBILITY**
- **Fixed PyPI publishing**: Resolved version conflicts
- **Updated dependencies**: Latest stable versions
- **Improved error handling**: Better user feedback
- **Enhanced documentation**: Updated guides and examples

### 🔧 **TECHNICAL FIXES**
- **Version bump**: Updated to v1.0.2 for PyPI compatibility
- **License configuration**: Fixed metadata issues
- **Build process**: Improved package building
- **CI/CD workflows**: Refined GitHub Actions

---

## [1.0.1] - 2026-01-16

### 🔧 **PRODUCTION FIXES**
- **License configuration**: Fixed PyPI metadata
- **Template improvements**: Enhanced project structures
- **CI/CD workflows**: Refined GitHub Actions
- **Mobile optimization**: Improved website responsiveness

### 🎨 **WEBSITE IMPROVEMENTS**
- **Mobile compatibility**: Fixed responsive design issues
- **Theme toggle**: Added dark/light mode support
- **Performance**: Optimized loading and interactions
- **Documentation**: Updated user guides

### 🛠️ **DEVELOPMENT**
- **Code quality**: Fixed linting issues
- **Test coverage**: Improved test reliability
- **Build process**: Enhanced packaging workflow
- **Dependencies**: Updated to latest stable versions

---

## [1.0.0] - 2026-01-15

### 🎉 **INITIAL RELEASE**
- **Core functionality**: Interactive CLI with Rich UI
- **Multi-framework support**: Scikit-learn, PyTorch, TensorFlow
- **MLOps integration**: MLflow, W&B, Airflow, Kubeflow
- **Production templates**: Docker, FastAPI, Kubernetes

### ✨ **FEATURES**
- **🔧 Framework Support**: Scikit-learn, PyTorch, TensorFlow/Keras
- **📊 Task Types**: Classification, Regression, Time-Series
- **🔬 Experiment Tracking**: MLflow, W&B
- **🎯 Orchestration**: Airflow, Kubeflow
- **🚀 Deployment**: FastAPI, Docker, Kubernetes
- **📈 Monitoring**: Evidently AI, Custom solutions
- **🛠️ Production-Ready**: CI/CD, monitoring, best practices by default

### 🌟 **ADVANCED FEATURES**
- **🔍 Smart System Validation**: Automatic system checks
- **🧠 Intelligent Project Generation**: Smart naming and estimation
- **📊 Enhanced User Experience**: Beautiful progress indicators
- **🔧 Advanced Template Features**: Dynamic configurations

### 🧪 **TESTING**
- **Comprehensive test coverage**: 39 test cases
- **Multiple test types**: Unit, integration, CLI tests
- **Code quality**: Black, isort, flake8, mypy compliance
- **CI/CD ready**: GitHub Actions workflows

### 📦 **PACKAGING**
- **PyPI published**: Easy installation via pip
- **Cross-platform**: Windows, macOS, Linux support
- **Python 3.8+**: Broad compatibility range
- **Zero dependencies**: Minimal installation requirements

### 📚 **DOCUMENTATION**
- **Complete README**: Comprehensive usage guide
- **Screenshots**: Visual examples of CLI usage
- **Templates**: Well-documented project structures
- **Best practices**: Industry-standard MLOps patterns

---

## 🔮 **PLANNED RELEASES**

### [v1.1] - Additional Frameworks
- **XGBoost**: Gradient boosting framework
- **LightGBM**: Microsoft's gradient boosting
- **CatBoost**: Yandex's gradient boosting
- **Hugging Face**: Transformers and NLP models

### [v1.2] - Cloud Deployment Templates
- **AWS**: SageMaker, ECS, Lambda deployments
- **GCP**: Vertex AI, Cloud Run, GKE templates
- **Azure**: Machine Learning, Container Instances
- **Cloud-agnostic**: Terraform and Pulumi templates

### [v1.3] - Advanced Monitoring
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **ELK Stack**: Centralized logging
- **Custom monitoring**: Framework-specific solutions

### [v2.0] - GUI Interface
- **Web interface**: Browser-based project generation
- **Desktop app**: Electron-based application
- **Visual designer**: Drag-and-drop project builder
- **Real-time preview**: Live project structure preview

### [v2.1] - Template Marketplace
- **Community templates**: User-contributed templates
- **Template sharing**: Easy sharing and discovery
- **Version control**: Template versioning and updates
- **Quality assurance**: Template validation and testing

---

## 📊 **STATISTICS**

- **Total Releases**: 5 (v1.0.0, v1.0.1, v1.0.2, v1.0.5)
- **Features Added**: 20+ major features
- **Test Coverage**: 95%+ code coverage
- **Frameworks Supported**: 3 (with more planned)
- **Deployment Options**: 3 production-ready options
- **Monitoring Solutions**: 2 integrated solutions

---

## 🤝 **CONTRIBUTING**

To contribute to this changelog:

1. **Add new entries** under the appropriate version
2. **Follow the format** consistently with existing entries
3. **Use semantic versioning** for version numbers
4. **Include dates** for all releases
5. **Categorize changes** appropriately (Added, Changed, Deprecated, Removed, Fixed, Security)

---

## 📞 **SUPPORT**

For questions about the changelog:

- 📧 Email: contact@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/NotHarshhaa/MLOps-Project-Generator/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/NotHarshhaa/MLOps-Project-Generator/discussions)

---

⭐ **Star History**: [View Star History](https://star-history.dev/#NotHarshhaa/MLOps-Project-Generator)

Generated with ❤️ by [MLOps Project Generator](https://github.com/NotHarshhaa/MLOps-Project-Generator)
