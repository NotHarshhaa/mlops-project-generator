#!/usr/bin/env python3
"""
Script to publish the MLOps Project Generator to PyPI
"""

import subprocess
import sys
from pathlib import Path


def run_command(cmd, check=True):
    """Run a command and return the result"""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    return result


def check_git_status():
    """Check if git working directory is clean"""
    result = run_command("git status --porcelain")
    if result.stdout.strip():
        print("❌ Git working directory is not clean. Please commit or stash changes.")
        sys.exit(1)
    print("✅ Git working directory is clean")


def build_package():
    """Build the package"""
    print("🔨 Building package...")
    run_command("python -m pip install --upgrade build")
    run_command("python -m build")
    print("✅ Package built successfully")


def check_package():
    """Check the package with twine"""
    print("🔍 Checking package...")
    run_command("python -m pip install --upgrade twine")
    run_command("twine check dist/*")
    print("✅ Package check passed")


def publish_to_test_pypi():
    """Publish to Test PyPI"""
    print("🧪 Publishing to Test PyPI...")
    run_command("twine upload --repository testpypi dist/*")
    print("✅ Published to Test PyPI")


def publish_to_pypi():
    """Publish to PyPI"""
    print("🚀 Publishing to PyPI...")
    run_command("twine upload dist/*")
    print("✅ Published to PyPI")


def main():
    """Main publishing workflow"""
    print("🚀 MLOps Project Generator Publishing Script")
    print("=" * 50)
    
    # Check prerequisites
    check_git_status()
    
    # Build and check package
    build_package()
    check_package()
    
    # Ask where to publish
    print("\nWhere do you want to publish?")
    print("1. Test PyPI (recommended first)")
    print("2. Production PyPI")
    print("3. Both (Test first, then Production)")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        publish_to_test_pypi()
        print("\n🎉 Successfully published to Test PyPI!")
        print("Install with: pip install --index-url https://test.pypi.org/simple/ mlops-project-generator")
        
    elif choice == "2":
        confirm = input("⚠️  Are you sure you want to publish to production PyPI? (y/N): ").strip().lower()
        if confirm == 'y':
            publish_to_pypi()
            print("\n🎉 Successfully published to PyPI!")
            print("Install with: pip install mlops-project-generator")
        else:
            print("❌ Publication cancelled")
            
    elif choice == "3":
        print("Publishing to Test PyPI first...")
        publish_to_test_pypi()
        
        confirm = input("\n✅ Test PyPI successful. Continue to production PyPI? (y/N): ").strip().lower()
        if confirm == 'y':
            publish_to_pypi()
            print("\n🎉 Successfully published to both Test PyPI and PyPI!")
            print("Install with: pip install mlops-project-generator")
        else:
            print("❌ Production publication cancelled")
            print("🎉 Still published to Test PyPI!")
            print("Install with: pip install --index-url https://test.pypi.org/simple/ mlops-project-generator")
    else:
        print("❌ Invalid choice")
        sys.exit(1)


if __name__ == "__main__":
    main()
