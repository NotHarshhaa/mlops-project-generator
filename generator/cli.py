#!/usr/bin/env python3
"""
CLI interface for MLOps Project Generator
"""

import os
from pathlib import Path
import typer
from rich.align import Align
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

from generator.prompts import get_user_choices
from generator.renderer import ProjectRenderer
from generator.utils import get_next_steps
from generator.validators import validate_choices
from generator.validator import validate_project
from generator.config_manager import ConfigManager
from generator.analytics import ProjectAnalytics
from generator.template_customizer import TemplateCustomizer
from generator.cloud_deployer import CloudDeployer
from generator.project_browser import ProjectBrowser
from generator.stack_presets import get_preset_choices, list_presets as get_all_presets, STACK_PRESETS
from generator.project_lifecycle import ProjectLifecycleManager
from generator.dependency_checker import DependencyChecker
from generator.performance_profiler import PerformanceProfiler

app = typer.Typer(
    name="mlops-project-generator",
    help="🚀 Generate production-ready MLOps project templates",
    no_args_is_help=True,
)
console = Console()


@app.command()
def init(
    preset: str = typer.Option(None, "--preset", help="Use a stack preset (quick-start, data-science, deep-learning, production-mlops, enterprise, research)"),
    framework: str = typer.Option(None, "--framework", "-f", help="ML framework (sklearn, pytorch, tensorflow)"),
    task_type: str = typer.Option(None, "--task-type", "-t", help="Task type (classification, regression, time-series, nlp, computer-vision)"),
    tracking: str = typer.Option(None, "--tracking", "-r", help="Experiment tracking (mlflow, wandb, custom, none)"),
    orchestration: str = typer.Option(None, "--orchestration", "-o", help="Orchestration (airflow, kubeflow, none)"),
    deployment: str = typer.Option(None, "--deployment", "-d", help="Deployment (fastapi, docker, kubernetes)"),
    monitoring: str = typer.Option(None, "--monitoring", "-m", help="Monitoring (evidently, custom, none)"),
    project_name: str = typer.Option(None, "--project-name", "-p", help="Project name"),
    author_name: str = typer.Option(None, "--author-name", "-a", help="Author name"),
    description: str = typer.Option(None, "--description", "--desc", help="Project description"),
):
    """
    Initialize a new MLOps project with interactive prompts, CLI flags, or presets
    """
    # Check if using a preset
    if preset:
        try:
            # Get preset configuration
            choices = get_preset_choices(
                preset, 
                project_name=project_name,
                author_name=author_name,
                description=description
            )
            
            # Allow individual flags to override preset values
            if framework:
                choices["framework"] = framework
            if task_type:
                choices["task_type"] = task_type
            if tracking:
                choices["experiment_tracking"] = tracking
            if orchestration:
                choices["orchestration"] = orchestration
            if deployment:
                choices["deployment"] = deployment
            if monitoring:
                choices["monitoring"] = monitoring
            
            # Validate choices
            validate_choices(choices)
            
            # Show preset info
            preset_info = STACK_PRESETS[preset.lower()]
            console.print(f"🎯 Using preset: [bold cyan]{preset_info['name']}[/bold cyan]")
            console.print(f"📝 {preset_info['description']}")
            console.print(f"🚀 Generating {choices['project_name']}...\n")
            
            # Render the project
            renderer = ProjectRenderer(choices)
            renderer.generate_project()
            
            # Record project generation in analytics
            analytics = ProjectAnalytics()
            analytics.record_project_generation(choices, str(renderer.output_dir))
            
            # Success message
            console.print(f"✅ Project '{choices['project_name']}' generated successfully using [bold cyan]{preset_info['name']}[/bold cyan] preset!")
            return
            
        except ValueError as e:
            console.print(
                Panel(
                    Text(f"❌ {str(e)}", style="bold red"),
                    border_style="red",
                )
            )
            raise typer.Exit(1)
    
    # Check if running in non-interactive mode (any flag provided)
    non_interactive = any([
        framework, task_type, tracking, orchestration, 
        deployment, monitoring, project_name, author_name, description
    ])
    
    if non_interactive:
        # Non-interactive mode - use provided flags
        choices = {
            "framework": framework or "sklearn",
            "task_type": task_type or "classification",
            "experiment_tracking": tracking or "mlflow",
            "orchestration": orchestration or "none",
            "deployment": deployment or "fastapi",
            "monitoring": monitoring or "evidently",
            "project_name": project_name or "ml-project",
            "author_name": author_name or "ML Engineer",
            "description": description or "A production-ready ML project"
        }
        
        # Validate non-interactive choices
        validate_choices(choices)
        
        # Show minimal output for CI/CD
        console.print(f"🚀 Generating {choices['project_name']} with {choices['framework']}...")
        
        # Render the project
        renderer = ProjectRenderer(choices)
        renderer.generate_project()
        
        # Record project generation in analytics
        analytics = ProjectAnalytics()
        analytics.record_project_generation(choices, str(renderer.output_dir))
        
        # Simple success message for CI/CD
        console.print(f"✅ Project '{choices['project_name']}' generated successfully!")
        
    else:
        # Interactive mode - show full banner and prompts
        # Create impressive banner with better layout
        title = Text("🧠 MLOps Project Generator", style="bold cyan")
        title.stylize("bold magenta", 0, 2)  # 🧠 in magenta
        title.stylize("bold cyan", 3, 28)  # MLOps Project Generator in cyan

        # Create feature highlights with better formatting
        features_text = Text()
        features_text.append("🔧 Frameworks: ", style="bold cyan")
        features_text.append("Scikit-learn • PyTorch • TensorFlow\n", style="white")
        features_text.append("📊 Task Types: ", style="bold cyan")
        features_text.append("Classification • Regression • Time-Series\n", style="white")
        features_text.append("🔬 Tracking: ", style="bold cyan")
        features_text.append("MLflow • W&B • Custom\n", style="white")
        features_text.append("🚀 Deployment: ", style="bold cyan")
        features_text.append("FastAPI • Docker • Kubernetes", style="white")

        # Create author credit
        author_text = Text("Created by H A R S H H A A", style="italic dim cyan")

        # Main banner panel with better content
        main_panel = Panel(
            features_text,
            title=title,
            subtitle=author_text,
            border_style="cyan",
            padding=(1, 3),
            title_align="center",
            subtitle_align="center",
        )

        console.print(main_panel)
        console.print()  # Add spacing

        try:
            # Get user choices through interactive prompts
            choices = get_user_choices()

            # Validate choices
            validate_choices(choices)

            # Render the project
            renderer = ProjectRenderer(choices)
            renderer.generate_project()
            
            # Record project generation in analytics
            analytics = ProjectAnalytics()
            analytics.record_project_generation(choices, str(renderer.output_dir))

            # Success message with great UI
            success_title = Text("🎉 Project Generated Successfully!", style="bold green")
            success_title.stylize("bold yellow", 0, 2)  # 🎉 in yellow

            # Create project summary
            summary_table = Table(show_header=False, box=None, padding=0)
            summary_table.add_column(justify="left", style="cyan", width=15)
            summary_table.add_column(justify="left", style="white", width=25)

            summary_table.add_row("📁 Project", choices["project_name"])
            summary_table.add_row("🔧 Framework", choices["framework"].title())
            summary_table.add_row("📊 Task Type", choices["task_type"].title())
            summary_table.add_row("🔬 Tracking", choices["experiment_tracking"].title())
            summary_table.add_row("🚀 Deploy", choices["deployment"].title())

            success_panel = Panel(
                Align.center(summary_table),
                title=success_title,
                subtitle="Created by H A R S H H A A • Ready to build! 🚀",
                border_style="green",
                padding=(1, 2),
            )

            console.print(success_panel)

            # Show next steps
            next_steps = get_next_steps(
                choices["framework"], choices["task_type"], choices["deployment"]
            )

            steps_text = Text()
            for i, step in enumerate(next_steps, 1):
                steps_text.append(f"{i}. {step}\n", style="cyan")

            next_steps_panel = Panel(
                steps_text,
                title="🎯 Next Steps",
                border_style="blue",
                padding=(1, 2),
            )

            console.print(next_steps_panel)
            console.print(
                Text(
                    f"\n✨ Happy coding with {choices['project_name']}! ✨",
                    style="bold green",
                )
            )

        except Exception as e:
            console.print(
                Panel(
                    Text(f"❌ Error: {str(e)}", style="bold red"),
                    border_style="red",
                )
            )
            raise typer.Exit(1)


@app.command()
def version():
    """Show version information"""
    console.print("mlops-project-generator v2.0.1")


@app.command()
def validate(
    project_path: str = typer.Option(".", "--path", "-p", help="Path to the project to validate")
):
    """
    Validate an existing MLOps project structure and configuration
    """
    try:
        # Check if project path exists
        if not os.path.exists(project_path):
            console.print(
                Panel(
                    Text(f"❌ Path '{project_path}' does not exist", style="bold red"),
                    border_style="red",
                )
            )
            raise typer.Exit(1)
        
        # Validate the project
        is_valid = validate_project(project_path)
        
        # Exit with appropriate code
        if is_valid:
            console.print("\n✅ [bold green]Project validation completed successfully![/bold green]")
            raise typer.Exit(0)
        else:
            console.print("\n❌ [bold red]Project validation failed. Please address the issues above.[/bold red]")
            raise typer.Exit(1)
            
    except Exception as e:
        console.print(
            Panel(
                Text(f"❌ Error during validation: {str(e)}", style="bold red"),
                border_style="red",
            )
        )
        raise typer.Exit(1)


# Configuration Management Commands
@app.command()
def save_preset(
    name: str = typer.Argument(..., help="Name of the preset"),
    config_file: str = typer.Option(None, "--config", "-c", help="Configuration file to load"),
    description: str = typer.Option("", "--description", "-d", help="Description of the preset")
):
    """Save a project configuration as a preset"""
    config_manager = ConfigManager()
    
    if config_file:
        # Load from file
        config = config_manager.load_config(config_file)
        if not config:
            console.print(f"❌ Configuration file '{config_file}' not found")
            raise typer.Exit(1)
    else:
        # Use current directory configuration
        console.print("🔍 Analyzing current project...")
        # This would analyze the current project to extract configuration
        console.print("⚠️  Please provide a configuration file with --config option")
        raise typer.Exit(1)
    
    config_manager.save_preset(name, config, description)


@app.command()
def list_presets():
    """List all available stack presets and saved configuration presets"""
    # Show stack presets
    console.print("\n[bold cyan]📦 Stack Presets[/bold cyan]\n")
    
    table = Table(show_header=True, header_style="bold magenta", box=None)
    table.add_column("Preset", style="cyan", width=20)
    table.add_column("Framework", style="green", width=12)
    table.add_column("Tracking", style="yellow", width=12)
    table.add_column("Orchestration", style="blue", width=14)
    table.add_column("Deploy", style="magenta", width=12)
    table.add_column("Monitor", style="red", width=12)
    
    for preset_id, preset in STACK_PRESETS.items():
        table.add_row(
            f"⚡ {preset['name']}" if preset_id == "quick-start" else
            f"🧪 {preset['name']}" if preset_id == "data-science" else
            f"🧠 {preset['name']}" if preset_id == "deep-learning" else
            f"📡 {preset['name']}" if preset_id == "production-mlops" else
            f"🏢 {preset['name']}" if preset_id == "enterprise" else
            f"🔬 {preset['name']}",
            preset['framework'].title(),
            preset['experiment_tracking'].title(),
            preset['orchestration'].title(),
            preset['deployment'].title(),
            preset['monitoring'].title()
        )
    
    console.print(table)
    console.print("\n[dim]Usage: mlops-project-generator init --preset <name>[/dim]")
    console.print("[dim]Example: mlops-project-generator init --preset quick-start[/dim]\n")
    
    # Show saved configuration presets
    console.print("[bold cyan]💾 Saved Configuration Presets[/bold cyan]\n")
    config_manager = ConfigManager()
    config_manager.display_presets()


@app.command()
def load_preset(
    name: str = typer.Argument(..., help="Name of the preset to load"),
    output_file: str = typer.Option(None, "--output", "-o", help="Output file for configuration")
):
    """Load a preset configuration"""
    config_manager = ConfigManager()
    preset = config_manager.get_preset(name)
    
    if not preset:
        console.print(f"❌ Preset '{name}' not found")
        raise typer.Exit(1)
    
    if output_file:
        config_manager.save_config(preset["config"], output_file)
    else:
        # Display the configuration
        console.print(f"📋 Preset: {preset['name']}")
        console.print(f"📝 Description: {preset['description']}")
        console.print("⚙️  Configuration:")
        for key, value in preset["config"].items():
            console.print(f"  {key}: {value}")


@app.command()
def delete_preset(
    name: str = typer.Argument(..., help="Name of the preset to delete")
):
    """Delete a preset"""
    config_manager = ConfigManager()
    
    if config_manager.delete_preset(name):
        console.print(f"✅ Preset '{name}' deleted successfully")
    else:
        console.print(f"❌ Preset '{name}' not found")
        raise typer.Exit(1)


# Template Management Commands
@app.command()
def create_template(
    name: str = typer.Argument(..., help="Name of the custom template"),
    framework: str = typer.Argument(..., help="Base framework (sklearn, pytorch, tensorflow)"),
    description: str = typer.Option("", "--description", "-d", help="Description of the template")
):
    """Create a custom template based on an existing framework"""
    customizer = TemplateCustomizer()
    customizer.create_custom_template(name, framework, description)


@app.command()
def list_templates():
    """List all custom templates"""
    customizer = TemplateCustomizer()
    customizer.display_custom_templates()


@app.command()
def delete_template(
    name: str = typer.Argument(..., help="Name of the template to delete")
):
    """Delete a custom template"""
    customizer = TemplateCustomizer()
    customizer.delete_template(name)


@app.command()
def add_template_file(
    template_name: str = typer.Argument(..., help="Name of the template"),
    file_path: str = typer.Argument(..., help="Path of the file to add"),
    content: str = typer.Option("", "--content", "-c", help="Content of the file")
):
    """Add a custom file to a template"""
    customizer = TemplateCustomizer()
    customizer.add_custom_file(template_name, file_path, content)


# Analytics Commands
@app.command()
def stats():
    """Show project generation statistics"""
    analytics = ProjectAnalytics()
    analytics.display_project_stats()


@app.command()
def analyze(
    project_path: str = typer.Argument(".", help="Path to the project to analyze")
):
    """Analyze a generated project"""
    analytics = ProjectAnalytics()
    analytics.display_project_analysis(project_path)


# Cloud Deployment Commands
@app.command()
def cloud_services():
    """List available cloud deployment services"""
    deployer = CloudDeployer()
    deployer.display_cloud_services()


@app.command()
def cloud_deploy(
    provider: str = typer.Argument(..., help="Cloud provider (aws, gcp, azure)"),
    service: str = typer.Argument(..., help="Cloud service"),
    project_path: str = typer.Option(".", "--project", "-p", help="Path to the project")
):
    """Generate cloud deployment templates"""
    deployer = CloudDeployer()
    
    # Load project configuration
    # This would need to be implemented to extract config from existing project
    choices = {
        "project_name": Path(project_path).name,
        "framework": "sklearn",  # Default, should be detected
        "task_type": "classification",
        "deployment": "fastapi",
        "monitoring": "none"
    }
    
    deployer.generate_cloud_templates(provider, service, Path(project_path), choices)


# Project Browser Commands
@app.command()
def browse():
    """Interactive project browser"""
    browser = ProjectBrowser()
    browser.browse_projects()


@app.command()
def export_projects(
    output_file: str = typer.Argument(..., help="Output file for project list")
):
    """Export project list to a file"""
    browser = ProjectBrowser()
    browser.export_project_list(output_file)


@app.command()
def import_projects(
    input_file: str = typer.Argument(..., help="Input file with project list")
):
    """Import project list from a file"""
    browser = ProjectBrowser()
    browser.import_project_list(input_file)


@app.command()
def clone(
    source_project: str = typer.Argument(..., help="Source project path or name"),
    target_name: str = typer.Option(None, "--name", "-n", help="Target project name"),
    target_dir: str = typer.Option(None, "--dir", "-d", help="Target directory"),
    deep_clone: bool = typer.Option(False, "--deep", help="Deep clone with all artifacts")
):
    """
    Clone an existing project with configuration
    """
    lifecycle = ProjectLifecycleManager()
    
    try:
        # Determine if source is a path or project name from analytics
        if Path(source_project).exists():
            source_path = Path(source_project)
        else:
            # Find project by name in analytics
            analytics = ProjectAnalytics()
            projects = analytics.load_projects()["projects"]
            matching_projects = [p for p in projects if p["project_name"] == source_project]
            if not matching_projects:
                console.print(f"❌ Project '{source_project}' not found")
                raise typer.Exit(1)
            source_path = Path(matching_projects[0]["project_path"])
        
        # Perform clone
        target_path = lifecycle.clone_project(
            source_path, 
            target_name or f"{source_path.name}-clone",
            target_dir,
            deep_clone
        )
        
        console.print(f"✅ Project cloned to: {target_path}")
        
    except Exception as e:
        console.print(f"❌ Clone failed: {str(e)}")
        raise typer.Exit(1)


@app.command()
def archive(
    project_path: str = typer.Argument(..., help="Project path to archive"),
    archive_type: str = typer.Option("zip", "--type", "-t", help="Archive type (zip, tar, gzip)"),
    include_data: bool = typer.Option(False, "--data", help="Include data directories"),
    include_models: bool = typer.Option(True, "--models", help="Include model files")
):
    """
    Archive a project with selective content inclusion
    """
    lifecycle = ProjectLifecycleManager()
    
    try:
        archive_path = lifecycle.archive_project(
            project_path, archive_type, include_data, include_models
        )
        console.print(f"✅ Project archived to: {archive_path}")
        
    except Exception as e:
        console.print(f"❌ Archive failed: {str(e)}")
        raise typer.Exit(1)


@app.command()
def check_deps(
    project_path: str = typer.Option(".", "--path", "-p", help="Project path to check"),
    update: bool = typer.Option(False, "--update", "-u", help="Update dependencies"),
    security: bool = typer.Option(False, "--security", "-s", help="Check for security vulnerabilities")
):
    """
    Check and manage project dependencies
    """
    checker = DependencyChecker()
    
    try:
        issues = checker.check_dependencies(project_path)
        
        if issues:
            console.print("🔍 Dependency Issues Found:")
            for issue in issues:
                console.print(f"  • {issue}")
        
        if security:
            vulns = checker.check_security_vulnerabilities(project_path)
            if vulns:
                console.print("\n🚨 Security Vulnerabilities:")
                for vuln in vulns:
                    console.print(f"  • {vuln}")
        
        if update:
            checker.update_dependencies(project_path)
            console.print("✅ Dependencies updated")
        else:
            console.print("\n💡 Use --update to fix dependency issues")
            
    except Exception as e:
        console.print(f"❌ Dependency check failed: {str(e)}")
        raise typer.Exit(1)


@app.command()
def profile(
    project_path: str = typer.Option(".", "--path", "-p", help="Project path to profile"),
    model_file: str = typer.Option(None, "--model", "-m", help="Model file to profile"),
    output_format: str = typer.Option("table", "--format", "-f", help="Output format (table, json, csv)")
):
    """
    Profile model performance and resource usage
    """
    profiler = PerformanceProfiler()
    
    try:
        results = profiler.profile_project(project_path, model_file)
        profiler.display_results(results, output_format)
        
    except Exception as e:
        console.print(f"❌ Profiling failed: {str(e)}")
        raise typer.Exit(1)


@app.command()
def migrate(
    old_project: str = typer.Argument(..., help="Old project path"),
    new_framework: str = typer.Argument(..., help="Target framework"),
    config_file: str = typer.Option(None, "--config", "-c", help="Migration configuration file")
):
    """
    Migrate project between frameworks
    """
    lifecycle = ProjectLifecycleManager()
    
    try:
        migration_plan = lifecycle.create_migration_plan(old_project, new_framework)
        
        console.print("🔄 Migration Plan:")
        for step in migration_plan["steps"]:
            console.print(f"  • {step}")
        
        if Confirm.ask("Proceed with migration?"):
            result = lifecycle.execute_migration(old_project, new_framework, config_file)
            console.print(f"✅ Migration completed: {result['new_project_path']}")
        
    except Exception as e:
        console.print(f"❌ Migration failed: {str(e)}")
        raise typer.Exit(1)


@app.command()
def doctor(
    project_path: str = typer.Option(".", "--path", "-p", help="Project path to check"),
    fix: bool = typer.Option(False, "--fix", "-f", help="Automatically fix issues"),
    deep_scan: bool = typer.Option(False, "--deep", "-d", help="Perform deep scan")
):
    """
    Comprehensive project health check and diagnostics
    """
    lifecycle = ProjectLifecycleManager()
    
    try:
        health_report = lifecycle.health_check(project_path, deep_scan)
        
        console.print("🏥 Project Health Report:")
        console.print(f"Overall Score: {health_report['overall_score']}/100")
        
        for category, issues in health_report['categories'].items():
            console.print(f"\n{category.replace('_', ' ').title()}:")
            for issue in issues:
                status = "✅" if issue['status'] == 'healthy' else "⚠️" if issue['status'] == 'warning' else "❌"
                console.print(f"  {status} {issue['message']}")
        
        if fix and health_report['fixable_issues']:
            console.print("\n🔧 Auto-fixing issues...")
            fixed = lifecycle.auto_fix_issues(project_path, health_report['fixable_issues'])
            console.print(f"✅ Fixed {len(fixed)} issues")
        
    except Exception as e:
        console.print(f"❌ Health check failed: {str(e)}")
        raise typer.Exit(1)


if __name__ == "__main__":
    app()
