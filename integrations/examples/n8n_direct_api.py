#!/usr/bin/env python3
"""
n8n Direct API Integration

This script demonstrates how to directly interact with the n8n API
to create and trigger workflows without using the AG2 connector.

Usage:
    python n8n_direct_api.py
"""

import os
import sys
import json
import requests
import time
from datetime import datetime, timedelta
import logging
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
N8N_URL = "http://localhost:5678"  # n8n API URL
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MWQ4YWNmNS0xN2Q0LTQ3OGYtYjAzOC1kOWQwY2Q1OTE5YzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQxMDM5MjM5fQ.DW5iRPMotxBjVa5AGBl2IoQQ_QUKUrRrGikEajD8-PY"
WORKFLOW_TYPE = "simple_demo"  # The type of workflow to create

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

def list_workflows():
    """List all workflows in the n8n instance"""
    headers = {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{N8N_URL}/api/v1/workflows", headers=headers)
        
        if response.status_code == 200:
            workflows = response.json()
            if isinstance(workflows, dict) and 'data' in workflows:
                workflows = workflows['data']
                
            logger.info(f"Found {len(workflows)} workflows")
            for workflow in workflows:
                logger.info(f"ID: {workflow.get('id')}, Name: {workflow.get('name')}, Active: {workflow.get('active', False)}")
            return workflows
        else:
            logger.error(f"Failed to list workflows. Status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error listing workflows: {str(e)}")
        return []

def create_simple_workflow():
    """Create a simple workflow with core nodes only"""
    # Create workflow data
    workflow_data = {
        "name": f"Simple Demo Workflow - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "nodes": [
            {
                "id": f"node_{uuid.uuid4().hex[:8]}",
                "name": "Manual Trigger",
                "type": "n8n-nodes-base.manualTrigger",
                "typeVersion": 1,
                "position": [250, 300],
                "parameters": {}
            },
            {
                "id": f"node_{uuid.uuid4().hex[:8]}",
                "name": "Set",
                "type": "n8n-nodes-base.set",
                "typeVersion": 2,
                "position": [480, 300],
                "parameters": {
                    "keepOnlySet": True,
                    "values": {
                        "string": [
                            {
                                "name": "message",
                                "value": "Hello from n8n workflow!"
                            },
                            {
                                "name": "timestamp",
                                "value": "={{ $now }}"
                            }
                        ]
                    }
                }
            },
            {
                "id": f"node_{uuid.uuid4().hex[:8]}",
                "name": "Function",
                "type": "n8n-nodes-base.function",
                "typeVersion": 1,
                "position": [700, 300],
                "parameters": {
                    "functionCode": "// Log the incoming data\nconsole.log('Received data:', $input.all());\n\n// Process the data\nconst items = $input.all();\nfor (const item of items) {\n  item.json.processed = true;\n  item.json.uppercaseMessage = item.json.message.toUpperCase();\n}\n\n// Return the processed data\nreturn items;"
                }
            }
        ],
        "connections": {
            "Manual Trigger": {
                "main": [
                    [
                        {
                            "node": "Set",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Set": {
                "main": [
                    [
                        {
                            "node": "Function",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "settings": {}
    }
    
    # Create the workflow
    headers = {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(f"{N8N_URL}/api/v1/workflows", headers=headers, json=workflow_data)
        
        if response.status_code == 200:
            workflow = response.json()
            workflow_id = workflow.get('id')
            logger.info(f"Successfully created workflow with ID: {workflow_id}")
            return workflow_id
        else:
            logger.error(f"Failed to create workflow. Status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Error creating workflow: {str(e)}")
        return None

def activate_workflow(workflow_id):
    """Activate a workflow using the n8n API"""
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
    """Trigger a workflow using the n8n API"""
    logger.info(f"Triggering workflow {workflow_id}...")
    
    url = f"{N8N_URL}/api/v1/workflows/{workflow_id}/execute"
    
    headers = {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers)
        
        if response.status_code in [200, 201]:
            result = response.json()
            logger.info("Successfully triggered workflow")
            return result.get('id')
        else:
            logger.error(f"Failed to trigger workflow. Status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error triggering workflow: {str(e)}")
        return None

def get_execution_result(execution_id):
    """Get the result of a workflow execution"""
    logger.info(f"Getting result of workflow execution {execution_id}...")
    
    url = f"{N8N_URL}/api/v1/executions/{execution_id}/result"
    
    headers = {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            logger.info(f"Workflow execution result: {json.dumps(result, indent=2)}")
        else:
            logger.error(f"Failed to get workflow execution result. Status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Error getting workflow execution result: {str(e)}")

def main():
    """Main function to run the demo"""
    logger.info("Starting n8n direct API demo...")
    
    # Check if n8n is running
    if not check_n8n_instance():
        logger.error("n8n is not running or API key is invalid. Exiting.")
        return
    
    # List existing workflows
    list_workflows()
    
    # Create a simple workflow
    workflow_id = create_simple_workflow()
    
    if workflow_id:
        logger.info(f"Workflow created with ID: {workflow_id}")
        
        # Activate the workflow
        if activate_workflow(workflow_id):
            logger.info(f"Workflow {workflow_id} activated successfully")
        else:
            logger.warning("Failed to activate workflow. Will try to trigger it anyway.")
        
        # Wait a bit before triggering
        logger.info("Waiting 2 seconds before triggering the workflow...")
        time.sleep(2)
        
        # Trigger the workflow
        execution_id = trigger_workflow(workflow_id)
        
        if execution_id:
            logger.info(f"Workflow triggered with execution ID: {execution_id}")
            
            # Wait for the execution to complete
            time.sleep(2)
            
            # Get the execution result
            get_execution_result(execution_id)
        else:
            logger.error("Failed to get workflow execution result.")
    else:
        logger.error("Failed to create workflow. Exiting.")
    
    logger.info("n8n direct API demo completed!")
    logger.info(f"You can view the workflow in your n8n instance at: {N8N_URL}")

if __name__ == "__main__":
    main()
