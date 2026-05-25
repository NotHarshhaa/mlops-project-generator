import type { TemplateContext, VirtualFile } from "@/lib/generator/types"

export function generateTensorflowFiles(ctx: TemplateContext): VirtualFile[] {
  const { task_type, experiment_tracking, deployment, framework_display, task_display } = ctx
  return [
    { path: "src/__init__.py", content: "" },
    { path: "src/models/__init__.py", content: "" },
    { path: "src/utils/__init__.py", content: "" },
    {
      path: "src/models/model.py",
      content: `"""TensorFlow/Keras ${task_display} model"""
import tensorflow as tf
from tensorflow import keras


def build_model(input_dim: int = 20, output_dim: int = ${task_type === "classification" ? "2" : "1"}) -> keras.Model:
    model = keras.Sequential([
        keras.layers.Dense(128, activation="relu", input_shape=(input_dim,)),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(64, activation="relu"),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(32, activation="relu"),
        keras.layers.Dense(output_dim, activation="${task_type === "classification" ? "softmax" : "linear"}"),
    ])
    model.compile(
        optimizer="adam",
        loss="${task_type === "classification" ? "sparse_categorical_crossentropy" : "mse"}",
        metrics=["${task_type === "classification" ? "accuracy" : "mae"}"],
    )
    return model
`,
    },
    {
      path: "src/train.py",
      content: `#!/usr/bin/env python3
"""Training for ${framework_display} ${task_display} model"""
import yaml, logging
import numpy as np
from sklearn.datasets import make_${task_type === "classification" ? "classification" : "regression"}
from sklearn.model_selection import train_test_split
${experiment_tracking === "mlflow" ? "import mlflow\nimport mlflow.tensorflow" : ""}
${experiment_tracking === "wandb"  ? "import wandb\nfrom wandb.keras import WandbCallback" : ""}
from src.models.model import build_model

logging.basicConfig(level=logging.INFO)

def main():
    with open("configs/config.yaml") as f:
        config = yaml.safe_load(f)
    train_cfg = config["training"]

    X, y = make_${task_type === "classification" ? "classification" : "regression"}(n_samples=1000, n_features=20, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = build_model()
    callbacks = [
        __import__("tensorflow").keras.callbacks.EarlyStopping(patience=train_cfg["patience"], restore_best_weights=True)
    ]
    ${experiment_tracking === "wandb" ? `wandb.init(project=config["experiment_tracking"]["project"])
    callbacks.append(WandbCallback())` : ""}

    ${experiment_tracking === "mlflow" ? `with mlflow.start_run():` : "if True:"}
        model.fit(X_train, y_train, validation_split=0.1,
                  epochs=train_cfg["epochs"], batch_size=train_cfg["batch_size"], callbacks=callbacks)
        results = model.evaluate(X_test, y_test, verbose=0)
        logging.info("Test results: %s", results)
        model.save("models/production/model.keras")
        ${experiment_tracking === "mlflow" ? "mlflow.tensorflow.log_model(model, 'model')" : ""}
        ${experiment_tracking === "wandb" ? "wandb.finish()" : ""}

if __name__ == "__main__":
    main()
`,
    },
    {
      path: "src/inference.py",
      content: `#!/usr/bin/env python3
"""Inference for ${framework_display} model"""
import numpy as np
import tensorflow as tf
${deployment === "fastapi" ? "from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport uvicorn" : ""}

MODEL_PATH = "models/production/model.keras"

${deployment === "fastapi" ? `app = FastAPI(title="TensorFlow Inference API")

class PredictRequest(BaseModel):
    features: list[float]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: PredictRequest):
    model = tf.keras.models.load_model(MODEL_PATH)
    x = np.array(req.features).reshape(1, -1)
    pred = model.predict(x).tolist()
    return {"prediction": pred}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
` : `def predict(features: list) -> list:
    model = tf.keras.models.load_model(MODEL_PATH)
    x = np.array(features).reshape(1, -1)
    return model.predict(x).tolist()

if __name__ == "__main__":
    print(predict([0.1] * 20))
`}
`,
    },
  ]
}
