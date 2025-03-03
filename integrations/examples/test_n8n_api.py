#!/usr/bin/env python3
"""
Test script for direct n8n API communication

This script demonstrates how to interact with the n8n API directly,
without going through the AG2 connector.
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Add the parent directory to the path so we can import from integrations
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Configuration
N8N_API_URL = "http://localhost:5678"
N8N_API_KEY = os.getenv('N8N_API_KEY', '')

def get_n8n_headers():
    """Get headers for n8n API requests"""
    headers = {
        'Content-Type': 'application/json'
    }
    
    # Add API key only if it's available and not empty
    if N8N_API_KEY:
        headers['X-N8N-API-KEY'] = N8N_API_KEY
    
    return headers

def list_workflows():
    """List all workflows in n8n"""
    print("\n=== Listing n8n Workflows ===")
    
    try:
        response = requests.get(f"{N8N_API_URL}/api/v1/workflows", headers=get_n8n_headers())
        
        if response.status_code == 401:
            print("Authentication required. Your n8n instance has authentication enabled.")
            print("To disable authentication, set N8N_AUTH_ENABLED=false in your n8n environment.")
            return None
            
        response.raise_for_status()
        workflows = response.json()
        
        if 'data' in workflows and workflows['data']:
            print(f"Found {len(workflows['data'])} workflows:")
            for workflow in workflows['data']:
                print(f"  - {workflow['name']} (ID: {workflow['id']})")
            return workflows['data']
        else:
            print("No workflows found.")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Error listing workflows: {str(e)}")
        return None

def create_workflow(name, nodes=None, connections=None):
    """Create a new workflow in n8n"""
    print(f"\n=== Creating Workflow: {name} ===")
    
    if nodes is None:
        # Create a simple workflow with just a Start node
        nodes = [
            {
                "parameters": {},
                "name": "Start",
                "type": "n8n-nodes-base.start",
                "typeVersion": 1,
                "position": [100, 300]
            }
        ]
    
    if connections is None:
        connections = {}
    
    payload = {
        "name": name,
        "nodes": nodes,
        "connections": connections,
        "active": False,
        "settings": {},
        "tags": [],
        "pinData": {}
    }
    
    try:
        response = requests.post(
            f"{N8N_API_URL}/api/v1/workflows",
            json=payload,
            headers=get_n8n_headers()
        )
        
        if response.status_code == 401:
            print("Authentication required. Your n8n instance has authentication enabled.")
            print("To disable authentication, set N8N_AUTH_ENABLED=false in your n8n environment.")
            return None
            
        response.raise_for_status()
        workflow = response.json()
        print(f"Workflow created successfully with ID: {workflow['id']}")
        return workflow
    except requests.exceptions.RequestException as e:
        print(f"Error creating workflow: {str(e)}")
        return None

def trigger_workflow(workflow_id, payload=None):
    """Trigger a workflow by ID"""
    print(f"\n=== Triggering Workflow: {workflow_id} ===")
    
    if payload is None:
        payload = {"data": {"test": True}}
    
    try:
        response = requests.post(
            f"{N8N_API_URL}/api/v1/workflows/{workflow_id}/execute",
            json=payload,
            headers=get_n8n_headers()
        )
        
        if response.status_code == 401:
            print("Authentication required. Your n8n instance has authentication enabled.")
            print("To disable authentication, set N8N_AUTH_ENABLED=false in your n8n environment.")
            return None
            
        response.raise_for_status()
        result = response.json()
        print(f"Workflow triggered successfully. Result: {json.dumps(result, indent=2)}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error triggering workflow: {str(e)}")
        return None

def main():
    """Main function"""
    print("Starting n8n API tests...")
    
    # List existing workflows
    workflows = list_workflows()
    
    # Create a new test workflow
    workflow = create_workflow("Test Workflow from API")
    
    # Trigger the workflow if it was created successfully
    if workflow and 'id' in workflow:
        trigger_workflow(workflow['id'])
    
    print("\nTests completed!")

if __name__ == "__main__":
    main()
