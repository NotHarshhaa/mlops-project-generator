"""
Interactive prompts for user configuration
"""

from typing import Dict, List, Any
from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.table import Table
from rich.panel import Panel
from rich.text import Text

console = Console()


def get_user_choices() -> Dict[str, Any]:
    """
    Get user choices through interactive prompts
    
    Returns:
        Dict containing all user choices
    """
    choices = {}
    
    # Framework selection
    console.print(Panel(Text("🔧 Choose ML Framework", style="bold cyan")))
    framework_choices = ["Scikit-learn", "PyTorch", "TensorFlow"]
    framework = Prompt.ask(
        "Select framework",
        choices=framework_choices,
        default="Scikit-learn"
    )
    choices["framework"] = framework.lower().replace("-", "")
    
    # Task type selection
    console.print(Panel(Text("📊 Choose Task Type", style="bold cyan")))
    task_choices = ["Classification", "Regression", "Time-Series"]
    task_type = Prompt.ask(
        "Select task type",
        choices=task_choices,
        default="Classification"
    )
    choices["task_type"] = task_type.lower().replace("-", "")
    
    # Experiment tracking
    console.print(Panel(Text("🔬 Experiment Tracking", style="bold cyan")))
    tracking_choices = ["MLflow", "W&B", "None"]
    experiment_tracking = Prompt.ask(
        "Select experiment tracking",
        choices=tracking_choices,
        default="MLflow"
    )
    choices["experiment_tracking"] = experiment_tracking.lower().replace("&", "wandb" if experiment_tracking == "W&B" else experiment_tracking.lower())
    
    # Orchestration
    console.print(Panel(Text("🎯 Orchestration", style="bold cyan")))
    orchestration_choices = ["Airflow", "Kubeflow", "None"]
    orchestration = Prompt.ask(
        "Select orchestration tool",
        choices=orchestration_choices,
        default="None"
    )
    choices["orchestration"] = orchestration.lower()
    
    # Deployment
    console.print(Panel(Text("🚀 Deployment", style="bold cyan")))
    deployment_choices = ["FastAPI", "Docker", "Kubernetes"]
    deployment = Prompt.ask(
        "Select deployment method",
        choices=deployment_choices,
        default="FastAPI"
    )
    choices["deployment"] = deployment.lower()
    
    # Monitoring
    console.print(Panel(Text("📈 Monitoring", style="bold cyan")))
    monitoring_choices = ["Evidently", "Custom", "None"]
    monitoring = Prompt.ask(
        "Select monitoring solution",
        choices=monitoring_choices,
        default="Evidently"
    )
    choices["monitoring"] = monitoring.lower()
    
    # Project name
    console.print(Panel(Text("📝 Project Details", style="bold cyan")))
    project_name = Prompt.ask(
        "Enter project name",
        default=f"mlops-{choices['framework']}-{choices['task_type']}"
    )
    choices["project_name"] = project_name
    
    # Author name
    author_name = Prompt.ask(
        "Enter author name",
        default="ML Engineer"
    )
    choices["author_name"] = author_name
    
    # Display summary
    display_summary(choices)
    
    # Confirm choices
    if not Confirm.ask("Proceed with these choices?", default=True):
        console.print("❌ Project generation cancelled.")
        exit(0)
    
    return choices


def display_summary(choices: Dict[str, Any]) -> None:
    """Display a summary of user choices"""
    table = Table(title="📋 Project Configuration Summary")
    table.add_column("Setting", style="cyan")
    table.add_column("Choice", style="green")
    
    display_mapping = {
        "framework": "ML Framework",
        "task_type": "Task Type",
        "experiment_tracking": "Experiment Tracking",
        "orchestration": "Orchestration",
        "deployment": "Deployment",
        "monitoring": "Monitoring",
        "project_name": "Project Name",
        "author_name": "Author"
    }
    
    for key, display_name in display_mapping.items():
        value = choices.get(key, "N/A")
        # Format display values
        if value == "none":
            value = "None"
        elif value == "wandb":
            value = "W&B"
        elif value == "sklearn":
            value = "Scikit-learn"
        elif value == "pytorch":
            value = "PyTorch"
        elif value == "tensorflow":
            value = "TensorFlow"
        
        table.add_row(display_name, value)
    
    console.print(table)
