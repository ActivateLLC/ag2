"""Tests for the Content Strategy Agent."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime
from autogen.content_strategy import ContentStrategyAgent

@pytest.fixture
def content_agent():
    """Create a test content strategy agent."""
    return ContentStrategyAgent(name="test_content_agent")

@pytest.fixture
def mock_api_keys():
    """Mock API keys for testing."""
    return {
        "semrush": "test_key",
        "ahrefs": "test_key",
        "moz": "test_key"
    }

@pytest.fixture
def mock_competitors():
    """Mock competitor URLs for testing."""
    return [
        "https://competitor1.com",
        "https://competitor2.com"
    ]

@pytest.mark.asyncio
async def test_analyze_content_success(content_agent, mock_api_keys, mock_competitors):
    """Test successful content analysis."""
    with patch.object(content_agent, '_research_keywords', new_callable=AsyncMock) as mock_keywords, \
         patch.object(content_agent, '_analyze_content_gaps', new_callable=AsyncMock) as mock_gaps, \
         patch.object(content_agent, '_analyze_competitors', new_callable=AsyncMock) as mock_competitors_analysis, \
         patch.object(content_agent, '_generate_topic_recommendations', new_callable=AsyncMock) as mock_topics, \
         patch.object(content_agent, '_get_performance_metrics', new_callable=AsyncMock) as mock_metrics:
        
        # Set up mock return values
        mock_keywords.return_value = {
            "primary_keywords": ["keyword1", "keyword2"],
            "secondary_keywords": ["keyword3", "keyword4"]
        }
        mock_gaps.return_value = {
            "missing_topics": ["topic1", "topic2"],
            "opportunity_score": 85
        }
        mock_competitors_analysis.return_value = {
            "competitor1.com": {"content_score": 90},
            "competitor2.com": {"content_score": 85}
        }
        mock_topics.return_value = [
            {"topic": "topic1", "priority": "high"},
            {"topic": "topic2", "priority": "medium"}
        ]
        mock_metrics.return_value = {
            "avg_engagement": 0.75,
            "content_freshness": 0.85
        }

        # Run the analysis
        result = await content_agent.analyze_content(
            target_url="https://example.com",
            competitors=mock_competitors,
            api_keys=mock_api_keys
        )

        # Verify all methods were called
        mock_keywords.assert_called_once()
        mock_gaps.assert_called_once()
        mock_competitors_analysis.assert_called_once()
        mock_topics.assert_called_once()
        mock_metrics.assert_called_once()

        # Check result structure
        assert "target_url" in result
        assert "timestamp" in result
        assert "keyword_opportunities" in result
        assert "content_gaps" in result
        assert "competitor_analysis" in result
        assert "topic_recommendations" in result
        assert "performance_metrics" in result
        assert "error" not in result

@pytest.mark.asyncio
async def test_analyze_content_with_focus_keywords(content_agent, mock_api_keys, mock_competitors):
    """Test content analysis with specific focus keywords."""
    focus_keywords = ["keyword1", "keyword2"]
    
    with patch.object(content_agent, '_research_keywords', new_callable=AsyncMock) as mock_keywords:
        mock_keywords.return_value = {
            "primary_keywords": focus_keywords,
            "related_keywords": ["related1", "related2"]
        }

        result = await content_agent.analyze_content(
            target_url="https://example.com",
            competitors=mock_competitors,
            api_keys=mock_api_keys,
            focus_keywords=focus_keywords
        )

        # Verify keywords were passed correctly
        mock_keywords.assert_called_once_with(
            "https://example.com",
            mock_competitors,
            mock_api_keys,
            focus_keywords
        )

        assert "keyword_opportunities" in result
        assert result["keyword_opportunities"]["primary_keywords"] == focus_keywords

@pytest.mark.asyncio
async def test_analyze_content_error_handling(content_agent, mock_api_keys, mock_competitors):
    """Test error handling during content analysis."""
    with patch.object(content_agent, '_research_keywords', new_callable=AsyncMock) as mock_keywords:
        mock_keywords.side_effect = Exception("API Error")

        result = await content_agent.analyze_content(
            target_url="https://example.com",
            competitors=mock_competitors,
            api_keys=mock_api_keys
        )

        assert "error" in result
        assert "API Error" in result["error"]

@pytest.mark.asyncio
async def test_research_keywords(content_agent, mock_api_keys, mock_competitors):
    """Test keyword research functionality."""
    with patch('aiohttp.ClientSession.get') as mock_get:
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "keywords": [
                {"keyword": "test1", "volume": 1000},
                {"keyword": "test2", "volume": 500}
            ]
        }
        mock_get.return_value.__aenter__.return_value = mock_response

        result = await content_agent._research_keywords(
            target_url="https://example.com",
            competitors=mock_competitors,
            api_keys=mock_api_keys,
            focus_keywords=None
        )

        assert "primary_keywords" in result
        assert len(result["primary_keywords"]) > 0
