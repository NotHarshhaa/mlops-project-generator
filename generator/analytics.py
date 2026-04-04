"""
Project analytics and metrics for MLOps Project Generator
"""

import json
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.progress import Progress, BarColumn, TextColumn

console = Console()


class ProjectAnalytics:
    """
    Analytics and metrics for generated projects
    """

    def __init__(self):
        self.analytics_dir = Path.home() / ".mlops-project-generator" / "analytics"
        self.analytics_dir.mkdir(parents=True, exist_ok=True)
        self.projects_file = self.analytics_dir / "projects.json"
        self._ensure_analytics_file()

    def _ensure_analytics_file(self):
        """Ensure analytics file exists"""
        if not self.projects_file.exists():
            with open(self.projects_file, "w", encoding="utf-8") as f:
                json.dump({"projects": []}, f)

    def record_project_generation(self, choices: Dict[str, Any], project_path: str):
        """Record a project generation event"""
        projects = self.load_projects()
        
        project_record = {
            "timestamp": datetime.now().isoformat(),
            "project_name": choices.get("project_name", "unknown"),
            "project_path": project_path,
            "framework": choices.get("framework", "unknown"),
            "task_type": choices.get("task_type", "unknown"),
            "experiment_tracking": choices.get("experiment_tracking", "none"),
            "orchestration": choices.get("orchestration", "none"),
            "deployment": choices.get("deployment", "none"),
            "monitoring": choices.get("monitoring", "none"),
            "author_name": choices.get("author_name", "unknown"),
            "complexity_score": self._calculate_complexity_score(choices),
            "estimated_files": self._estimate_file_count(choices),
            "estimated_lines": self._estimate_line_count(choices)
        }
        
        projects["projects"].append(project_record)
        
        with open(self.projects_file, "w", encoding="utf-8") as f:
            json.dump(projects, f, indent=2)

    def load_projects(self) -> Dict[str, Any]:
        """Load all project records"""
        try:
            with open(self.projects_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"projects": []}

    def get_project_stats(self) -> Dict[str, Any]:
        """Get overall project statistics"""
        projects = self.load_projects()["projects"]
        
        if not projects:
            return {"total_projects": 0}
        
        # Framework distribution
        frameworks = {}
        task_types = {}
        deployments = {}
        tracking_tools = {}
        
        total_complexity = 0
        total_files = 0
        total_lines = 0
        
        for project in projects:
            # Count frameworks
            framework = project.get("framework", "unknown")
            frameworks[framework] = frameworks.get(framework, 0) + 1
            
            # Count task types
            task_type = project.get("task_type", "unknown")
            task_types[task_type] = task_types.get(task_type, 0) + 1
            
            # Count deployments
            deployment = project.get("deployment", "unknown")
            deployments[deployment] = deployments.get(deployment, 0) + 1
            
            # Count tracking tools
            tracking = project.get("experiment_tracking", "none")
            tracking_tools[tracking] = tracking_tools.get(tracking, 0) + 1
            
            # Sum metrics
            total_complexity += project.get("complexity_score", 0)
            total_files += project.get("estimated_files", 0)
            total_lines += project.get("estimated_lines", 0)
        
        return {
            "total_projects": len(projects),
            "frameworks": frameworks,
            "task_types": task_types,
            "deployments": deployments,
            "tracking_tools": tracking_tools,
            "avg_complexity": total_complexity / len(projects),
            "total_files_generated": total_files,
            "total_lines_generated": total_lines,
            "recent_projects": projects[-5:] if len(projects) > 5 else projects
        }

    def display_project_stats(self):
        """Display project statistics in a formatted way"""
        stats = self.get_project_stats()
        
        if stats["total_projects"] == 0:
            console.print("No projects generated yet.")
            return
        
        # Main stats table
        stats_table = Table(title="📊 Project Generation Statistics")
        stats_table.add_column("Metric", style="cyan", width=20)
        stats_table.add_column("Value", style="white", width=15)
        
        stats_table.add_row("Total Projects", str(stats["total_projects"]))
        stats_table.add_row("Avg Complexity", f"{stats['avg_complexity']:.1f}")
        stats_table.add_row("Total Files Generated", f"{stats['total_files_generated']:,}")
        stats_table.add_row("Total Lines Generated", f"{stats['total_lines_generated']:,}")
        
        console.print(stats_table)
        console.print()
        
        # Framework distribution
        self._display_distribution("🔧 Framework Distribution", stats["frameworks"])
        
        # Task type distribution
        self._display_distribution("📊 Task Type Distribution", stats["task_types"])
        
        # Deployment distribution
        self._display_distribution("🚀 Deployment Distribution", stats["deployments"])
        
        # Tracking tools distribution
        self._display_distribution("🔬 Tracking Tools", stats["tracking_tools"])

    def _display_distribution(self, title: str, distribution: Dict[str, int]):
        """Display a distribution as a table"""
        table = Table(title=title)
        table.add_column("Item", style="cyan", width=15)
        table.add_column("Count", style="white", width=8)
        table.add_column("Percentage", style="green", width=10)
        
        total = sum(distribution.values())
        
        for item, count in sorted(distribution.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / total) * 100
            table.add_row(
                item.title(),
                str(count),
                f"{percentage:.1f}%"
            )
        
        console.print(table)
        console.print()

    def analyze_project(self, project_path: str) -> Dict[str, Any]:
        """Analyze a generated project"""
        project_path = Path(project_path)
        
        if not project_path.exists():
            return {"error": "Project path does not exist"}
        
        analysis = {
            "project_path": str(project_path),
            "total_files": 0,
            "total_lines": 0,
            "file_types": {},
            "directory_structure": {},
            "python_files": 0,
            "config_files": 0,
            "doc_files": 0,
            "test_files": 0
        }
        
        # Analyze files
        for file_path in project_path.rglob("*"):
            if file_path.is_file():
                analysis["total_files"] += 1
                
                # Count file types
                suffix = file_path.suffix.lower()
                analysis["file_types"][suffix] = analysis["file_types"].get(suffix, 0) + 1
                
                # Count lines for text files
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        lines = len(f.readlines())
                        analysis["total_lines"] += lines
                        
                        # Categorize files
                        if suffix == ".py":
                            analysis["python_files"] += 1
                        elif suffix in [".yml", ".yaml", ".json", ".toml", ".cfg"]:
                            analysis["config_files"] += 1
                        elif suffix in [".md", ".rst", ".txt"]:
                            analysis["doc_files"] += 1
                        elif "test" in file_path.name.lower():
                            analysis["test_files"] += 1
                except (UnicodeDecodeError, PermissionError):
                    # Skip binary files
                    pass
        
        # Analyze directory structure
        for dir_path in project_path.rglob("*"):
            if dir_path.is_dir():
                depth = len(dir_path.relative_to(project_path).parts)
                if depth not in analysis["directory_structure"]:
                    analysis["directory_structure"][depth] = 0
                analysis["directory_structure"][depth] += 1
        
        return analysis

    def display_project_analysis(self, project_path: str):
        """Display detailed project analysis"""
        analysis = self.analyze_project(project_path)
        
        if "error" in analysis:
            console.print(f"❌ {analysis['error']}")
            return
        
        # Project overview
        overview_table = Table(title=f"📁 Project Analysis: {Path(project_path).name}")
        overview_table.add_column("Metric", style="cyan", width=20)
        overview_table.add_column("Value", style="white", width=15)
        
        overview_table.add_row("Total Files", str(analysis["total_files"]))
        overview_table.add_row("Total Lines", f"{analysis['total_lines']:,}")
        overview_table.add_row("Python Files", str(analysis["python_files"]))
        overview_table.add_row("Config Files", str(analysis["config_files"]))
        overview_table.add_row("Documentation", str(analysis["doc_files"]))
        overview_table.add_row("Test Files", str(analysis["test_files"]))
        
        console.print(overview_table)
        console.print()
        
        # File type distribution
        self._display_distribution("📄 File Type Distribution", analysis["file_types"])

    def _calculate_complexity_score(self, choices: Dict[str, Any]) -> int:
        """Calculate complexity score for a project configuration"""
        score = 0
        
        # Framework complexity
        framework_scores = {"sklearn": 1, "tensorflow": 2, "pytorch": 3}
        score += framework_scores.get(choices.get("framework", "sklearn"), 1)
        
        # Task type complexity
        task_scores = {"classification": 1, "regression": 1, "time-series": 2, "nlp": 3, "computer-vision": 3}
        score += task_scores.get(choices.get("task_type", "classification"), 1)
        
        # Tool complexity
        if choices.get("experiment_tracking") != "none":
            score += 1
        if choices.get("orchestration") != "none":
            score += 2
        if choices.get("deployment") == "kubernetes":
            score += 3
        elif choices.get("deployment") == "docker":
            score += 2
        else:
            score += 1
        if choices.get("monitoring") != "none":
            score += 1
        
        return score

    def _estimate_file_count(self, choices: Dict[str, Any]) -> int:
        """Estimate number of files for a project configuration"""
        base_files = 10  # Basic files like README, requirements, etc.
        
        # Framework-specific files
        framework_files = {"sklearn": 8, "tensorflow": 12, "pytorch": 12}
        base_files += framework_files.get(choices.get("framework", "sklearn"), 8)
        
        # Tool-specific files
        if choices.get("experiment_tracking") != "none":
            base_files += 3
        if choices.get("orchestration") != "none":
            base_files += 5
        if choices.get("deployment") == "kubernetes":
            base_files += 8
        elif choices.get("deployment") == "docker":
            base_files += 4
        if choices.get("monitoring") != "none":
            base_files += 3
        
        return base_files

    def _estimate_line_count(self, choices: Dict[str, Any]) -> int:
        """Estimate number of lines of code for a project configuration"""
        base_lines = 100  # Basic configuration and setup
        
        # Framework-specific lines
        framework_lines = {"sklearn": 200, "tensorflow": 400, "pytorch": 450}
        base_lines += framework_lines.get(choices.get("framework", "sklearn"), 200)
        
        # Tool-specific lines
        if choices.get("experiment_tracking") != "none":
            base_lines += 50
        if choices.get("orchestration") != "none":
            base_lines += 100
        if choices.get("deployment") == "kubernetes":
            base_lines += 150
        elif choices.get("deployment") == "docker":
            base_lines += 80
        if choices.get("monitoring") != "none":
            base_lines += 60
        
        return base_lines

    def get_trending_metrics(self) -> Dict[str, Any]:
        """Get trending metrics and insights"""
        projects = self.load_projects()["projects"]
        
        if len(projects) < 2:
            return {"message": "Need at least 2 projects for trending analysis"}
        
        # Sort by timestamp
        sorted_projects = sorted(projects, key=lambda x: x["timestamp"])
        
        # Calculate trends
        recent_projects = sorted_projects[-10:]  # Last 10 projects
        older_projects = sorted_projects[:-10] if len(sorted_projects) > 10 else sorted_projects[:len(sorted_projects)//2]
        
        trends = {
            "framework_trends": self._calculate_framework_trends(recent_projects, older_projects),
            "complexity_trends": self._calculate_complexity_trends(recent_projects, older_projects),
            "deployment_trends": self._calculate_deployment_trends(recent_projects, older_projects),
            "productivity_metrics": self._calculate_productivity_metrics(sorted_projects)
        }
        
        return trends

    def _calculate_framework_trends(self, recent: List[Dict], older: List[Dict]) -> Dict[str, Any]:
        """Calculate framework usage trends"""
        recent_frameworks = {}
        older_frameworks = {}
        
        for project in recent:
            fw = project.get("framework", "unknown")
            recent_frameworks[fw] = recent_frameworks.get(fw, 0) + 1
        
        for project in older:
            fw = project.get("framework", "unknown")
            older_frameworks[fw] = older_frameworks.get(fw, 0) + 1
        
        trends = {}
        all_frameworks = set(recent_frameworks.keys()) | set(older_frameworks.keys())
        
        for fw in all_frameworks:
            recent_count = recent_frameworks.get(fw, 0)
            older_count = older_frameworks.get(fw, 0)
            
            if older_count == 0:
                trend = "new"
                change_pct = 100
            else:
                change_pct = ((recent_count - older_count) / older_count) * 100
                trend = "increasing" if change_pct > 10 else "decreasing" if change_pct < -10 else "stable"
            
            trends[fw] = {
                "trend": trend,
                "change_percentage": round(change_pct, 1),
                "recent_usage": recent_count,
                "older_usage": older_count
            }
        
        return trends

    def _calculate_complexity_trends(self, recent: List[Dict], older: List[Dict]) -> Dict[str, Any]:
        """Calculate complexity trends"""
        recent_avg = sum(p.get("complexity_score", 0) for p in recent) / len(recent) if recent else 0
        older_avg = sum(p.get("complexity_score", 0) for p in older) / len(older) if older else 0
        
        change = recent_avg - older_avg
        trend = "increasing" if change > 1 else "decreasing" if change < -1 else "stable"
        
        return {
            "trend": trend,
            "recent_average": round(recent_avg, 1),
            "older_average": round(older_avg, 1),
            "change": round(change, 1)
        }

    def _calculate_deployment_trends(self, recent: List[Dict], older: List[Dict]) -> Dict[str, Any]:
        """Calculate deployment trends"""
        recent_deployments = {}
        older_deployments = {}
        
        for project in recent:
            dep = project.get("deployment", "unknown")
            recent_deployments[dep] = recent_deployments.get(dep, 0) + 1
        
        for project in older:
            dep = project.get("deployment", "unknown")
            older_deployments[dep] = older_deployments.get(dep, 0) + 1
        
        trends = {}
        all_deployments = set(recent_deployments.keys()) | set(older_deployments.keys())
        
        for dep in all_deployments:
            recent_count = recent_deployments.get(dep, 0)
            older_count = older_deployments.get(dep, 0)
            
            if older_count == 0:
                trend = "emerging"
                change_pct = 100
            else:
                change_pct = ((recent_count - older_count) / older_count) * 100
                trend = "growing" if change_pct > 10 else "declining" if change_pct < -10 else "stable"
            
            trends[dep] = {
                "trend": trend,
                "change_percentage": round(change_pct, 1),
                "recent_usage": recent_count,
                "older_usage": older_count
            }
        
        return trends

    def _calculate_productivity_metrics(self, projects: List[Dict]) -> Dict[str, Any]:
        """Calculate productivity metrics"""
        if len(projects) < 2:
            return {"message": "Insufficient data for productivity metrics"}
        
        # Calculate projects per month
        dates = [datetime.fromisoformat(p["timestamp"]) for p in projects]
        date_range = (max(dates) - min(dates)).days
        
        if date_range == 0:
            projects_per_month = len(projects)
        else:
            projects_per_month = (len(projects) / date_range) * 30
        
        # Calculate average files and lines per project
        avg_files = sum(p.get("estimated_files", 0) for p in projects) / len(projects)
        avg_lines = sum(p.get("estimated_lines", 0) for p in projects) / len(projects)
        
        return {
            "projects_per_month": round(projects_per_month, 1),
            "average_files_per_project": round(avg_files, 1),
            "average_lines_per_project": round(avg_lines, 1),
            "total_projects": len(projects),
            "date_range_days": date_range
        }

    def get_actionable_insights(self) -> List[Dict[str, Any]]:
        """Generate actionable insights based on analytics data"""
        projects = self.load_projects()["projects"]
        insights = []
        
        if not projects:
            return [{"type": "info", "message": "No projects to analyze"}]
        
        stats = self.get_project_stats()
        trends = self.get_trending_metrics()
        
        # Framework insights
        frameworks = stats.get("frameworks", {})
        if frameworks:
            most_popular = max(frameworks.items(), key=lambda x: x[1])
            insights.append({
                "type": "insight",
                "category": "framework",
                "message": f"{most_popular[0].title()} is your most used framework ({most_popular[1]} projects)",
                "action": f"Consider creating templates optimized for {most_popular[0]}"
            })
        
        # Complexity insights
        avg_complexity = stats.get("avg_complexity", 0)
        if avg_complexity > 8:
            insights.append({
                "type": "warning",
                "category": "complexity",
                "message": f"High average complexity score ({avg_complexity:.1f}) detected",
                "action": "Consider simplifying project templates or providing better documentation"
            })
        elif avg_complexity < 3:
            insights.append({
                "type": "info",
                "category": "complexity",
                "message": f"Low complexity projects ({avg_complexity:.1f} average)",
                "action": "Good for rapid prototyping, consider adding advanced features when needed"
            })
        
        # Deployment insights
        deployments = stats.get("deployments", {})
        if deployments:
            simple_deployments = deployments.get("fastapi", 0) + deployments.get("docker", 0)
            complex_deployments = deployments.get("kubernetes", 0)
            
            if simple_deployments > complex_deployments * 2:
                insights.append({
                    "type": "trend",
                    "category": "deployment",
                    "message": "Strong preference for simple deployment options",
                    "action": "Continue optimizing FastAPI and Docker templates"
                })
            elif complex_deployments > simple_deployments:
                insights.append({
                    "type": "trend",
                    "category": "deployment",
                    "message": "Advanced deployment patterns are common",
                    "action": "Invest in more sophisticated Kubernetes templates"
                })
        
        # Tracking insights
        tracking_tools = stats.get("tracking_tools", {})
        if tracking_tools.get("none", 0) > tracking_tools.get("mlflow", 0) + tracking_tools.get("wandb", 0):
            insights.append({
                "type": "recommendation",
                "category": "tracking",
                "message": "Many projects without experiment tracking",
                "action": "Add experiment tracking by default or provide better onboarding"
            })
        
        # Productivity insights
        if "productivity_metrics" in trends:
            productivity = trends["productivity_metrics"]
            projects_per_month = productivity.get("projects_per_month", 0)
            
            if projects_per_month > 10:
                insights.append({
                    "type": "achievement",
                    "category": "productivity",
                    "message": f"High productivity: {projects_per_month} projects/month",
                    "action": "Consider automating more workflows to maintain efficiency"
                })
            elif projects_per_month < 2:
                insights.append({
                    "type": "suggestion",
                    "category": "productivity",
                    "message": f"Low project generation rate: {projects_per_month} projects/month",
                    "action": "Consider creating more presets or improving CLI usability"
                })
        
        return insights

    def benchmark_project(self, choices: Dict[str, Any]) -> Dict[str, Any]:
        """Benchmark a project configuration against historical data"""
        projects = self.load_projects()["projects"]
        
        if not projects:
            return {"message": "No historical data for benchmarking"}
        
        # Calculate project score
        project_score = self._calculate_complexity_score(choices)
        
        # Find similar projects
        similar_projects = []
        for project in projects:
            if project.get("framework") == choices.get("framework"):
                similar_projects.append(project)
        
        # Calculate percentiles
        all_scores = [p.get("complexity_score", 0) for p in projects]
        similar_scores = [p.get("complexity_score", 0) for p in similar_projects]
        
        def percentile_score(score, scores):
            if not scores:
                return 50
            scores_sorted = sorted(scores)
            rank = sum(1 for s in scores_sorted if s <= score)
            return (rank / len(scores_sorted)) * 100
        
        benchmark = {
            "project_score": project_score,
            "overall_percentile": percentile_score(project_score, all_scores),
            "framework_percentile": percentile_score(project_score, similar_scores) if similar_scores else 50,
            "total_comparisons": len(projects),
            "similar_comparisons": len(similar_projects),
            "assessment": self._get_benchmark_assessment(project_score, all_scores)
        }
        
        return benchmark

    def _get_benchmark_assessment(self, score: int, all_scores: List[int]) -> str:
        """Get assessment for benchmark score"""
        if not all_scores:
            return "No data available"
        
        avg_score = sum(all_scores) / len(all_scores)
        max_score = max(all_scores)
        min_score = min(all_scores)
        
        if score > avg_score + (max_score - avg_score) * 0.5:
            return "Very High Complexity - Advanced Project"
        elif score > avg_score:
            return "Above Average Complexity - Challenging Project"
        elif score < avg_score - (avg_score - min_score) * 0.5:
            return "Low Complexity - Simple Project"
        else:
            return "Average Complexity - Standard Project"

    def display_enhanced_stats(self):
        """Display enhanced statistics with insights"""
        stats = self.get_project_stats()
        trends = self.get_trending_metrics()
        insights = self.get_actionable_insights()
        
        # Basic stats
        self.display_project_stats()
        
        # Trends section
        if "framework_trends" in trends:
            console.print("\n[bold cyan]📈 Trending Analysis[/bold cyan]\n")
            
            # Framework trends
            fw_trends = trends["framework_trends"]
            if fw_trends:
                table = Table(title="Framework Trends")
                table.add_column("Framework", style="cyan", width=12)
                table.add_column("Trend", style="green" if any(t["trend"] in ["increasing", "new"] for t in fw_trends.values()) else "yellow", width=12)
                table.add_column("Change", style="white", width=10)
                table.add_column("Recent", style="blue", width=8)
                
                for fw, data in fw_trends.items():
                    trend_style = {
                        "increasing": "green",
                        "decreasing": "red",
                        "stable": "yellow",
                        "new": "blue"
                    }.get(data["trend"], "white")
                    
                    table.add_row(
                        fw.title(),
                        f"[{trend_style}]{data['trend'].title()}[/{trend_style}]",
                        f"{data['change_percentage']:+.1f}%",
                        str(data["recent_usage"])
                    )
                
                console.print(table)
            
            # Productivity metrics
            if "productivity_metrics" in trends:
                prod = trends["productivity_metrics"]
                if "projects_per_month" in prod:
                    prod_table = Table(title="Productivity Metrics")
                    prod_table.add_column("Metric", style="cyan", width=20)
                    prod_table.add_column("Value", style="white", width=15)
                    
                    prod_table.add_row("Projects/Month", f"{prod['projects_per_month']:.1f}")
                    prod_table.add_row("Avg Files/Project", f"{prod['average_files_per_project']:.1f}")
                    prod_table.add_row("Avg Lines/Project", f"{prod['average_lines_per_project']:.0f}")
                    
                    console.print(prod_table)
        
        # Insights section
        if insights:
            console.print("\n[bold yellow]💡 Actionable Insights[/bold yellow]\n")
            
            for insight in insights:
                icon = {
                    "insight": "🔍",
                    "warning": "⚠️",
                    "recommendation": "💡",
                    "trend": "📊",
                    "achievement": "🏆",
                    "suggestion": "💭",
                    "info": "ℹ️"
                }.get(insight["type"], "📌")
                
                console.print(f"{icon} {insight['message']}")
                if insight.get("action"):
                    console.print(f"   🎯 Action: {insight['action']}")
                console.print()

    def export_analytics_report(self, output_file: str = None):
        """Export comprehensive analytics report"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"analytics_report_{timestamp}.json"
        
        report = {
            "report_date": datetime.now().isoformat(),
            "basic_stats": self.get_project_stats(),
            "trends": self.get_trending_metrics(),
            "insights": self.get_actionable_insights()
        }
        
        output_path = Path(output_file)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        
        console.print(f"✅ Analytics report exported to {output_path}")

    def get_recommendations(self, choices: Dict[str, Any]) -> List[str]:
        """Get recommendations based on project configuration"""
        recommendations = []
        
        framework = choices.get("framework", "sklearn")
        deployment = choices.get("deployment", "fastapi")
        tracking = choices.get("experiment_tracking", "none")
        task_type = choices.get("task_type", "classification")
        
        # Enhanced framework recommendations
        if framework == "sklearn":
            if task_type == "time-series":
                recommendations.append("Consider using specialized time-series libraries like Prophet or statsmodels")
            if deployment == "kubernetes":
                recommendations.append("Sklearn models are lightweight - consider resource optimization for K8s")
        elif framework == "pytorch":
            if tracking == "none":
                recommendations.append("PyTorch projects benefit greatly from experiment tracking (W&B or MLflow)")
            if deployment == "fastapi":
                recommendations.append("Consider using TorchServe for PyTorch model serving")
        elif framework == "tensorflow":
            if deployment == "kubernetes":
                recommendations.append("TensorFlow Serving provides excellent K8s integration")
            if task_type == "computer-vision":
                recommendations.append("Consider TensorFlow Lite for edge deployment")
        
        # Task-specific recommendations
        if task_type == "nlp":
            recommendations.append("Consider using transformer libraries (Hugging Face) for NLP tasks")
        elif task_type == "computer-vision":
            recommendations.append("Consider data augmentation and transfer learning for vision tasks")
        elif task_type == "time-series":
            recommendations.append("Include feature engineering for time-specific patterns")
        
        # Deployment recommendations
        if deployment == "fastapi":
            recommendations.append("Add API documentation with FastAPI's automatic docs")
            recommendations.append("Consider adding rate limiting and authentication")
        elif deployment == "docker":
            recommendations.append("Optimize Docker image size with multi-stage builds")
            recommendations.append("Include health checks in Docker configuration")
        elif deployment == "kubernetes":
            recommendations.append("Define resource requests and limits for better cluster management")
            recommendations.append("Consider using Helm charts for easier deployment")
        
        # Tracking recommendations
        if tracking == "mlflow":
            recommendations.append("Configure MLflow server for collaborative experiment tracking")
        elif tracking == "wandb":
            recommendations.append("Set up W&B teams for better collaboration")
        elif tracking == "none":
            recommendations.append("Add basic logging for model performance monitoring")
        
        # Production recommendations
        monitoring = choices.get("monitoring", "none")
        if monitoring == "none":
            if deployment in ["docker", "kubernetes"]:
                recommendations.append("Add monitoring for production deployments (Prometheus/Grafana)")
            recommendations.append("Implement basic health check endpoints")
        
        # Orchestration recommendations
        orchestration = choices.get("orchestration", "none")
        if orchestration == "airflow":
            recommendations.append("Include DAG documentation and retry policies")
        elif orchestration == "kubeflow":
            recommendations.append("Configure resource quotas for Kubeflow pipelines")
        
        # Security recommendations
        if deployment in ["fastapi", "docker", "kubernetes"]:
            recommendations.append("Add security scanning to CI/CD pipeline")
            recommendations.append("Implement proper secret management")
        
        return recommendations
