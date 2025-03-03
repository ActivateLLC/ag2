#!/usr/bin/env python3
"""
Example: Automating Caregiver Metrics with AG2 and n8n

This example demonstrates how to use the AG2 connector to:
1. Create a caregiver metrics workflow in n8n
2. Trigger the workflow to collect and analyze caregiver performance data
3. Process the results using AG2 agents

Usage:
    python automate_caregiver_metrics.py
"""

import os
import sys
import json
import requests
import asyncio
from datetime import datetime
from typing import Dict, List, Any
import logging

# Add the parent directory to the path so we can import from integrations
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
AG2_CONNECTOR_URL = "http://localhost:5003"
N8N_API_URL = "http://localhost:5678"

# Sample caregiver data
CAREGIVERS = [
    {"id": "CG001", "name": "John Smith", "role": "Home Health Aide"},
    {"id": "CG002", "name": "Maria Garcia", "role": "Registered Nurse"},
    {"id": "CG003", "name": "David Johnson", "role": "Personal Care Assistant"}
]

# Sample metrics to collect
METRICS = [
    "client_satisfaction",
    "visit_timeliness",
    "documentation_quality",
    "medication_management",
    "communication_skills"
]

def create_caregiver_metrics_workflow() -> str:
    """Create a caregiver metrics workflow in n8n"""
    logger.info("Creating caregiver metrics workflow...")
    
    url = f"{AG2_CONNECTOR_URL}/api/n8n/create_workflow/caregiver_metrics"
    payload = {
        "name": f"Daily Caregiver Metrics - {datetime.now().strftime('%Y-%m-%d')}",
        "caregiver_ids": [cg["id"] for cg in CAREGIVERS],
        "metrics": METRICS
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        
        workflow_id = result.get('result', {}).get('workflow_id')
        if workflow_id:
            logger.info(f"Successfully created workflow with ID: {workflow_id}")
            return workflow_id
        else:
            logger.error("Failed to get workflow ID from response")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Error creating workflow: {str(e)}")
        return None

def trigger_workflow(workflow_id: str) -> Dict[str, Any]:
    """Trigger the caregiver metrics workflow"""
    logger.info(f"Triggering workflow {workflow_id}...")
    
    url = f"{AG2_CONNECTOR_URL}/api/n8n/trigger_workflow/{workflow_id}"
    payload = {
        "data": {
            "run_date": datetime.now().strftime("%Y-%m-%d"),
            "caregivers": CAREGIVERS,
            "metrics": METRICS
        }
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        logger.info("Successfully triggered workflow")
        return result.get('result', {})
    except requests.exceptions.RequestException as e:
        logger.error(f"Error triggering workflow: {str(e)}")
        return {}

def analyze_caregiver_data(caregiver_id: str) -> Dict[str, Any]:
    """Analyze caregiver data using AG2 agents"""
    logger.info(f"Analyzing data for caregiver {caregiver_id}...")
    
    url = f"{AG2_CONNECTOR_URL}/api/ag2/caregiver_analysis"
    payload = {
        "caregiver_id": caregiver_id,
        "metrics": METRICS
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        logger.info(f"Successfully analyzed data for caregiver {caregiver_id}")
        return result.get('result', {})
    except requests.exceptions.RequestException as e:
        logger.error(f"Error analyzing caregiver data: {str(e)}")
        return {}

def process_workflow_results(workflow_results: Dict[str, Any]) -> None:
    """Process the results from the workflow execution"""
    logger.info("Processing workflow results...")
    
    # In a real implementation, this would process the actual workflow results
    # For this example, we'll simulate by analyzing each caregiver separately
    
    all_results = {}
    for caregiver in CAREGIVERS:
        caregiver_id = caregiver["id"]
        analysis = analyze_caregiver_data(caregiver_id)
        all_results[caregiver_id] = analysis
    
    # Generate a summary report
    generate_summary_report(all_results)

def generate_summary_report(results: Dict[str, Dict[str, Any]]) -> None:
    """Generate a summary report of caregiver metrics"""
    logger.info("Generating summary report...")
    
    report = {
        "report_date": datetime.now().isoformat(),
        "total_caregivers": len(results),
        "average_scores": {},
        "top_performers": [],
        "improvement_needed": []
    }
    
    # Calculate average scores (simulated)
    for metric in METRICS:
        report["average_scores"][metric] = round(70 + 15 * (0.5 - (hash(metric) % 100) / 100), 1)
    
    # Identify top performers and those needing improvement (simulated)
    for caregiver_id, analysis in results.items():
        performance = analysis.get("performance_summary", {})
        overall_score = performance.get("overall_score", 0)
        
        caregiver_name = next((cg["name"] for cg in CAREGIVERS if cg["id"] == caregiver_id), "Unknown")
        
        if overall_score > 85:
            report["top_performers"].append({
                "id": caregiver_id,
                "name": caregiver_name,
                "score": overall_score,
                "strengths": performance.get("strengths", [])
            })
        elif overall_score < 80:
            report["improvement_needed"].append({
                "id": caregiver_id,
                "name": caregiver_name,
                "score": overall_score,
                "areas_for_improvement": performance.get("areas_for_improvement", [])
            })
    
    # Save the report to a file
    report_path = os.path.join(os.path.dirname(__file__), "caregiver_metrics_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    
    logger.info(f"Summary report saved to {report_path}")
    
    # Print a summary to the console
    print("\n===== CAREGIVER METRICS SUMMARY =====")
    print(f"Report Date: {datetime.now().strftime('%Y-%m-%d')}")
    print(f"Total Caregivers: {len(results)}")
    print("\nAverage Scores:")
    for metric, score in report["average_scores"].items():
        print(f"  - {metric.replace('_', ' ').title()}: {score}")
    
    print("\nTop Performers:")
    for performer in report["top_performers"]:
        print(f"  - {performer['name']} (ID: {performer['id']}) - Score: {performer['score']}")
    
    print("\nNeeds Improvement:")
    for performer in report["improvement_needed"]:
        print(f"  - {performer['name']} (ID: {performer['id']}) - Score: {performer['score']}")
    
    print("\nDetailed report saved to:", report_path)

def main():
    """Main function to run the example"""
    logger.info("Starting caregiver metrics automation example...")
    
    # Step 1: Create the workflow
    workflow_id = create_caregiver_metrics_workflow()
    if not workflow_id:
        logger.error("Failed to create workflow. Exiting.")
        return
    
    # Step 2: Trigger the workflow
    workflow_results = trigger_workflow(workflow_id)
    if not workflow_results:
        logger.error("Failed to get workflow results. Exiting.")
        return
    
    # Step 3: Process the results
    process_workflow_results(workflow_results)
    
    logger.info("Caregiver metrics automation example completed successfully!")

if __name__ == "__main__":
    main()
