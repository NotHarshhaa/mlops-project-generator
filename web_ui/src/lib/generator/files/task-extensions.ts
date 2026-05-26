import type { TemplateContext, VirtualFile } from "../types"

/** Task-specific data utilities beyond generic classification/regression */
export function generateTaskExtensionFiles(ctx: TemplateContext): VirtualFile[] {
  const { task_type, framework_display, project_name } = ctx
  const files: VirtualFile[] = []

  if (task_type === "nlp") {
    files.push({
      path: "src/data/text_preprocessor.py",
      content: `"""NLP text preprocessing for ${project_name}"""
from typing import List


class TextPreprocessor:
    def __init__(self, max_length: int = 512):
        self.max_length = max_length

    def tokenize_batch(self, texts: List[str]) -> List[List[str]]:
        """Simple whitespace tokenizer — swap for Hugging Face tokenizers in production."""
        return [t.lower().split()[: self.max_length] for t in texts]

    def build_vocab(self, texts: List[str]) -> dict:
        vocab = {"<pad>": 0, "<unk>": 1}
        for text in texts:
            for token in text.lower().split():
                if token not in vocab:
                    vocab[token] = len(vocab)
        return vocab
`,
    })
    files.push({
      path: "notebooks/nlp_quickstart.md",
      content: `# NLP quickstart (${framework_display})

1. Place raw text in \`data/raw/\`
2. Use \`src/data/text_preprocessor.py\` for tokenization
3. Fine-tune with transformers — see \`requirements.txt\`
`,
    })
  }

  if (task_type === "computer-vision") {
    files.push({
      path: "src/data/image_dataset.py",
      content: `"""Image dataset helpers for ${project_name}"""
from pathlib import Path
from typing import Callable, Optional, Tuple

from PIL import Image


class ImageDataset:
    def __init__(self, root: str, transform: Optional[Callable] = None):
        self.root = Path(root)
        self.transform = transform
        self.paths = sorted(self.root.glob("**/*.*"))

    def __len__(self) -> int:
        return len(self.paths)

    def __getitem__(self, idx: int) -> Tuple[Image.Image, int]:
        path = self.paths[idx]
        image = Image.open(path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        label = 0  # Replace with real labels from metadata
        return image, label
`,
    })
  }

  if (task_type === "timeseries") {
    files.push({
      path: "src/data/timeseries_loader.py",
      content: `"""Time series loading utilities for ${project_name}"""
import numpy as np
import pandas as pd


class TimeSeriesLoader:
    def __init__(self, config: dict):
        self.config = config
        self.window = config.get("data", {}).get("window_size", 24)
        self.horizon = config.get("data", {}).get("forecast_horizon", 1)

    def load_csv(self, path: str, time_col: str, value_col: str) -> pd.DataFrame:
        df = pd.read_csv(path, parse_dates=[time_col])
        return df.sort_values(time_col)

    def make_windows(self, series: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        X, y = [], []
        for i in range(len(series) - self.window - self.horizon):
            X.append(series[i : i + self.window])
            y.append(series[i + self.window : i + self.window + self.horizon])
        return np.array(X), np.array(y)
`,
    })
  }

  return files
}
