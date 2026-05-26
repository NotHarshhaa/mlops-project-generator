#!/usr/bin/env python3
"""Copy root templates/ into generator/templates/ for PyPI wheel packaging."""
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "templates"
DEST = ROOT / "generator" / "templates"


def main() -> None:
    if not SRC.exists():
        print(f"❌ Missing source templates: {SRC}")
        sys.exit(1)
    if DEST.exists():
        shutil.rmtree(DEST)
    shutil.copytree(SRC, DEST)
    print(f"Copied {SRC} -> {DEST}")


if __name__ == "__main__":
    main()
