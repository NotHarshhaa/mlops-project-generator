"""
Template customization system for MLOps Project Generator
"""

import json
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.prompt import Confirm, Prompt

from generator.config_manager import ConfigManager

console = Console()


class TemplateCustomizer:
    """
    Manages custom templates and template customization
    """

    def __init__(self):
        self.config_manager = ConfigManager()
        self.templates_dir = Path.home() / ".mlops-project-generator" / "custom_templates"
        self.templates_dir.mkdir(parents=True, exist_ok=True)

    def create_custom_template(self, name: str, base_framework: str, description: str = ""):
        """Create a new custom template based on an existing framework"""
        # Get the base template directory
        package_dir = Path(__file__).parent.parent
        base_template_dir = package_dir / "templates" / base_framework
        
        if not base_template_dir.exists():
            console.print(f"❌ Base framework '{base_framework}' not found")
            return
        
        # Create custom template directory
        custom_template_dir = self.templates_dir / name
        if custom_template_dir.exists():
            if not Confirm.ask(f"Template '{name}' already exists. Overwrite?"):
                return
            shutil.rmtree(custom_template_dir)
        
        # Copy base template
        shutil.copytree(base_template_dir, custom_template_dir)
        
        # Add metadata file
        metadata = {
            "name": name,
            "description": description,
            "base_framework": base_framework,
            "created_at": str(Path().cwd()),
            "custom_files": [],
            "modified_files": []
        }
        
        metadata_file = custom_template_dir / "template_metadata.json"
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
        
        console.print(f"✅ Custom template '{name}' created successfully!")
        console.print(f"📁 Template location: {custom_template_dir}")

    def list_custom_templates(self) -> List[Dict[str, Any]]:
        """List all custom templates"""
        templates = []
        
        for template_dir in self.templates_dir.iterdir():
            if template_dir.is_dir():
                metadata_file = template_dir / "template_metadata.json"
                if metadata_file.exists():
                    try:
                        with open(metadata_file, "r", encoding="utf-8") as f:
                            metadata = json.load(f)
                        templates.append(metadata)
                    except json.JSONDecodeError:
                        continue
        
        return templates

    def display_custom_templates(self):
        """Display all custom templates"""
        templates = self.list_custom_templates()
        
        if not templates:
            console.print("No custom templates found.")
            console.print("Use 'create-template' to create one.")
            return
        
        table = Table(title="🎨 Custom Templates")
        table.add_column("Name", style="cyan", width=15)
        table.add_column("Base Framework", style="green", width=15)
        table.add_column("Description", style="white", width=25)
        table.add_column("Files", style="yellow", width=10)
        
        for template in templates:
            file_count = len(list((self.templates_dir / template["name"]).rglob("*")))
            table.add_row(
                template["name"],
                template["base_framework"],
                template.get("description", ""),
                str(file_count)
            )
        
        console.print(table)

    def add_custom_file(self, template_name: str, file_path: str, content: str = ""):
        """Add a custom file to a template"""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists():
            console.print(f"❌ Template '{template_name}' not found")
            return
        
        # Create the file
        target_file = template_dir / file_path
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        if content:
            with open(target_file, "w", encoding="utf-8") as f:
                f.write(content)
        else:
            target_file.touch()
        
        # Update metadata
        metadata_file = template_dir / "template_metadata.json"
        with open(metadata_file, "r", encoding="utf-8") as f:
            metadata = json.load(f)
        
        if file_path not in metadata["custom_files"]:
            metadata["custom_files"].append(file_path)
        
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
        
        console.print(f"✅ File '{file_path}' added to template '{template_name}'")

    def remove_file(self, template_name: str, file_path: str):
        """Remove a file from a template"""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists():
            console.print(f"❌ Template '{template_name}' not found")
            return
        
        target_file = template_dir / file_path
        if target_file.exists():
            target_file.unlink()
        
        # Update metadata
        metadata_file = template_dir / "template_metadata.json"
        with open(metadata_file, "r", encoding="utf-8") as f:
            metadata = json.load(f)
        
        if file_path in metadata["custom_files"]:
            metadata["custom_files"].remove(file_path)
        
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
        
        console.print(f"🗑️ File '{file_path}' removed from template '{template_name}'")

    def list_template_files(self, template_name: str) -> List[str]:
        """List all files in a custom template"""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists():
            console.print(f"❌ Template '{template_name}' not found")
            return []
        
        files = []
        for file_path in template_dir.rglob("*"):
            if file_path.is_file() and file_path.name != "template_metadata.json":
                relative_path = file_path.relative_to(template_dir)
                files.append(str(relative_path))
        
        return sorted(files)

    def display_template_files(self, template_name: str):
        """Display files in a custom template"""
        files = self.list_template_files(template_name)
        
        if not files:
            console.print(f"No files found in template '{template_name}'")
            return
        
        table = Table(title=f"📁 Files in Template '{template_name}'")
        table.add_column("File Path", style="cyan")
        
        for file_path in files:
            table.add_row(file_path)
        
        console.print(table)

    def export_template(self, template_name: str, export_path: str):
        """Export a custom template to a directory"""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists():
            console.print(f"❌ Template '{template_name}' not found")
            return
        
        export_dir = Path(export_path)
        if export_dir.exists():
            if not Confirm.ask(f"Directory '{export_path}' already exists. Overwrite?"):
                return
            shutil.rmtree(export_dir)
        
        shutil.copytree(template_dir, export_dir)
        console.print(f"✅ Template '{template_name}' exported to '{export_path}'")

    def import_template(self, import_path: str, template_name: str):
        """Import a template from a directory"""
        import_dir = Path(import_path)
        
        if not import_dir.exists():
            console.print(f"❌ Import path '{import_path}' does not exist")
            return
        
        template_dir = self.templates_dir / template_name
        if template_dir.exists():
            if not Confirm.ask(f"Template '{template_name}' already exists. Overwrite?"):
                return
            shutil.rmtree(template_dir)
        
        shutil.copytree(import_dir, template_dir)
        
        # Create metadata if it doesn't exist
        metadata_file = template_dir / "template_metadata.json"
        if not metadata_file.exists():
            metadata = {
                "name": template_name,
                "description": f"Imported from {import_path}",
                "base_framework": "custom",
                "created_at": str(Path().cwd()),
                "custom_files": [],
                "modified_files": []
            }
            
            with open(metadata_file, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=2)
        
        console.print(f"✅ Template imported as '{template_name}'")

    def delete_template(self, template_name: str):
        """Delete a custom template"""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists():
            console.print(f"❌ Template '{template_name}' not found")
            return
        
        if Confirm.ask(f"Are you sure you want to delete template '{template_name}'?"):
            shutil.rmtree(template_dir)
            console.print(f"🗑️ Template '{template_name}' deleted")

    def get_available_frameworks(self) -> List[str]:
        """Get list of available base frameworks"""
        package_dir = Path(__file__).parent.parent
        templates_dir = package_dir / "templates"
        
        frameworks = []
        for item in templates_dir.iterdir():
            if item.is_dir() and item.name != "common":
                frameworks.append(item.name)
        
        return frameworks

    def validate_template(self, template_name: str) -> List[str]:
        """Validate a custom template and return any issues"""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists():
            return [f"Template '{template_name}' not found"]
        
        issues = []
        
        # Check metadata
        metadata_file = template_dir / "template_metadata.json"
        if not metadata_file.exists():
            issues.append("Missing template_metadata.json")
        
        # Check for required files
        required_files = ["requirements.txt.j2", "README.md.j2"]
        for required_file in required_files:
            if not (template_dir / required_file).exists():
                issues.append(f"Missing required file: {required_file}")
        
        # Check for Jinja2 syntax errors
        for template_file in template_dir.rglob("*.j2"):
            try:
                # Basic Jinja2 syntax check
                content = template_file.read_text(encoding="utf-8")
                # This is a basic check - for more thorough validation, 
                # you'd want to use Jinja2's environment
                if "{{" in content and "}}" not in content:
                    issues.append(f"Possible Jinja2 syntax error in {template_file.name}")
            except Exception as e:
                issues.append(f"Error reading {template_file.name}: {e}")
        
        return issues

    def display_template_validation(self, template_name: str):
        """Display validation results for a template"""
        issues = self.validate_template(template_name)
        
        if not issues:
            console.print(f"✅ Template '{template_name}' is valid!")
        else:
            console.print(f"❌ Template '{template_name}' has issues:")
            for issue in issues:
                console.print(f"  • {issue}")

    def create_template_from_project(self, project_path: str, template_name: str, description: str = ""):
        """Create a custom template from an existing project"""
        project_dir = Path(project_path)
        
        if not project_dir.exists():
            console.print(f"❌ Project path '{project_path}' does not exist")
            return
        
        # Create template directory
        template_dir = self.templates_dir / template_name
        if template_dir.exists():
            if not Confirm.ask(f"Template '{template_name}' already exists. Overwrite?"):
                return
            shutil.rmtree(template_dir)
        
        # Copy project files
        shutil.copytree(project_dir, template_dir)
        
        # Convert appropriate files to Jinja2 templates
        for file_path in template_dir.rglob("*"):
            if file_path.is_file() and file_path.suffix in [".py", ".md", ".txt", ".yml", ".yaml"]:
                # Rename to .j2 for template processing
                template_file = file_path.with_suffix(file_path.suffix + ".j2")
                file_path.rename(template_file)
        
        # Create metadata
        metadata = {
            "name": template_name,
            "description": description or f"Created from project {project_dir.name}",
            "base_framework": "custom",
            "created_at": str(Path().cwd()),
            "custom_files": [],
            "modified_files": []
        }
        
        metadata_file = template_dir / "template_metadata.json"
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
        
        console.print(f"✅ Template '{template_name}' created from project!")
        console.print(f"📁 Template location: {template_dir}")
        console.print("⚠️  Remember to customize the Jinja2 variables in the template files.")
