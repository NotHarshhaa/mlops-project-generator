"""
Stack presets for MLOps Project Generator
"""

STACK_PRESETS = {
    "quick-start": {
        "name": "Quick Start",
        "description": "Zero friction — get a working project in seconds",
        "framework": "sklearn",
        "task_type": "classification",
        "experiment_tracking": "none",
        "orchestration": "none",
        "deployment": "fastapi",
        "monitoring": "none"
    },
    "data-science": {
        "name": "Data Science",
        "description": "Ideal for exploratory analysis and Jupyter workflows",
        "framework": "sklearn",
        "task_type": "regression",
        "experiment_tracking": "mlflow",
        "orchestration": "none",
        "deployment": "fastapi",
        "monitoring": "custom"
    },
    "deep-learning": {
        "name": "Deep Learning",
        "description": "PyTorch-first setup with experiment tracking",
        "framework": "pytorch",
        "task_type": "classification",
        "experiment_tracking": "wandb",
        "orchestration": "none",
        "deployment": "docker",
        "monitoring": "none"
    },
    "production-mlops": {
        "name": "Production MLOps",
        "description": "Battle-tested stack with full observability",
        "framework": "pytorch",
        "task_type": "classification",
        "experiment_tracking": "mlflow",
        "orchestration": "airflow",
        "deployment": "docker",
        "monitoring": "evidently"
    },
    "enterprise": {
        "name": "Enterprise",
        "description": "Maximum scale — Kubernetes & full MLOps suite",
        "framework": "tensorflow",
        "task_type": "classification",
        "experiment_tracking": "mlflow",
        "orchestration": "kubeflow",
        "deployment": "kubernetes",
        "monitoring": "evidently"
    },
    "research": {
        "name": "Research",
        "description": "Flexible setup optimised for experimentation",
        "framework": "pytorch",
        "task_type": "regression",
        "experiment_tracking": "wandb",
        "orchestration": "none",
        "deployment": "fastapi",
        "monitoring": "none"
    }
}


def get_preset(preset_name: str) -> dict:
    """
    Get a preset configuration by name
    
    Args:
        preset_name: Name of the preset (e.g., 'quick-start', 'enterprise')
    
    Returns:
        Dictionary with preset configuration
    
    Raises:
        ValueError: If preset not found
    """
    preset_name = preset_name.lower()
    if preset_name not in STACK_PRESETS:
        available = ", ".join(STACK_PRESETS.keys())
        raise ValueError(f"Preset '{preset_name}' not found. Available presets: {available}")
    
    return STACK_PRESETS[preset_name].copy()


def list_presets() -> dict:
    """
    Get all available presets
    
    Returns:
        Dictionary of all presets
    """
    return STACK_PRESETS.copy()


def get_preset_choices(preset_name: str, project_name: str = None, 
                       author_name: str = None, description: str = None) -> dict:
    """
    Get complete choices dictionary from a preset
    
    Args:
        preset_name: Name of the preset
        project_name: Optional project name override
        author_name: Optional author name override
        description: Optional description override
    
    Returns:
        Complete choices dictionary ready for project generation
    """
    preset = get_preset(preset_name)
    
    choices = {
        "framework": preset["framework"],
        "task_type": preset["task_type"],
        "experiment_tracking": preset["experiment_tracking"],
        "orchestration": preset["orchestration"],
        "deployment": preset["deployment"],
        "monitoring": preset["monitoring"],
        "project_name": project_name or f"{preset['name'].lower().replace(' ', '-')}-project",
        "author_name": author_name or "ML Engineer",
        "description": description or preset["description"]
    }
    
    return choices
