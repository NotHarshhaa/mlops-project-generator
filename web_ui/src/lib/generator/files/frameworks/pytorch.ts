import type { TemplateContext, VirtualFile } from "@/lib/generator/types"

export function generatePytorchFiles(ctx: TemplateContext): VirtualFile[] {
  const { task_type, experiment_tracking, deployment, framework_display, task_display } = ctx
  return [
    { path: "src/__init__.py", content: "" },
    { path: "src/models/__init__.py", content: "" },
    { path: "src/utils/__init__.py", content: "" },
    {
      path: "src/models/model.py",
      content: `"""PyTorch ${task_display} model"""
import torch
import torch.nn as nn


class MLModel(nn.Module):
    def __init__(self, input_dim: int = 20, hidden: list = [128, 64, 32], output_dim: int = ${task_type === "classification" ? "2" : "1"}):
        super().__init__()
        layers = []
        prev = input_dim
        for h in hidden:
            layers += [nn.Linear(prev, h), nn.ReLU(), nn.Dropout(0.2)]
            prev = h
        layers.append(nn.Linear(prev, output_dim))
        ${task_type === "classification" ? "layers.append(nn.Softmax(dim=1))" : ""}
        self.net = nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)
`,
    },
    {
      path: "src/train.py",
      content: `#!/usr/bin/env python3
"""Training script for ${framework_display} ${task_display} model"""
import yaml, logging
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.datasets import make_${task_type === "classification" ? "classification" : "regression"}
from sklearn.model_selection import train_test_split
import numpy as np
${experiment_tracking === "mlflow" ? "import mlflow" : ""}
${experiment_tracking === "wandb"  ? "import wandb" : ""}
from src.models.model import MLModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    with open("configs/config.yaml") as f:
        config = yaml.safe_load(f)
    train_cfg = config["training"]

    X, y = make_${task_type === "classification" ? "classification" : "regression"}(n_samples=1000, n_features=20, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    X_train_t = torch.FloatTensor(X_train)
    y_train_t = torch.${task_type === "classification" ? "LongTensor(y_train)" : "FloatTensor(y_train).unsqueeze(1)"}
    loader = DataLoader(TensorDataset(X_train_t, y_train_t), batch_size=train_cfg["batch_size"], shuffle=True)

    model = MLModel(input_dim=20)
    optimizer = torch.optim.Adam(model.parameters(), lr=train_cfg["learning_rate"])
    criterion = nn.${task_type === "classification" ? "CrossEntropyLoss()" : "MSELoss()"}

    ${experiment_tracking === "mlflow" ? `mlflow.set_experiment(config["experiment_tracking"]["experiment_name"])
    with mlflow.start_run():` : "if True:"}
        for epoch in range(train_cfg["epochs"]):
            model.train()
            for xb, yb in loader:
                optimizer.zero_grad()
                loss = criterion(model(xb), yb)
                loss.backward()
                optimizer.step()
            if epoch % 10 == 0:
                logger.info("Epoch %d loss=%.4f", epoch, loss.item())

        torch.save(model.state_dict(), "models/production/model.pt")
        logger.info("Model saved.")

if __name__ == "__main__":
    main()
`,
    },
    {
      path: "src/inference.py",
      content: `#!/usr/bin/env python3
"""Inference for ${framework_display} model"""
import torch
import numpy as np
${deployment === "fastapi" ? "from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport uvicorn" : ""}
from src.models.model import MLModel

${deployment === "fastapi" ? `app = FastAPI(title="PyTorch Inference API")

class PredictRequest(BaseModel):
    features: list[float]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: PredictRequest):
    model = MLModel(input_dim=len(req.features))
    model.load_state_dict(torch.load("models/production/model.pt", map_location="cpu"))
    model.eval()
    with torch.no_grad():
        x = torch.FloatTensor(req.features).unsqueeze(0)
        pred = model(x).numpy().tolist()
    return {"prediction": pred}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
` : `def predict(features: list):
    model = MLModel(input_dim=len(features))
    model.load_state_dict(torch.load("models/production/model.pt", map_location="cpu"))
    model.eval()
    with torch.no_grad():
        x = torch.FloatTensor(features).unsqueeze(0)
        return model(x).numpy().tolist()

if __name__ == "__main__":
    print(predict([0.1] * 20))
`}
`,
    },
  ]
}
