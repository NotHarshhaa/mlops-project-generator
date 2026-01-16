#!/usr/bin/env python3
"""
CLI interface for MLOps Project Generator
"""

import typer
from rich.console import Console
from rich.panel import Panel
from rich.text import Text

from generator.prompts import get_user_choices
from generator.renderer import ProjectRenderer
from generator.validators import validate_choices

app = typer.Typer(
    name="mlops-project-generator",
    help="🚀 Generate production-ready MLOps project templates",
    no_args_is_help=True,
)
console = Console()


@app.command()
def init():
    """
    Initialize a new MLOps project with interactive prompts
    """
    console.print(Panel(
        Text("🧠 MLOps Project Generator", style="bold blue"),
        subtitle="Production-ready ML project templates",
        border_style="blue"
    ))
    
    try:
        # Get user choices through interactive prompts
        choices = get_user_choices()
        
        # Validate choices
        validate_choices(choices)
        
        # Render the project
        renderer = ProjectRenderer(choices)
        renderer.generate_project()
        
        console.print(Panel(
            Text("✅ Project generated successfully!", style="bold green"),
            subtitle=f"Framework: {choices['framework']} | Task: {choices['task_type']}",
            border_style="green"
        ))
        
    except Exception as e:
        console.print(Panel(
            Text(f"❌ Error: {str(e)}", style="bold red"),
            border_style="red"
        ))
        raise typer.Exit(1)


@app.command()
def version():
    """Show version information"""
    console.print(f"mlops-project-generator v1.0.0")


if __name__ == "__main__":
    app()
