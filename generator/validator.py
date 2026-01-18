#!/usr/bin/env python3
"""
Project validation functionality for MLOps Project Generator
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import yaml
import json

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.tree import Tree
from rich import box


class ValidationResult:
    """Represents the result of a validation check"""
    
    def __init__(self, name: str, status: str, message: str, details: Optional[str] = None):
        self.name = name
        self.status = status  # 'PASS', 'WARN', 'FAIL'
        self.message = message
        self.details = details


class ProjectValidator:
    """Validates MLOps project structure and configuration"""
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.console = Console()
        self.results: List[ValidationResult] = []
        
    def validate_all(self) -> bool:
        """Run all validation checks"""
        self.console.print("🔍 [bold blue]Validating MLOps Project Structure...[/bold blue]")
        self.console.print()
        
        # Core structure validation
        self._validate_project_structure()
        self._validate_config_files()
        self._validate_framework_files()
        self._validate_deployment_readiness()
        self._validate_mlflow_config()
        self._validate_data_folders()
        self._validate_dependencies()
        self._validate_documentation()
        
        # Display results
        self._display_results()
        
        # Return overall status
        return all(result.status != 'FAIL' for result in self.results)
    
    def _validate_project_structure(self):
        """Validate basic project structure"""
        required_dirs = [
            "src",
            "configs",
            "data",
            "models",
            "scripts"
        ]
        
        optional_dirs = [
            "notebooks",
            "tests",
            "mlruns",
            "docs"
        ]
        
        # Check required directories
        for dir_name in required_dirs:
            dir_path = self.project_path / dir_name
            if dir_path.exists() and dir_path.is_dir():
                self.results.append(
                    ValidationResult(
                        f"Directory: {dir_name}",
                        "PASS",
                        f"✅ {dir_name}/ directory exists"
                    )
                )
            else:
                self.results.append(
                    ValidationResult(
                        f"Directory: {dir_name}",
                        "FAIL",
                        f"❌ {dir_name}/ directory missing"
                    )
                )
        
        # Check optional directories
        for dir_name in optional_dirs:
            dir_path = self.project_path / dir_name
            if dir_path.exists() and dir_path.is_dir():
                self.results.append(
                    ValidationResult(
                        f"Optional: {dir_name}",
                        "PASS",
                        f"✅ {dir_name}/ directory exists (optional)"
                    )
                )
    
    def _validate_config_files(self):
        """Validate configuration files"""
        config_files = [
            ("configs/config.yaml", "Main configuration file"),
            ("configs/requirements.txt", "Python dependencies"),
            ("Makefile", "Build and development commands"),
            (".gitignore", "Git ignore rules"),
            ("README.md", "Project documentation")
        ]
        
        for file_path, description in config_files:
            full_path = self.project_path / file_path
            if full_path.exists() and full_path.is_file():
                self.results.append(
                    ValidationResult(
                        f"Config: {file_path}",
                        "PASS",
                        f"✅ {description} exists"
                    )
                )
            else:
                severity = "FAIL" if file_path in ["configs/config.yaml", "requirements.txt"] else "WARN"
                icon = "❌" if severity == "FAIL" else "⚠️"
                self.results.append(
                    ValidationResult(
                        f"Config: {file_path}",
                        severity,
                        f"{icon} {description} missing"
                    )
                )
    
    def _validate_framework_files(self):
        """Validate framework-specific files"""
        # Detect framework from config or structure
        framework = self._detect_framework()
        
        if framework == "sklearn":
            self._validate_sklearn_files()
        elif framework == "pytorch":
            self._validate_pytorch_files()
        elif framework == "tensorflow":
            self._validate_tensorflow_files()
        else:
            self.results.append(
                ValidationResult(
                    "Framework Detection",
                    "WARN",
                    "⚠️ Could not detect framework (sklearn/pytorch/tensorflow)"
                )
            )
    
    def _detect_framework(self) -> Optional[str]:
        """Detect the ML framework from project structure"""
        src_dir = self.project_path / "src"
        
        if not src_dir.exists():
            return None
            
        # Check for framework-specific files
        if (src_dir / "model.py").exists():
            content = (src_dir / "model.py").read_text()
            if "torch" in content or "nn.Module" in content:
                return "pytorch"
            elif "tensorflow" in content or "tf." in content:
                return "tensorflow"
            else:
                return "sklearn"
        
        return None
    
    def _validate_sklearn_files(self):
        """Validate Scikit-learn specific files"""
        required_files = [
            "src/model.py",
            "src/train.py",
            "src/predict.py"
        ]
        
        for file_path in required_files:
            full_path = self.project_path / file_path
            if full_path.exists():
                self.results.append(
                    ValidationResult(
                        f"Sklearn: {file_path}",
                        "PASS",
                        f"✅ {file_path} exists"
                    )
                )
            else:
                self.results.append(
                    ValidationResult(
                        f"Sklearn: {file_path}",
                        "FAIL",
                        f"❌ {file_path} missing"
                    )
                )
    
    def _validate_pytorch_files(self):
        """Validate PyTorch specific files"""
        required_files = [
            "src/model.py",
            "src/train.py",
            "src/dataset.py"
        ]
        
        for file_path in required_files:
            full_path = self.project_path / file_path
            if full_path.exists():
                # Additional PyTorch-specific checks
                if file_path == "src/model.py":
                    content = full_path.read_text()
                    if "nn.Module" in content and "forward" in content:
                        self.results.append(
                            ValidationResult(
                                f"PyTorch: {file_path}",
                                "PASS",
                                f"✅ {file_path} contains nn.Module"
                            )
                        )
                        continue
                
                self.results.append(
                    ValidationResult(
                        f"PyTorch: {file_path}",
                        "PASS",
                        f"✅ {file_path} exists"
                    )
                )
            else:
                self.results.append(
                    ValidationResult(
                        f"PyTorch: {file_path}",
                        "FAIL",
                        f"❌ {file_path} missing"
                    )
                )
    
    def _validate_tensorflow_files(self):
        """Validate TensorFlow specific files"""
        required_files = [
            "src/model.py",
            "src/train.py"
        ]
        
        for file_path in required_files:
            full_path = self.project_path / file_path
            if full_path.exists():
                # Additional TensorFlow-specific checks
                if file_path == "src/model.py":
                    content = full_path.read_text()
                    if "tf.keras" in content or "tensorflow" in content:
                        self.results.append(
                            ValidationResult(
                                f"TensorFlow: {file_path}",
                                "PASS",
                                f"✅ {file_path} contains TensorFlow code"
                            )
                        )
                        continue
                
                self.results.append(
                    ValidationResult(
                        f"TensorFlow: {file_path}",
                        "PASS",
                        f"✅ {file_path} exists"
                    )
                )
            else:
                self.results.append(
                    ValidationResult(
                        f"TensorFlow: {file_path}",
                        "FAIL",
                        f"❌ {file_path} missing"
                    )
                )
    
    def _validate_deployment_readiness(self):
        """Validate deployment configuration"""
        deployment_files = [
            ("Dockerfile", "Docker containerization", "WARN"),
            ("docker-compose.yml", "Docker Compose orchestration", "WARN"),
            ("src/api.py", "FastAPI endpoint", "WARN"),
            ("requirements.txt", "Python dependencies for deployment", "FAIL")
        ]
        
        for file_path, description, default_severity in deployment_files:
            full_path = self.project_path / file_path
            if full_path.exists():
                # Additional validation for specific files
                if file_path == "Dockerfile":
                    content = full_path.read_text()
                    if "FROM python" in content and "COPY" in content:
                        self.results.append(
                            ValidationResult(
                                f"Deployment: {file_path}",
                                "PASS",
                                f"✅ {description} - valid Dockerfile"
                            )
                        )
                        continue
                
                elif file_path == "src/api.py":
                    content = full_path.read_text()
                    if "FastAPI" in content and "@app" in content:
                        self.results.append(
                            ValidationResult(
                                f"Deployment: {file_path}",
                                "PASS",
                                f"✅ {description} - FastAPI detected"
                            )
                        )
                        continue
                
                self.results.append(
                    ValidationResult(
                        f"Deployment: {file_path}",
                        "PASS",
                        f"✅ {description} exists"
                    )
                )
            else:
                severity = default_severity
                icon = "⚠️" if severity == "WARN" else "❌"
                self.results.append(
                    ValidationResult(
                        f"Deployment: {file_path}",
                        severity,
                        f"{icon} {description} missing"
                    )
                )
    
    def _validate_mlflow_config(self):
        """Validate MLflow configuration"""
        mlflow_files = [
            ("mlruns", "MLflow tracking directory"),
            (".mlflow", "MLflow configuration"),
            ("configs/mlflow_config.yaml", "MLflow config file")
        ]
        
        for file_path, description in mlflow_files:
            full_path = self.project_path / file_path
            if full_path.exists():
                self.results.append(
                    ValidationResult(
                        f"MLflow: {file_path}",
                        "PASS",
                        f"✅ {description} exists"
                    )
                )
            else:
                severity = "WARN"  # MLflow files are optional
                self.results.append(
                    ValidationResult(
                        f"MLflow: {file_path}",
                        severity,
                        f"⚠️ {description} missing (optional)"
                    )
                )
    
    def _validate_data_folders(self):
        """Validate data folder structure and safety"""
        data_dirs = [
            ("data/raw", "Raw data directory"),
            ("data/processed", "Processed data directory"),
            ("data/external", "External data directory")
        ]
        
        for dir_path, description in data_dirs:
            full_path = self.project_path / dir_path
            if full_path.exists() and full_path.is_dir():
                # Check if directory is empty (good for new projects)
                files = list(full_path.glob("*"))
                if not files:
                    self.results.append(
                        ValidationResult(
                            f"Data: {dir_path}",
                            "PASS",
                            f"✅ {description} exists (empty - ready for data)"
                        )
                    )
                else:
                    self.results.append(
                        ValidationResult(
                            f"Data: {dir_path}",
                            "PASS",
                            f"✅ {description} exists ({len(files)} files)"
                        )
                    )
                
                # Check .gitignore in data directory
                gitignore_path = full_path / ".gitignore"
                if gitignore_path.exists():
                    self.results.append(
                        ValidationResult(
                            f"Data Safety: {dir_path}/.gitignore",
                            "PASS",
                            f"✅ Data directory has .gitignore (safe)"
                        )
                    )
                else:
                    self.results.append(
                        ValidationResult(
                            f"Data Safety: {dir_path}/.gitignore",
                            "WARN",
                            f"⚠️ Consider adding .gitignore to {dir_path}"
                        )
                    )
            else:
                self.results.append(
                    ValidationResult(
                        f"Data: {dir_path}",
                        "WARN",
                        f"⚠️ {description} missing (optional)"
                    )
                )
    
    def _validate_dependencies(self):
        """Validate Python dependencies"""
        req_file = self.project_path / "requirements.txt"
        if req_file.exists():
            try:
                content = req_file.read_text()
                lines = [line.strip() for line in content.split('\n') if line.strip() and not line.startswith('#')]
                
                if len(lines) >= 3:
                    self.results.append(
                        ValidationResult(
                            "Dependencies: requirements.txt",
                            "PASS",
                            f"✅ {len(lines)} dependencies found"
                        )
                    )
                else:
                    self.results.append(
                        ValidationResult(
                            "Dependencies: requirements.txt",
                            "WARN",
                            f"⚠️ Only {len(lines)} dependencies found"
                        )
                    )
                
                # Check for common ML packages
                ml_packages = ["scikit-learn", "torch", "tensorflow", "pandas", "numpy"]
                found_ml_packages = [pkg for pkg in ml_packages if any(pkg.lower() in line.lower() for line in lines)]
                
                if found_ml_packages:
                    self.results.append(
                        ValidationResult(
                            "Dependencies: ML Packages",
                            "PASS",
                            f"✅ Found ML packages: {', '.join(found_ml_packages)}"
                        )
                    )
                
            except Exception as e:
                self.results.append(
                    ValidationResult(
                        "Dependencies: requirements.txt",
                        "FAIL",
                        f"❌ Error reading requirements.txt: {str(e)}"
                    )
                )
        else:
            self.results.append(
                ValidationResult(
                    "Dependencies: requirements.txt",
                    "FAIL",
                    f"❌ requirements.txt missing"
                )
            )
    
    def _validate_documentation(self):
        """Validate documentation files"""
        doc_files = [
            ("README.md", "Main documentation"),
            ("docs/", "Additional documentation directory"),
            ("CHANGELOG.md", "Version history")
        ]
        
        for file_path, description in doc_files:
            if file_path.endswith("/"):
                full_path = self.project_path / file_path
                if full_path.exists() and full_path.is_dir():
                    self.results.append(
                        ValidationResult(
                            f"Documentation: {file_path}",
                            "PASS",
                            f"✅ {description} exists"
                        )
                    )
            else:
                full_path = self.project_path / file_path
                if full_path.exists() and full_path.is_file():
                    # Check file size
                    size = full_path.stat().st_size
                    if size > 100:  # At least 100 bytes
                        self.results.append(
                            ValidationResult(
                                f"Documentation: {file_path}",
                                "PASS",
                                f"✅ {description} exists ({size} bytes)"
                            )
                        )
                    else:
                        self.results.append(
                            ValidationResult(
                                f"Documentation: {file_path}",
                                "WARN",
                                f"⚠️ {description} exists but minimal content ({size} bytes)"
                            )
                        )
                else:
                    severity = "WARN" if file_path in ["CHANGELOG.md", "docs/"] else "FAIL"
                    icon = "⚠️" if severity == "WARN" else "❌"
                    self.results.append(
                        ValidationResult(
                            f"Documentation: {file_path}",
                            severity,
                            f"{icon} {description} missing"
                        )
                    )
    
    def _display_results(self):
        """Display validation results in a beautiful format"""
        # Summary
        pass_count = sum(1 for r in self.results if r.status == "PASS")
        warn_count = sum(1 for r in self.results if r.status == "WARN")
        fail_count = sum(1 for r in self.results if r.status == "FAIL")
        
        # Create summary panel
        summary_text = Text()
        summary_text.append(f"✅ Passed: {pass_count}", style="bold green")
        summary_text.append(f"  ⚠️  Warnings: {warn_count}", style="bold yellow")
        summary_text.append(f"  ❌ Failed: {fail_count}", style="bold red")
        
        summary_panel = Panel(
            summary_text,
            title="🔍 Validation Summary",
            border_style="blue" if fail_count == 0 else "red",
            padding=(1, 2)
        )
        
        self.console.print(summary_panel)
        self.console.print()
        
        # Detailed results table
        table = Table(
            title="📋 Detailed Validation Results",
            box=box.ROUNDED,
            show_header=True,
            header_style="bold blue"
        )
        
        table.add_column("Status", style="bold", width=8)
        table.add_column("Check", style="cyan", width=30)
        table.add_column("Message", style="white", width=50)
        
        # Sort results by status (FAIL first, then WARN, then PASS)
        sorted_results = sorted(
            self.results,
            key=lambda x: {"FAIL": 0, "WARN": 1, "PASS": 2}[x.status]
        )
        
        for result in sorted_results:
            status_icon = {"PASS": "✅", "WARN": "⚠️", "FAIL": "❌"}[result.status]
            status_style = {"PASS": "green", "WARN": "yellow", "FAIL": "red"}[result.status]
            
            table.add_row(
                f"[{status_style}]{status_icon}[/{status_style}]",
                result.name,
                result.message
            )
        
        self.console.print(table)
        self.console.print()
        
        # Recommendations
        if fail_count > 0:
            recommendations = [
                "🔧 Fix the failed checks to ensure project functionality",
                "📚 Refer to the documentation for proper setup",
                "🚀 Consider regenerating the project if issues persist"
            ]
            
            rec_text = Text()
            for i, rec in enumerate(recommendations, 1):
                rec_text.append(f"{i}. {rec}\n", style="white")
            
            rec_panel = Panel(
                rec_text,
                title="💡 Recommendations",
                border_style="yellow",
                padding=(1, 2)
            )
            
            self.console.print(rec_panel)
        
        # Final status
        if fail_count == 0:
            if warn_count == 0:
                self.console.print(
                    "🎉 [bold green]Perfect! Your MLOps project is fully validated and ready to go![/bold green]"
                )
            else:
                self.console.print(
                    f"✅ [bold green]Good! Your MLOps project passed validation with {warn_count} warnings.[/bold green]"
                )
        else:
            self.console.print(
                f"❌ [bold red]Issues found! {fail_count} critical checks failed. Please address these issues.[/bold red]"
            )


def validate_project(project_path: str = ".") -> bool:
    """Validate an MLOps project"""
    validator = ProjectValidator(project_path)
    return validator.validate_all()
