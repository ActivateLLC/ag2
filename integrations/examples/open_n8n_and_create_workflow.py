#!/usr/bin/env python3
"""
Open n8n UI and guide the user to create a workflow manually
"""

import webbrowser
import time
from datetime import datetime

# Configuration
N8N_URL = "http://localhost:5678"

# Generate a unique workflow name
workflow_name = f"Test Workflow - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

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

# Open the n8n UI in the default browser
print(f"Opening n8n UI at {N8N_URL}...")
webbrowser.open(N8N_URL)

print("Browser should be opening. If not, please manually navigate to:")
print(N8N_URL)
