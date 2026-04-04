"""
Performance profiler for MLOps projects
"""

import json
import time
import psutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.progress import Progress, BarColumn, TextColumn

console = Console()


class PerformanceProfiler:
    """
    Profiles ML model performance and resource usage
    """

    def __init__(self):
        self.profiles_dir = Path.home() / ".mlops-project-generator" / "profiles"
        self.profiles_dir.mkdir(parents=True, exist_ok=True)
        self.baseline_data = self.profiles_dir / "baselines.json"
        self._ensure_baseline_data()

    def _ensure_baseline_data(self):
        """Ensure baseline performance data exists"""
        if not self.baseline_data.exists():
            baselines = {
                "model_sizes": {
                    "small": {"parameters": "<1M", "memory_mb": "<100", "inference_ms": "<10"},
                    "medium": {"parameters": "1M-10M", "memory_mb": "100-500", "inference_ms": "10-100"},
                    "large": {"parameters": "10M-100M", "memory_mb": "500-2000", "inference_ms": "100-1000"},
                    "xlarge": {"parameters": ">100M", "memory_mb": ">2000", "inference_ms": ">1000"}
                },
                "framework_benchmarks": {
                    "sklearn": {"cpu_usage": "low", "memory_efficiency": "high", "training_speed": "fast"},
                    "pytorch": {"cpu_usage": "medium", "memory_efficiency": "medium", "training_speed": "medium"},
                    "tensorflow": {"cpu_usage": "medium", "memory_efficiency": "medium", "training_speed": "medium"}
                }
            }
            
            with open(self.baseline_data, "w", encoding="utf-8") as f:
                json.dump(baselines, f, indent=2)

    def profile_project(self, project_path: str, model_file: Optional[str] = None) -> Dict[str, Any]:
        """Profile an entire project"""
        project_path = Path(project_path)
        
        if not project_path.exists():
            raise ValueError(f"Project path '{project_path}' does not exist")
        
        profile_data = {
            "project_path": str(project_path),
            "profile_date": datetime.now().isoformat(),
            "system_info": self._get_system_info(),
            "project_analysis": {},
            "model_analysis": {},
            "performance_metrics": {},
            "recommendations": []
        }
        
        # Analyze project structure
        profile_data["project_analysis"] = self._analyze_project_structure(project_path)
        
        # Analyze models
        if model_file:
            model_path = project_path / model_file
            if model_path.exists():
                profile_data["model_analysis"] = self._analyze_model_file(model_path)
            else:
                # Find model files automatically
                model_files = self._find_model_files(project_path)
                if model_files:
                    profile_data["model_analysis"] = self._analyze_model_file(model_files[0])
        else:
            # Auto-detect model files
            model_files = self._find_model_files(project_path)
            if model_files:
                profile_data["model_analysis"] = self._analyze_model_file(model_files[0])
        
        # Performance metrics
        profile_data["performance_metrics"] = self._collect_performance_metrics(project_path)
        
        # Generate recommendations
        profile_data["recommendations"] = self._generate_performance_recommendations(profile_data)
        
        return profile_data

    def _get_system_info(self) -> Dict[str, Any]:
        """Get system information for profiling context"""
        try:
            return {
                "cpu_count": psutil.cpu_count(),
                "cpu_freq": psutil.cpu_freq()._asdict() if psutil.cpu_freq() else None,
                "memory_total": psutil.virtual_memory().total,
                "memory_available": psutil.virtual_memory().available,
                "disk_total": psutil.disk_usage('/').total if sys.platform != 'win32' else psutil.disk_usage('C:').total,
                "disk_free": psutil.disk_usage('/').free if sys.platform != 'win32' else psutil.disk_usage('C:').free,
                "python_version": sys.version,
                "platform": sys.platform
            }
        except Exception as e:
            return {"error": f"Failed to get system info: {str(e)}"}

    def _analyze_project_structure(self, project_path: Path) -> Dict[str, Any]:
        """Analyze project structure for performance implications"""
        analysis = {
            "total_files": 0,
            "python_files": 0,
            "data_files": 0,
            "model_files": 0,
            "total_size_mb": 0,
            "complexity_indicators": {}
        }
        
        try:
            total_size = 0
            
            for file_path in project_path.rglob("*"):
                if file_path.is_file():
                    analysis["total_files"] += 1
                    file_size = file_path.stat().st_size
                    total_size += file_size
                    
                    if file_path.suffix == ".py":
                        analysis["python_files"] += 1
                    elif file_path.suffix in [".pkl", ".joblib", ".pth", ".h5", ".pb"]:
                        analysis["model_files"] += 1
                    elif file_path.suffix in [".csv", ".json", ".parquet", ".hdf5"]:
                        analysis["data_files"] += 1
            
            analysis["total_size_mb"] = total_size / (1024 * 1024)
            
            # Complexity indicators
            analysis["complexity_indicators"] = {
                "has_large_data_files": analysis["data_files"] > 10,
                "has_multiple_models": analysis["model_files"] > 3,
                "is_large_codebase": analysis["python_files"] > 50,
                "is_large_project": analysis["total_size_mb"] > 100
            }
        
        except Exception as e:
            analysis["error"] = str(e)
        
        return analysis

    def _find_model_files(self, project_path: Path) -> List[Path]:
        """Find model files in the project"""
        model_extensions = [".pkl", ".joblib", ".pth", ".h5", ".pb", ".pt", ".model"]
        model_files = []
        
        for ext in model_extensions:
            model_files.extend(project_path.rglob(f"*{ext}"))
        
        return model_files

    def _analyze_model_file(self, model_path: Path) -> Dict[str, Any]:
        """Analyze a specific model file"""
        analysis = {
            "file_path": str(model_path),
            "file_size_mb": model_path.stat().st_size / (1024 * 1024),
            "file_type": model_path.suffix,
            "estimated_parameters": None,
            "framework": None,
            "model_size_category": None
        }
        
        try:
            # Estimate model size based on file size
            file_size_mb = analysis["file_size_mb"]
            
            if file_size_mb < 1:
                analysis["model_size_category"] = "small"
                analysis["estimated_parameters"] = "< 1M"
            elif file_size_mb < 10:
                analysis["model_size_category"] = "medium"
                analysis["estimated_parameters"] = "1M - 10M"
            elif file_size_mb < 100:
                analysis["model_size_category"] = "large"
                analysis["estimated_parameters"] = "10M - 100M"
            else:
                analysis["model_size_category"] = "xlarge"
                analysis["estimated_parameters"] = "> 100M"
            
            # Try to detect framework from file extension
            ext = model_path.suffix.lower()
            if ext in [".pth", ".pt"]:
                analysis["framework"] = "pytorch"
            elif ext in [".h5", ".pb"]:
                analysis["framework"] = "tensorflow"
            elif ext in [".pkl", ".joblib"]:
                analysis["framework"] = "sklearn"
        
        except Exception as e:
            analysis["error"] = str(e)
        
        return analysis

    def _collect_performance_metrics(self, project_path: Path) -> Dict[str, Any]:
        """Collect performance metrics"""
        metrics = {
            "resource_usage": {},
            "code_metrics": {},
            "dependency_analysis": {}
        }
        
        try:
            # Resource usage simulation
            process = psutil.Process()
            metrics["resource_usage"] = {
                "cpu_percent": process.cpu_percent(),
                "memory_mb": process.memory_info().rss / (1024 * 1024),
                "memory_percent": process.memory_percent()
            }
            
            # Code metrics
            metrics["code_metrics"] = self._analyze_code_metrics(project_path)
            
            # Dependency analysis
            metrics["dependency_analysis"] = self._analyze_dependencies_performance(project_path)
        
        except Exception as e:
            metrics["error"] = str(e)
        
        return metrics

    def _analyze_code_metrics(self, project_path: Path) -> Dict[str, Any]:
        """Analyze code for performance implications"""
        metrics = {
            "total_lines": 0,
            "complex_functions": 0,
            "data_processing_operations": 0,
            "ml_operations": 0,
            "potential_bottlenecks": []
        }
        
        try:
            for py_file in project_path.rglob("*.py"):
                try:
                    content = py_file.read_text(encoding="utf-8")
                    lines = content.split("\n")
                    metrics["total_lines"] += len(lines)
                    
                    # Count operations
                    for line in lines:
                        line_lower = line.lower().strip()
                        
                        # Data processing operations
                        if any(op in line_lower for op in ["for", "while", "pandas.", "numpy.", "iterrows"]):
                            metrics["data_processing_operations"] += 1
                        
                        # ML operations
                        if any(op in line_lower for op in [".fit(", ".predict(", ".transform(", ".train("]):
                            metrics["ml_operations"] += 1
                        
                        # Complex function indicators
                        if "def " in line and ("nested" in line_lower or "recursive" in line_lower):
                            metrics["complex_functions"] += 1
                        
                        # Potential bottlenecks
                        if any(bottleneck in line_lower for bottleneck in ["time.sleep", "subprocess", "os.system"]):
                            metrics["potential_bottlenecks"].append(f"{py_file.name}: {line.strip()}")
                
                except Exception:
                    continue
        
        except Exception as e:
            metrics["error"] = str(e)
        
        return metrics

    def _analyze_dependencies_performance(self, project_path: Path) -> Dict[str, Any]:
        """Analyze dependencies for performance implications"""
        analysis = {
            "heavy_dependencies": [],
            "lightweight_alternatives": {},
            "performance_score": 0
        }
        
        try:
            # Check requirements files
            requirements_files = [
                project_path / "requirements.txt",
                project_path / "pyproject.toml"
            ]
            
            heavy_deps = ["tensorflow", "torch", "pandas", "numpy", "scipy"]
            lightweight_alternatives = {
                "tensorflow": "tflite-runtime",
                "pandas": "polars",
                "numpy": "cupy"  # For GPU
            }
            
            dependencies = []
            
            for req_file in requirements_files:
                if req_file.exists():
                    try:
                        content = req_file.read_text(encoding="utf-8")
                        lines = content.split("\n")
                        
                        for line in lines:
                            line = line.strip()
                            if line and not line.startswith("#"):
                                dep_name = line.split(">")[0].split("<")[0].split("=")[0].strip().lower()
                                dependencies.append(dep_name)
                    except Exception:
                        continue
            
            # Identify heavy dependencies
            for dep in dependencies:
                if dep in heavy_deps:
                    analysis["heavy_dependencies"].append(dep)
                    if dep in lightweight_alternatives:
                        analysis["lightweight_alternatives"][dep] = lightweight_alternatives[dep]
            
            # Calculate performance score
            total_deps = len(dependencies)
            heavy_count = len(analysis["heavy_dependencies"])
            
            if total_deps == 0:
                analysis["performance_score"] = 100
            else:
                analysis["performance_score"] = max(0, 100 - (heavy_count * 20))
        
        except Exception as e:
            analysis["error"] = str(e)
        
        return analysis

    def _generate_performance_recommendations(self, profile_data: Dict[str, Any]) -> List[str]:
        """Generate performance recommendations based on profile data"""
        recommendations = []
        
        try:
            project_analysis = profile_data.get("project_analysis", {})
            model_analysis = profile_data.get("model_analysis", {})
            performance_metrics = profile_data.get("performance_metrics", {})
            
            # Project size recommendations
            if project_analysis.get("total_size_mb", 0) > 100:
                recommendations.append("📦 Consider using .gitignore to exclude large files from version control")
            
            if project_analysis.get("complexity_indicators", {}).get("has_large_data_files", False):
                recommendations.append("📊 Consider data streaming or chunking for large datasets")
            
            # Model recommendations
            model_size = model_analysis.get("model_size_category")
            if model_size == "xlarge":
                recommendations.append("🧠 Consider model quantization or pruning for large models")
                recommendations.append("⚡ Use model optimization techniques (TensorRT, ONNX)")
            elif model_size == "large":
                recommendations.append("🎯 Consider using a smaller model architecture")
            
            # Code performance recommendations
            code_metrics = performance_metrics.get("code_metrics", {})
            if code_metrics.get("data_processing_operations", 0) > 50:
                recommendations.append("🔄 Consider vectorizing data operations with NumPy/Pandas optimizations")
            
            if code_metrics.get("potential_bottlenecks"):
                recommendations.append("⚠️ Review and optimize potential bottlenecks in code")
            
            # Dependency recommendations
            dep_analysis = performance_metrics.get("dependency_analysis", {})
            heavy_deps = dep_analysis.get("heavy_dependencies", [])
            if heavy_deps:
                recommendations.append(f"🔧 Consider lightweight alternatives for: {', '.join(heavy_deps)}")
            
            perf_score = dep_analysis.get("performance_score", 100)
            if perf_score < 80:
                recommendations.append("📈 Overall dependency performance could be improved")
            
            # Memory recommendations
            resource_usage = performance_metrics.get("resource_usage", {})
            memory_mb = resource_usage.get("memory_mb", 0)
            if memory_mb > 1000:
                recommendations.append("💾 High memory usage detected - consider memory optimization")
            
            # Add framework-specific recommendations
            framework = model_analysis.get("framework")
            if framework == "pytorch":
                recommendations.append("🔥 Consider using torch.jit.script for model optimization")
            elif framework == "tensorflow":
                recommendations.append("🤖 Consider using TensorFlow Lite for deployment")
            elif framework == "sklearn":
                recommendations.append("⚡ Consider using joblib for model serialization optimization")
        
        except Exception as e:
            recommendations.append(f"❌ Error generating recommendations: {str(e)}")
        
        return recommendations

    def display_results(self, profile_data: Dict[str, Any], output_format: str = "table"):
        """Display profiling results in specified format"""
        if output_format == "json":
            console.print(json.dumps(profile_data, indent=2))
        elif output_format == "csv":
            self._display_csv_format(profile_data)
        else:
            self._display_table_format(profile_data)

    def _display_table_format(self, profile_data: Dict[str, Any]):
        """Display results in table format"""
        # Project Overview
        project_analysis = profile_data.get("project_analysis", {})
        
        overview_table = Table(title="📊 Project Performance Overview")
        overview_table.add_column("Metric", style="cyan", width=25)
        overview_table.add_column("Value", style="white", width=20)
        overview_table.add_column("Status", style="green", width=10)
        
        overview_table.add_row(
            "Total Files", 
            str(project_analysis.get("total_files", 0)),
            "✅" if project_analysis.get("total_files", 0) < 100 else "⚠️"
        )
        overview_table.add_row(
            "Project Size", 
            f"{project_analysis.get('total_size_mb', 0):.1f} MB",
            "✅" if project_analysis.get('total_size_mb', 0) < 50 else "⚠️"
        )
        overview_table.add_row(
            "Python Files", 
            str(project_analysis.get("python_files", 0)),
            "✅" if project_analysis.get("python_files", 0) < 50 else "⚠️"
        )
        
        console.print(overview_table)
        console.print()
        
        # Model Analysis
        model_analysis = profile_data.get("model_analysis", {})
        if model_analysis:
            model_table = Table(title="🤖 Model Analysis")
            model_table.add_column("Property", style="cyan", width=20)
            model_table.add_column("Value", style="white", width=25)
            model_table.add_column("Assessment", style="yellow", width=15)
            
            model_table.add_row(
                "Model Size",
                f"{model_analysis.get('file_size_mb', 0):.2f} MB",
                model_analysis.get("model_size_category", "unknown").title()
            )
            model_table.add_row(
                "Framework",
                model_analysis.get("framework", "unknown").title() if model_analysis.get("framework") else "Unknown",
                "✅" if model_analysis.get("framework") else "❓"
            )
            model_table.add_row(
                "Parameters",
                model_analysis.get("estimated_parameters", "unknown"),
                "✅" if model_analysis.get("estimated_parameters") != "unknown" else "❓"
            )
            
            console.print(model_table)
            console.print()
        
        # Performance Metrics
        perf_metrics = profile_data.get("performance_metrics", {})
        if perf_metrics:
            perf_table = Table(title="⚡ Performance Metrics")
            perf_table.add_column("Category", style="cyan", width=20)
            perf_table.add_column("Metric", style="white", width=25)
            perf_table.add_column("Value", style="green", width=15)
            
            # Resource usage
            resource_usage = perf_metrics.get("resource_usage", {})
            if resource_usage:
                perf_table.add_row("Resource", "Memory Usage", f"{resource_usage.get('memory_mb', 0):.1f} MB")
                perf_table.add_row("Resource", "CPU Usage", f"{resource_usage.get('cpu_percent', 0):.1f}%")
            
            # Code metrics
            code_metrics = perf_metrics.get("code_metrics", {})
            if code_metrics:
                perf_table.add_row("Code", "Total Lines", f"{code_metrics.get('total_lines', 0):,}")
                perf_table.add_row("Code", "ML Operations", str(code_metrics.get('ml_operations', 0)))
            
            # Dependencies
            dep_analysis = perf_metrics.get("dependency_analysis", {})
            if dep_analysis:
                perf_table.add_row("Dependencies", "Performance Score", f"{dep_analysis.get('performance_score', 0)}/100")
                heavy_deps = dep_analysis.get("heavy_dependencies", [])
                perf_table.add_row("Dependencies", "Heavy Dependencies", str(len(heavy_deps)))
            
            console.print(perf_table)
            console.print()
        
        # Recommendations
        recommendations = profile_data.get("recommendations", [])
        if recommendations:
            console.print("💡 Performance Recommendations:\n")
            for i, rec in enumerate(recommendations, 1):
                console.print(f"  {i}. {rec}")
            console.print()

    def _display_csv_format(self, profile_data: Dict[str, Any]):
        """Display results in CSV format"""
        import csv
        from io import StringIO
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(["Category", "Metric", "Value", "Status"])
        
        # Project data
        project_analysis = profile_data.get("project_analysis", {})
        writer.writerow(["Project", "Total Files", project_analysis.get("total_files", 0), ""])
        writer.writerow(["Project", "Size MB", f"{project_analysis.get('total_size_mb', 0):.2f}", ""])
        writer.writerow(["Project", "Python Files", project_analysis.get("python_files", 0), ""])
        
        # Model data
        model_analysis = profile_data.get("model_analysis", {})
        if model_analysis:
            writer.writerow(["Model", "Size MB", f"{model_analysis.get('file_size_mb', 0):.2f}", ""])
            writer.writerow(["Model", "Framework", model_analysis.get("framework", ""), ""])
            writer.writerow(["Model", "Category", model_analysis.get("model_size_category", ""), ""])
        
        # Performance data
        perf_metrics = profile_data.get("performance_metrics", {})
        if perf_metrics:
            resource_usage = perf_metrics.get("resource_usage", {})
            if resource_usage:
                writer.writerow(["Performance", "Memory MB", f"{resource_usage.get('memory_mb', 0):.1f}", ""])
                writer.writerow(["Performance", "CPU %", f"{resource_usage.get('cpu_percent', 0):.1f}", ""])
        
        console.print(output.getvalue())

    def save_profile(self, profile_data: Dict[str, Any], filename: Optional[str] = None):
        """Save profile data to file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"profile_{timestamp}.json"
        
        profile_file = self.profiles_dir / filename
        
        with open(profile_file, "w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=2)
        
        console.print(f"✅ Profile saved to: {profile_file}")

    def compare_profiles(self, profile1: Dict[str, Any], profile2: Dict[str, Any]) -> Dict[str, Any]:
        """Compare two profile results"""
        comparison = {
            "comparison_date": datetime.now().isoformat(),
            "profile1": profile1.get("profile_date", "unknown"),
            "profile2": profile2.get("profile_date", "unknown"),
            "differences": {},
            "improvements": [],
            "degradations": []
        }
        
        try:
            # Compare project sizes
            size1 = profile1.get("project_analysis", {}).get("total_size_mb", 0)
            size2 = profile2.get("project_analysis", {}).get("total_size_mb", 0)
            
            if size1 != size2:
                diff = size2 - size1
                comparison["differences"]["project_size_mb"] = diff
                if diff < 0:
                    comparison["improvements"].append(f"Project size reduced by {abs(diff):.1f} MB")
                else:
                    comparison["degradations"].append(f"Project size increased by {diff:.1f} MB")
            
            # Compare performance scores
            score1 = profile1.get("performance_metrics", {}).get("dependency_analysis", {}).get("performance_score", 0)
            score2 = profile2.get("performance_metrics", {}).get("dependency_analysis", {}).get("performance_score", 0)
            
            if score1 != score2:
                diff = score2 - score1
                comparison["differences"]["performance_score"] = diff
                if diff > 0:
                    comparison["improvements"].append(f"Performance score improved by {diff}")
                else:
                    comparison["degradations"].append(f"Performance score decreased by {abs(diff)}")
        
        except Exception as e:
            comparison["error"] = str(e)
        
        return comparison
