#!/usr/bin/env python3
"""
CLI interface for MLOps Project Generator
"""

import os
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

app = typer.Typer(
    name="mlops-project-generator",
    help="🚀 Generate production-ready MLOps project templates",
    no_args_is_help=True,
)
console = Console()


@app.command()
def init(
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
    Initialize a new MLOps project with interactive prompts or CLI flags
    """
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
    console.print("mlops-project-generator v1.0.7")


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
    """List all available presets"""
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


if __name__ == "__main__":
    app()
