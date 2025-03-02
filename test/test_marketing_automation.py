"""Tests for the Marketing Automation Agent."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timedelta, timezone
from autogen.marketing_automation import MarketingAutomationAgent

@pytest.fixture
def marketing_agent():
    """Create a test marketing automation agent."""
    return MarketingAutomationAgent(name="test_marketing_agent")

@pytest.fixture
def mock_platform_tokens():
    """Mock platform tokens for testing."""
    return {
        "facebook": "test_token",
        "twitter": "test_token",
        "linkedin": "test_token"
    }

@pytest.fixture
def mock_campaign_config():
    """Mock campaign configuration for testing."""
    return {
        "name": "Test Campaign",
        "platforms": ["facebook", "twitter", "linkedin"],
        "content": [
            {
                "text": "Test post 1",
                "media": ["image1.jpg"],
                "schedule": datetime.now(timezone.utc).isoformat()
            },
            {
                "text": "Test post 2",
                "media": ["image2.jpg"],
                "schedule": datetime.now(timezone.utc).isoformat()
            }
        ],
        "targeting": {
            "locations": ["US", "UK"],
            "age_range": [25, 54],
            "interests": ["technology", "marketing"]
        },
        "budget": {
            "total": 1000,
            "daily_limit": 100
        }
    }

@pytest.mark.asyncio
async def test_schedule_campaign_success(marketing_agent, mock_platform_tokens, mock_campaign_config):
    """Test successful campaign scheduling."""
    schedule_start = datetime.now(timezone.utc)
    schedule_end = schedule_start + timedelta(days=7)

    with patch.object(marketing_agent, '_generate_campaign_id', new_callable=AsyncMock) as mock_id, \
         patch.object(marketing_agent, '_schedule_posts', new_callable=AsyncMock) as mock_schedule, \
         patch.object(marketing_agent, '_configure_platforms', new_callable=AsyncMock) as mock_config, \
         patch.object(marketing_agent, '_setup_tracking', new_callable=AsyncMock) as mock_tracking, \
         patch.object(marketing_agent, '_setup_automation_rules', new_callable=AsyncMock) as mock_rules, \
         patch.object(marketing_agent, '_log_campaign_execution', new_callable=AsyncMock) as mock_log:
        
        # Set up mock return values
        mock_id.return_value = "test_campaign_123"
        mock_schedule.return_value = [
            {"platform": "facebook", "status": "scheduled", "time": datetime.now(timezone.utc).isoformat()},
            {"platform": "twitter", "status": "scheduled", "time": datetime.now(timezone.utc).isoformat()}
        ]
        mock_config.return_value = {
            "facebook": {"status": "configured"},
            "twitter": {"status": "configured"}
        }
        mock_tracking.return_value = {
            "utm_parameters": {"source": "test_campaign_123"},
            "conversion_tracking": True
        }
        mock_rules.return_value = [
            {"type": "budget_control", "condition": "spend > daily_limit"},
            {"type": "performance_optimization", "condition": "engagement < threshold"}
        ]

        # Run the campaign scheduling
        result = await marketing_agent.schedule_campaign(
            campaign_config=mock_campaign_config,
            platform_tokens=mock_platform_tokens,
            schedule_start=schedule_start,
            schedule_end=schedule_end
        )

        # Verify all methods were called
        mock_id.assert_called_once()
        mock_schedule.assert_called_once()
        mock_config.assert_called_once()
        mock_tracking.assert_called_once()
        mock_rules.assert_called_once()
        mock_log.assert_called_once()

        # Check result structure
        assert result["campaign_id"] == "test_campaign_123"
        assert "timestamp" in result
        assert "scheduled_posts" in result
        assert "platform_configs" in result
        assert "tracking_setup" in result
        assert "automation_rules" in result
        assert result["status"] == "scheduled"
        assert "error" not in result

@pytest.mark.asyncio
async def test_schedule_campaign_error_handling(marketing_agent, mock_platform_tokens, mock_campaign_config):
    """Test error handling during campaign scheduling."""
    schedule_start = datetime.now(timezone.utc)
    
    with patch.object(marketing_agent, '_generate_campaign_id', new_callable=AsyncMock) as mock_id:
        mock_id.side_effect = Exception("API Error")

        result = await marketing_agent.schedule_campaign(
            campaign_config=mock_campaign_config,
            platform_tokens=mock_platform_tokens,
            schedule_start=schedule_start
        )

        assert "error" in result
        assert "API Error" in result["error"]
        assert result["status"] == "failed"

@pytest.mark.asyncio
async def test_schedule_posts(marketing_agent, mock_platform_tokens, mock_campaign_config):
    """Test post scheduling functionality."""
    schedule_start = datetime.now(timezone.utc)
    schedule_end = schedule_start + timedelta(days=7)

    with patch('aiohttp.ClientSession.post') as mock_post:
        mock_response = MagicMock()
        mock_response.json.return_value = {"id": "post_123", "scheduled_time": datetime.now(timezone.utc).isoformat()}
        mock_post.return_value.__aenter__.return_value = mock_response

        result = await marketing_agent._schedule_posts(
            campaign_config=mock_campaign_config,
            platform_tokens=mock_platform_tokens,
            schedule_start=schedule_start,
            schedule_end=schedule_end
        )

        assert len(result) > 0
        assert "platform" in result[0]
        assert "status" in result[0]
        assert "time" in result[0]

@pytest.mark.asyncio
async def test_setup_tracking(marketing_agent, mock_platform_tokens, mock_campaign_config):
    """Test tracking setup functionality."""
    campaign_id = "test_campaign_123"
    
    with patch('aiohttp.ClientSession.post') as mock_post:
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "tracking_id": "track_123",
            "status": "active"
        }
        mock_post.return_value.__aenter__.return_value = mock_response

        result = await marketing_agent._setup_tracking(
            campaign_id=campaign_id,
            campaign_config=mock_campaign_config,
            platform_tokens=mock_platform_tokens
        )

        assert "utm_parameters" in result
        assert "conversion_tracking" in result
