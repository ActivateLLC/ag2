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
from n8n_workflow_manager import N8nWorkflowManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Set up environment variables
AG2_API_URL = os.environ.get('AG2_API_URL', 'http://localhost:5001')  # Inside Docker container
AG2_CONNECTOR_URL = 'http://localhost:5003'  # From outside Docker (for testing)
N8N_URL = os.environ.get('N8N_URL', 'http://host.docker.internal:5678')
N8N_API_KEY = os.environ.get('N8N_API_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MWQ4YWNmNS0xN2Q0LTQ3OGYtYjAzOC1kOWQwY2Q1OTE5YzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQxMDM5MjM5fQ.DW5iRPMotxBjVa5AGBl2IoQQ_QUKUrRrGikEajD8-PY')

# Initialize Flask app
app = Flask(__name__)

# Function to get n8n API headers
def get_n8n_headers():
    """Get headers for n8n API requests"""
    headers = {
        'Content-Type': 'application/json'
    }
    
    # Add API key only if it's available and not empty
    if N8N_API_KEY:
        headers['X-N8N-API-KEY'] = N8N_API_KEY
    
    return headers

# Initialize components
orchestrator = None
browser_automation = None
n8n_workflow_manager = None

def initialize_components():
    """Initialize the system components"""
    global orchestrator, browser_automation, n8n_workflow_manager
    
    try:
        orchestrator = SystemOrchestrator()
        logger.info("Successfully initialized SystemOrchestrator")
    except Exception as e:
        logger.error(f"Failed to initialize SystemOrchestrator: {str(e)}")
        orchestrator = None
        
    try:
        browser_automation = BrowserUseAutomation()
        logger.info("Successfully initialized BrowserUseAutomation")
    except Exception as e:
        logger.error(f"Failed to initialize BrowserUseAutomation: {str(e)}")
        browser_automation = None
        
    try:
        n8n_workflow_manager = N8nWorkflowManager(N8N_URL)
        logger.info("Successfully initialized N8nWorkflowManager")
    except Exception as e:
        logger.error(f"Failed to initialize N8nWorkflowManager: {str(e)}")
        n8n_workflow_manager = None
        
    if orchestrator and browser_automation and n8n_workflow_manager:
        logger.info("All components initialized successfully")
        return True
    else:
        logger.warning("Some components failed to initialize. Service will operate in limited mode.")
        return False

# Ensure components are initialized
if not initialize_components():
    logger.error("Failed to initialize components. Service may not function correctly.")

def _test_n8n_connection():
    """Test connection to n8n API"""
    try:
        # Try to get workflows
        url = f"{N8N_URL}/api/v1/workflows"
        response = requests.get(url, headers=get_n8n_headers())
        
        # Check if we got a successful response
        if response.status_code == 200:
            return True, "Connected to n8n API successfully"
        elif response.status_code == 401:
            return False, "Authentication required. Your n8n instance has authentication enabled. Please set N8N_AUTH_ENABLED=false in your n8n environment or provide an API key."
        else:
            return False, f"Failed to connect to n8n API. Status code: {response.status_code}"
    except Exception as e:
        return False, f"Error connecting to n8n API: {str(e)}"

@app.route('/api/n8n/trigger_workflow/<workflow_id>', methods=['POST'])
def api_trigger_workflow(workflow_id):
    """
    API endpoint to trigger an n8n workflow
    
    Args:
        workflow_id: The ID of the workflow to trigger
        
    Returns:
        JSON response with the result of the workflow execution
    """
    try:
        data = request.json or {}
        result = trigger_n8n_workflow(workflow_id, data)
        return jsonify({"status": "success", "result": result})
    except Exception as e:
        app.logger.error(f"Error triggering workflow: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

def trigger_n8n_workflow(workflow_id, payload=None):
    """Trigger an n8n workflow"""
    if not payload:
        payload = {}
    
    try:
        # First try direct API call
        url = f"{N8N_URL}/api/v1/workflows/{workflow_id}/activate"
        activate_response = requests.post(
            url,
            headers=get_n8n_headers()
        )
        
        if activate_response.status_code == 200:
            app.logger.info(f"Successfully activated workflow {workflow_id}")
            
            # Now execute the workflow
            execute_url = f"{N8N_URL}/api/v1/workflows/{workflow_id}/execute"
            response = requests.post(
                execute_url,
                json=payload,
                headers=get_n8n_headers()
            )
            
            if response.status_code == 200:
                app.logger.info("Direct API call successful")
                return response.json()
        
        # If direct API call fails with 401 (authentication required), try webhook URL
        app.logger.warning(f"Direct API call failed with status {activate_response.status_code}. Trying webhook URL...")
        
        # Try to use webhook URL with the workflow ID as the webhook ID
        webhook_url = f"{N8N_URL}/webhook/{workflow_id}"
        app.logger.info(f"Trying webhook URL: {webhook_url}")
        
        webhook_response = requests.post(
            webhook_url,
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if webhook_response.status_code == 200:
            app.logger.info("Webhook trigger successful")
            return webhook_response.json()
        else:
            app.logger.warning(f"Webhook trigger failed with status {webhook_response.status_code}")
            
            # Try with a different webhook format (n8n sometimes uses UUIDs for webhooks)
            alt_webhook_url = f"{N8N_URL}/webhook-test/{workflow_id}"
            app.logger.info(f"Trying alternative webhook URL: {alt_webhook_url}")
            
            alt_webhook_response = requests.post(
                alt_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            
            if alt_webhook_response.status_code == 200:
                app.logger.info("Alternative webhook trigger successful")
                return alt_webhook_response.json()
            else:
                app.logger.error(f"All trigger methods failed for workflow {workflow_id}")
                return {"error": f"Failed to trigger workflow via API or webhook. Status codes: API={activate_response.status_code}, Webhook={webhook_response.status_code}, Alt Webhook={alt_webhook_response.status_code}"}
    
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error triggering workflow: {str(e)}")
        return {"error": str(e)}

def create_execution_workflow(target_workflow_id, payload):
    """Create a temporary workflow to execute another workflow"""
    # Create a simple workflow with an HTTP request node that calls the target workflow
    workflow_data = {
        "name": f"Execute Workflow {target_workflow_id}",
        "nodes": [
            {
                "parameters": {},
                "name": "Start",
                "type": "n8n-nodes-base.start",
                "typeVersion": 1,
                "position": [100, 300]
            },
            {
                "parameters": {
                    "url": f"{N8N_URL}/webhook/{target_workflow_id}",
                    "options": {},
                    "method": "POST",
                    "bodyParametersUi": {
                        "parameter": [
                            {
                                "name": "data",
                                "value": json.dumps(payload)
                            }
                        ]
                    }
                },
                "name": "HTTP Request",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 1,
                "position": [300, 300]
            }
        ],
        "connections": {
            "Start": {
                "main": [
                    [
                        {
                            "node": "HTTP Request",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "active": False
    }
    
    try:
        url = f"{N8N_URL}/api/v1/workflows"
        response = requests.post(
            url,
            json=workflow_data,
            headers=get_n8n_headers()
        )
        
        if response.status_code == 401:
            app.logger.error("Authentication required for n8n API. Cannot create execution workflow.")
            return None
            
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error creating execution workflow: {str(e)}")
        return None

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
    result = loop.run_until_complete(orchestrator.seo_agent.run_audit(
        url=target_url,
        api_keys={} # Empty dict for now, we'll use mock data
    ))
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
    
    # Run the AG2 agent asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(orchestrator.content_agent.analyze_content(
        target_url=target_url,
        competitors=competitors,
        api_keys={} # Empty dict for now, we'll use mock data
    ))
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
                "due_date": (datetime.now() + timedelta(days=30)).isoformat()
            },
            {
                "type": "mentoring",
                "focus": "Time Management",
                "priority": "medium",
                "due_date": (datetime.now() + timedelta(days=45)).isoformat()
            }
        ],
        "metrics": metrics
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
    
    if not business_name:
        return jsonify({"status": "error", "message": "No business_name provided"}), 400
    
    # Run BrowserUse asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(browser_automation.collect_business_reviews(business_name))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/browseruse/competitor', methods=['POST'])
def analyze_competitor():
    """Analyze competitor website using BrowserUse"""
    data = request.json
    competitor_url = data.get('competitor_url')
    
    if not competitor_url:
        return jsonify({"status": "error", "message": "No competitor_url provided"}), 400
    
    # Run BrowserUse asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(browser_automation.analyze_competitor_website(competitor_url))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/browseruse/google_business', methods=['POST'])
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
# n8n Workflow Endpoints
#======================

@app.route('/api/n8n/create_workflow/seo_audit', methods=['POST'])
def create_seo_audit_workflow():
    """Create an SEO audit workflow in n8n"""
    data = request.json
    name = data.get('name', f"SEO Audit - {datetime.now().strftime('%Y-%m-%d')}")
    target_url = data.get('target_url', "https://arisecares.com")
    email_recipient = data.get('email_recipient', "marketing@arisecares.com")
    schedule = data.get('schedule', {
        "mode": "everyWeek",
        "weekday": 1,  # Monday
        "hour": 9,
        "minute": 0
    })
    
    # Initialize the n8n workflow manager if needed
    global n8n_workflow_manager
    if not n8n_workflow_manager:
        n8n_workflow_manager = N8nWorkflowManager(N8N_URL)
        
    # Run the workflow manager asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(n8n_workflow_manager.create_weekly_seo_audit_workflow(
        target_url=target_url,
        email_recipient=email_recipient
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/n8n/create_workflow/content_strategy', methods=['POST'])
def create_content_strategy_workflow():
    """Create a content strategy workflow in n8n"""
    data = request.json
    name = data.get('name', f"Content Strategy - {datetime.now().strftime('%Y-%m-%d')}")
    target_url = data.get('target_url', "https://arisecares.com")
    competitors = data.get('competitors', [
        "https://homeinstead.com",
        "https://comfortkeepers.com",
        "https://brightstarcare.com"
    ])
    email_recipient = data.get('email_recipient', "content@arisecares.com")
    
    # Initialize the n8n workflow manager if needed
    global n8n_workflow_manager
    if not n8n_workflow_manager:
        n8n_workflow_manager = N8nWorkflowManager(N8N_URL)
        
    # Run the workflow manager asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(n8n_workflow_manager.create_monthly_content_strategy_workflow(
        target_url=target_url,
        competitors=competitors,
        email_recipient=email_recipient
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/n8n/create_workflow/caregiver_metrics', methods=['POST'])
def create_caregiver_metrics_workflow():
    """Create a caregiver metrics workflow in n8n"""
    data = request.json
    name = data.get('name', f"Caregiver Metrics - {datetime.now().strftime('%Y-%m-%d')}")
    caregiver_ids = data.get('caregiver_ids')
    metrics = data.get('metrics')
    
    # Initialize the n8n workflow manager if needed
    global n8n_workflow_manager
    if not n8n_workflow_manager:
        n8n_workflow_manager = N8nWorkflowManager(N8N_URL)
        
    # Run the workflow manager asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(n8n_workflow_manager.create_daily_caregiver_metrics_workflow(
        caregiver_ids=caregiver_ids,
        metrics=metrics
    ))
    loop.close()
    
    return jsonify({"status": "success", "result": result})

@app.route('/api/n8n/create_all_workflows', methods=['POST'])
def create_all_workflows():
    """Create all standard workflows in n8n"""
    # Initialize the n8n workflow manager if needed
    global n8n_workflow_manager
    if not n8n_workflow_manager:
        n8n_workflow_manager = N8nWorkflowManager(N8N_URL)
        
    # Run the workflow manager asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(n8n_workflow_manager.create_all_workflows())
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
            "n8n_workflow_manager": n8n_workflow_manager is not None,
            "n8n_connector": True
        },
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Starting n8n connector for AG2 and BrowserUse integration...")
    app.run(debug=True, host='0.0.0.0', port=5001)
