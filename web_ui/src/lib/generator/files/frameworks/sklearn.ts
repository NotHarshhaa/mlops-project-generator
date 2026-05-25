import type { TemplateContext, VirtualFile } from "@/lib/generator/types"

export function generateSklearnFiles(ctx: TemplateContext): VirtualFile[] {
  const { task_type, experiment_tracking, framework_display, task_display } = ctx

  return [
    { path: "src/__init__.py", content: "" },
    { path: "src/data/__init__.py", content: "from .data_loader import DataLoader\n" },
    {
      path: "src/data/data_loader.py",
      content: `"""Data loading utilities for ${framework_display} project"""
import pandas as pd
import numpy as np
from sklearn.datasets import make_classification, make_regression
from typing import Tuple


class DataLoader:
    def __init__(self, config: dict):
        self.config = config

    def load_sample_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Load sample data for demonstration"""
        ${task_type === "classification"
          ? "return make_classification(n_samples=1000, n_features=20, random_state=42)"
          : task_type === "regression"
          ? "return make_regression(n_samples=1000, n_features=20, random_state=42)"
          : "# Time series sample\n        t = np.linspace(0, 10, 1000)\n        X = t.reshape(-1, 1)\n        y = np.sin(t)\n        return X, y"}

    def load_from_file(self, path: str) -> Tuple[pd.DataFrame, pd.Series]:
        """Load data from CSV file"""
        df = pd.read_csv(path)
        target = self.config["data"].get("target_column", "target")
        X = df.drop(columns=[target])
        y = df[target]
        return X.values, y.values
`,
    },
    { path: "src/features/__init__.py", content: "from .feature_engineering import FeatureEngineer\n" },
    {
      path: "src/features/feature_engineering.py",
      content: `"""Feature engineering for ${framework_display} project"""
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from typing import Optional


class FeatureEngineer:
    def __init__(self, config: dict):
        self.config = config
        self.scaler = StandardScaler()
        self.imputer = SimpleImputer(strategy="mean")
        self._fitted = False

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        X = self.imputer.fit_transform(X)
        X = self.scaler.fit_transform(X)
        self._fitted = True
        return X

    def transform(self, X: np.ndarray) -> np.ndarray:
        if not self._fitted:
            raise RuntimeError("Call fit_transform first")
        X = self.imputer.transform(X)
        return self.scaler.transform(X)
`,
    },
    { path: "src/models/__init__.py", content: "" },
    {
      path: "src/models/model.py",
      content: `"""${framework_display} ${task_display} model"""
import joblib
import numpy as np
from pathlib import Path
${task_type === "classification"
  ? "from sklearn.ensemble import RandomForestClassifier"
  : task_type === "regression"
  ? "from sklearn.ensemble import RandomForestRegressor"
  : "from sklearn.linear_model import Ridge"}


class MLModel:
    def __init__(self, config: dict):
        self.config = config
        model_cfg = config.get("model", {})
        ${task_type === "classification"
          ? "self.model = RandomForestClassifier(\n            n_estimators=model_cfg.get('n_estimators', 100),\n            max_depth=model_cfg.get('max_depth', 10),\n            random_state=42,\n        )"
          : task_type === "regression"
          ? "self.model = RandomForestRegressor(\n            n_estimators=model_cfg.get('n_estimators', 100),\n            max_depth=model_cfg.get('max_depth', 10),\n            random_state=42,\n        )"
          : "self.model = Ridge()"}

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)

    def predict(self, X):
        return self.model.predict(X)

    def save(self, path: str):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, path)

    def load(self, path: str):
        self.model = joblib.load(path)
`,
    },
    {
      path: "src/train.py",
      content: generateSklearnTrain(ctx),
    },
    {
      path: "src/inference.py",
      content: generateSklearnInference(ctx),
    },
  ]
}

function generateSklearnTrain(ctx: TemplateContext): string {
  const { task_type, experiment_tracking, framework_display, task_display } = ctx
  return `#!/usr/bin/env python3
"""Training script for ${framework_display} ${task_display} model"""

import logging
import argparse
from pathlib import Path
import numpy as np
import yaml
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_squared_error, mean_absolute_error, r2_score
)
${experiment_tracking === "mlflow" ? "import mlflow\nimport mlflow.sklearn" : ""}
${experiment_tracking === "wandb"  ? "import wandb" : ""}

from src.models.model import MLModel
from src.data.data_loader import DataLoader
from src.features.feature_engineering import FeatureEngineer

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


def load_config(path: str) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def evaluate(model, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)
    ${task_type === "classification" ? `return {
        "accuracy":  accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, average="weighted", zero_division=0),
        "recall":    recall_score(y_test, y_pred, average="weighted", zero_division=0),
        "f1_score":  f1_score(y_test, y_pred, average="weighted", zero_division=0),
    }` : `return {
        "mse":      mean_squared_error(y_test, y_pred),
        "rmse":     float(np.sqrt(mean_squared_error(y_test, y_pred))),
        "mae":      mean_absolute_error(y_test, y_pred),
        "r2_score": r2_score(y_test, y_pred),
    }`}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="configs/config.yaml")
    args = parser.parse_args()

    config = load_config(args.config)
    data_cfg = config["data"]

    loader = DataLoader(config)
    X, y = loader.load_sample_data()

    engineer = FeatureEngineer(config)
    X = engineer.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=data_cfg["test_size"], random_state=data_cfg["random_state"]
    )

    ${experiment_tracking === "mlflow" ? `mlflow.set_tracking_uri(config["experiment_tracking"]["tracking_uri"])
    mlflow.set_experiment(config["experiment_tracking"]["experiment_name"])
    with mlflow.start_run():` : "if True:"}
        model = MLModel(config)
        model.train(X_train, y_train)

        metrics = evaluate(model, X_test, y_test)
        logger.info("Metrics: %s", metrics)

        cv = cross_val_score(model.model, X_train, y_train, cv=config["training"]["cross_validation"])
        logger.info("CV mean: %.4f ± %.4f", cv.mean(), cv.std())

        model.save("models/production/model.joblib")
        logger.info("Model saved.")

        ${experiment_tracking === "mlflow" ? `mlflow.log_params(config["model"])
        mlflow.log_metrics(metrics)
        mlflow.log_metric("cv_mean", float(cv.mean()))` : ""}
        ${experiment_tracking === "wandb" ? `wandb.init(project=config["experiment_tracking"]["project"])
        wandb.log(metrics)
        wandb.finish()` : ""}

if __name__ == "__main__":
    main()
`
}

function generateSklearnInference(ctx: TemplateContext): string {
  const { task_type, deployment, framework_display } = ctx
  const useFastapi = deployment === "fastapi"
  return `#!/usr/bin/env python3
"""Inference script for ${framework_display} model"""

import numpy as np
import joblib
${useFastapi ? "from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport uvicorn" : ""}

MODEL_PATH = "models/production/model.joblib"

${useFastapi ? `app = FastAPI(title="${framework_display} Inference API")

class PredictRequest(BaseModel):
    features: list[float]

class PredictResponse(BaseModel):
    prediction: float | int | str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    model = joblib.load(MODEL_PATH)
    X = np.array(req.features).reshape(1, -1)
    pred = model.predict(X)[0]
    return PredictResponse(prediction=pred)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
` : `def predict(features: list) -> float:
    model = joblib.load(MODEL_PATH)
    X = np.array(features).reshape(1, -1)
    return model.predict(X)[0]

if __name__ == "__main__":
    sample = [0.1] * 20
    result = predict(sample)
    print(f"Prediction: {result}")
`}
`
}
