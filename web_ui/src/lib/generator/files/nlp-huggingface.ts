import type { TemplateContext, VirtualFile } from "../types"

/** Hugging Face fine-tuning & inference stubs for NLP task type */
export function generateNlpHuggingfaceFiles(ctx: TemplateContext): VirtualFile[] {
  const { project_name, framework, experiment_tracking, deployment, framework_display } = ctx
  const modelId = "distilbert-base-uncased"

  const trackingImports =
    experiment_tracking === "mlflow"
      ? "import mlflow\n"
      : experiment_tracking === "wandb"
        ? "import wandb\n"
        : ""

  const trackingStart =
    experiment_tracking === "mlflow"
      ? `    mlflow.set_experiment(config.get("experiment_tracking", {}).get("experiment_name", "${project_name}"))
    mlflow.start_run()
`
      : experiment_tracking === "wandb"
        ? `    wandb.init(project=config.get("experiment_tracking", {}).get("project", "${project_name}"))
`
        : ""

  const trackingEnd =
    experiment_tracking === "mlflow"
      ? "    mlflow.end_run()\n"
      : experiment_tracking === "wandb"
        ? "    wandb.finish()\n"
        : ""

  const files: VirtualFile[] = [
    { path: "src/nlp/__init__.py", content: "" },
    {
      path: "configs/nlp.yaml",
      content: `# NLP / Hugging Face settings for ${project_name}
model:
  pretrained: "${modelId}"
  max_length: 256
  num_labels: 2

training:
  epochs: 3
  batch_size: 16
  learning_rate: 2.0e-5
  warmup_ratio: 0.1
  weight_decay: 0.01
  eval_steps: 100
  save_steps: 200

data:
  train_path: "data/raw/train.csv"
  validation_path: "data/raw/val.csv"
  text_column: "text"
  label_column: "label"

inference:
  threshold: 0.5
  batch_size: 32
`,
    },
    {
      path: "src/nlp/dataset.py",
      content: `"""Hugging Face dataset helpers for ${project_name}"""
from pathlib import Path
from typing import Any

import pandas as pd
from datasets import Dataset


def load_text_dataset(
    train_path: str,
    text_column: str = "text",
    label_column: str = "label",
    validation_path: str | None = None,
) -> tuple[Dataset, Dataset | None]:
    """Load CSV text data into Hugging Face Dataset objects."""
    train_df = pd.read_csv(train_path)
    train_ds = Dataset.from_pandas(train_df[[text_column, label_column]])

    val_ds = None
    if validation_path and Path(validation_path).exists():
        val_df = pd.read_csv(validation_path)
        val_ds = Dataset.from_pandas(val_df[[text_column, label_column]])

    return train_ds, val_ds


def sample_rows_for_demo(n: int = 200) -> pd.DataFrame:
    """Tiny demo corpus when no CSV is present yet."""
    texts = [
        "Great product, would recommend.",
        "Terrible experience, very disappointed.",
        "Average quality, nothing special.",
        "Absolutely love it!",
        "Would not buy again.",
    ]
    labels = [1, 0, 1, 1, 0]
    rows = []
    for i in range(n):
        rows.append({"text": texts[i % len(texts)], "label": labels[i % len(labels)]})
    return pd.DataFrame(rows)
`,
    },
    {
      path: "src/nlp/finetune.py",
      content: `#!/usr/bin/env python3
"""Fine-tune a Hugging Face transformer for ${project_name} (${framework_display})"""
import argparse
import logging
from pathlib import Path

import numpy as np
import yaml
from datasets import Dataset
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    DataCollatorWithPadding,
    Trainer,
    TrainingArguments,
)

${trackingImports}
from src.nlp.dataset import load_text_dataset, sample_rows_for_demo

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def tokenize_dataset(dataset: Dataset, tokenizer, text_column: str, max_length: int):
    def _tok(batch):
        return tokenizer(batch[text_column], truncation=True, max_length=max_length)

    return dataset.map(_tok, batched=True)


def main():
    parser = argparse.ArgumentParser(description="Fine-tune Hugging Face model")
    parser.add_argument("--config", default="configs/nlp.yaml")
    args = parser.parse_args()

    with open(args.config) as f:
        config = yaml.safe_load(f)

    model_name = config["model"]["pretrained"]
    text_col = config["data"]["text_column"]
    label_col = config["data"]["label_column"]
    max_length = config["model"]["max_length"]

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=config["model"]["num_labels"],
    )

    train_path = Path(config["data"]["train_path"])
    if train_path.exists():
        train_ds, val_ds = load_text_dataset(
            str(train_path),
            text_col,
            label_col,
            config["data"].get("validation_path"),
        )
    else:
        logger.warning("No train CSV at %s — using demo samples", train_path)
        demo = sample_rows_for_demo()
        train_ds = Dataset.from_pandas(demo)
        val_ds = None

    train_ds = tokenize_dataset(train_ds, tokenizer, text_col, max_length)
    if val_ds is not None:
        val_ds = tokenize_dataset(val_ds, tokenizer, text_col, max_length)

    collator = DataCollatorWithPadding(tokenizer=tokenizer)
    out_dir = Path("models/production/hf-nlp")
    out_dir.mkdir(parents=True, exist_ok=True)

    train_cfg = config["training"]
    training_args = TrainingArguments(
        output_dir=str(out_dir / "checkpoints"),
        num_train_epochs=train_cfg["epochs"],
        per_device_train_batch_size=train_cfg["batch_size"],
        learning_rate=train_cfg["learning_rate"],
        weight_decay=train_cfg["weight_decay"],
        eval_strategy="epoch" if val_ds is not None else "no",
        save_strategy="epoch",
        load_best_model_at_end=val_ds is not None,
        report_to=[],
    )

${trackingStart}
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        tokenizer=tokenizer,
        data_collator=collator,
    )
    trainer.train()
    trainer.save_model(str(out_dir))
    tokenizer.save_pretrained(str(out_dir))
    logger.info("Saved fine-tuned model to %s", out_dir)
${trackingEnd}


if __name__ == "__main__":
    main()
`,
    },
    {
      path: "src/nlp/inference.py",
      content: `#!/usr/bin/env python3
"""Run Hugging Face NLP inference for ${project_name}"""
import argparse
import logging
from pathlib import Path

import torch
import yaml
from transformers import AutoModelForSequenceClassification, AutoTokenizer

${deployment === "fastapi" ? `from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
` : ""}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = Path("models/production/hf-nlp")


def load_pipeline():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model.eval()
    return tokenizer, model


def predict_texts(texts: list[str], tokenizer, model, max_length: int = 256) -> list[float]:
    enc = tokenizer(texts, return_tensors="pt", truncation=True, max_length=max_length, padding=True)
    with torch.no_grad():
        logits = model(**enc).logits
        probs = torch.softmax(logits, dim=-1)[:, 1]
    return probs.tolist()


${deployment === "fastapi" ? `
app = FastAPI(title="${project_name} NLP API")

class PredictRequest(BaseModel):
    texts: list[str]

@app.get("/health")
def health():
    return {"status": "ok", "model": str(MODEL_DIR)}

@app.post("/predict")
def predict(req: PredictRequest):
    tokenizer, model = load_pipeline()
    scores = predict_texts(req.texts, tokenizer, model)
    return {"predictions": scores}
` : ""}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", nargs="+", default=["Sample input for inference"])
    parser.add_argument("--serve", action="store_true", help="Start FastAPI server")
    args = parser.parse_args()

    ${deployment === "fastapi" ? `if args.serve:
        uvicorn.run(app, host="0.0.0.0", port=8000)
        return
` : ""}
    tokenizer, model = load_pipeline()
    scores = predict_texts(args.text, tokenizer, model)
    for text, score in zip(args.text, scores):
        logger.info("%s -> %.4f", text[:60], score)


if __name__ == "__main__":
    main()
`,
    },
    {
      path: "notebooks/nlp_huggingface_quickstart.md",
      content: `# Hugging Face NLP — ${project_name}

## Setup

\`\`\`bash
pip install -r requirements.txt
\`\`\`

Place \`train.csv\` / \`val.csv\` under \`data/raw/\` with columns \`text\` and \`label\`.

## Fine-tune

\`\`\`bash
python src/nlp/finetune.py --config configs/nlp.yaml
\`\`\`

## Inference

\`\`\`bash
python src/nlp/inference.py --text "I love this product"
${deployment === "fastapi" ? `\n# API server\npython src/nlp/inference.py --serve` : ""}
\`\`\`

Default model: \`${modelId}\` (change in \`configs/nlp.yaml\`).
`,
    },
  ]

  if (framework === "sklearn") {
    files.push({
      path: "src/train.py",
      content: `#!/usr/bin/env python3
"""NLP entrypoint — delegates to Hugging Face fine-tuning (${project_name})"""
import subprocess
import sys

if __name__ == "__main__":
    subprocess.run([sys.executable, "src/nlp/finetune.py", *sys.argv[1:]], check=True)
`,
    })
    files.push({
      path: "src/inference.py",
      content: `#!/usr/bin/env python3
"""NLP inference entrypoint (${project_name})"""
import subprocess
import sys

if __name__ == "__main__":
    subprocess.run([sys.executable, "src/nlp/inference.py", *sys.argv[1:]], check=True)
`,
    })
  }

  return files
}
