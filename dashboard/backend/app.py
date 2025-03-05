"""
Dashboard API for Arise Cares Analytics Platform

This module provides a Flask API for the dashboard UI, connecting to the
existing n8n integration for workflow automation and data processing.
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
N8N_URL = os.getenv("N8N_URL", "http://localhost:5678")
N8N_API_KEY = os.getenv("N8N_API_KEY", "")
AG2_CONNECTOR_URL = os.getenv("AG2_CONNECTOR_URL", "http://localhost:5003")

# Import sample data
from data import sample_data

@app.route('/api/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    """Get summary metrics for the dashboard"""
    try:
        # In production, fetch this data from your database or n8n workflows
        summary = {
            "total_caregivers": 42,
            "average_satisfaction": 92,
            "compliance_rate": 87,
            "alerts": 3,
            "last_updated": datetime.now().isoformat()
        }
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/metrics/caregiver/<caregiver_id>', methods=['GET'])
def get_caregiver_metrics(caregiver_id):
    """Get metrics for a specific caregiver"""
    try:
        # In production, fetch this from your database or through n8n
        if caregiver_id in sample_data["caregivers"]:
            return jsonify(sample_data["caregivers"][caregiver_id])
        else:
            return jsonify({"error": "Caregiver not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/metrics/caregivers', methods=['GET'])
def get_all_caregivers():
    """Get all caregivers with basic metrics"""
    try:
        # In production, fetch this from your database or through n8n
        caregivers = []
        for caregiver_id, caregiver_data in sample_data["caregivers"].items():
            caregivers.append({
                "id": caregiver_data["id"],
                "name": caregiver_data["name"],
                "role": caregiver_data["role"],
                "overall_score": sum(metric["score"] for metric in caregiver_data["metrics"].values()) / len(caregiver_data["metrics"])
            })
        return jsonify(caregivers)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/metrics/performance', methods=['GET'])
def get_performance_metrics():
    """Get overall performance metrics"""
    try:
        # In production, fetch this from your database or through n8n
        return jsonify(sample_data["performance"])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/workflows', methods=['GET'])
def get_workflows():
    """Get all n8n workflows"""
    try:
        # Fetch workflows from n8n API
        headers = {"X-N8N-API-KEY": N8N_API_KEY}
        response = requests.get(f"{N8N_URL}/api/v1/workflows", headers=headers)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch workflows: {response.text}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/workflows/<workflow_id>/trigger', methods=['POST'])
def trigger_workflow(workflow_id):
    """Trigger an n8n workflow"""
    try:
        # Trigger workflow through n8n API
        headers = {"X-N8N-API-KEY": N8N_API_KEY}
        url = f"{N8N_URL}/api/v1/workflows/{workflow_id}/trigger"
        
        # Get payload from request or use empty dict
        payload = request.json or {}
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code in [200, 201]:
            return jsonify(response.json())
        else:
            # Try alternative method through AG2 connector
            alt_url = f"{AG2_CONNECTOR_URL}/api/n8n/trigger_workflow/{workflow_id}"
            alt_response = requests.post(alt_url, json=payload)
            
            if alt_response.status_code in [200, 201]:
                return jsonify(alt_response.json())
            else:
                return jsonify({"error": f"Failed to trigger workflow: {response.text}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/generate', methods=['POST'])
def generate_report():
    """Generate a report based on specified parameters"""
    try:
        report_type = request.json.get('type', 'performance')
        date_range = request.json.get('date_range', {'start': None, 'end': None})
        
        # In production, generate this through n8n workflows or database queries
        report = {
            "type": report_type,
            "generated_at": datetime.now().isoformat(),
            "date_range": date_range,
            "data": sample_data["reports"][report_type]
        }
        
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Dashboard API...")
    app.run(debug=True, host='0.0.0.0', port=5002)
