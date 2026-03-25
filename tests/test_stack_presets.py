"""
Tests for stack presets functionality
"""

import pytest
from generator.stack_presets import (
    get_preset,
    list_presets,
    get_preset_choices,
    STACK_PRESETS
)


def test_stack_presets_exist():
    """Test that all 6 stack presets are defined"""
    assert len(STACK_PRESETS) == 6
    assert "quick-start" in STACK_PRESETS
    assert "data-science" in STACK_PRESETS
    assert "deep-learning" in STACK_PRESETS
    assert "production-mlops" in STACK_PRESETS
    assert "enterprise" in STACK_PRESETS
    assert "research" in STACK_PRESETS


def test_get_preset_quick_start():
    """Test getting the quick-start preset"""
    preset = get_preset("quick-start")
    assert preset["framework"] == "sklearn"
    assert preset["experiment_tracking"] == "none"
    assert preset["deployment"] == "fastapi"
    assert preset["monitoring"] == "none"


def test_get_preset_enterprise():
    """Test getting the enterprise preset"""
    preset = get_preset("enterprise")
    assert preset["framework"] == "tensorflow"
    assert preset["experiment_tracking"] == "mlflow"
    assert preset["orchestration"] == "kubeflow"
    assert preset["deployment"] == "kubernetes"
    assert preset["monitoring"] == "evidently"


def test_get_preset_case_insensitive():
    """Test that preset names are case-insensitive"""
    preset1 = get_preset("quick-start")
    preset2 = get_preset("QUICK-START")
    preset3 = get_preset("Quick-Start")
    
    assert preset1 == preset2 == preset3


def test_get_preset_invalid():
    """Test that invalid preset raises ValueError"""
    with pytest.raises(ValueError) as exc_info:
        get_preset("invalid-preset")
    
    assert "not found" in str(exc_info.value)
    assert "Available presets:" in str(exc_info.value)


def test_list_presets():
    """Test listing all presets"""
    presets = list_presets()
    assert len(presets) == 6
    assert isinstance(presets, dict)


def test_get_preset_choices_default():
    """Test getting preset choices with default values"""
    choices = get_preset_choices("quick-start")
    
    assert choices["framework"] == "sklearn"
    assert choices["experiment_tracking"] == "none"
    assert choices["deployment"] == "fastapi"
    assert "project_name" in choices
    assert "author_name" in choices
    assert "description" in choices


def test_get_preset_choices_with_overrides():
    """Test getting preset choices with custom overrides"""
    choices = get_preset_choices(
        "quick-start",
        project_name="my-custom-project",
        author_name="John Doe",
        description="Custom description"
    )
    
    assert choices["project_name"] == "my-custom-project"
    assert choices["author_name"] == "John Doe"
    assert choices["description"] == "Custom description"
    assert choices["framework"] == "sklearn"  # From preset


def test_all_presets_have_required_fields():
    """Test that all presets have required fields"""
    required_fields = [
        "name", "description", "framework", "task_type",
        "experiment_tracking", "orchestration", "deployment", "monitoring"
    ]
    
    for preset_id, preset in STACK_PRESETS.items():
        for field in required_fields:
            assert field in preset, f"Preset '{preset_id}' missing field '{field}'"


def test_preset_values_are_valid():
    """Test that preset values are valid options"""
    valid_frameworks = ["sklearn", "pytorch", "tensorflow"]
    valid_tracking = ["none", "mlflow", "wandb", "custom"]
    valid_orchestration = ["none", "airflow", "kubeflow"]
    valid_deployment = ["fastapi", "docker", "kubernetes"]
    valid_monitoring = ["none", "evidently", "custom"]
    
    for preset_id, preset in STACK_PRESETS.items():
        assert preset["framework"] in valid_frameworks, f"Invalid framework in {preset_id}"
        assert preset["experiment_tracking"] in valid_tracking, f"Invalid tracking in {preset_id}"
        assert preset["orchestration"] in valid_orchestration, f"Invalid orchestration in {preset_id}"
        assert preset["deployment"] in valid_deployment, f"Invalid deployment in {preset_id}"
        assert preset["monitoring"] in valid_monitoring, f"Invalid monitoring in {preset_id}"
