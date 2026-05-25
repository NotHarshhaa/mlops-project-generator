import type { TemplateContext, VirtualFile } from "@/lib/generator/types"

export function generateCloudFiles(provider: string, service: string, ctx: TemplateContext): VirtualFile[] {
  const { project_name, framework, task_type, deployment, monitoring } = ctx
  const base = `cloud/${provider}/${service}`
  const files: VirtualFile[] = []

  // Shared Dockerfile for any cloud target
  const dockerfile = `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
COPY models/ ./models/
COPY configs/ ./configs/
ENV PYTHONPATH=/app
EXPOSE 8000
CMD ["python", "src/inference.py"]
`

  files.push({ path: `${base}/Dockerfile`, content: dockerfile })

  // cloud-config.yaml
  files.push({
    path: `${base}/cloud-config.yaml`,
    content: `# Cloud Deployment Configuration
provider: ${provider}
service: ${service}
project_name: ${project_name}
framework: ${framework}
task_type: ${task_type}
deployment: ${deployment}
monitoring: ${monitoring}
`,
  })

  // Provider-specific extras
  if (provider === "aws" && service === "sagemaker") {
    files.push({ path: `${base}/train.py`, content: `# SageMaker training entry point\nimport subprocess, sys\nsubprocess.run([sys.executable, "src/train.py"] + sys.argv[1:], check=True)\n` })
  }
  if (provider === "gcp" && service === "cloud-run") {
    files.push({ path: `${base}/cloudbuild.yaml`, content: `steps:\n  - name: gcr.io/cloud-builders/docker\n    args: [build, -t, "gcr.io/$PROJECT_ID/${project_name}", .]\n  - name: gcr.io/cloud-builders/docker\n    args: [push, "gcr.io/$PROJECT_ID/${project_name}"]\n  - name: gcr.io/google.com/cloudsdktool/cloud-sdk\n    entrypoint: gcloud\n    args: [run, deploy, ${project_name}, --image, "gcr.io/$PROJECT_ID/${project_name}", --region, us-central1, --allow-unauthenticated]\n` })
  }
  if (provider === "azure") {
    files.push({ path: `${base}/conda.yml`, content: `name: ${project_name}-env\ndependencies:\n  - python=3.11\n  - pip:\n    - -r requirements.txt\n` })
  }

  // deploy.sh
  const deployCommands: Record<string, Record<string, string>> = {
    aws: {
      sagemaker: "aws sagemaker create-training-job --training-job-name \"${PROJECT_NAME}-$(date +%s)\" ...",
      ecs: "aws ecs update-service --cluster ml-cluster --service ${PROJECT_NAME} --force-new-deployment",
      lambda: "aws lambda update-function-code --function-name ${PROJECT_NAME} --zip-file fileb://function.zip",
    },
    gcp: {
      "cloud-run": "gcloud run deploy ${PROJECT_NAME} --image gcr.io/${PROJECT_ID}/${PROJECT_NAME} --region us-central1",
      "vertex-ai": "gcloud ai custom-jobs create --display-name=${PROJECT_NAME} ...",
      "ai-platform": "gcloud ml-engine jobs submit training ${PROJECT_NAME}_train ...",
    },
    azure: {
      "ml-studio": "az ml model create -n ${PROJECT_NAME} -p ./model && az ml endpoint create ...",
      "container-instances": "az container create --resource-group myRG --name ${PROJECT_NAME} ...",
      functions: "func azure functionapp publish ${PROJECT_NAME}",
    },
  }

  const cmd = deployCommands[provider]?.[service] ?? "# Add your deployment commands here"
  files.push({
    path: `${base}/deploy.sh`,
    content: `#!/bin/bash
# Deployment script for ${provider.toUpperCase()} ${service}
set -e

PROJECT_NAME="${project_name}"
echo "🚀 Deploying \${PROJECT_NAME} to ${provider.toUpperCase()} ${service}..."

${cmd}

echo "✅ Deployment completed successfully!"
`,
  })

  return files
}
