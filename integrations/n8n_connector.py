"""
n8n Connector for AG2 and BrowserUse Integration

This module provides an interface between n8n workflows and the AG2/BrowserUse components
of the Arise Cares caregiver quality metrics and marketing integration system.

It exposes RESTful APIs that n8n can call to invoke AG2 agents and BrowserUse automation.
"""

import os
import json
import asyncio
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import logging

# Import the integrations
from integration_architecture import SystemOrchestrator
from browseruse_integration import BrowserUseAutomation

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# n8n API configuration
N8N_URL = os.getenv('N8N_URL', 'http://localhost:5678')
N8N_API_KEY = os.getenv('N8N_API_KEY', '')

# Initialize components
orchestrator = None
browser_automation = None

def initialize_components():
    """Initialize the system components"""
    global orchestrator, browser_automation
    
    try:
        orchestrator = SystemOrchestrator()
        browser_automation = BrowserUseAutomation()
        logger.info("Successfully initialized system components")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize components: {str(e)}")
        return False

# Ensure components are initialized
if not initialize_components():
    logger.error("Failed to initialize components. Service may not function correctly.")

def trigger_n8n_workflow(workflow_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Trigger an n8n workflow via the n8n API
    
    Args:
        workflow_id: The ID of the workflow to trigger
        payload: The data to send to the workflow
        
    Returns:
        The response from the workflow
    """
    headers = {
        'Content-Type': 'application/json',
    }
    
    if N8N_API_KEY:
        headers['X-N8N-API-KEY'] = N8N_API_KEY
    
    url = f"{N8N_URL}/api/v1/workflows/{workflow_id}/execute"
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error triggering n8n workflow {workflow_id}: {str(e)}")
        return {"error": str(e)}

#======================
# AG2 Agent Endpoints
#======================

@app.route('/api/ag2/seo_audit', methods=['POST'])
def run_seo_audit():
    """Run an SEO audit using AG2 agents"""
    data = request.json
    target_url = data.get('target_url')
    
    if not target_url:
        return jsonify({"status": "error", "message": "No target_url provided"}), 400
    
    # Run the AG2 agent asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(orchestrator.seo_agent.analyze_website(target_url))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/ag2/content_strategy', methods=['POST'])
def run_content_strategy():
    """Run content strategy analysis using AG2 agents"""
    data = request.json
    target_url = data.get('target_url')
    competitors = data.get('competitors', [])
    
    if not target_url:
        return jsonify({"status": "error", "message": "No target_url provided"}), 400
    
    # Create input data for the agent
    input_data = {
        "target_url": target_url,
        "competitors": competitors
    }
    
    # Run the AG2 agent asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(orchestrator.content_agent.analyze_content_opportunities(input_data))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/ag2/marketing_campaign', methods=['POST'])
def run_marketing_campaign():
    """Schedule a marketing campaign using AG2 agents"""
    data = request.json
    campaign_config = data.get('campaign_config', {})
    platform_tokens = data.get('platform_tokens', {})
    
    if not campaign_config:
        return jsonify({"status": "error", "message": "No campaign_config provided"}), 400
    
    # Run the AG2 agent asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(orchestrator.marketing_agent.schedule_campaign(
        campaign_config, platform_tokens
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/ag2/caregiver_analysis', methods=['POST'])
def run_caregiver_analysis():
    """Analyze caregiver performance using AG2 agents"""
    data = request.json
    caregiver_id = data.get('caregiver_id')
    metrics = data.get('metrics', {})
    
    if not caregiver_id:
        return jsonify({"status": "error", "message": "No caregiver_id provided"}), 400
    
    # This would be implemented with a specialized caregiver analysis agent
    # For now, return a simulated response
    
    # Simulated response
    result = {
        "caregiver_id": caregiver_id,
        "analysis_date": datetime.now().isoformat(),
        "performance_summary": {
            "overall_score": 87,
            "strengths": [
                "Client satisfaction (94/100)",
                "Documentation quality (91/100)",
                "Medication management (89/100)"
            ],
            "areas_for_improvement": [
                "Time management (76/100)",
                "Communication with family members (82/100)"
            ]
        },
        "recommendations": [
            {
                "type": "training",
                "focus": "Family Communication Strategies",
                "priority": "high",
                "expected_impact": "Improved family satisfaction scores by 12%"
            },
            {
                "type": "mentoring",
                "focus": "Time Management for Home Care",
                "priority": "medium",
                "expected_impact": "Increased visit efficiency by 15%"
            }
        ],
        "peer_comparison": {
            "percentile": 73,
            "top_metrics": ["client_satisfaction", "documentation_quality"],
            "below_average_metrics": ["visit_timeliness"]
        }
    }
    
    return jsonify({"status": "success", "result": result})

#======================
# BrowserUse Endpoints
#======================

@app.route('/api/browseruse/seo_rankings', methods=['POST'])
def check_seo_rankings():
    """Check SEO rankings using BrowserUse"""
    data = request.json
    business_name = data.get('business_name')
    location = data.get('location')
    keywords = data.get('keywords', [])
    
    if not business_name or not location or not keywords:
        return jsonify({"status": "error", "message": "Missing required parameters"}), 400
    
    # Run BrowserUse asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(browser_automation.check_local_seo_rankings(
        business_name, location, keywords
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/browseruse/reviews', methods=['POST'])
def collect_reviews():
    """Collect business reviews using BrowserUse"""
    data = request.json
    business_name = data.get('business_name')
    platforms = data.get('platforms', ["Google", "Yelp", "Facebook"])
    
    if not business_name:
        return jsonify({"status": "error", "message": "No business_name provided"}), 400
    
    # Run BrowserUse asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(browser_automation.collect_business_reviews(
        business_name, platforms
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/browseruse/competitor_analysis', methods=['POST'])
def analyze_competitor():
    """Analyze competitor website using BrowserUse"""
    data = request.json
    competitor_url = data.get('competitor_url')
    
    if not competitor_url:
        return jsonify({"status": "error", "message": "No competitor_url provided"}), 400
    
    # Run BrowserUse asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(browser_automation.analyze_competitor_website(
        competitor_url
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/browseruse/update_gbp', methods=['POST'])
def update_google_business():
    """Update Google Business Profile using BrowserUse"""
    data = request.json
    business_name = data.get('business_name')
    updates = data.get('updates', {})
    
    if not business_name or not updates:
        return jsonify({"status": "error", "message": "Missing required parameters"}), 400
    
    # Run BrowserUse asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(browser_automation.update_google_business_profile(
        business_name, updates
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/browseruse/social_post', methods=['POST'])
def post_social_content():
    """Post to social media using BrowserUse"""
    data = request.json
    platform = data.get('platform')
    content = data.get('content', {})
    
    if not platform or not content:
        return jsonify({"status": "error", "message": "Missing required parameters"}), 400
    
    # Run BrowserUse asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(browser_automation.publish_social_media_content(
        platform, content
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

#======================
# Orchestration Endpoints
#======================

@app.route('/api/workflows/seo_monitoring', methods=['POST'])
def run_seo_monitoring_workflow():
    """Run the complete SEO monitoring workflow with all components"""
    data = request.json
    target_url = data.get('target_url')
    
    if not target_url:
        return jsonify({"status": "error", "message": "No target_url provided"}), 400
    
    # Run the orchestrator asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(orchestrator.run_seo_monitoring_workflow(target_url))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/workflows/caregiver_evaluation', methods=['POST'])
def run_caregiver_evaluation_workflow():
    """Run the complete caregiver evaluation workflow with all components"""
    data = request.json
    caregiver_id = data.get('caregiver_id')
    
    if not caregiver_id:
        return jsonify({"status": "error", "message": "No caregiver_id provided"}), 400
    
    # This would run the full workflow
    # For now, return a simulated response
    
    result = {
        "caregiver_id": caregiver_id,
        "workflow": "caregiver_evaluation",
        "status": "completed",
        "steps_completed": [
            "data_collection",
            "metrics_analysis",
            "peer_comparison",
            "feedback_collection",
            "development_plan_generation"
        ],
        "outputs": {
            "performance_report_url": f"/reports/caregiver/{caregiver_id}/performance",
            "development_plan_url": f"/reports/caregiver/{caregiver_id}/development",
            "marketing_content_generated": 3,
            "training_sessions_scheduled": 2
        }
    }
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "components": {
            "ag2": orchestrator is not None,
            "browseruse": browser_automation is not None,
            "n8n_connector": True
        },
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Starting n8n connector for AG2 and BrowserUse integration...")
    app.run(debug=True, host='0.0.0.0', port=5001)
