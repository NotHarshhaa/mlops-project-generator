"""
Tests for project validation functionality
"""

import os
import tempfile
from unittest.mock import patch

import pytest

from generator.validator import ProjectValidator, ValidationResult


class TestProjectValidator:
    """Test cases for project validation functionality"""

    def setup_method(self):
        """Setup test environment"""
        self.temp_dir = tempfile.mkdtemp()
        self.validator = ProjectValidator(self.temp_dir)

    def teardown_method(self):
        """Cleanup test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_validate_all_empty_project(self):
        """Test validation on empty project"""
        result = self.validator.validate_all()
        
        # Should fail due to missing required directories
        assert result is False
        
        # Check for specific failures
        results = self.validator.results
        failed_checks = [r for r in results if r.status == "FAIL"]
        assert len(failed_checks) > 0
        
        # Should fail on missing required directories
        required_dirs = ["src", "configs", "data", "models", "scripts"]
        for dir_name in required_dirs:
            assert any(f"Directory: {dir_name}" in r.name and r.status == "FAIL" for r in results)

    def test_validate_basic_structure(self):
        """Test validation with basic project structure"""
        # Create required directories
        required_dirs = ["src", "configs", "data", "models", "scripts"]
        for dir_name in required_dirs:
            os.makedirs(os.path.join(self.temp_dir, dir_name))
        
        # Create basic files
        files_to_create = [
            "configs/config.yaml",
            "requirements.txt",
            "Makefile",
            ".gitignore",
            "README.md"
        ]
        
        for file_path in files_to_create:
            full_path = os.path.join(self.temp_dir, file_path)
            with open(full_path, 'w') as f:
                f.write("# Test content")
        
        result = self.validator.validate_all()
        
        # Should pass basic structure validation
        assert result is True
        
        # Check for specific passes
        results = self.validator.results
        passed_checks = [r for r in results if r.status == "PASS"]
        assert len(passed_checks) >= len(required_dirs) + len(files_to_create)

    def test_validate_sklearn_project(self):
        """Test validation of sklearn project"""
        # Create sklearn project structure
        dirs_to_create = ["src", "configs", "data", "models", "scripts"]
        for dir_name in dirs_to_create:
            os.makedirs(os.path.join(self.temp_dir, dir_name))
        
        # Create sklearn-specific files
        sklearn_files = {
            "src/model.py": "from sklearn.ensemble import RandomForestClassifier\n\nclass Model:\n    pass",
            "src/train.py": "import pandas as pd\nfrom sklearn.model_selection import train_test_split",
            "src/predict.py": "import joblib\nimport numpy as np",
            "configs/config.yaml": "project:\n  name: test-project",
            "requirements.txt": "scikit-learn==1.3.0\npandas==2.0.0"
        }
        
        for file_path, content in sklearn_files.items():
            full_path = os.path.join(self.temp_dir, file_path)
            with open(full_path, 'w') as f:
                f.write(content)
        
        result = self.validator.validate_all()
        
        # Should pass sklearn validation
        assert result is True
        
        # Check for sklearn-specific passes
        results = self.validator.results
        sklearn_passes = [r for r in results if "Sklearn:" in r.name and r.status == "PASS"]
        assert len(sklearn_passes) >= 3  # model.py, train.py, predict.py

    def test_validate_pytorch_project(self):
        """Test validation of PyTorch project"""
        # Create PyTorch project structure
        dirs_to_create = ["src", "configs", "data", "models", "scripts"]
        for dir_name in dirs_to_create:
            os.makedirs(os.path.join(self.temp_dir, dir_name))
        
        # Create PyTorch-specific files
        pytorch_files = {
            "src/model.py": "import torch\nimport torch.nn as nn\n\nclass Model(nn.Module):\n    def forward(self, x):\n        return x",
            "src/train.py": "import torch\nfrom torch.utils.data import DataLoader",
            "src/dataset.py": "import torch\nfrom torch.utils.data import Dataset",
            "configs/config.yaml": "project:\n  name: test-project",
            "requirements.txt": "torch==2.0.0\ntorchvision==0.15.0"
        }
        
        for file_path, content in pytorch_files.items():
            full_path = os.path.join(self.temp_dir, file_path)
            with open(full_path, 'w') as f:
                f.write(content)
        
        result = self.validator.validate_all()
        
        # Should pass PyTorch validation
        assert result is True
        
        # Check for PyTorch-specific passes
        results = self.validator.results
        pytorch_passes = [r for r in results if "PyTorch:" in r.name and r.status == "PASS"]
        assert len(pytorch_passes) >= 3  # model.py, train.py, dataset.py

    def test_validate_tensorflow_project(self):
        """Test validation of TensorFlow project"""
        # Create TensorFlow project structure
        dirs_to_create = ["src", "configs", "data", "models", "scripts"]
        for dir_name in dirs_to_create:
            os.makedirs(os.path.join(self.temp_dir, dir_name))
        
        # Create TensorFlow-specific files
        tf_files = {
            "src/model.py": "import tensorflow as tf\n\nclass Model:\n    def __init__(self):\n        self.model = tf.keras.Sequential()",
            "src/train.py": "import tensorflow as tf\nfrom tensorflow.keras.callbacks import EarlyStopping",
            "configs/config.yaml": "project:\n  name: test-project",
            "requirements.txt": "tensorflow==2.13.0\nnumpy==1.24.0"
        }
        
        for file_path, content in tf_files.items():
            full_path = os.path.join(self.temp_dir, file_path)
            with open(full_path, 'w') as f:
                f.write(content)
        
        result = self.validator.validate_all()
        
        # Should pass TensorFlow validation
        assert result is True
        
        # Check for TensorFlow-specific passes
        results = self.validator.results
        tf_passes = [r for r in results if "TensorFlow:" in r.name and r.status == "PASS"]
        assert len(tf_passes) >= 2  # model.py, train.py

    def test_validate_deployment_readiness(self):
        """Test deployment readiness validation"""
        # Create basic structure
        dirs_to_create = ["src", "configs"]
        for dir_name in dirs_to_create:
            os.makedirs(os.path.join(self.temp_dir, dir_name))
        
        # Create deployment files
        deployment_files = {
            "Dockerfile": "FROM python:3.11\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ['python', 'src/api.py']",
            "src/api.py": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/')\ndef root():\n    return {'message': 'Hello World'}",
            "requirements.txt": "fastapi==0.104.0\nuvicorn==0.24.0"
        }
        
        for file_path, content in deployment_files.items():
            full_path = os.path.join(self.temp_dir, file_path)
            with open(full_path, 'w') as f:
                f.write(content)
        
        result = self.validator.validate_all()
        
        # Check for deployment-specific passes
        results = self.validator.results
        deployment_passes = [r for r in results if "Deployment:" in r.name and r.status == "PASS"]
        assert len(deployment_passes) >= 2  # Dockerfile, api.py

    def test_validate_data_folders_safety(self):
        """Test data folder safety validation"""
        # Create data directories
        data_dirs = ["data/raw", "data/processed", "data/external"]
        for dir_name in data_dirs:
            full_path = os.path.join(self.temp_dir, dir_name)
            os.makedirs(full_path)
            
            # Add .gitignore to some directories
            if dir_name in ["data/raw", "data/processed"]:
                gitignore_path = os.path.join(full_path, ".gitignore")
                with open(gitignore_path, 'w') as f:
                    f.write("*.csv\n*.json\n")
        
        result = self.validator.validate_all()
        
        # Check for data safety passes
        results = self.validator.results
        data_safety_passes = [r for r in results if "Data Safety:" in r.name and r.status == "PASS"]
        assert len(data_safety_passes) >= 2  # Should have .gitignore in raw and processed

    def test_validate_mlflow_config(self):
        """Test MLflow configuration validation"""
        # Create MLflow directories
        mlflow_dirs = ["mlruns", ".mlflow"]
        for dir_name in mlflow_dirs:
            full_path = os.path.join(self.temp_dir, dir_name)
            os.makedirs(full_path)
        
        # Create MLflow config file
        mlflow_config = os.path.join(self.temp_dir, "configs", "mlflow_config.yaml")
        os.makedirs(os.path.dirname(mlflow_config), exist_ok=True)
        with open(mlflow_config, 'w') as f:
            f.write("mlflow:\n  tracking_uri: http://localhost:5000\n  experiment_name: default")
        
        result = self.validator.validate_all()
        
        # Check for MLflow passes (should be warnings since MLflow is optional)
        results = self.validator.results
        mlflow_results = [r for r in results if "MLflow:" in r.name]
        assert len(mlflow_results) >= 3  # mlruns, .mlflow, mlflow_config.yaml
        
        # All should be PASS or WARN (not FAIL)
        assert all(r.status in ["PASS", "WARN"] for r in mlflow_results)

    def test_validate_dependencies(self):
        """Test dependencies validation"""
        # Create requirements.txt with ML packages
        req_file = os.path.join(self.temp_dir, "requirements.txt")
        with open(req_file, 'w') as f:
            f.write("scikit-learn==1.3.0\npandas==2.0.0\nnumpy==1.24.0\nmatplotlib==3.7.0")
        
        result = self.validator.validate_all()
        
        # Check for dependency validation
        results = self.validator.results
        dep_results = [r for r in results if "Dependencies:" in r.name]
        assert len(dep_results) >= 2  # requirements.txt and ML packages
        
        # Should pass with ML packages detected
        ml_package_result = next((r for r in dep_results if "ML Packages" in r.name), None)
        assert ml_package_result is not None
        assert ml_package_result.status == "PASS"
        assert "scikit-learn" in ml_package_result.message

    def test_validate_documentation(self):
        """Test documentation validation"""
        # Create documentation files
        doc_files = {
            "README.md": "# Test Project\n\nThis is a test project with substantial content.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\nMore detailed content here.",
            "CHANGELOG.md": "# Changelog\n\n## [1.0.0] - 2023-01-01\n\n- Initial release",
            "docs/guide.md": "# User Guide\n\nThis is a detailed user guide."
        }
        
        for file_path, content in doc_files.items():
            full_path = os.path.join(self.temp_dir, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'w') as f:
                f.write(content)
        
        result = self.validator.validate_all()
        
        # Check for documentation passes
        results = self.validator.results
        doc_results = [r for r in results if "Documentation:" in r.name and r.status == "PASS"]
        assert len(doc_results) >= 3  # README.md, CHANGELOG.md, docs/

    def test_validate_nonexistent_path(self):
        """Test validation of nonexistent path"""
        nonexistent_path = os.path.join(self.temp_dir, "nonexistent")
        validator = ProjectValidator(nonexistent_path)
        
        # Should handle gracefully (not crash)
        result = validator.validate_all()
        
        # Should fail due to missing structure
        assert result is False

    def test_validation_result_creation(self):
        """Test ValidationResult creation and properties"""
        result = ValidationResult("Test Check", "PASS", "Test message", "Test details")
        
        assert result.name == "Test Check"
        assert result.status == "PASS"
        assert result.message == "Test message"
        assert result.details == "Test details"

    def test_framework_detection(self):
        """Test framework detection logic"""
        # Test sklearn detection
        sklearn_model = os.path.join(self.temp_dir, "src", "model.py")
        os.makedirs(os.path.dirname(sklearn_model), exist_ok=True)
        with open(sklearn_model, 'w') as f:
            f.write("from sklearn.ensemble import RandomForestClassifier")
        
        validator = ProjectValidator(self.temp_dir)
        detected_framework = validator._detect_framework()
        assert detected_framework == "sklearn"
        
        # Test PyTorch detection
        with open(sklearn_model, 'w') as f:
            f.write("import torch\nimport torch.nn as nn")
        
        validator = ProjectValidator(self.temp_dir)
        detected_framework = validator._detect_framework()
        assert detected_framework == "pytorch"
        
        # Test TensorFlow detection
        with open(sklearn_model, 'w') as f:
            f.write("import tensorflow as tf")
        
        validator = ProjectValidator(self.temp_dir)
        detected_framework = validator._detect_framework()
        assert detected_framework == "tensorflow"

    def test_partial_project_structure(self):
        """Test validation with partial project structure"""
        # Create only some required directories
        partial_dirs = ["src", "configs"]
        for dir_name in partial_dirs:
            os.makedirs(os.path.join(self.temp_dir, dir_name))
        
        # Create some files
        files_to_create = ["src/model.py", "configs/config.yaml"]
        for file_path in files_to_create:
            full_path = os.path.join(self.temp_dir, file_path)
            with open(full_path, 'w') as f:
                f.write("# Test content")
        
        result = self.validator.validate_all()
        
        # Should fail due to missing required directories
        assert result is False
        
        # Should have both passes and failures
        results = self.validator.results
        passed_checks = [r for r in results if r.status == "PASS"]
        failed_checks = [r for r in results if r.status == "FAIL"]
        
        assert len(passed_checks) > 0  # Some checks should pass
        assert len(failed_checks) > 0  # Some checks should fail
