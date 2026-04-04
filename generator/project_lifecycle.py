"""
Project lifecycle management for MLOps Project Generator
"""

import json
import shutil
import zipfile
import tarfile
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

console = Console()


class ProjectLifecycleManager:
    """
    Manages project lifecycle operations like cloning, archiving, migration
    """

    def __init__(self):
        self.lifecycle_dir = Path.home() / ".mlops-project-generator" / "lifecycle"
        self.lifecycle_dir.mkdir(parents=True, exist_ok=True)
        self.migration_configs = self.lifecycle_dir / "migration_configs.json"
        self._ensure_migration_configs()

    def _ensure_migration_configs(self):
        """Ensure migration configuration file exists"""
        if not self.migration_configs.exists():
            default_configs = {
                "sklearn_to_pytorch": {
                    "description": "Migrate from Scikit-learn to PyTorch",
                    "file_mappings": {
                        "models/sklearn_model.py": "models/pytorch_model.py",
                        "train_sklearn.py": "train_pytorch.py"
                    },
                    "dependency_changes": {
                        "remove": ["scikit-learn"],
                        "add": ["torch", "torchvision"]
                    }
                },
                "pytorch_to_tensorflow": {
                    "description": "Migrate from PyTorch to TensorFlow",
                    "file_mappings": {
                        "models/pytorch_model.py": "models/tensorflow_model.py",
                        "train_pytorch.py": "train_tensorflow.py"
                    },
                    "dependency_changes": {
                        "remove": ["torch", "torchvision"],
                        "add": ["tensorflow", "keras"]
                    }
                }
            }
            
            with open(self.migration_configs, "w", encoding="utf-8") as f:
                json.dump(default_configs, f, indent=2)

    def clone_project(self, source_path: Path, target_name: str, target_dir: Optional[str] = None, deep_clone: bool = False) -> Path:
        """Clone an existing project"""
        source_path = Path(source_path)
        
        if not source_path.exists():
            raise ValueError(f"Source path '{source_path}' does not exist")
        
        # Determine target directory
        if target_dir:
            target_base = Path(target_dir)
        else:
            target_base = source_path.parent
        
        target_path = target_base / target_name
        
        if target_path.exists():
            raise ValueError(f"Target path '{target_path}' already exists")
        
        # Create target directory
        target_path.mkdir(parents=True, exist_ok=True)
        
        # Files and directories to exclude
        exclude_patterns = {
            "__pycache__", "*.pyc", ".git", ".vscode", ".idea", 
            "*.log", "data/", "models/", "outputs/", "logs/"
        } if not deep_clone else {"__pycache__", "*.pyc", ".git"}
        
        # Copy project files
        for item in source_path.rglob("*"):
            if item.is_file():
                relative_path = item.relative_to(source_path)
                
                # Check if should exclude
                should_exclude = False
                for pattern in exclude_patterns:
                    if pattern.endswith("/"):
                        if str(relative_path).startswith(pattern[:-1]):
                            should_exclude = True
                            break
                    else:
                        if item.match(pattern):
                            should_exclude = True
                            break
                
                if not should_exclude:
                    target_file = target_path / relative_path
                    target_file.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(item, target_file)
        
        # Update project configuration
        self._update_cloned_project_config(target_path, target_name)
        
        return target_path

    def _update_cloned_project_config(self, project_path: Path, new_name: str):
        """Update configuration files for cloned project"""
        # Update README if exists
        readme_file = project_path / "README.md"
        if readme_file.exists():
            content = readme_file.read_text(encoding="utf-8")
            # Simple title replacement
            lines = content.split("\n")
            if lines and lines[0].startswith("# "):
                lines[0] = f"# {new_name.title()}"
            readme_file.write_text("\n".join(lines), encoding="utf-8")
        
        # Update pyproject.toml if exists
        pyproject_file = project_path / "pyproject.toml"
        if pyproject_file.exists():
            content = pyproject_file.read_text(encoding="utf-8")
            # Update name field
            import re
            content = re.sub(r'name = ".*?"', f'name = "{new_name}"', content)
            pyproject_file.write_text(content, encoding="utf-8")

    def archive_project(self, project_path: str, archive_type: str = "zip", 
                       include_data: bool = False, include_models: bool = True) -> Path:
        """Archive a project with selective content inclusion"""
        project_path = Path(project_path)
        
        if not project_path.exists():
            raise ValueError(f"Project path '{project_path}' does not exist")
        
        # Determine archive filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archive_name = f"{project_path.name}_{timestamp}"
        
        # Determine archive path
        archive_path = project_path.parent / f"{archive_name}.{archive_type}"
        
        # Files to include/exclude
        exclude_dirs = set()
        if not include_data:
            exclude_dirs.update(["data", "datasets", "raw_data"])
        if not include_models:
            exclude_dirs.update(["models", "checkpoints", "saved_models"])
        
        exclude_dirs.update(["__pycache__", ".git", ".vscode", ".idea", "outputs", "logs"])
        
        if archive_type == "zip":
            with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_path in project_path.rglob("*"):
                    if file_path.is_file():
                        relative_path = file_path.relative_to(project_path)
                        
                        # Check if should exclude
                        should_exclude = False
                        for exclude_dir in exclude_dirs:
                            if str(relative_path).startswith(exclude_dir + "/") or str(relative_path).startswith(exclude_dir + "\\"):
                                should_exclude = True
                                break
                        
                        if not should_exclude:
                            zipf.write(file_path, relative_path)
        
        elif archive_type in ["tar", "gzip"]:
            mode = "w:gz" if archive_type == "gzip" else "w"
            with tarfile.open(archive_path, mode) as tarf:
                for file_path in project_path.rglob("*"):
                    if file_path.is_file():
                        relative_path = file_path.relative_to(project_path)
                        
                        # Check if should exclude
                        should_exclude = False
                        for exclude_dir in exclude_dirs:
                            if str(relative_path).startswith(exclude_dir + "/") or str(relative_path).startswith(exclude_dir + "\\"):
                                should_exclude = True
                                break
                        
                        if not should_exclude:
                            tarf.add(file_path, relative_path)
        
        else:
            raise ValueError(f"Unsupported archive type: {archive_type}")
        
        return archive_path

    def create_migration_plan(self, project_path: str, target_framework: str) -> Dict[str, Any]:
        """Create a migration plan for framework change"""
        project_path = Path(project_path)
        
        if not project_path.exists():
            raise ValueError(f"Project path '{project_path}' does not exist")
        
        # Detect current framework
        current_framework = self._detect_project_framework(project_path)
        
        if current_framework == target_framework:
            raise ValueError(f"Project already uses {target_framework}")
        
        # Get migration configuration
        migration_key = f"{current_framework}_to_{target_framework}"
        configs = self._load_migration_configs()
        
        if migration_key not in configs:
            # Create generic migration plan
            plan = {
                "source_framework": current_framework,
                "target_framework": target_framework,
                "steps": [
                    f"Update dependencies from {current_framework} to {target_framework}",
                    "Convert model architecture files",
                    "Update training scripts",
                    "Modify inference code",
                    "Update configuration files",
                    "Test migration"
                ],
                "file_changes": self._analyze_project_files(project_path),
                "estimated_time": "2-4 hours",
                "complexity": "medium"
            }
        else:
            config = configs[migration_key]
            plan = {
                "source_framework": current_framework,
                "target_framework": target_framework,
                "description": config["description"],
                "steps": [
                    f"Remove dependencies: {', '.join(config['dependency_changes']['remove'])}",
                    f"Add dependencies: {', '.join(config['dependency_changes']['add'])}",
                    "Convert model files according to mappings",
                    "Update training and inference scripts",
                    "Test and validate migration"
                ],
                "file_mappings": config["file_mappings"],
                "dependency_changes": config["dependency_changes"],
                "estimated_time": "1-3 hours",
                "complexity": "low"
            }
        
        return plan

    def _detect_project_framework(self, project_path: Path) -> str:
        """Detect the ML framework used in a project"""
        requirements_file = project_path / "requirements.txt"
        
        if requirements_file.exists():
            content = requirements_file.read_text(encoding="utf-8").lower()
            
            if "torch" in content or "pytorch" in content:
                return "pytorch"
            elif "tensorflow" in content or "keras" in content:
                return "tensorflow"
            elif "sklearn" in content or "scikit-learn" in content:
                return "sklearn"
        
        # Check pyproject.toml
        pyproject_file = project_path / "pyproject.toml"
        if pyproject_file.exists():
            content = pyproject_file.read_text(encoding="utf-8").lower()
            
            if "torch" in content:
                return "pytorch"
            elif "tensorflow" in content:
                return "tensorflow"
            elif "sklearn" in content:
                return "sklearn"
        
        # Check model files
        models_dir = project_path / "models"
        if models_dir.exists():
            for model_file in models_dir.rglob("*.py"):
                content = model_file.read_text(encoding="utf-8").lower()
                
                if "import torch" in content:
                    return "pytorch"
                elif "import tensorflow" in content or "import keras" in content:
                    return "tensorflow"
                elif "import sklearn" in content or "from sklearn" in content:
                    return "sklearn"
        
        return "unknown"

    def _load_migration_configs(self) -> Dict[str, Any]:
        """Load migration configurations"""
        try:
            with open(self.migration_configs, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def _analyze_project_files(self, project_path: Path) -> List[str]:
        """Analyze project files to identify what needs migration"""
        files_to_migrate = []
        
        for py_file in project_path.rglob("*.py"):
            content = py_file.read_text(encoding="utf-8")
            
            # Check if file contains ML framework code
            if any(keyword in content.lower() for keyword in ["model", "train", "predict", "fit", "transform"]):
                files_to_migrate.append(str(py_file.relative_to(project_path)))
        
        return files_to_migrate

    def execute_migration(self, project_path: str, target_framework: str, config_file: Optional[str] = None) -> Dict[str, Any]:
        """Execute framework migration"""
        project_path = Path(project_path)
        
        if not project_path.exists():
            raise ValueError(f"Project path '{project_path}' does not exist")
        
        # Create migration plan
        plan = self.create_migration_plan(str(project_path), target_framework)
        
        # Create backup
        backup_path = self._create_project_backup(project_path)
        
        try:
            # Execute migration steps
            current_framework = plan["source_framework"]
            migration_key = f"{current_framework}_to_{target_framework}"
            configs = self._load_migration_configs()
            
            if migration_key in configs:
                config = configs[migration_key]
                
                # Update dependencies
                self._update_dependencies(project_path, config["dependency_changes"])
                
                # Rename/convert files
                for old_file, new_file in config["file_mappings"].items():
                    old_path = project_path / old_file
                    new_path = project_path / new_file
                    
                    if old_path.exists():
                        new_path.parent.mkdir(parents=True, exist_ok=True)
                        
                        # Simple file conversion (in real implementation, would be more sophisticated)
                        content = old_path.read_text(encoding="utf-8")
                        converted_content = self._convert_framework_code(content, current_framework, target_framework)
                        new_path.write_text(converted_content, encoding="utf-8")
                        old_path.unlink()
            
            # Update project configuration
            self._update_project_framework_config(project_path, target_framework)
            
            return {
                "success": True,
                "new_project_path": str(project_path),
                "backup_path": str(backup_path),
                "migration_completed": datetime.now().isoformat()
            }
            
        except Exception as e:
            # Restore from backup if migration failed
            console.print(f"❌ Migration failed: {e}")
            console.print(f"🔄 Restoring from backup: {backup_path}")
            self._restore_from_backup(project_path, backup_path)
            raise

    def _create_project_backup(self, project_path: Path) -> Path:
        """Create a backup of the project before migration"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{project_path.name}_backup_{timestamp}"
        backup_path = project_path.parent / backup_name
        
        shutil.copytree(project_path, backup_path)
        return backup_path

    def _restore_from_backup(self, project_path: Path, backup_path: Path):
        """Restore project from backup"""
        if project_path.exists():
            shutil.rmtree(project_path)
        shutil.copytree(backup_path, project_path)

    def _update_dependencies(self, project_path: Path, dependency_changes: Dict[str, List[str]]):
        """Update project dependencies"""
        requirements_file = project_path / "requirements.txt"
        
        if requirements_file.exists():
            content = requirements_file.read_text(encoding="utf-8")
            lines = content.split("\n")
            
            # Remove dependencies
            for dep in dependency_changes.get("remove", []):
                lines = [line for line in lines if not line.startswith(dep)]
            
            # Add dependencies
            for dep in dependency_changes.get("add", []):
                lines.append(dep)
            
            requirements_file.write_text("\n".join(filter(None, lines)), encoding="utf-8")

    def _convert_framework_code(self, content: str, from_framework: str, to_framework: str) -> str:
        """Convert code from one framework to another (simplified)"""
        # This is a simplified conversion - in practice would need more sophisticated parsing
        conversions = {
            ("sklearn", "pytorch"): {
                "from sklearn.": "from torch.",
                "sklearn.": "torch.",
                "model.fit(": "model.train(",
                "model.predict(": "model("
            },
            ("pytorch", "tensorflow"): {
                "import torch": "import tensorflow as tf",
                "torch.": "tf.",
                "nn.Module": "tf.keras.Model",
                "forward(": "call("
            }
        }
        
        key = (from_framework, to_framework)
        if key in conversions:
            for old, new in conversions[key].items():
                content = content.replace(old, new)
        
        return content

    def _update_project_framework_config(self, project_path: Path, framework: str):
        """Update project configuration files with new framework"""
        # Update any configuration files that might reference the framework
        config_files = ["pyproject.toml", "setup.cfg", "config.yaml"]
        
        for config_file in config_files:
            file_path = project_path / config_file
            if file_path.exists():
                content = file_path.read_text(encoding="utf-8")
                # Simple framework reference update
                content = content.replace("sklearn", framework).replace("pytorch", framework).replace("tensorflow", framework)
                file_path.write_text(content, encoding="utf-8")

    def health_check(self, project_path: str, deep_scan: bool = False) -> Dict[str, Any]:
        """Perform comprehensive project health check"""
        project_path = Path(project_path)
        
        if not project_path.exists():
            raise ValueError(f"Project path '{project_path}' does not exist")
        
        health_report = {
            "overall_score": 0,
            "categories": {},
            "fixable_issues": [],
            "recommendations": []
        }
        
        # Check project structure
        structure_score, structure_issues = self._check_project_structure(project_path)
        health_report["categories"]["structure"] = structure_issues
        
        # Check dependencies
        deps_score, deps_issues = self._check_dependencies_health(project_path)
        health_report["categories"]["dependencies"] = deps_issues
        
        # Check configuration
        config_score, config_issues = self._check_configuration(project_path)
        health_report["categories"]["configuration"] = config_issues
        
        # Check code quality
        if deep_scan:
            code_score, code_issues = self._check_code_quality(project_path)
            health_report["categories"]["code_quality"] = code_issues
        else:
            code_score, code_issues = 80, [{"status": "healthy", "message": "Code quality check skipped (use --deep)"}]
            health_report["categories"]["code_quality"] = code_issues
        
        # Calculate overall score
        total_score = (structure_score + deps_score + config_score + code_score) // 4
        health_report["overall_score"] = total_score
        
        # Collect fixable issues
        for category_issues in health_report["categories"].values():
            for issue in category_issues:
                if issue.get("fixable", False):
                    health_report["fixable_issues"].append(issue)
        
        return health_report

    def _check_project_structure(self, project_path: Path) -> tuple[int, List[Dict[str, Any]]]:
        """Check project structure"""
        issues = []
        score = 100
        
        # Required directories
        required_dirs = ["src", "models", "data"]
        for dir_name in required_dirs:
            if not (project_path / dir_name).exists():
                issues.append({
                    "status": "error",
                    "message": f"Missing required directory: {dir_name}",
                    "fixable": True
                })
                score -= 20
        
        # Required files
        required_files = ["README.md", "requirements.txt"]
        for file_name in required_files:
            if not (project_path / file_name).exists():
                issues.append({
                    "status": "warning",
                    "message": f"Missing recommended file: {file_name}",
                    "fixable": True
                })
                score -= 10
        
        return max(0, score), issues

    def _check_dependencies_health(self, project_path: Path) -> tuple[int, List[Dict[str, Any]]]:
        """Check project dependencies"""
        issues = []
        score = 100
        
        requirements_file = project_path / "requirements.txt"
        if not requirements_file.exists():
            issues.append({
                "status": "error",
                "message": "No requirements.txt found",
                "fixable": True
            })
            return 0, issues
        
        # Check for common issues
        content = requirements_file.read_text(encoding="utf-8")
        
        # Check for unpinned versions
        lines = content.split("\n")
        for line in lines:
            line = line.strip()
            if line and not line.startswith("#"):
                if "==" not in line and ">=" not in line and "<=" not in line:
                    issues.append({
                        "status": "warning",
                        "message": f"Unpinned dependency: {line}",
                        "fixable": True
                    })
                    score -= 5
        
        return max(0, score), issues

    def _check_configuration(self, project_path: Path) -> tuple[int, List[Dict[str, Any]]]:
        """Check project configuration"""
        issues = []
        score = 100
        
        # Check for configuration files
        config_files = ["pyproject.toml", "setup.cfg", "config.yaml"]
        has_config = any((project_path / f).exists() for f in config_files)
        
        if not has_config:
            issues.append({
                "status": "warning",
                "message": "No project configuration file found",
                "fixable": True
            })
            score -= 15
        
        return max(0, score), issues

    def _check_code_quality(self, project_path: Path) -> tuple[int, List[Dict[str, Any]]]:
        """Check code quality (basic checks)"""
        issues = []
        score = 100
        
        for py_file in project_path.rglob("*.py"):
            try:
                content = py_file.read_text(encoding="utf-8")
                
                # Check for common issues
                if "TODO" in content or "FIXME" in content:
                    issues.append({
                        "status": "warning",
                        "message": f"TODO/FIXME comments in {py_file.name}",
                        "fixable": False
                    })
                    score -= 5
                
                # Check for long functions (simplified)
                lines = content.split("\n")
                for i, line in enumerate(lines):
                    if line.strip().startswith("def ") and i + 50 < len(lines):
                        function_end = i + 50
                        if "def " in "\n".join(lines[i+1:function_end]):
                            issues.append({
                                "status": "warning",
                                "message": f"Potentially long function in {py_file.name}",
                                "fixable": False
                            })
                            score -= 10
                            break
                            
            except Exception:
                continue
        
        return max(0, score), issues

    def auto_fix_issues(self, project_path: str, issues: List[Dict[str, Any]]) -> List[str]:
        """Automatically fix fixable issues"""
        project_path = Path(project_path)
        fixed_issues = []
        
        for issue in issues:
            if not issue.get("fixable", False):
                continue
            
            message = issue["message"]
            
            if "Missing required directory" in message:
                dir_name = message.split(": ")[1]
                (project_path / dir_name).mkdir(parents=True, exist_ok=True)
                fixed_issues.append(f"Created directory: {dir_name}")
            
            elif "Missing recommended file" in message:
                file_name = message.split(": ")[1]
                file_path = project_path / file_name
                
                if file_name == "README.md":
                    content = f"# {project_path.name}\n\nProject description here.\n"
                    file_path.write_text(content, encoding="utf-8")
                elif file_name == "requirements.txt":
                    content = "# Add your dependencies here\n"
                    file_path.write_text(content, encoding="utf-8")
                
                fixed_issues.append(f"Created file: {file_name}")
            
            elif "No requirements.txt found" in message:
                content = "# Add your dependencies here\n"
                (project_path / "requirements.txt").write_text(content, encoding="utf-8")
                fixed_issues.append("Created requirements.txt")
        
        return fixed_issues
