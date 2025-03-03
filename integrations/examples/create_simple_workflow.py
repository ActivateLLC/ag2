#!/usr/bin/env python3
"""
Example: Create a Simple Workflow with n8n API

This example demonstrates how to create a simple workflow using the n8n API
with proper authentication handling.

Usage:
    python create_simple_workflow.py
"""

import os
import sys
import json
import requests
import time
from datetime import datetime
import logging
import subprocess
import webbrowser

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
N8N_URL = "http://localhost:5678"

def check_n8n_running():
    """Check if n8n is running on the specified port"""
    try:
        response = requests.get(f"{N8N_URL}/healthz")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        return False

def create_simple_workflow():
    """Create a simple workflow in n8n using the API"""
    logger.info("Creating a simple workflow...")
    
    # Generate a unique workflow name with timestamp
    workflow_name = f"Simple Test Workflow - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    
    # Create a simple workflow with a webhook trigger and HTTP request
    workflow = {
        "name": workflow_name,
        "nodes": [
            {
                "parameters": {
                    "path": "test-trigger",
                    "responseMode": "onReceived",
                    "options": {}
                },
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [250, 300],
                "webhookId": "test-trigger"
            },
            {
                "parameters": {
                    "method": "POST",
                    "url": "https://httpbin.org/post",
                    "sendBody": True,
                    "bodyParameters": {
                        "parameters": [
                            {
                                "name": "message",
                                "value": "Hello from n8n!"
                            },
                            {
                                "name": "timestamp",
                                "value": "={{ $now }}"
                            }
                        ]
                    },
                    "options": {}
                },
                "name": "HTTP Request",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 1,
                "position": [500, 300]
            }
        ],
        "connections": {
            "Webhook": {
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
        "active": True,
        "settings": {},
        "tags": [],
        "pinData": {}
    }
    
    try:
        # Try to create the workflow
        response = requests.post(
            f"{N8N_URL}/api/v1/workflows",
            json=workflow,
            headers={"Content-Type": "application/json"}
        )
        
        # Check if we got a 401 (authentication required)
        if response.status_code == 401:
            logger.warning("Authentication required. Opening browser to create workflow manually.")
            
            # Open the n8n UI in a browser
            open_n8n_ui_with_instructions(workflow_name)
            
            # Return a simplified workflow representation
            return {
                "name": workflow_name,
                "webhook_url": f"{N8N_URL}/webhook/test-trigger",
                "manual_creation": True,
                "instructions": "Please create the workflow manually in the n8n UI"
            }
        
        # If successful, return the response
        if response.status_code in [200, 201]:
            result = response.json()
            logger.info(f"Successfully created workflow with ID: {result.get('id')}")
            return result
        else:
            logger.error(f"Failed to create workflow. Status code: {response.status_code}, Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error creating workflow: {str(e)}")
        return None

def open_n8n_ui_with_instructions(workflow_name):
    """Open the n8n UI in a browser with instructions for manual workflow creation"""
    logger.info("Opening n8n UI in browser...")
    
    # Open the n8n UI
    webbrowser.open(f"{N8N_URL}")
    
    # Print instructions
    print("\n" + "="*80)
    print(f"MANUAL WORKFLOW CREATION INSTRUCTIONS")
    print("="*80)
    print(f"1. Create a new workflow named: {workflow_name}")
    print("2. Add a Webhook node with the following settings:")
    print("   - Path: test-trigger")
    print("   - Response Mode: Immediately")
    print("3. Add an HTTP Request node with the following settings:")
    print("   - Method: POST")
    print("   - URL: https://httpbin.org/post")
    print("   - Body Parameters:")
    print("     - message: Hello from n8n!")
    print("     - timestamp: {{ $now }}")
    print("4. Connect the Webhook node to the HTTP Request node")
    print("5. Save and activate the workflow")
    print("="*80 + "\n")

def trigger_workflow_webhook(webhook_path):
    """Trigger a workflow via webhook"""
    logger.info(f"Triggering workflow via webhook: {webhook_path}")
    
    url = f"{N8N_URL}/webhook/{webhook_path}"
    payload = {
        "message": "Hello from Python!",
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        response = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code in [200, 201]:
            logger.info("Successfully triggered workflow")
            return response.json()
        else:
            logger.error(f"Failed to trigger workflow. Status code: {response.status_code}, Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error triggering workflow: {str(e)}")
        return None

def main():
    """Main function to run the example"""
    logger.info("Starting simple workflow creation example...")
    
    # Check if n8n is running
    if not check_n8n_running():
        logger.error("n8n is not running at http://localhost:5678. Please start n8n first.")
        return
    
    # Create the workflow
    workflow = create_simple_workflow()
    if not workflow:
        logger.error("Failed to create workflow. Exiting.")
        return
    
    logger.info(f"Workflow creation response: {json.dumps(workflow, indent=2)}")
    
    # If manual creation was required, wait for user to confirm
    if workflow.get("manual_creation"):
        input("\nPress Enter after you've created the workflow in the n8n UI...")
    
    # Get the webhook path
    webhook_path = "test-trigger"
    
    # Trigger the workflow
    logger.info("Waiting 2 seconds before triggering the workflow...")
    time.sleep(2)
    
    result = trigger_workflow_webhook(webhook_path)
    if result:
        logger.info(f"Workflow execution result: {json.dumps(result, indent=2)}")
    else:
        logger.error("Failed to get workflow execution result.")
    
    logger.info("Simple workflow example completed!")

if __name__ == "__main__":
    main()
