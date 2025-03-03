#!/usr/bin/env python3
"""
Test script for n8n workflow creation via the AG2 connector
"""

import os
import sys
import json
import requests
from typing import Dict, Any
from dotenv import load_dotenv

# Add the parent directory to the path so we can import from integrations
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Configuration
AG2_API_URL = os.getenv('AG2_API_URL', 'http://localhost:5003')
AG2_CONNECTOR_URL = "http://localhost:5003"
N8N_API_URL = "http://localhost:5678"  # For direct API tests
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MWQ4YWNmNS0xN2Q0LTQ3OGYtYjAzOC1kOWQwY2Q1OTE5YzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQxMDM5MjM5fQ.DW5iRPMotxBjVa5AGBl2IoQQ_QUKUrRrGikEajD8-PY"

def get_n8n_headers():
    """Get headers for n8n API requests"""
    headers = {
        'Content-Type': 'application/json'
    }
    
    # Add API key only if it's available and not empty
    if N8N_API_KEY:
        headers['X-N8N-API-KEY'] = N8N_API_KEY
    
    return headers

def test_n8n_connection():
    """Test direct connection to n8n API"""
    print("\n=== Testing Direct n8n API Connection ===")
    
    try:
        response = requests.get(f"{N8N_API_URL}/api/v1/workflows", headers=get_n8n_headers())
        
        if response.status_code == 401:
            print("Authentication required. Your n8n instance has authentication enabled.")
            print("To disable authentication, set N8N_AUTH_ENABLED=false in your n8n environment.")
            print("Alternatively, you can use the AG2 connector API which handles authentication for you.")
            return False
            
        response.raise_for_status()
        workflows = response.json()
        
        if workflows and 'data' in workflows and len(workflows['data']) > 0:
            print(f"Successfully connected to n8n API. Found {len(workflows['data'])} workflows.")
            return True
        else:
            print("Connected to n8n API but no workflows found.")
            return True
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to n8n API: {str(e)}")
        return False

def test_health_check():
    """Test health check endpoint"""
    print("\n=== Testing Health Check ===")
    
    try:
        response = requests.get(f"{AG2_API_URL}/api/health")
        response.raise_for_status()
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if result.get('status') == 'healthy':
            print("Health check passed, proceeding with workflow creation tests...")
            return True
        else:
            print("Health check failed. Service may not be healthy.")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Error checking health: {str(e)}")
        return False

def test_create_seo_audit_workflow():
    """Test creating an SEO audit workflow"""
    print("\n=== Testing SEO Audit Workflow Creation ===")
    
    payload = {
        "target_url": "https://arisecares.com"
    }
    
    try:
        response = requests.post(
            f"{AG2_API_URL}/api/n8n/create_workflow/seo_audit",
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error creating SEO audit workflow: {str(e)}")
        return None

def test_create_content_strategy_workflow():
    """Test creating a content strategy workflow"""
    print("\n=== Testing Content Strategy Workflow Creation ===")
    
    payload = {
        "target_url": "https://arisecares.com",
        "competitors": ["https://homeinstead.com", "https://comfortkeepers.com"]
    }
    
    try:
        response = requests.post(
            f"{AG2_API_URL}/api/n8n/create_workflow/content_strategy",
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error creating content strategy workflow: {str(e)}")
        return None

def test_create_caregiver_metrics_workflow():
    """Test creating a caregiver metrics workflow"""
    print("\n=== Testing Caregiver Metrics Workflow Creation ===")
    
    payload = {
        "caregiver_ids": ["CG001", "CG002", "CG003"],
        "metrics": ["performance", "client_satisfaction", "training_needs"]
    }
    
    try:
        response = requests.post(
            f"{AG2_API_URL}/api/n8n/create_workflow/caregiver_metrics",
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error creating caregiver metrics workflow: {str(e)}")
        return None

def test_create_all_workflows():
    """Test creating all standard workflows"""
    print("\n=== Testing Create All Workflows ===")
    
    payload = {
        "target_url": "https://arisecares.com",
        "competitors": ["https://homeinstead.com", "https://comfortkeepers.com"],
        "caregiver_ids": ["CG001", "CG002", "CG003"],
        "metrics": ["performance", "client_satisfaction", "training_needs"]
    }
    
    try:
        response = requests.post(
            f"{AG2_API_URL}/api/n8n/create_all_workflows",
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error creating all workflows: {str(e)}")
        return None

def test_trigger_workflow(workflow_id: str):
    """Test triggering a workflow"""
    print(f"\n=== Testing Trigger Workflow {workflow_id} ===")
    
    payload = {
        "data": {
            "test": True,
            "timestamp": "2025-03-03T12:00:00Z"
        }
    }
    
    try:
        response = requests.post(
            f"{AG2_API_URL}/api/n8n/trigger_workflow/{workflow_id}",
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error triggering workflow: {str(e)}")
        return None

def main():
    """Main function"""
    print("Starting n8n workflow creation tests...")
    print("Testing direct connection to n8n...")
    
    # Test direct connection to n8n
    n8n_connected = test_n8n_connection()
    
    # Test health check
    if not test_health_check():
        print("Health check failed. Exiting.")
        return
    
    # Test workflow creation
    seo_result = test_create_seo_audit_workflow()
    content_result = test_create_content_strategy_workflow()
    caregiver_result = test_create_caregiver_metrics_workflow()
    
    # Test triggering a workflow if we created one
    if seo_result and 'result' in seo_result and 'workflow' in seo_result['result']:
        workflow_id = seo_result['result']['workflow']['id']
        test_trigger_workflow(workflow_id)
    
    print("\nTests completed!")

if __name__ == "__main__":
    main()
