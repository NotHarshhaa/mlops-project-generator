"""
Cloud deployment templates for MLOps Project Generator
"""

from pathlib import Path
from typing import Any, Dict, List

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

console = Console()


class CloudDeployer:
    """
    Manages cloud deployment templates and configurations
    """

    def __init__(self):
        self.cloud_templates = {
            "aws": {
                "sagemaker": {
                    "name": "AWS SageMaker",
                    "description": "Machine learning platform for building, training, and deploying models",
                    "files": [
                        "sagemaker/Dockerfile",
                        "sagemaker/entrypoint.py",
                        "sagemaker/inference.py",
                        "sagemaker/train.py",
                        "sagemaker/requirements.txt",
                        "cloudformation/sagemaker-pipeline.yaml",
                        "cloudformation/iam-roles.yaml"
                    ],
                    "config": {
                        "region": "us-east-1",
                        "instance_type": "ml.m5.large",
                        "framework": "container"
                    }
                },
                "ecs": {
                    "name": "AWS ECS",
                    "description": "Elastic Container Service for containerized deployments",
                    "files": [
                        "ecs/Dockerfile",
                        "ecs/docker-compose.yml",
                        "ecs/task-definition.json",
                        "cloudformation/ecs-cluster.yaml",
                        "cloudformation/load-balancer.yaml"
                    ],
                    "config": {
                        "region": "us-east-1",
                        "cluster_name": "ml-cluster",
                        "service_name": "ml-service"
                    }
                },
                "lambda": {
                    "name": "AWS Lambda",
                    "description": "Serverless function deployment for ML inference",
                    "files": [
                        "lambda/lambda_function.py",
                        "lambda/requirements.txt",
                        "cloudformation/lambda-function.yaml",
                        "cloudformation/api-gateway.yaml"
                    ],
                    "config": {
                        "region": "us-east-1",
                        "runtime": "python3.9",
                        "memory_size": 512,
                        "timeout": 60
                    }
                }
            },
            "gcp": {
                "ai-platform": {
                    "name": "Google Cloud AI Platform",
                    "description": "Unified ML platform for training and deploying models",
                    "files": [
                        "gcp/Dockerfile",
                        "gcp/main.py",
                        "gcp/requirements.txt",
                        "gcp/cloudbuild.yaml",
                        "deployment/pipeline.yaml",
                        "deployment/model-deployment.yaml"
                    ],
                    "config": {
                        "region": "us-central1",
                        "runtime_version": "2.5",
                        "python_version": "3.9"
                    }
                },
                "cloud-run": {
                    "name": "Google Cloud Run",
                    "description": "Serverless container deployment for ML models",
                    "files": [
                        "cloud-run/Dockerfile",
                        "cloud-run/main.py",
                        "cloud-run/requirements.txt",
                        "cloud-run/cloudbuild.yaml",
                        "deployment/service.yaml"
                    ],
                    "config": {
                        "region": "us-central1",
                        "memory": "1Gi",
                        "cpu": "1",
                        "max_instances": 100
                    }
                },
                "vertex-ai": {
                    "name": "Google Vertex AI",
                    "description": "Unified ML platform for model training and deployment",
                    "files": [
                        "vertex-ai/training-job.py",
                        "vertex-ai/deployment.py",
                        "vertex-ai/requirements.txt",
                        "vertex-ai/pipeline.json",
                        "deployment/endpoint-config.yaml"
                    ],
                    "config": {
                        "region": "us-central1",
                        "machine_type": "n1-standard-4",
                        "accelerator_type": "NVIDIA_TESLA_T4"
                    }
                }
            },
            "azure": {
                "ml-studio": {
                    "name": "Azure Machine Learning Studio",
                    "description": "Comprehensive ML workspace for model development and deployment",
                    "files": [
                        "azure-ml/conda.yml",
                        "azure-ml/score.py",
                        "azure-ml/train.py",
                        "azure-ml/environment.yml",
                        "azure-ml/workspace.json",
                        "deployment/aci-deploy.yml",
                        "deployment/aks-deploy.yml"
                    ],
                    "config": {
                        "region": "eastus",
                        "compute_instance": "Standard_DS3_v2",
                        "compute_cluster": "cpu-cluster"
                    }
                },
                "container-instances": {
                    "name": "Azure Container Instances",
                    "description": "Serverless container deployment for ML models",
                    "files": [
                        "aci/Dockerfile",
                        "aci/app.py",
                        "aci/requirements.txt",
                        "deployment/container-group.yaml",
                        "deployment/container-registry.yaml"
                    ],
                    "config": {
                        "region": "eastus",
                        "cpu": 2,
                        "memory": 4,
                        "ports": [8000]
                    }
                },
                "functions": {
                    "name": "Azure Functions",
                    "description": "Serverless function deployment for ML inference",
                    "files": [
                        "azure-functions/__init__.py",
                        "azure-functions/function.json",
                        "azure-functions/host.json",
                        "azure-functions/requirements.txt",
                        "deployment/function-app.yaml"
                    ],
                    "config": {
                        "region": "eastus",
                        "runtime": "python3.9",
                        "consumption_plan": True
                    }
                }
            }
        }

    def get_available_providers(self) -> List[str]:
        """Get list of available cloud providers"""
        return list(self.cloud_templates.keys())

    def get_provider_services(self, provider: str) -> List[str]:
        """Get list of services for a cloud provider"""
        if provider not in self.cloud_templates:
            return []
        return list(self.cloud_templates[provider].keys())

    def get_service_info(self, provider: str, service: str) -> Dict[str, Any]:
        """Get information about a specific cloud service"""
        if provider not in self.cloud_templates:
            return {}
        if service not in self.cloud_templates[provider]:
            return {}
        return self.cloud_templates[provider][service]

    def display_cloud_services(self):
        """Display all available cloud services"""
        table = Table(title="☁️  Cloud Deployment Services")
        table.add_column("Provider", style="cyan", width=10)
        table.add_column("Service", style="green", width=15)
        table.add_column("Description", style="white", width=40)
        table.add_column("Files", style="yellow", width=8)
        
        for provider, services in self.cloud_templates.items():
            for service, info in services.items():
                table.add_row(
                    provider.upper(),
                    info["name"],
                    info["description"],
                    str(len(info["files"]))
                )
        
        console.print(table)

    def display_provider_services(self, provider: str):
        """Display services for a specific provider"""
        if provider not in self.cloud_templates:
            console.print(f"❌ Provider '{provider}' not found")
            return
        
        services = self.cloud_templates[provider]
        
        table = Table(title=f"☁️  {provider.upper()} Services")
        table.add_column("Service", style="cyan", width=15)
        table.add_column("Description", style="white", width=40)
        table.add_column("Files", style="yellow", width=8)
        
        for service, info in services.items():
            table.add_row(
                info["name"],
                info["description"],
                str(len(info["files"]))
            )
        
        console.print(table)

    def generate_cloud_templates(self, provider: str, service: str, output_dir: Path, choices: Dict[str, Any]):
        """Generate cloud deployment templates"""
        if provider not in self.cloud_templates:
            console.print(f"❌ Provider '{provider}' not found")
            return
        
        if service not in self.cloud_templates[provider]:
            console.print(f"❌ Service '{service}' not found for provider '{provider}'")
            return
        
        service_info = self.cloud_templates[provider][service]
        
        # Create cloud-specific directory structure
        cloud_dir = output_dir / "cloud" / provider / service
        cloud_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate template files based on service type
        if provider == "aws":
            self._generate_aws_templates(service, cloud_dir, choices, service_info)
        elif provider == "gcp":
            self._generate_gcp_templates(service, cloud_dir, choices, service_info)
        elif provider == "azure":
            self._generate_azure_templates(service, cloud_dir, choices, service_info)
        
        # Generate configuration file
        config_file = cloud_dir / "cloud-config.yaml"
        self._generate_cloud_config(config_file, provider, service, service_info, choices)
        
        # Generate deployment scripts
        self._generate_deployment_scripts(cloud_dir, provider, service, choices)
        
        console.print(f"✅ {provider.upper()} {service_info['name']} templates generated!")

    def _generate_aws_templates(self, service: str, output_dir: Path, choices: Dict[str, Any], service_info: Dict[str, Any]):
        """Generate AWS-specific templates"""
        if service == "sagemaker":
            self._generate_sagemaker_templates(output_dir, choices)
        elif service == "ecs":
            self._generate_ecs_templates(output_dir, choices)
        elif service == "lambda":
            self._generate_lambda_templates(output_dir, choices)

    def _generate_gcp_templates(self, service: str, output_dir: Path, choices: Dict[str, Any], service_info: Dict[str, Any]):
        """Generate GCP-specific templates"""
        if service == "ai-platform":
            self._generate_ai_platform_templates(output_dir, choices)
        elif service == "cloud-run":
            self._generate_cloud_run_templates(output_dir, choices)
        elif service == "vertex-ai":
            self._generate_vertex_ai_templates(output_dir, choices)

    def _generate_azure_templates(self, service: str, output_dir: Path, choices: Dict[str, Any], service_info: Dict[str, Any]):
        """Generate Azure-specific templates"""
        if service == "ml-studio":
            self._generate_azure_ml_templates(output_dir, choices)
        elif service == "container-instances":
            self._generate_aci_templates(output_dir, choices)
        elif service == "functions":
            self._generate_azure_functions_templates(output_dir, choices)

    def _generate_sagemaker_templates(self, output_dir: Path, choices: Dict[str, Any]):
        """Generate AWS SageMaker templates"""
        # Dockerfile
        dockerfile_content = f"""FROM python:3.9-slim

# Set working directory
WORKDIR /opt/ml

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ /opt/ml/src/
COPY models/ /opt/ml/models/

# Set environment variables
ENV PYTHONPATH=/opt/ml
ENV SAGEMAKER_PROGRAM=train.py

# Default command
CMD ["python", "train.py"]
"""
        
        with open(output_dir / "Dockerfile", "w") as f:
            f.write(dockerfile_content)
        
        # Training script
        train_script = f"""#!/usr/bin/env python3
\"\"\"
SageMaker training script for {choices['framework']} model
\"\"\"

import argparse
import json
import os
import sys
from pathlib import Path

# Add src to path
sys.path.append('/opt/ml/src')

{self._get_framework_import(choices['framework'])}

def train(args):
    \"\"\"Train the model\"\"\"
    print("Starting training...")
    
    # Load data
    train_path = Path(args.train)
    test_path = Path(args.test)
    
    # Training logic here
    print(f"Training {args.epochs} epochs...")
    
    # Save model
    model_dir = Path(args.model_dir)
    model_dir.mkdir(parents=True, exist_ok=True)
    
    print("Training completed!")

def main():
    parser = argparse.ArgumentParser()
    
    # SageMaker environment variables
    parser.add_argument('--model-dir', type=str, default=os.environ.get('SM_MODEL_DIR'))
    parser.add_argument('--train', type=str, default=os.environ.get('SM_CHANNEL_TRAINING'))
    parser.add_argument('--test', type=str, default=os.environ.get('SM_CHANNEL_TESTING'))
    
    # Hyperparameters
    parser.add_argument('--epochs', type=int, default=10)
    parser.add_argument('--batch-size', type=int, default=32)
    parser.add_argument('--learning-rate', type=float, default=0.001)
    
    args = parser.parse_args()
    
    train(args)

if __name__ == '__main__':
    main()
"""
        
        with open(output_dir / "train.py", "w") as f:
            f.write(train_script)

    def _generate_cloud_run_templates(self, output_dir: Path, choices: Dict[str, Any]):
        """Generate Google Cloud Run templates"""
        # Main application
        main_content = f"""#!/usr/bin/env python3
\"\"\"
Cloud Run deployment for {choices['framework']} model
\"\"\"

import os
from fastapi import FastAPI
from pydantic import BaseModel

{self._get_framework_import(choices['framework'])}

app = FastAPI(title="{choices['project_name']} API")

class PredictionRequest(BaseModel):
    # Define your request schema here
    data: dict

class PredictionResponse(BaseModel):
    prediction: dict
    confidence: float = None

@app.get("/")
async def root():
    return {{"message": "{choices['project_name']} API is running"}}

@app.get("/health")
async def health_check():
    return {{"status": "healthy"}}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    \"\"\"Make predictions\"\"\"
    # Load your model and make predictions
    prediction = {{"result": "placeholder"}}
    
    return PredictionResponse(prediction=prediction)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
"""
        
        with open(output_dir / "main.py", "w") as f:
            f.write(main_content)
        
        # Cloud Build configuration
        cloudbuild_content = f"""steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/{choices["project_name"]}', '.']
  
  # Push the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/{choices["project_name"]}']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
    - 'run'
    - 'deploy'
    - '{choices["project_name"]}'
    - '--image'
    - 'gcr.io/$PROJECT_ID/{choices["project_name"]}'
    - '--region'
    - 'us-central1'
    - '--allow-unauthenticated'
    - '--platform'
    - 'managed'

images:
  - 'gcr.io/$PROJECT_ID/{choices["project_name"]}'
"""
        
        with open(output_dir / "cloudbuild.yaml", "w") as f:
            f.write(cloudbuild_content)

    def _generate_azure_ml_templates(self, output_dir: Path, choices: Dict[str, Any]):
        """Generate Azure ML Studio templates"""
        # Conda environment
        conda_content = f"""name: {choices["project_name"]}-env
channels:
  - defaults
  - conda-forge
dependencies:
  - python=3.9
  - pip
  - pip:
    - fastapi
    - uvicorn
    - scikit-learn
    - pandas
    - numpy
    - azureml-defaults
"""
        
        with open(output_dir / "conda.yml", "w") as f:
            f.write(conda_content)
        
        # Scoring script
        score_content = f"""#!/usr/bin/env python3
\"\"\"
Azure ML scoring script for {choices['framework']} model
\"\"\"

import json
import numpy as np
import pandas as pd
from pathlib import Path

{self._get_framework_import(choices['framework'])}

def init():
    \"\"\"Initialize the model\"\"\"
    global model
    
    # Get the model path
    model_path = Path('./model')
    
    # Load your model here
    print("Model loaded successfully")

def run(raw_data):
    \"\"\"Make predictions\"\"\"
    try:
        data = json.loads(raw_data)
        
        # Make predictions
        predictions = {{"result": "placeholder"}}
        
        return json.dumps(predictions)
    
    except Exception as e:
        return json.dumps({{"error": str(e)}})

if __name__ == "__main__":
    # Test the scoring script
    test_data = json.dumps({{"data": [1, 2, 3, 4, 5]}})
    print(run(test_data))
"""
        
        with open(output_dir / "score.py", "w") as f:
            f.write(score_content)

    def _generate_cloud_config(self, config_file: Path, provider: str, service: str, service_info: Dict[str, Any], choices: Dict[str, Any]):
        """Generate cloud configuration file"""
        config_content = f"""# Cloud Deployment Configuration
# Generated for {provider.upper()} {service_info['name']}

provider: {provider}
service: {service}
project_name: {choices['project_name']}
framework: {choices['framework']}

# Service-specific configuration
{service.lower().replace('-', '_')}:
"""
        
        for key, value in service_info["config"].items():
            config_content += f"  {key}: {value}\n"
        
        # Add project-specific configuration
        config_content += f"""
# Project configuration
project:
  name: {choices['project_name']}
  framework: {choices['framework']}
  task_type: {choices['task_type']}
  deployment: {choices['deployment']}
  monitoring: {choices['monitoring']}

# Deployment settings
deployment:
  auto_scale: true
  health_check: true
  logging: true
  monitoring: {choices['monitoring'] != 'none'}
"""
        
        with open(config_file, "w") as f:
            f.write(config_content)

    def _generate_deployment_scripts(self, output_dir: Path, provider: str, service: str, choices: Dict[str, Any]):
        """Generate deployment scripts"""
        deploy_script = f"""#!/bin/bash
# Deployment script for {provider.upper()} {service}

set -e

echo "🚀 Starting deployment to {provider.upper()} {service}..."

# Provider-specific deployment commands
{self._get_deployment_commands(provider, service, choices)}

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is now live!"
"""
        
        with open(output_dir / "deploy.sh", "w") as f:
            f.write(deploy_script)
        
        # Make it executable
        os.chmod(output_dir / "deploy.sh", 0o755)

    def _get_deployment_commands(self, provider: str, service: str, choices: Dict[str, Any]) -> str:
        """Get provider-specific deployment commands"""
        if provider == "aws" and service == "sagemaker":
            return """
# AWS SageMaker deployment
aws sagemaker create-training-job \
    --training-job-name "${{PROJECT_NAME}}-$(date +%s)" \
    --role-arn "arn:aws:iam::${{AWS_ACCOUNT_ID}}:role/SageMakerExecutionRole" \
    --resource-config "InstanceType=ml.m5.large,InstanceCount=1,VolumeSizeInGB=50" \
    --stopping-condition "MaxRuntimeInSeconds=86400"
"""
        elif provider == "gcp" and service == "cloud-run":
            return """
# Google Cloud Run deployment
gcloud builds submit --tag gcr.io/${{PROJECT_ID}}/${{PROJECT_NAME}}
gcloud run deploy ${{PROJECT_NAME}} \
    --image gcr.io/${{PROJECT_ID}}/${{PROJECT_NAME}} \
    --region us-central1 \
    --allow-unauthenticated
"""
        elif provider == "azure" and service == "ml-studio":
            return """
# Azure ML Studio deployment
az ml model create -n ${{PROJECT_NAME}} -p ./model
az ml endpoint create -n ${{PROJECT_NAME}}-endpoint --model ${{PROJECT_NAME}}:1
"""
        else:
            return "# Add your deployment commands here"

    def _get_framework_import(self, framework: str) -> str:
        """Get framework-specific import statements"""
        imports = {
            "sklearn": "import joblib\nimport pickle\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.preprocessing import StandardScaler",
            "pytorch": "import torch\nimport torch.nn as nn\nfrom torch.utils.data import DataLoader",
            "tensorflow": "import tensorflow as tf\nfrom tensorflow import keras"
        }
        return imports.get(framework, "# Add your framework imports here")

    def get_cloud_recommendations(self, choices: Dict[str, Any]) -> List[str]:
        """Get cloud deployment recommendations based on project configuration"""
        recommendations = []
        
        framework = choices.get("framework", "sklearn")
        deployment = choices.get("deployment", "fastapi")
        monitoring = choices.get("monitoring", "none")
        
        # Framework-specific recommendations
        if framework == "tensorflow":
            recommendations.append("Consider Google Vertex AI for TensorFlow deployments")
        elif framework == "pytorch":
            recommendations.append("AWS SageMaker provides excellent PyTorch support")
        
        # Scale recommendations
        if deployment == "kubernetes":
            recommendations.append("Consider managed Kubernetes services (EKS, GKE, AKS)")
        elif deployment == "fastapi":
            recommendations.append("Cloud Run (GCP) or Container Instances (Azure) for simple APIs")
        
        # Monitoring recommendations
        if monitoring == "evidently":
            recommendations.append("Cloud-native monitoring services integrate well with Evidently")
        elif monitoring == "none":
            recommendations.append("Add cloud-native monitoring for production deployments")
        
        return recommendations
