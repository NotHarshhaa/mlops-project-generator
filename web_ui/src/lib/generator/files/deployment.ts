import type { GeneratorConfig } from "../types"
import type { TemplateContext, VirtualFile } from "../types"

export function generateDeploymentFiles(cfg: GeneratorConfig, ctx: TemplateContext): VirtualFile[] {
  const { project_name, deployment, python_version } = ctx
  if (!deployment || deployment === "fastapi") {
    if (cfg.custom_template !== "microservice") return []
  }

  const files: VirtualFile[] = []
  const dockerfile = `FROM python:${python_version}-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY configs/ ./configs/
COPY models/ ./models/

ENV PYTHONPATH=/app
ENV PROJECT_NAME=${project_name}

EXPOSE 8000
CMD ["python", "src/inference.py"]
`

  const dockerignore = `__pycache__
*.pyc
.venv
venv
.git
notebooks
data/raw
mlruns
wandb
*.egg-info
.pytest_cache
`

  if (deployment === "docker" || deployment === "kubernetes") {
    files.push({ path: "Dockerfile", content: dockerfile })
    files.push({ path: ".dockerignore", content: dockerignore })
  }

  if (deployment === "docker") {
    files.push({
      path: "docker-compose.yml",
      content: `services:
  ${project_name}:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PROJECT_NAME=${project_name}
    volumes:
      - ./models:/app/models
      - ./configs:/app/configs
    restart: unless-stopped
`,
    })
    files.push({
      path: "scripts/run_docker.sh",
      content: `#!/bin/bash
set -e
docker compose build
docker compose up -d
echo "Service running at http://localhost:8000"
`,
    })
  }

  if (deployment === "kubernetes") {
    files.push({
      path: "k8s/deployment.yaml",
      content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${project_name}
  labels:
    app: ${project_name}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ${project_name}
  template:
    metadata:
      labels:
        app: ${project_name}
    spec:
      containers:
        - name: ${project_name}
          image: ${project_name}:latest
          ports:
            - containerPort: 8000
          envFrom:
            - configMapRef:
                name: ${project_name}-config
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "2Gi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 5
`,
    })
    files.push({
      path: "k8s/service.yaml",
      content: `apiVersion: v1
kind: Service
metadata:
  name: ${project_name}
spec:
  selector:
    app: ${project_name}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: LoadBalancer
`,
    })
    files.push({
      path: "k8s/configmap.yaml",
      content: `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${project_name}-config
data:
  PROJECT_NAME: "${project_name}"
  CONFIG_PATH: "configs/config.yaml"
`,
    })
    files.push({
      path: "scripts/deploy_k8s.sh",
      content: `#!/bin/bash
set -e
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
echo "Deployed ${project_name} to Kubernetes"
`,
    })
  }

  if (cfg.custom_template === "microservice" && deployment === "fastapi") {
    files.push({
      path: "src/api/__init__.py",
      content: "",
    })
    files.push({
      path: "src/api/middleware.py",
      content: `"""Request logging middleware for ${project_name} API"""
import time
import logging

logger = logging.getLogger(__name__)


async def log_requests(request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info("%s %s -> %s (%.1fms)", request.method, request.url.path, response.status_code, duration_ms)
    return response
`,
    })
  }

  return files
}
