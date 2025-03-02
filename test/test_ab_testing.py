"""Tests for the A/B Testing Agent."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timezone, timedelta
from autogen.marketing_ab_testing import ABTestingAgent

@pytest.fixture
def ab_testing_agent():
    """Fixture for creating an A/B Testing Agent."""
    return ABTestingAgent(name="test_ab_testing_agent")

@pytest.fixture
def mock_test_config():
    """Fixture for A/B test configuration."""
    return {
        "name": "Homepage CTA Test",
        "variants": [
            {
                "name": "Control",
                "content": {
                    "cta_text": "Sign Up Now",
                    "cta_color": "#1E90FF"
                },
                "traffic_allocation": 0.5
            },
            {
                "name": "Variant B",
                "content": {
                    "cta_text": "Get Started Free",
                    "cta_color": "#32CD32"
                },
                "traffic_allocation": 0.5
            }
        ],
        "metrics": ["click_through_rate", "conversion_rate"],
        "duration_days": 14,
        "min_sample_size": 1000,
        "confidence_level": 0.95
    }

@pytest.mark.asyncio
async def test_setup_experiment_success(ab_testing_agent, mock_test_config):
    """Test successful experiment setup."""
    result = await ab_testing_agent.setup_experiment(mock_test_config)
    
    assert result["status"] == "configured"
    assert "test_id" in result
    assert len(result["variants"]) == 2
    assert result["metrics"] == ["click_through_rate", "conversion_rate"]
    assert datetime.fromisoformat(result["start_time"]).tzinfo == timezone.utc
    assert datetime.fromisoformat(result["end_time"]).tzinfo == timezone.utc

@pytest.mark.asyncio
async def test_setup_experiment_invalid_allocation(ab_testing_agent, mock_test_config):
    """Test experiment setup with invalid traffic allocation."""
    mock_test_config["variants"][0]["traffic_allocation"] = 0.7
    mock_test_config["variants"][1]["traffic_allocation"] = 0.7
    
    result = await ab_testing_agent.setup_experiment(mock_test_config)
    
    assert result["status"] == "error"
    assert "traffic allocation" in result["error"].lower()

@pytest.mark.asyncio
async def test_assign_variant(ab_testing_agent):
    """Test variant assignment."""
    result = await ab_testing_agent.assign_variant(
        test_id="test_123",
        user_id="user_456",
        context={"source": "email"}
    )
    
    assert result["status"] == "assigned"
    assert "variant_id" in result
    assert result["user_id"] == "user_456"
    assert result["context"] == {"source": "email"}
    assert datetime.fromisoformat(result["assignment_time"]).tzinfo == timezone.utc

@pytest.mark.asyncio
async def test_track_metrics_success(ab_testing_agent):
    """Test successful metric tracking."""
    metrics = {
        "click_through_rate": 0.15,
        "conversion_rate": 0.05
    }
    
    result = await ab_testing_agent.track_metrics(
        test_id="test_123",
        variant_id="variant_1",
        user_id="user_456",
        metrics=metrics
    )
    
    assert result["status"] == "recorded"
    assert result["test_id"] == "test_123"
    assert result["variant_id"] == "variant_1"
    assert result["metrics"] == metrics
    assert datetime.fromisoformat(result["timestamp"]).tzinfo == timezone.utc

@pytest.mark.asyncio
async def test_analyze_results_success(ab_testing_agent):
    """Test successful results analysis."""
    result = await ab_testing_agent.analyze_results(test_id="test_123")
    
    assert result["status"] == "completed"
    assert "winning_variant" in result
    assert "metrics" in result
    assert "statistical_significance" in result
    assert datetime.fromisoformat(result["analysis_time"]).tzinfo == timezone.utc

@pytest.mark.asyncio
async def test_full_experiment_workflow(ab_testing_agent, mock_test_config):
    """Test the complete A/B testing workflow."""
    # Step 1: Setup experiment
    setup_result = await ab_testing_agent.setup_experiment(mock_test_config)
    assert setup_result["status"] == "configured"
    test_id = setup_result["test_id"]
    
    # Step 2: Assign variants to users
    assignments = []
    for user_id in ["user_1", "user_2"]:
        assignment = await ab_testing_agent.assign_variant(
            test_id=test_id,
            user_id=user_id
        )
        assert assignment["status"] == "assigned"
        assignments.append(assignment)
    
    # Step 3: Track metrics for each user
    for assignment in assignments:
        tracking_result = await ab_testing_agent.track_metrics(
            test_id=test_id,
            variant_id=assignment["variant_id"],
            user_id=assignment["user_id"],
            metrics={
                "click_through_rate": 0.15,
                "conversion_rate": 0.05
            }
        )
        assert tracking_result["status"] == "recorded"
    
    # Step 4: Analyze results
    analysis_result = await ab_testing_agent.analyze_results(test_id=test_id)
    assert analysis_result["status"] == "completed"
    assert analysis_result["statistical_significance"] in [True, False]

@pytest.mark.asyncio
async def test_error_handling(ab_testing_agent):
    """Test error handling across different methods."""
    # Test with invalid test_id
    result = await ab_testing_agent.analyze_results(test_id="nonexistent_test")
    assert result["status"] == "error"
    
    # Test with invalid metrics
    result = await ab_testing_agent.track_metrics(
        test_id="test_123",
        variant_id="variant_1",
        user_id="user_456",
        metrics=None  # Invalid metrics
    )
    assert result["status"] == "error"
