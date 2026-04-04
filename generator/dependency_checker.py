"""
Dependency checker and manager for MLOps Project Generator
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

console = Console()


class DependencyChecker:
    """
    Checks and manages project dependencies with security scanning
    """

    def __init__(self):
        self.cache_dir = Path.home() / ".mlops-project-generator" / "dependency_cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.vulnerability_db = self.cache_dir / "vulnerabilities.json"
        self._ensure_vulnerability_db()

    def _ensure_vulnerability_db(self):
        """Ensure vulnerability database exists"""
        if not self.vulnerability_db.exists():
            # Create a basic vulnerability database (in practice, would fetch from real sources)
            basic_vulns = {
                "numpy": {
                    "<1.21.0": ["CVE-2021-34141: Memory corruption vulnerability"],
                    "<1.22.0": ["CVE-2022-34141: Buffer overflow vulnerability"]
                },
                "pandas": {
                    "<1.3.0": ["CVE-2021-32944: Code execution vulnerability"],
                    "<1.4.0": ["CVE-2022-32944: Deserialization vulnerability"]
                },
                "requests": {
                    "<2.25.0": ["CVE-2021-33503: Redirect vulnerability"],
                    "<2.26.0": ["CVE-2021-33504: Header injection vulnerability"]
                },
                "pillow": {
                    "<8.2.0": ["CVE-2021-34552: Image parsing vulnerability"],
                    "<9.0.0": ["CVE-2022-22817: Buffer overflow vulnerability"]
                }
            }
            
            with open(self.vulnerability_db, "w", encoding="utf-8") as f:
                json.dump(basic_vulns, f, indent=2)

    def check_dependencies(self, project_path: str) -> List[str]:
        """Check project dependencies for issues"""
        project_path = Path(project_path)
        issues = []
        
        # Find requirements files
        requirements_files = [
            project_path / "requirements.txt",
            project_path / "requirements-dev.txt",
            project_path / "pyproject.toml"
        ]
        
        for req_file in requirements_files:
            if req_file.exists():
                file_issues = self._check_requirements_file(req_file)
                issues.extend(file_issues)
        
        # Check for dependency conflicts
        conflict_issues = self._check_dependency_conflicts(project_path)
        issues.extend(conflict_issues)
        
        # Check for outdated dependencies
        outdated_issues = self._check_outdated_dependencies(project_path)
        issues.extend(outdated_issues)
        
        return issues

    def _check_requirements_file(self, requirements_file: Path) -> List[str]:
        """Check a specific requirements file"""
        issues = []
        
        try:
            content = requirements_file.read_text(encoding="utf-8")
            lines = content.split("\n")
            
            for line_num, line in enumerate(lines, 1):
                line = line.strip()
                
                # Skip comments and empty lines
                if not line or line.startswith("#"):
                    continue
                
                # Check for common issues
                if not self._is_valid_requirement_line(line):
                    issues.append(f"Line {line_num} in {requirements_file.name}: Invalid requirement format '{line}'")
                
                # Check for unpinned dependencies
                if "==" not in line and ">=" not in line and "<=" not in line and "~=" not in line:
                    package_name = line.split(">")[0].split("<")[0].split("=")[0].strip()
                    issues.append(f"Unpinned dependency: {package_name} (line {line_num})")
                
                # Check for known problematic packages
                problematic_packages = ["pip", "setuptools", "wheel"]
                for pkg in problematic_packages:
                    if line.startswith(pkg) and not any(op in line for op in [">", "<", "="]):
                        issues.append(f"Consider pinning version for {pkg} (line {line_num})")
        
        except Exception as e:
            issues.append(f"Error reading {requirements_file.name}: {str(e)}")
        
        return issues

    def _is_valid_requirement_line(self, line: str) -> bool:
        """Check if a requirement line is valid"""
        # Basic validation - in practice would use more sophisticated parsing
        if not line or line.startswith("#"):
            return True
        
        # Remove comments
        if " #" in line:
            line = line.split(" #")[0].strip()
        
        # Check for basic package name pattern
        import re
        package_pattern = r'^[a-zA-Z0-9_-]+([><=!~]+[0-9\.]+.*)?$'
        return bool(re.match(package_pattern, line))

    def _check_dependency_conflicts(self, project_path: Path) -> List[str]:
        """Check for dependency conflicts"""
        conflicts = []
        
        # Parse all requirements
        all_deps = self._parse_all_dependencies(project_path)
        
        # Check for version conflicts
        for package, versions in all_deps.items():
            if len(versions) > 1:
                conflicts.append(f"Conflicting versions for {package}: {', '.join(versions)}")
        
        # Check for known incompatible packages
        incompatible_pairs = [
            ("tensorflow", "torch"),
            ("keras", "torch"),
            ("sklearn", "pyspark")  # Sometimes conflicting
        ]
        
        for pkg1, pkg2 in incompatible_pairs:
            if pkg1 in all_deps and pkg2 in all_deps:
                conflicts.append(f"Potentially incompatible packages: {pkg1} and {pkg2}")
        
        return conflicts

    def _parse_all_dependencies(self, project_path: Path) -> Dict[str, List[str]]:
        """Parse all dependencies from project"""
        deps = {}
        
        requirements_files = [
            project_path / "requirements.txt",
            project_path / "requirements-dev.txt"
        ]
        
        for req_file in requirements_files:
            if req_file.exists():
                try:
                    content = req_file.read_text(encoding="utf-8")
                    lines = content.split("\n")
                    
                    for line in lines:
                        line = line.strip()
                        if line and not line.startswith("#"):
                            package_name = self._extract_package_name(line)
                            version_spec = self._extract_version_spec(line)
                            
                            if package_name not in deps:
                                deps[package_name] = []
                            if version_spec and version_spec not in deps[package_name]:
                                deps[package_name].append(version_spec)
                
                except Exception:
                    continue
        
        return deps

    def _extract_package_name(self, requirement: str) -> str:
        """Extract package name from requirement line"""
        # Remove version specifiers
        for op in [">=", "<=", "==", ">", "<", "~=", "!="]:
            if op in requirement:
                return requirement.split(op)[0].strip()
        return requirement.strip()

    def _extract_version_spec(self, requirement: str) -> str:
        """Extract version specification from requirement line"""
        for op in [">=", "<=", "==", ">", "<", "~=", "!="]:
            if op in requirement:
                return requirement.split(op)[1].strip()
        return ""

    def _check_outdated_dependencies(self, project_path: Path) -> List[str]:
        """Check for outdated dependencies"""
        outdated = []
        
        try:
            # Try to get latest versions (simplified approach)
            result = subprocess.run(
                [sys.executable, "-m", "pip", "list", "--outdated", "--format=json"],
                capture_output=True,
                text=True,
                cwd=project_path
            )
            
            if result.returncode == 0:
                try:
                    outdated_packages = json.loads(result.stdout)
                    for pkg in outdated_packages[:10]:  # Limit to first 10
                        outdated.append(f"Outdated: {pkg['name']} {pkg['version']} -> {pkg['latest_version']}")
                except json.JSONDecodeError:
                    pass
        
        except Exception:
            # If pip list fails, provide a generic message
            outdated.append("Unable to check for outdated dependencies (pip list failed)")
        
        return outdated

    def check_security_vulnerabilities(self, project_path: str) -> List[str]:
        """Check for security vulnerabilities in dependencies"""
        project_path = Path(project_path)
        vulnerabilities = []
        
        # Load vulnerability database
        try:
            with open(self.vulnerability_db, "r", encoding="utf-8") as f:
                vuln_db = json.load(f)
        except Exception:
            return ["Unable to load vulnerability database"]
        
        # Parse dependencies
        deps = self._parse_all_dependencies(project_path)
        
        # Check each dependency against vulnerability database
        for package, versions in deps.items():
            if package.lower() in vuln_db:
                package_vulns = vuln_db[package.lower()]
                
                for version_spec in versions:
                    if self._version_is_vulnerable(version_spec, package_vulns):
                        for version_range, vulns in package_vulns.items():
                            if self._version_matches_range(version_spec, version_range):
                                for vuln in vulns:
                                    vulnerabilities.append(f"Security issue in {package}: {vuln}")
        
        return vulnerabilities

    def _version_is_vulnerable(self, version_spec: str, vulnerability_data: Dict[str, List[str]]) -> bool:
        """Check if a version specification is vulnerable"""
        # Simplified vulnerability checking
        for version_range in vulnerability_data.keys():
            if self._version_matches_range(version_spec, version_range):
                return True
        return False

    def _version_matches_range(self, version_spec: str, version_range: str) -> bool:
        """Check if version specification matches vulnerable range"""
        # Simplified version matching - in practice would use packaging.version
        try:
            if version_spec.startswith("=="):
                version = version_spec[2:]
                return self._compare_versions(version, version_range[1:]) < 0
            elif version_spec.startswith("<"):
                version = version_spec[1:]
                return self._compare_versions(version, version_range[1:]) <= 0
        except Exception:
            pass
        return False

    def _compare_versions(self, v1: str, v2: str) -> int:
        """Simple version comparison"""
        try:
            v1_parts = [int(x) for x in v1.split('.')]
            v2_parts = [int(x) for x in v2.split('.')]
            
            # Pad shorter version with zeros
            max_len = max(len(v1_parts), len(v2_parts))
            v1_parts.extend([0] * (max_len - len(v1_parts)))
            v2_parts.extend([0] * (max_len - len(v2_parts)))
            
            for a, b in zip(v1_parts, v2_parts):
                if a < b:
                    return -1
                elif a > b:
                    return 1
            return 0
        except Exception:
            return 0

    def update_dependencies(self, project_path: str):
        """Update project dependencies"""
        project_path = Path(project_path)
        
        # Update pip first
        console.print("🔄 Updating pip...")
        self._run_command([sys.executable, "-m", "pip", "install", "--upgrade", "pip"], project_path)
        
        # Update requirements.txt dependencies
        requirements_file = project_path / "requirements.txt"
        if requirements_file.exists():
            console.print("🔄 Updating requirements.txt dependencies...")
            self._update_requirements_file(requirements_file)
        
        # Update pyproject.toml dependencies
        pyproject_file = project_path / "pyproject.toml"
        if pyproject_file.exists():
            console.print("🔄 Updating pyproject.toml dependencies...")
            self._update_pyproject_dependencies(pyproject_file)

    def _run_command(self, command: List[str], cwd: Path) -> bool:
        """Run a command and return success status"""
        try:
            result = subprocess.run(
                command,
                cwd=cwd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            return result.returncode == 0
        except subprocess.TimeoutExpired:
            console.print(f"❌ Command timed out: {' '.join(command)}")
            return False
        except Exception as e:
            console.print(f"❌ Command failed: {str(e)}")
            return False

    def _update_requirements_file(self, requirements_file: Path):
        """Update dependencies in requirements.txt"""
        try:
            content = requirements_file.read_text(encoding="utf-8")
            lines = content.split("\n")
            updated_lines = []
            
            for line in lines:
                line = line.strip()
                if line and not line.startswith("#"):
                    package_name = self._extract_package_name(line)
                    
                    # Try to get latest version
                    latest_version = self._get_latest_version(package_name)
                    if latest_version:
                        updated_lines.append(f"{package_name}=={latest_version}")
                    else:
                        updated_lines.append(line)
                else:
                    updated_lines.append(line)
            
            requirements_file.write_text("\n".join(updated_lines), encoding="utf-8")
            
        except Exception as e:
            console.print(f"❌ Failed to update requirements.txt: {str(e)}")

    def _update_pyproject_dependencies(self, pyproject_file: Path):
        """Update dependencies in pyproject.toml"""
        try:
            content = pyproject_file.read_text(encoding="utf-8")
            
            # Simple regex-based update (in practice would use TOML parser)
            import re
            
            # Find dependencies section
            deps_match = re.search(r'dependencies\s*=\s*\[(.*?)\]', content, re.DOTALL)
            if deps_match:
                deps_section = deps_match.group(1)
                # Update each dependency (simplified)
                updated_deps = self._update_dependency_list(deps_section)
                
                # Replace in content
                new_content = content.replace(deps_section, updated_deps)
                pyproject_file.write_text(new_content, encoding="utf-8")
        
        except Exception as e:
            console.print(f"❌ Failed to update pyproject.toml: {str(e)}")

    def _update_dependency_list(self, deps_section: str) -> str:
        """Update a list of dependencies"""
        # Simplified dependency list update
        lines = deps_section.split("\n")
        updated_lines = []
        
        for line in lines:
            line = line.strip()
            if line and not line.startswith("#"):
                # Extract package name from quoted string
                if '"' in line:
                    package_spec = line.split('"')[1]
                    package_name = self._extract_package_name(package_spec)
                    latest_version = self._get_latest_version(package_name)
                    if latest_version:
                        updated_lines.append(f'    "{package_name}=={latest_version}",')
                    else:
                        updated_lines.append(line)
                else:
                    updated_lines.append(line)
            else:
                updated_lines.append(line)
        
        return "\n".join(updated_lines)

    def _get_latest_version(self, package_name: str) -> Optional[str]:
        """Get latest version of a package"""
        try:
            result = subprocess.run(
                [sys.executable, "-m", "pip", "index", "versions", package_name],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                output = result.stdout
                # Parse versions from output
                import re
                versions_match = re.search(r'Available versions: (.+)', output)
                if versions_match:
                    versions_str = versions_match.group(1)
                    versions = [v.strip() for v in versions_str.split(",")]
                    # Return the last (latest) version
                    return versions[-1].strip()
        
        except Exception:
            pass
        
        return None

    def generate_dependency_report(self, project_path: str) -> Dict[str, Any]:
        """Generate comprehensive dependency report"""
        project_path = Path(project_path)
        
        report = {
            "project_path": str(project_path),
            "scan_date": datetime.now().isoformat(),
            "dependencies": {},
            "issues": [],
            "vulnerabilities": [],
            "recommendations": []
        }
        
        # Parse dependencies
        deps = self._parse_all_dependencies(project_path)
        report["dependencies"] = deps
        
        # Check issues
        issues = self.check_dependencies(str(project_path))
        report["issues"] = issues
        
        # Check vulnerabilities
        vulns = self.check_security_vulnerabilities(str(project_path))
        report["vulnerabilities"] = vulns
        
        # Generate recommendations
        recommendations = self._generate_recommendations(deps, issues, vulns)
        report["recommendations"] = recommendations
        
        return report

    def _generate_recommendations(self, deps: Dict[str, List[str]], issues: List[str], vulns: List[str]) -> List[str]:
        """Generate recommendations based on dependency analysis"""
        recommendations = []
        
        # Security recommendations
        if vulns:
            recommendations.append("🚨 Update vulnerable packages immediately")
        
        # Version pinning recommendations
        unpinned_count = sum(1 for issue in issues if "Unpinned dependency" in issue)
        if unpinned_count > 0:
            recommendations.append(f"📌 Pin versions for {unpinned_count} unpinned dependencies")
        
        # Outdated dependencies
        outdated_count = sum(1 for issue in issues if "Outdated:" in issue)
        if outdated_count > 0:
            recommendations.append(f"⬆️ Update {outdated_count} outdated dependencies")
        
        # Dependency management
        if len(deps) > 50:
            recommendations.append("📦 Consider reducing dependency count")
        
        # Development dependencies
        if "pytest" not in deps and "test" not in deps:
            recommendations.append("🧪 Add testing framework (pytest)")
        
        if "black" not in deps and "flake8" not in deps:
            recommendations.append("🎨 Add code formatting tools (black, flake8)")
        
        return recommendations
