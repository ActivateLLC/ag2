"""
n8n Workflow Manager for Arise Cares

This module provides a high-level interface for creating and managing n8n workflows
for the Arise Cares caregiver analytics system using BrowserUse automation.
"""

import os
import json
import asyncio
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta

from browseruse_integration import BrowserUseAutomation

class N8nWorkflowManager:
    """
    Manager for creating and managing n8n workflows
    
    This class provides a high-level interface for creating predefined workflows
    for the Arise Cares caregiver analytics system.
    """
    
    def __init__(self, n8n_url: str = None, username: str = None, password: str = None, n8n_api_key: str = None):
        """
        Initialize the workflow manager
        
        Args:
            n8n_url: URL of the n8n instance (default: from environment or http://localhost:5678)
            username: Username for n8n login (if authentication is enabled)
            password: Password for n8n login (if authentication is enabled)
            n8n_api_key: N8N API key (if authentication is enabled)
        """
        self.n8n_url = n8n_url or os.environ.get("N8N_URL", "http://localhost:5678")
        self.username = username or os.environ.get("N8N_USERNAME", "")
        self.password = password or os.environ.get("N8N_PASSWORD", "")
        self.n8n_api_key = n8n_api_key or os.environ.get("N8N_API_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MWQ4YWNmNS0xN2Q0LTQ3OGYtYjAzOC1kOWQwY2Q1OTE5YzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQxMDM5MjM5fQ.DW5iRPMotxBjVa5AGBl2IoQQ_QUKUrRrGikEajD8-PY")
        
        self.browser = BrowserUseAutomation()
        self.initialized = False
        
    async def initialize(self):
        """Initialize the workflow manager and login to n8n"""
        if not self.initialized:
            await self.browser.initialize()
            await self.browser.login_to_n8n(self.n8n_url, self.username, self.password, self.n8n_api_key)
            self.initialized = True
        return self.initialized
        
    async def create_weekly_seo_audit_workflow(self, target_url: str = "https://arisecares.com", 
                                             email_recipient: str = "marketing@arisecares.com") -> Dict[str, Any]:
        """
        Create a weekly SEO audit workflow
        
        Args:
            target_url: URL to audit (default: arisecares.com)
            email_recipient: Email to send results to
            
        Returns:
            Dictionary with workflow details
        """
        if not self.initialized:
            await self.initialize()
            
        # Configure schedule for Monday at 9 AM
        schedule_config = {
            "mode": "everyWeek",
            "weekday": 1,  # Monday
            "hour": 9,
            "minute": 0
        }
        
        # Configure email
        email_config = {
            "from": "analytics@arisecares.com",
            "to": email_recipient,
            "subject": "Weekly SEO Audit Results - {{$now.format('YYYY-MM-DD')}}",
            "text": "",
            "html": """
            <h1>SEO Audit Results for Arise Cares</h1>
            <p><strong>Date:</strong> {{$now.format("YYYY-MM-DD")}}</p>
            
            <h2>Core Web Vitals</h2>
            <ul>
              <li><strong>LCP:</strong> {{$node["HTTP Request"].json["result"]["core_web_vitals"]["lcp"]}} seconds</li>
              <li><strong>FID:</strong> {{$node["HTTP Request"].json["result"]["core_web_vitals"]["fid"]}} ms</li>
              <li><strong>CLS:</strong> {{$node["HTTP Request"].json["result"]["core_web_vitals"]["cls"]}}</li>
            </ul>
            
            <p>View the full report in the attached JSON file.</p>
            """
        }
        
        # Create the workflow
        return await self.browser.create_seo_audit_workflow(
            name="Weekly SEO Audit",
            target_url=target_url,
            schedule=schedule_config,
            email_config=email_config
        )
        
    async def create_monthly_content_strategy_workflow(self, target_url: str = "https://arisecares.com", 
                                                    competitors: List[str] = None,
                                                    email_recipient: str = "content@arisecares.com") -> Dict[str, Any]:
        """
        Create a monthly content strategy workflow
        
        Args:
            target_url: URL to analyze (default: arisecares.com)
            competitors: List of competitor URLs (default: major competitors)
            email_recipient: Email to send results to
            
        Returns:
            Dictionary with workflow details
        """
        if not self.initialized:
            await self.initialize()
            
        # Default competitors if none provided
        if not competitors:
            competitors = [
                "https://homeinstead.com",
                "https://comfortkeepers.com",
                "https://brightstarcare.com"
            ]
            
        # Configure schedule for 1st of each month at 10 AM
        schedule_config = {
            "mode": "everyMonth",
            "day": 1,
            "hour": 10,
            "minute": 0
        }
        
        # Configure email
        email_config = {
            "from": "analytics@arisecares.com",
            "to": email_recipient,
            "subject": "Monthly Content Strategy Report - {{$now.format('YYYY-MM')}}",
            "text": "",
            "html": """
            <h1>Content Strategy Report for Arise Cares</h1>
            <p><strong>Month:</strong> {{$now.format("MMMM YYYY")}}</p>
            
            <h2>Keyword Opportunities</h2>
            <h3>Primary Keywords</h3>
            <ul>
              {% for keyword in $node["HTTP Request"].json["result"]["keyword_opportunities"]["primary_keywords"] %}
                <li>{{ keyword }} (Volume: {{ $node["HTTP Request"].json["result"]["keyword_opportunities"]["search_volumes"][keyword] }})</li>
              {% endfor %}
            </ul>
            
            <h3>Related Keywords</h3>
            <ul>
              {% for keyword in $node["HTTP Request"].json["result"]["keyword_opportunities"]["related_keywords"] %}
                <li>{{ keyword }}</li>
              {% endfor %}
            </ul>
            
            <p>View the full report in the attached JSON file.</p>
            """
        }
        
        # Create the workflow
        return await self.browser.create_content_strategy_workflow(
            name="Monthly Content Strategy",
            target_url=target_url,
            competitors=competitors,
            schedule=schedule_config,
            email_config=email_config
        )
        
    async def create_daily_caregiver_metrics_workflow(self, caregiver_ids: List[str] = None, 
                                                   metrics: List[str] = None) -> Dict[str, Any]:
        """
        Create a daily caregiver metrics workflow
        
        Args:
            caregiver_ids: List of caregiver IDs to analyze (default: all active caregivers)
            metrics: List of metrics to analyze (default: all metrics)
            
        Returns:
            Dictionary with workflow details
        """
        if not self.initialized:
            await self.initialize()
            
        # Default caregiver IDs (in production, this would be fetched from a database)
        if not caregiver_ids:
            caregiver_ids = ["CG001", "CG002", "CG003", "CG004", "CG005"]
            
        # Default metrics if none provided
        if not metrics:
            metrics = [
                "performance",
                "client_satisfaction",
                "training_needs",
                "specialty_skills",
                "visit_compliance"
            ]
            
        # Configure schedule for daily at 1 AM
        schedule_config = {
            "mode": "everyDay",
            "hour": 1,
            "minute": 0
        }
        
        # Configure dashboard update
        dashboard_config = {
            "dashboard_id": "caregiver_metrics",
            "update_method": "append",
            "format_data": True
        }
        
        # Create the workflow
        return await self.browser.create_caregiver_analysis_workflow(
            name="Daily Caregiver Metrics",
            caregiver_ids=caregiver_ids,
            metrics=metrics,
            schedule=schedule_config,
            dashboard_config=dashboard_config
        )
        
    async def create_all_workflows(self) -> Dict[str, Any]:
        """
        Create all predefined workflows for the Arise Cares system
        
        Returns:
            Dictionary with all workflow details
        """
        if not self.initialized:
            await self.initialize()
            
        results = {}
        
        # Create SEO audit workflow
        results["seo_audit"] = await self.create_weekly_seo_audit_workflow()
        
        # Create content strategy workflow
        results["content_strategy"] = await self.create_monthly_content_strategy_workflow()
        
        # Create caregiver metrics workflow
        results["caregiver_metrics"] = await self.create_daily_caregiver_metrics_workflow()
        
        return results
        
    async def close(self):
        """Close the workflow manager"""
        if self.initialized:
            await self.browser.close()
            self.initialized = False
            
# For testing
if __name__ == "__main__":
    manager = N8nWorkflowManager()
    asyncio.run(manager.initialize())
    
    # Create all workflows
    workflows = asyncio.run(manager.create_all_workflows())
    print(json.dumps(workflows, indent=2))
    
    asyncio.run(manager.close())
