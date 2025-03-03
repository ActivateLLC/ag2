#!/usr/bin/env python3
"""
AG2 Connector Workflow Demo

This script demonstrates how to create and trigger workflows through the AG2 connector
for the Arise Cares Analytics Platform.

Usage:
    python ag2_workflow_demo.py
"""

import os
import sys
import json
import requests
import time
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
AG2_CONNECTOR_URL = "http://localhost:5003"  # AG2 connector API URL
N8N_URL = "http://localhost:5678"  # Direct n8n API URL
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MWQ4YWNmNS0xN2Q0LTQ3OGYtYjAzOC1kOWQwY2Q1OTE5YzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQxMDM5MjM5fQ.DW5iRPMotxBjVa5AGBl2IoQQ_QUKUrRrGikEajD8-PY"
WORKFLOW_TYPE = "caregiver_metrics"  # Options: seo_audit, content_strategy, caregiver_metrics

def check_ag2_connector():
    """Check if the AG2 connector is running"""
    try:
        response = requests.get(f"{AG2_CONNECTOR_URL}/api/health")
        if response.status_code == 200:
            logger.info("AG2 connector is running")
            return True
        else:
            logger.error(f"AG2 connector returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        logger.error(f"Could not connect to AG2 connector at {AG2_CONNECTOR_URL}")
        return False

def check_n8n_instance():
    """Check if n8n is running and accessible with the API key"""
    try:
        headers = {
            "X-N8N-API-KEY": N8N_API_KEY,
            "Content-Type": "application/json"
        }
        response = requests.get(f"{N8N_URL}/api/v1/workflows", headers=headers)
        
        if response.status_code == 200:
            logger.info("n8n is running and API key is valid")
            return True
        else:
            logger.error(f"n8n API returned status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        logger.error(f"Could not connect to n8n at {N8N_URL}")
        return False

def create_workflow():
    """Create a workflow using the AG2 connector API"""
    logger.info(f"Creating {WORKFLOW_TYPE} workflow...")
    
    url = f"{AG2_CONNECTOR_URL}/api/n8n/create_workflow/{WORKFLOW_TYPE}"
    
    # Prepare payload based on workflow type
    if WORKFLOW_TYPE == "seo_audit":
        payload = {
            "name": f"SEO Audit - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "target_url": "https://arisecares.com",
            "keywords": ["home care", "senior care", "caregiver services"]
        }
    elif WORKFLOW_TYPE == "content_strategy":
        payload = {
            "name": f"Content Strategy - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "topics": ["senior care", "home health", "caregiver tips"],
            "content_types": ["blog", "social media", "email"]
        }
    elif WORKFLOW_TYPE == "caregiver_metrics":
        payload = {
            "name": f"Caregiver Metrics - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "caregiver_ids": ["CG001", "CG002", "CG003"],
            "metrics": ["performance", "client_satisfaction", "documentation_quality"]
        }
    else:
        logger.error(f"Unknown workflow type: {WORKFLOW_TYPE}")
        return None
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        
        workflow_id = None
        if 'result' in result and 'workflow' in result['result']:
            workflow_id = result['result']['workflow']['id']
        elif 'result' in result and 'workflow_id' in result['result']:
            workflow_id = result['result']['workflow_id']
            
        if workflow_id:
            logger.info(f"Successfully created workflow with ID: {workflow_id}")
            return workflow_id
        else:
            logger.warning("No workflow ID returned. Check the response:")
            logger.warning(json.dumps(result, indent=2))
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error creating workflow: {str(e)}")
        return None

def activate_workflow(workflow_id):
    """Activate a workflow using the n8n API directly"""
    logger.info(f"Activating workflow {workflow_id}...")
    
    url = f"{N8N_URL}/api/v1/workflows/{workflow_id}/activate"
    
    headers = {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers)
        
        if response.status_code in [200, 201]:
            logger.info("Successfully activated workflow")
            return True
        else:
            logger.error(f"Failed to activate workflow. Status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error activating workflow: {str(e)}")
        return False

def trigger_workflow(workflow_id):
    """Trigger a workflow using the AG2 connector API"""
    logger.info(f"Triggering workflow {workflow_id}...")
    
    url = f"{AG2_CONNECTOR_URL}/api/n8n/trigger_workflow/{workflow_id}"
    
    # Prepare payload based on workflow type
    if WORKFLOW_TYPE == "seo_audit":
        payload = {
            "data": {
                "url": "https://arisecares.com",
                "depth": 2,
                "check_mobile": True
            }
        }
    elif WORKFLOW_TYPE == "content_strategy":
        payload = {
            "data": {
                "target_audience": "seniors and families",
                "content_goal": "engagement and lead generation",
                "competitor_urls": ["https://example.com/competitor1", "https://example.com/competitor2"]
            }
        }
    elif WORKFLOW_TYPE == "caregiver_metrics":
        payload = {
            "data": {
                "date_range": {
                    "start": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
                    "end": datetime.now().strftime("%Y-%m-%d")
                },
                "include_charts": True
            }
        }
    else:
        payload = {"data": {"test": True}}
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        logger.info("Successfully triggered workflow")
        return result.get('result', {})
    except requests.exceptions.RequestException as e:
        logger.error(f"Error triggering workflow: {str(e)}")
        return {}

def trigger_workflow_direct(workflow_id):
    """Trigger a workflow using the n8n API directly"""
    logger.info(f"Triggering workflow {workflow_id} directly via n8n API...")
    
    url = f"{N8N_URL}/api/v1/workflows/{workflow_id}/execute"
    
    headers = {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json"
    }
    
    # Prepare payload based on workflow type
    if WORKFLOW_TYPE == "seo_audit":
        payload = {
            "data": {
                "url": "https://arisecares.com",
                "depth": 2,
                "check_mobile": True
            }
        }
    elif WORKFLOW_TYPE == "content_strategy":
        payload = {
            "data": {
                "target_audience": "seniors and families",
                "content_goal": "engagement and lead generation",
                "competitor_urls": ["https://example.com/competitor1", "https://example.com/competitor2"]
            }
        }
    elif WORKFLOW_TYPE == "caregiver_metrics":
        payload = {
            "data": {
                "date_range": {
                    "start": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
                    "end": datetime.now().strftime("%Y-%m-%d")
                },
                "include_charts": True
            }
        }
    else:
        payload = {}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code in [200, 201]:
            result = response.json()
            logger.info("Successfully triggered workflow directly")
            return result
        else:
            logger.error(f"Failed to trigger workflow. Status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return {}
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error triggering workflow: {str(e)}")
        return {}

def main():
    """Main function to run the demo"""
    logger.info("Starting AG2 connector workflow demo...")
    
    # Check if AG2 connector is running
    if not check_ag2_connector():
        logger.error("AG2 connector is not running. Please start it first.")
        logger.info("You can start it by running: cd /Users/activate/Dev/ag2/integrations && ./start_services.sh")
        return
    
    # Check if n8n is accessible with the API key
    if not check_n8n_instance():
        logger.error("Could not connect to n8n with the provided API key.")
        return
    
    # Create the workflow
    workflow_id = create_workflow()
    if not workflow_id:
        logger.error("Failed to create workflow. Exiting.")
        return
    
    logger.info(f"Workflow created with ID: {workflow_id}")
    
    # Activate the workflow
    if not activate_workflow(workflow_id):
        logger.warning("Failed to activate workflow. Will try to trigger it anyway.")
    
    # Wait a bit before triggering
    logger.info("Waiting 2 seconds before triggering the workflow...")
    time.sleep(2)
    
    # Try to trigger via AG2 connector first
    logger.info("Attempting to trigger workflow via AG2 connector...")
    result = trigger_workflow(workflow_id)
    
    # If that fails, try direct API
    if not result or 'error' in result:
        logger.warning("Triggering via AG2 connector failed. Trying direct n8n API...")
        result = trigger_workflow_direct(workflow_id)
    
    if result:
        logger.info(f"Workflow execution result: {json.dumps(result, indent=2)}")
    else:
        logger.error("Failed to get workflow execution result.")
    
    logger.info("AG2 connector workflow demo completed!")
    logger.info("You can view the workflow in your n8n instance at: http://localhost:5678")

if __name__ == "__main__":
    main()
