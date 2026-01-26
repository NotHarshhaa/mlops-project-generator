"""
Interactive project browser for MLOps Project Generator
"""

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.prompt import Confirm, Prompt
from rich.tree import Tree

from generator.analytics import ProjectAnalytics
from generator.config_manager import ConfigManager

console = Console()


class ProjectBrowser:
    """
    Interactive browser for exploring generated projects
    """

    def __init__(self):
        self.analytics = ProjectAnalytics()
        self.config_manager = ConfigManager()
        self.current_directory = Path.cwd()

    def browse_projects(self):
        """Main interactive project browser"""
        while True:
            console.clear()
            self._show_browser_header()
            
            choice = Prompt.ask(
                "What would you like to do?",
                choices=[
                    "list", "search", "analyze", "compare", 
                    "recent", "stats", "navigate", "back"
                ],
                default="list"
            )
            
            if choice == "list":
                self._list_projects()
            elif choice == "search":
                self._search_projects()
            elif choice == "analyze":
                self._analyze_project()
            elif choice == "compare":
                self._compare_projects()
            elif choice == "recent":
                self._show_recent_projects()
            elif choice == "stats":
                self._show_statistics()
            elif choice == "navigate":
                self._navigate_projects()
            elif choice == "back":
                break
            
            if choice != "back":
                console.print("\nPress Enter to continue...")
                input()

    def _show_browser_header(self):
        """Show the browser header"""
        header = Text("🔍 MLOps Project Browser", style="bold cyan")
        header.stylize("bold magenta", 0, 2)
        
        info_text = Text()
        info_text.append(f"Current Directory: {self.current_directory}\n", style="dim")
        info_text.append(f"Total Projects: {len(self.analytics.load_projects()['projects'])}\n", style="dim")
        info_text.append(f"Browse Mode: Interactive", style="dim")
        
        panel = Panel(
            info_text,
            title=header,
            border_style="cyan",
            padding=(1, 2)
        )
        console.print(panel)

    def _list_projects(self):
        """List all projects with details"""
        projects = self.analytics.load_projects()["projects"]
        
        if not projects:
            console.print("No projects found. Generate some projects first!")
            return
        
        table = Table(title="📁 Generated Projects")
        table.add_column("Name", style="cyan", width=20)
        table.add_column("Framework", style="green", width=12)
        table.add_column("Task", style="yellow", width=12)
        table.add_column("Deployment", style="blue", width=12)
        table.add_column("Date", style="dim", width=12)
        table.add_column("Complexity", style="red", width=8)
        
        for project in projects:
            date_str = project["timestamp"][:10]  # YYYY-MM-DD
            table.add_row(
                project["project_name"],
                project["framework"].title(),
                project["task_type"].title(),
                project["deployment"].title(),
                date_str,
                str(project["complexity_score"])
            )
        
        console.print(table)

    def _search_projects(self):
        """Search projects by various criteria"""
        projects = self.analytics.load_projects()["projects"]
        
        if not projects:
            console.print("No projects to search.")
            return
        
        search_type = Prompt.ask(
            "Search by",
            choices=["name", "framework", "task", "deployment", "tracking"],
            default="name"
        )
        
        search_term = Prompt.ask(f"Enter {search_type} to search for").lower()
        
        filtered_projects = []
        for project in projects:
            field_value = project.get(f"{search_type}_type" if search_type in ["task", "tracking"] else search_type, "").lower()
            if search_term in field_value:
                filtered_projects.append(project)
        
        if not filtered_projects:
            console.print(f"No projects found matching '{search_term}' in {search_type}")
            return
        
        console.print(f"\nFound {len(filtered_projects)} projects matching '{search_term}':\n")
        
        table = Table(title=f"🔍 Search Results: {search_term}")
        table.add_column("Name", style="cyan", width=20)
        table.add_column("Framework", style="green", width=12)
        table.add_column("Task", style="yellow", width=12)
        table.add_column("Deployment", style="blue", width=12)
        table.add_column("Date", style="dim", width=12)
        
        for project in filtered_projects:
            date_str = project["timestamp"][:10]
            table.add_row(
                project["project_name"],
                project["framework"].title(),
                project["task_type"].title(),
                project["deployment"].title(),
                date_str
            )
        
        console.print(table)

    def _analyze_project(self):
        """Analyze a specific project"""
        project_path = Prompt.ask("Enter project path to analyze", default=str(self.current_directory))
        
        if not Path(project_path).exists():
            console.print(f"❌ Path '{project_path}' does not exist")
            return
        
        console.print(f"\n📊 Analyzing project: {Path(project_path).name}")
        self.analytics.display_project_analysis(project_path)
        
        # Show project configuration if available in analytics
        projects = self.analytics.load_projects()["projects"]
        for project in projects:
            if project["project_path"] == project_path:
                console.print("\n🔧 Project Configuration:")
                config_table = Table(show_header=False, box=None)
                config_table.add_column("Setting", style="cyan", width=15)
                config_table.add_column("Value", style="white", width=20)
                
                config_table.add_row("Framework", project["framework"].title())
                config_table.add_row("Task Type", project["task_type"].title())
                config_table.add_row("Tracking", project["experiment_tracking"].title())
                config_table.add_row("Orchestration", project["orchestration"].title())
                config_table.add_row("Deployment", project["deployment"].title())
                config_table.add_row("Monitoring", project["monitoring"].title())
                
                console.print(config_table)
                break

    def _compare_projects(self):
        """Compare multiple projects"""
        projects = self.analytics.load_projects()["projects"]
        
        if len(projects) < 2:
            console.print("Need at least 2 projects to compare")
            return
        
        console.print("Available projects:")
        for i, project in enumerate(projects, 1):
            console.print(f"{i}. {project['project_name']}")
        
        try:
            indices = Prompt.ask("Enter project numbers to compare (e.g., 1,3,5)")
            selected_indices = [int(i.strip()) - 1 for i in indices.split(",")]
            
            if len(selected_indices) < 2:
                console.print("Please select at least 2 projects")
                return
            
            selected_projects = [projects[i] for i in selected_indices if 0 <= i < len(projects)]
            
            if len(selected_projects) < 2:
                console.print("Invalid selection")
                return
            
            self._display_project_comparison(selected_projects)
            
        except (ValueError, IndexError):
            console.print("Invalid input. Please enter valid project numbers.")

    def _display_project_comparison(self, projects: List[Dict[str, Any]]):
        """Display comparison of selected projects"""
        table = Table(title="📊 Project Comparison")
        table.add_column("Attribute", style="cyan", width=15)
        
        for project in projects:
            table.add_column(project["project_name"], style="white", width=15)
        
        # Compare attributes
        attributes = ["framework", "task_type", "experiment_tracking", "orchestration", "deployment", "monitoring"]
        
        for attr in attributes:
            row = [attr.replace("_", " ").title()]
            for project in projects:
                value = project.get(attr, "N/A")
                if value == "none":
                    value = "None"
                elif value == "wandb":
                    value = "W&B"
                else:
                    value = value.title()
                row.append(value)
            table.add_row(*row)
        
        # Compare complexity
        row = ["Complexity Score"]
        for project in projects:
            row.append(str(project.get("complexity_score", 0)))
        table.add_row(*row)
        
        console.print(table)

    def _show_recent_projects(self):
        """Show recently generated projects"""
        projects = self.analytics.load_projects()["projects"]
        
        if not projects:
            console.print("No projects found.")
            return
        
        # Sort by timestamp (most recent first)
        recent_projects = sorted(projects, key=lambda x: x["timestamp"], reverse=True)[:5]
        
        table = Table(title="🕐 Recent Projects (Last 5)")
        table.add_column("Name", style="cyan", width=20)
        table.add_column("Framework", style="green", width=12)
        table.add_column("Task", style="yellow", width=12)
        table.add_column("Deployment", style="blue", width=12)
        table.add_column("Date", style="dim", width=16)
        
        for project in recent_projects:
            # Parse timestamp for better formatting
            try:
                dt = datetime.fromisoformat(project["timestamp"])
                date_str = dt.strftime("%Y-%m-%d %H:%M")
            except:
                date_str = project["timestamp"][:16]
            
            table.add_row(
                project["project_name"],
                project["framework"].title(),
                project["task_type"].title(),
                project["deployment"].title(),
                date_str
            )
        
        console.print(table)

    def _show_statistics(self):
        """Show project statistics"""
        self.analytics.display_project_stats()

    def _navigate_projects(self):
        """Navigate through project directories"""
        while True:
            console.clear()
            console.print(f"📁 Current Directory: {self.current_directory}")
            console.print()
            
            # List contents
            items = list(self.current_directory.iterdir())
            directories = [item for item in items if item.is_dir()]
            files = [item for item in items if item.is_file()]
            
            if directories:
                console.print("📂 Directories:")
                for i, directory in enumerate(directories, 1):
                    console.print(f"  {i}. {directory.name}/")
            
            if files:
                console.print("\n📄 Files:")
                for i, file in enumerate(files, len(directories) + 1):
                    console.print(f"  {i}. {file.name}")
            
            if not items:
                console.print("Empty directory")
            
            console.print("\nOptions:")
            console.print("  • Enter number to navigate")
            console.print("  • 'cd <path>' to change directory")
            console.print("  • 'ls' to list contents")
            console.print("  • 'pwd' to show current path")
            console.print("  • 'analyze' to analyze current directory")
            console.print("  • 'back' to return to browser")
            
            choice = Prompt.ask("Choose action").strip()
            
            if choice == "back":
                break
            elif choice == "ls":
                continue  # Will re-list
            elif choice == "pwd":
                console.print(f"Current path: {self.current_directory}")
                console.print("Press Enter to continue...")
                input()
            elif choice == "analyze":
                if self.current_directory.exists():
                    self.analytics.display_project_analysis(str(self.current_directory))
                console.print("Press Enter to continue...")
                input()
            elif choice.startswith("cd "):
                path = choice[3:].strip()
                new_path = Path(path).expanduser()
                if new_path.is_absolute():
                    self.current_directory = new_path
                else:
                    self.current_directory = self.current_directory / new_path
            else:
                try:
                    index = int(choice) - 1
                    if 0 <= index < len(directories):
                        self.current_directory = directories[index]
                    elif 0 <= index < len(directories) + len(files):
                        file_index = index - len(directories)
                        selected_file = files[file_index]
                        console.print(f"\n📄 File: {selected_file.name}")
                        console.print(f"📁 Path: {selected_file}")
                        console.print(f"📏 Size: {selected_file.stat().st_size} bytes")
                        
                        # Show file content if it's a text file
                        if selected_file.suffix in ['.py', '.md', '.txt', '.yml', '.yaml', '.json']:
                            try:
                                content = selected_file.read_text(encoding='utf-8')
                                lines = content.split('\n')
                                console.print(f"📝 Lines: {len(lines)}")
                                console.print("\nFirst 10 lines:")
                                for i, line in enumerate(lines[:10], 1):
                                    console.print(f"{i:2d}: {line}")
                                if len(lines) > 10:
                                    console.print(f"... ({len(lines) - 10} more lines)")
                            except Exception as e:
                                console.print(f"Error reading file: {e}")
                        
                        console.print("Press Enter to continue...")
                        input()
                except (ValueError, IndexError):
                    console.print("Invalid selection")

    def find_similar_projects(self, project_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Find projects similar to the given configuration"""
        projects = self.analytics.load_projects()["projects"]
        similar_projects = []
        
        for project in projects:
            similarity_score = 0
            
            # Calculate similarity based on matching attributes
            if project.get("framework") == project_config.get("framework"):
                similarity_score += 3
            if project.get("task_type") == project_config.get("task_type"):
                similarity_score += 2
            if project.get("deployment") == project_config.get("deployment"):
                similarity_score += 2
            if project.get("experiment_tracking") == project_config.get("experiment_tracking"):
                similarity_score += 1
            if project.get("orchestration") == project_config.get("orchestration"):
                similarity_score += 1
            if project.get("monitoring") == project_config.get("monitoring"):
                similarity_score += 1
            
            if similarity_score >= 3:  # Threshold for similarity
                project["similarity_score"] = similarity_score
                similar_projects.append(project)
        
        # Sort by similarity score
        similar_projects.sort(key=lambda x: x["similarity_score"], reverse=True)
        
        return similar_projects

    def display_similar_projects(self, project_config: Dict[str, Any]):
        """Display projects similar to the given configuration"""
        similar = self.find_similar_projects(project_config)
        
        if not similar:
            console.print("No similar projects found.")
            return
        
        table = Table(title="🔍 Similar Projects")
        table.add_column("Name", style="cyan", width=20)
        table.add_column("Framework", style="green", width=12)
        table.add_column("Task", style="yellow", width=12)
        table.add_column("Deployment", style="blue", width=12)
        table.add_column("Similarity", style="red", width=10)
        
        for project in similar[:5]:  # Show top 5
            table.add_row(
                project["project_name"],
                project["framework"].title(),
                project["task_type"].title(),
                project["deployment"].title(),
                f"{project['similarity_score']}/10"
            )
        
        console.print(table)

    def export_project_list(self, output_file: str):
        """Export project list to a file"""
        projects = self.analytics.load_projects()["projects"]
        
        export_data = {
            "export_date": datetime.now().isoformat(),
            "total_projects": len(projects),
            "projects": projects
        }
        
        output_path = Path(output_file)
        if not output_path.suffix:
            output_path = output_path.with_suffix(".json")
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(export_data, f, indent=2)
        
        console.print(f"✅ Project list exported to {output_path}")

    def import_project_list(self, input_file: str):
        """Import project list from a file"""
        input_path = Path(input_file)
        
        try:
            with open(input_path, "r", encoding="utf-8") as f:
                import_data = json.load(f)
            
            imported_projects = import_data.get("projects", [])
            
            # Merge with existing projects
            existing_projects = self.analytics.load_projects()["projects"]
            
            # Add imported projects (avoiding duplicates by project name and timestamp)
            existing_keys = {(p["project_name"], p["timestamp"]) for p in existing_projects}
            
            new_projects = []
            for project in imported_projects:
                key = (project["project_name"], project["timestamp"])
                if key not in existing_keys:
                    new_projects.append(project)
            
            if new_projects:
                # Update analytics file
                updated_data = {
                    "projects": existing_projects + new_projects
                }
                
                with open(self.analytics.projects_file, "w", encoding="utf-8") as f:
                    json.dump(updated_data, f, indent=2)
                
                console.print(f"✅ Imported {len(new_projects)} new projects")
            else:
                console.print("No new projects to import")
        
        except Exception as e:
            console.print(f"❌ Error importing projects: {e}")
