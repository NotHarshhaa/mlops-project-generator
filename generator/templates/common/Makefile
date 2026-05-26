.PHONY: help install train inference test lint format clean docker

PROJECT_NAME ?= {{ project_name }}

help:
	@echo "Targets: install train inference test lint format clean{% if deployment == 'docker' %} docker{% endif %}"

install:
	pip install -r requirements.txt

train:
{% if task_type == "nlp" %}
	python src/nlp/finetune.py --config configs/nlp.yaml
{% else %}
	python src/train.py --config configs/config.yaml
{% endif %}

inference:
{% if task_type == "nlp" %}
	python src/nlp/inference.py
{% else %}
	python src/inference.py
{% endif %}

test:
	pytest tests/ -v

lint:
	flake8 src/ tests/ || true

format:
	black src/ tests/
	isort src/ tests/

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache htmlcov/

{% if deployment == "docker" %}
docker:
	docker compose up --build
{% endif %}
