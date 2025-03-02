"""Tests for the SEO Audit Agent."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime
from autogen.seo_audit import SEOAuditAgent

@pytest.fixture
def seo_agent():
    """Create a test SEO audit agent."""
    return SEOAuditAgent(name="test_seo_agent")

@pytest.fixture
def mock_api_keys():
    """Mock API keys for testing."""
    return {
        "pagespeed": "test_key",
        "google": "test_key",
        "security": "test_key"
    }

@pytest.mark.asyncio
async def test_run_audit_success(seo_agent, mock_api_keys):
    """Test successful SEO audit run."""
    # Mock the internal audit methods
    with patch.object(seo_agent, '_check_core_web_vitals', new_callable=AsyncMock) as mock_core_vitals, \
         patch.object(seo_agent, '_check_security', new_callable=AsyncMock) as mock_security, \
         patch.object(seo_agent, '_check_mobile_friendly', new_callable=AsyncMock) as mock_mobile, \
         patch.object(seo_agent, '_check_crawlability', new_callable=AsyncMock) as mock_crawl, \
         patch.object(seo_agent, '_validate_schema', new_callable=AsyncMock) as mock_schema, \
         patch.object(seo_agent, '_check_inp_metrics', new_callable=AsyncMock) as mock_inp:
        
        # Set up mock return values
        mock_core_vitals.return_value = {"lcp": 2.5, "fid": 100, "cls": 0.1}
        mock_security.return_value = {"ssl": True, "headers": {"x-frame-options": "DENY"}}
        mock_mobile.return_value = {"is_mobile_friendly": True}
        mock_crawl.return_value = {"robots_txt": True, "sitemap": True}
        mock_schema.return_value = {"valid": True}
        mock_inp.return_value = {"score": 120}

        # Run the audit
        result = await seo_agent.run_audit(
            url="https://example.com",
            api_keys=mock_api_keys
        )

        # Verify all methods were called
        mock_core_vitals.assert_called_once()
        mock_security.assert_called_once()
        mock_mobile.assert_called_once()
        mock_crawl.assert_called_once()
        mock_schema.assert_called_once()
        mock_inp.assert_called_once()

        # Check result structure
        assert "url" in result
        assert "timestamp" in result
        assert "core_web_vitals" in result
        assert "security" in result
        assert "mobile" in result
        assert "crawlability" in result
        assert "schema" in result
        assert "inp_metrics" in result
        assert "error" not in result

@pytest.mark.asyncio
async def test_run_audit_with_specific_metrics(seo_agent, mock_api_keys):
    """Test SEO audit with specific metrics."""
    metrics = ["core_web_vitals", "security"]
    
    with patch.object(seo_agent, '_check_core_web_vitals', new_callable=AsyncMock) as mock_core_vitals, \
         patch.object(seo_agent, '_check_security', new_callable=AsyncMock) as mock_security:
        
        mock_core_vitals.return_value = {"lcp": 2.5}
        mock_security.return_value = {"ssl": True}

        result = await seo_agent.run_audit(
            url="https://example.com",
            api_keys=mock_api_keys,
            metrics=metrics
        )

        # Verify only specified methods were called
        mock_core_vitals.assert_called_once()
        mock_security.assert_called_once()

        assert "core_web_vitals" in result
        assert "security" in result
        assert result["core_web_vitals"]["lcp"] == 2.5
        assert result["security"]["ssl"] is True

@pytest.mark.asyncio
async def test_run_audit_error_handling(seo_agent, mock_api_keys):
    """Test error handling during SEO audit."""
    with patch.object(seo_agent, '_check_core_web_vitals', new_callable=AsyncMock) as mock_core_vitals:
        mock_core_vitals.side_effect = Exception("API Error")

        result = await seo_agent.run_audit(
            url="https://example.com",
            api_keys=mock_api_keys
        )

        assert "error" in result
        assert "API Error" in result["error"]

@pytest.mark.asyncio
async def test_check_core_web_vitals(seo_agent, mock_api_keys):
    """Test core web vitals check."""
    with patch('aiohttp.ClientSession.get') as mock_get:
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "lighthouseResult": {
                "audits": {
                    "largest-contentful-paint": {"numericValue": 2500},
                    "first-input-delay": {"numericValue": 100},
                    "cumulative-layout-shift": {"numericValue": 0.1}
                }
            }
        }
        mock_get.return_value.__aenter__.return_value = mock_response

        result = await seo_agent._check_core_web_vitals(
            url="https://example.com",
            api_keys=mock_api_keys
        )

        assert "lcp" in result
        assert "fid" in result
        assert "cls" in result
