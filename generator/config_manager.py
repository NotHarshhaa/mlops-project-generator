"""
Configuration management for MLOps Project Generator
"""

import json
import os
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

console = Console()


class ConfigManager:
    """
    Manages project configurations, templates, and presets
    """

    def __init__(self):
        self.config_dir = Path.home() / ".mlops-project-generator"
        self.config_dir.mkdir(exist_ok=True)
        self.presets_file = self.config_dir / "presets.json"
        self.templates_file = self.config_dir / "custom_templates.json"
        self._ensure_default_configs()

    def _ensure_default_configs(self):
        """Ensure default configuration files exist"""
        if not self.presets_file.exists():
            self._create_default_presets()
        if not self.templates_file.exists():
            self._create_default_templates()

    def _create_default_presets(self):
        """Create default project presets"""
        default_presets = {
            "quick-start": {
                "name": "Quick Start",
                "description": "Fast setup for prototyping",
                "config": {
                    "framework": "sklearn",
                    "task_type": "classification",
                    "experiment_tracking": "none",
                    "orchestration": "none",
                    "deployment": "fastapi",
                    "monitoring": "none"
                }
            },
            "production-ready": {
                "name": "Production Ready",
                "description": "Full MLOps stack for production",
                "config": {
                    "framework": "pytorch",
                    "task_type": "classification",
                    "experiment_tracking": "mlflow",
                    "orchestration": "airflow",
                    "deployment": "kubernetes",
                    "monitoring": "evidently"
                }
            },
            "research": {
                "name": "Research",
                "description": "Experiment tracking focused setup",
                "config": {
                    "framework": "pytorch",
                    "task_type": "classification",
                    "experiment_tracking": "wandb",
                    "orchestration": "none",
                    "deployment": "fastapi",
                    "monitoring": "custom"
                }
            },
            "enterprise": {
                "name": "Enterprise",
                "description": "Enterprise-grade MLOps pipeline",
                "config": {
                    "framework": "tensorflow",
                    "task_type": "classification",
                    "experiment_tracking": "mlflow",
                    "orchestration": "kubeflow",
                    "deployment": "kubernetes",
                    "monitoring": "evidently"
                }
            }
        }
        
        with open(self.presets_file, "w", encoding="utf-8") as f:
            json.dump(default_presets, f, indent=2)

    def _create_default_templates(self):
        """Create default custom templates configuration"""
        default_templates = {
            "custom_templates": [],
            "template_paths": [],
            "overrides": {}
        }
        
        with open(self.templates_file, "w", encoding="utf-8") as f:
            json.dump(default_templates, f, indent=2)

    def save_preset(self, name: str, config: Dict[str, Any], description: str = ""):
        """Save a project configuration as a preset"""
        presets = self.load_presets()
        
        presets[name] = {
            "name": name,
            "description": description,
            "config": config
        }
        
        with open(self.presets_file, "w", encoding="utf-8") as f:
            json.dump(presets, f, indent=2)
        
        console.print(f"✅ Preset '{name}' saved successfully!")

    def load_presets(self) -> Dict[str, Any]:
        """Load all saved presets"""
        try:
            with open(self.presets_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def get_preset(self, name: str) -> Optional[Dict[str, Any]]:
        """Get a specific preset by name"""
        presets = self.load_presets()
        return presets.get(name)

    def delete_preset(self, name: str) -> bool:
        """Delete a preset"""
        presets = self.load_presets()
        if name in presets:
            del presets[name]
            with open(self.presets_file, "w", encoding="utf-8") as f:
                json.dump(presets, f, indent=2)
            return True
        return False

    def list_presets(self) -> List[Dict[str, Any]]:
        """List all available presets"""
        presets = self.load_presets()
        preset_list = []
        
        for key, preset in presets.items():
            preset_list.append({
                "key": key,
                "name": preset.get("name", key),
                "description": preset.get("description", ""),
                "config": preset.get("config", {})
            })
        
        return preset_list

    def display_presets(self):
        """Display all presets in a formatted table"""
        presets = self.list_presets()
        
        if not presets:
            console.print("No presets found. Use 'save-preset' to create one.")
            return
        
        table = Table(title="📋 Available Presets")
        table.add_column("Name", style="cyan", width=15)
        table.add_column("Description", style="white", width=25)
        table.add_column("Framework", style="green", width=12)
        table.add_column("Deployment", style="yellow", width=12)
        table.add_column("Tracking", style="blue", width=12)
        
        for preset in presets:
            config = preset["config"]
            table.add_row(
                preset["name"],
                preset["description"],
                config.get("framework", "N/A").title(),
                config.get("deployment", "N/A").title(),
                config.get("experiment_tracking", "N/A").title()
            )
        
        console.print(table)

    def save_config(self, config: Dict[str, Any], filename: str):
        """Save a configuration to a file"""
        config_file = self.config_dir / f"{filename}.json"
        
        with open(config_file, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2)
        
        console.print(f"✅ Configuration saved to {config_file}")

    def load_config(self, filename: str) -> Optional[Dict[str, Any]]:
        """Load a configuration from a file"""
        config_file = self.config_dir / f"{filename}.json"
        
        try:
            with open(config_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def list_saved_configs(self) -> List[str]:
        """List all saved configuration files"""
        configs = []
        for file in self.config_dir.glob("*.json"):
            if file.name not in ["presets.json", "custom_templates.json"]:
                configs.append(file.stem)
        return configs

    def export_preset(self, preset_name: str, export_path: str):
        """Export a preset to a file"""
        preset = self.get_preset(preset_name)
        if not preset:
            console.print(f"❌ Preset '{preset_name}' not found")
            return
        
        export_file = Path(export_path)
        if not export_file.suffix:
            export_file = export_file.with_suffix(".json")
        
        with open(export_file, "w", encoding="utf-8") as f:
            json.dump(preset, f, indent=2)
        
        console.print(f"✅ Preset exported to {export_file}")

    def import_preset(self, import_path: str, preset_name: str = None):
        """Import a preset from a file"""
        import_file = Path(import_path)
        
        try:
            with open(import_file, "r", encoding="utf-8") as f:
                preset_data = json.load(f)
            
            if isinstance(preset_data, dict) and "config" in preset_data:
                # It's a full preset object
                name = preset_name or preset_data.get("name", import_file.stem)
                preset = preset_data
            else:
                # It's just a config dict
                name = preset_name or import_file.stem
                preset = {
                    "name": name,
                    "description": f"Imported from {import_file.name}",
                    "config": preset_data
                }
            
            self.save_preset(name, preset["config"], preset["description"])
            
        except (FileNotFoundError, json.JSONDecodeError) as e:
            console.print(f"❌ Error importing preset: {e}")

    def create_environment_config(self, env_name: str, base_config: Dict[str, Any], 
                               env_overrides: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create environment-specific configuration"""
        env_config = base_config.copy()
        
        if env_overrides:
            env_config.update(env_overrides)
        
        # Add environment-specific settings
        env_settings = {
            "development": {
                "debug": True,
                "log_level": "DEBUG",
                "monitoring": "none",
                "orchestration": "none"
            },
            "staging": {
                "debug": False,
                "log_level": "INFO",
                "monitoring": "evidently",
                "orchestration": "airflow"
            },
            "production": {
                "debug": False,
                "log_level": "WARNING",
                "monitoring": "evidently",
                "orchestration": "kubeflow",
                "deployment": "kubernetes"
            }
        }
        
        if env_name in env_settings:
            env_config.update(env_settings[env_name])
        
        # Save environment config
        env_file = self.config_dir / f"{env_name}_config.json"
        with open(env_file, "w", encoding="utf-8") as f:
            json.dump(env_config, f, indent=2)
        
        console.print(f"✅ Environment config '{env_name}' created")
        return env_config

    def get_environment_config(self, env_name: str) -> Optional[Dict[str, Any]]:
        """Get environment-specific configuration"""
        env_file = self.config_dir / f"{env_name}_config.json"
        
        try:
            with open(env_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def list_environments(self) -> List[str]:
        """List all available environment configurations"""
        environments = []
        for file in self.config_dir.glob("*_config.json"):
            if file.name not in ["presets.json", "custom_templates.json"]:
                env_name = file.stem.replace("_config", "")
                environments.append(env_name)
        return environments

    def merge_configurations(self, base_config: Dict[str, Any], 
                          override_config: Dict[str, Any]) -> Dict[str, Any]:
        """Merge two configurations with proper conflict resolution"""
        merged = base_config.copy()
        
        for key, value in override_config.items():
            if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
                merged[key] = self.merge_configurations(merged[key], value)
            else:
                merged[key] = value
        
        return merged

    def validate_configuration_compatibility(self, config1: Dict[str, Any], 
                                            config2: Dict[str, Any]) -> Dict[str, Any]:
        """Validate compatibility between two configurations"""
        compatibility = {
            "compatible": True,
            "conflicts": [],
            "warnings": [],
            "recommendations": []
        }
        
        # Check framework compatibility
        fw1 = config1.get("framework")
        fw2 = config2.get("framework")
        if fw1 and fw2 and fw1 != fw2:
            compatibility["conflicts"].append(f"Framework mismatch: {fw1} vs {fw2}")
            compatibility["compatible"] = False
        
        # Check deployment compatibility
        dep1 = config1.get("deployment")
        dep2 = config2.get("deployment")
        if dep1 and dep2 and dep1 != dep2:
            compatibility["warnings"].append(f"Deployment difference: {dep1} vs {dep2}")
        
        # Check orchestration compatibility
        orch1 = config1.get("orchestration")
        orch2 = config2.get("orchestration")
        if orch1 == "kubeflow" and dep2 == "fastapi":
            compatibility["recommendations"].append("Kubeflow works best with containerized deployments")
        
        return compatibility

    def create_config_template(self, template_name: str, 
                             framework: str, 
                             use_cases: List[str]) -> Dict[str, Any]:
        """Create a configuration template for specific use cases"""
        template_config = {
            "framework": framework,
            "template_name": template_name,
            "use_cases": use_cases,
            "base_config": self._get_base_config_for_framework(framework),
            "customizations": {}
        }
        
        # Add use-case specific customizations
        for use_case in use_cases:
            customizations = self._get_use_case_customizations(use_case, framework)
            template_config["customizations"][use_case] = customizations
        
        # Save template
        template_file = self.config_dir / f"template_{template_name}.json"
        with open(template_file, "w", encoding="utf-8") as f:
            json.dump(template_config, f, indent=2)
        
        console.print(f"✅ Configuration template '{template_name}' created")
        return template_config

    def _get_base_config_for_framework(self, framework: str) -> Dict[str, Any]:
        """Get base configuration for a framework"""
        base_configs = {
            "sklearn": {
                "framework": "sklearn",
                "task_type": "classification",
                "experiment_tracking": "mlflow",
                "orchestration": "none",
                "deployment": "fastapi",
                "monitoring": "evidently"
            },
            "pytorch": {
                "framework": "pytorch",
                "task_type": "classification",
                "experiment_tracking": "wandb",
                "orchestration": "airflow",
                "deployment": "docker",
                "monitoring": "custom"
            },
            "tensorflow": {
                "framework": "tensorflow",
                "task_type": "classification",
                "experiment_tracking": "mlflow",
                "orchestration": "kubeflow",
                "deployment": "kubernetes",
                "monitoring": "evidently"
            }
        }
        
        return base_configs.get(framework, base_configs["sklearn"])

    def _get_use_case_customizations(self, use_case: str, framework: str) -> Dict[str, Any]:
        """Get customizations for specific use cases"""
        customizations = {
            "research": {
                "experiment_tracking": "wandb" if framework == "pytorch" else "mlflow",
                "orchestration": "none",
                "deployment": "fastapi",
                "monitoring": "custom"
            },
            "production": {
                "experiment_tracking": "mlflow",
                "orchestration": "kubeflow" if framework in ["tensorflow", "pytorch"] else "airflow",
                "deployment": "kubernetes",
                "monitoring": "evidently"
            },
            "prototype": {
                "experiment_tracking": "none",
                "orchestration": "none",
                "deployment": "fastapi",
                "monitoring": "none"
            },
            "enterprise": {
                "experiment_tracking": "mlflow",
                "orchestration": "airflow",
                "deployment": "kubernetes",
                "monitoring": "evidently"
            }
        }
        
        return customizations.get(use_case, {})

    def apply_template(self, template_name: str, use_case: str, 
                     additional_overrides: Dict[str, Any] = None) -> Dict[str, Any]:
        """Apply a configuration template"""
        template_file = self.config_dir / f"template_{template_name}.json"
        
        try:
            with open(template_file, "r", encoding="utf-8") as f:
                template = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            console.print(f"❌ Template '{template_name}' not found")
            return {}
        
        base_config = template["base_config"].copy()
        
        # Apply use case customizations
        if use_case in template["customizations"]:
            base_config.update(template["customizations"][use_case])
        
        # Apply additional overrides
        if additional_overrides:
            base_config.update(additional_overrides)
        
        return base_config

    def create_config_pipeline(self, pipeline_name: str, 
                             stages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a configuration pipeline for multi-stage deployments"""
        pipeline_config = {
            "pipeline_name": pipeline_name,
            "stages": stages,
            "created_at": datetime.now().isoformat(),
            "current_stage": 0
        }
        
        # Validate pipeline
        validation_result = self._validate_pipeline(pipeline_config)
        if not validation_result["valid"]:
            console.print(f"❌ Pipeline validation failed: {validation_result['errors']}")
            return {}
        
        # Save pipeline
        pipeline_file = self.config_dir / f"pipeline_{pipeline_name}.json"
        with open(pipeline_file, "w", encoding="utf-8") as f:
            json.dump(pipeline_config, f, indent=2)
        
        console.print(f"✅ Configuration pipeline '{pipeline_name}' created")
        return pipeline_config

    def _validate_pipeline(self, pipeline_config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate a configuration pipeline"""
        validation = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        stages = pipeline_config.get("stages", [])
        if not stages:
            validation["errors"].append("Pipeline must have at least one stage")
            validation["valid"] = False
        
        # Check stage order
        stage_order = ["development", "staging", "production"]
        for i, stage in enumerate(stages):
            stage_name = stage.get("name")
            if stage_name in stage_order and stage_order.index(stage_name) != i:
                validation["warnings"].append(f"Stage '{stage_name}' may be in wrong position")
        
        return validation

    def get_pipeline_stage_config(self, pipeline_name: str, stage_index: int = None) -> Optional[Dict[str, Any]]:
        """Get configuration for a specific pipeline stage"""
        pipeline_file = self.config_dir / f"pipeline_{pipeline_name}.json"
        
        try:
            with open(pipeline_file, "r", encoding="utf-8") as f:
                pipeline = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None
        
        stages = pipeline.get("stages", [])
        
        if stage_index is None:
            stage_index = pipeline.get("current_stage", 0)
        
        if 0 <= stage_index < len(stages):
            return stages[stage_index]
        
        return None

    def advance_pipeline_stage(self, pipeline_name: str) -> bool:
        """Advance to the next stage in a pipeline"""
        pipeline_file = self.config_dir / f"pipeline_{pipeline_name}.json"
        
        try:
            with open(pipeline_file, "r", encoding="utf-8") as f:
                pipeline = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return False
        
        current_stage = pipeline.get("current_stage", 0)
        next_stage = current_stage + 1
        
        if next_stage < len(pipeline["stages"]):
            pipeline["current_stage"] = next_stage
            
            with open(pipeline_file, "w", encoding="utf-8") as f:
                json.dump(pipeline, f, indent=2)
            
            console.print(f"✅ Advanced to stage: {pipeline['stages'][next_stage]['name']}")
            return True
        else:
            console.print("⚠️ Already at final stage")
            return False

    def create_config_diff(self, config1: Dict[str, Any], config2: Dict[str, Any]) -> Dict[str, Any]:
        """Create a diff between two configurations"""
        diff = {
            "added": {},
            "removed": {},
            "modified": {},
            "unchanged": {}
        }
        
        all_keys = set(config1.keys()) | set(config2.keys())
        
        for key in all_keys:
            if key in config1 and key not in config2:
                diff["removed"][key] = config1[key]
            elif key in config2 and key not in config1:
                diff["added"][key] = config2[key]
            elif key in config1 and key in config2:
                if config1[key] == config2[key]:
                    diff["unchanged"][key] = config1[key]
                else:
                    diff["modified"][key] = {
                        "old": config1[key],
                        "new": config2[key]
                    }
        
        return diff

    def display_config_diff(self, diff: Dict[str, Any]):
        """Display configuration diff in a readable format"""
        if not any(diff.values()):
            console.print("✅ No differences found")
            return
        
        # Added keys
        if diff["added"]:
            console.print("[green]➕ Added:[/green]")
            for key, value in diff["added"].items():
                console.print(f"  {key}: {value}")
            console.print()
        
        # Removed keys
        if diff["removed"]:
            console.print("[red]➖ Removed:[/red]")
            for key, value in diff["removed"].items():
                console.print(f"  {key}: {value}")
            console.print()
        
        # Modified keys
        if diff["modified"]:
            console.print("[yellow]🔄 Modified:[/yellow]")
            for key, values in diff["modified"].items():
                console.print(f"  {key}: {values['old']} → {values['new']}")
            console.print()

    def backup_configuration(self, config_name: str) -> str:
        """Create a backup of a configuration"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{config_name}_backup_{timestamp}"
        
        # Copy the configuration file
        source_file = self.config_dir / f"{config_name}.json"
        backup_file = self.config_dir / f"{backup_name}.json"
        
        if source_file.exists():
            shutil.copy2(source_file, backup_file)
            console.print(f"✅ Configuration backed up as '{backup_name}'")
            return backup_name
        else:
            console.print(f"❌ Configuration '{config_name}' not found")
            return ""

    def restore_configuration(self, backup_name: str, target_name: str = None) -> bool:
        """Restore a configuration from backup"""
        backup_file = self.config_dir / f"{backup_name}.json"
        
        if not backup_file.exists():
            console.print(f"❌ Backup '{backup_name}' not found")
            return False
        
        if target_name is None:
            # Remove backup suffix
            target_name = backup_name.replace("_backup_", "").split("_")[0]
        
        target_file = self.config_dir / f"{target_name}.json"
        shutil.copy2(backup_file, target_file)
        
        console.print(f"✅ Configuration restored as '{target_name}'")
        return True
