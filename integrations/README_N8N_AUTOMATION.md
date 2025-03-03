# n8n Workflow Automation with AG2

This document outlines how to use the AG2 connector to automate the creation and management of n8n workflows for the Arise Cares Analytics Platform.

## Overview

The AG2 connector provides two approaches for n8n workflow automation:

1. **Direct API Integration**: Trigger existing n8n workflows via the n8n API
2. **BrowserUse Automation**: Create and manage n8n workflows through browser automation

## Setup

### Prerequisites

- Docker and Docker Compose
- Python 3.8+
- pip
- n8n version 0.199.0 (used in our Docker setup)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ActivateLLC/ag2.git
   cd ag2/integrations
   ```

2. Start the services:
   ```bash
   chmod +x start_services.sh
   ./start_services.sh
   ```

This will start both the AG2 connector and n8n services using Docker Compose. The services will be available at:
- n8n: http://localhost:5678
- AG2 connector: http://localhost:5003

### Configuration

The integration uses the following environment variables:

- `N8N_URL`: URL of the n8n instance (default: `http://n8n:5678` for the AG2 connector, `http://localhost:5678` for test scripts)
- `N8N_API_KEY`: Optional API key for n8n (not required for local development with our Docker setup)
- `AG2_API_URL`: URL of the AG2 connector API (default: `http://localhost:5001` inside Docker, `http://localhost:5003` from host)

For local development, these variables are set in the `docker-compose.yml` file and the `n8n.env` file.

## Local n8n Setup

For cost efficiency, we're using a locally hosted n8n instance without requiring an API key. This setup provides several advantages:

1. No subscription costs for cloud-based n8n
2. No API authentication required for local connections
3. Full control over workflow execution and data

### Configuration

The integration between AG2 and n8n is configured using environment variables:

- `N8N_URL`: The URL of your n8n instance (default: `http://localhost:5678`)
- `N8N_API_KEY`: Optional API key for n8n (not required for local development with authentication disabled)
- `AG2_API_URL`: The URL of the AG2 connector API (default: `http://localhost:5003`)

For local development, we use an n8n instance with authentication disabled (`N8N_AUTH_ENABLED=false` in n8n.env), so no API key is required.

The n8n environment is configured in the `n8n.env` file with the following settings:

```
N8N_AUTH_ENABLED=false
N8N_PUBLIC_API_DISABLED=false
N8N_PUBLIC_API_SAME_USER_ALLOWED=true
```

These settings allow the AG2 connector to communicate with n8n without authentication when running locally.

## API Endpoints

### Workflow Creation Endpoints

#### Create SEO Audit Workflow
- **URL**: `/api/n8n/create_workflow/seo_audit`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "Weekly SEO Audit",
    "target_url": "https://arisecares.com",
    "email_recipient": "marketing@arisecares.com",
    "schedule": {
      "mode": "everyWeek",
      "weekday": 1,
      "hour": 9,
      "minute": 0
    }
  }
  ```

#### Create Content Strategy Workflow
- **URL**: `/api/n8n/create_workflow/content_strategy`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "Monthly Content Strategy",
    "target_url": "https://arisecares.com",
    "competitors": [
      "https://homeinstead.com",
      "https://comfortkeepers.com",
      "https://brightstarcare.com"
    ],
    "email_recipient": "content@arisecares.com"
  }
  ```

#### Create Caregiver Metrics Workflow
- **URL**: `/api/n8n/create_workflow/caregiver_metrics`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "Daily Caregiver Metrics",
    "caregiver_ids": ["CG001", "CG002", "CG003"],
    "metrics": ["performance", "client_satisfaction", "training_needs"]
  }
  ```

#### Create All Standard Workflows
- **URL**: `/api/n8n/create_all_workflows`
- **Method**: POST
- **Request Body**: `{}`

### Workflow Trigger Endpoint

#### Trigger n8n Workflow
- **URL**: `/api/n8n/trigger_workflow/{workflow_id}`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "data": {
      "key1": "value1",
      "key2": "value2"
    }
  }
  ```

## Workflow Types

### SEO Audit Workflow

The SEO audit workflow performs the following tasks:
1. Schedules a weekly SEO audit of the target website
2. Collects core web vitals, mobile friendliness, and other SEO metrics
3. Generates a comprehensive SEO report
4. Sends the report to the specified email recipient

### Content Strategy Workflow

The content strategy workflow performs the following tasks:
1. Schedules a monthly content analysis
2. Analyzes the target website and competitor websites
3. Identifies keyword opportunities and content gaps
4. Generates content recommendations
5. Sends the content strategy report to the specified email recipient

### Caregiver Metrics Workflow

The caregiver metrics workflow performs the following tasks:
1. Schedules daily collection of caregiver performance metrics
2. Analyzes caregiver performance across multiple dimensions
3. Identifies strengths and areas for improvement
4. Generates training and development recommendations
5. Updates the caregiver performance dashboard

## Usage Examples

### Creating a Workflow via Python

```python
import requests

API_BASE_URL = "http://localhost:5003"

def create_seo_audit_workflow():
    url = f"{API_BASE_URL}/api/n8n/create_workflow/seo_audit"
    payload = {
        "name": "Weekly SEO Audit",
        "target_url": "https://arisecares.com",
        "email_recipient": "marketing@arisecares.com"
    }
    
    response = requests.post(url, json=payload)
    return response.json()

result = create_seo_audit_workflow()
print(result)
```

### Triggering a Workflow via Python

```python
import requests

API_BASE_URL = "http://localhost:5003"
WORKFLOW_ID = "123456"  # Replace with actual workflow ID

def trigger_workflow():
    url = f"{API_BASE_URL}/api/n8n/trigger_workflow/{WORKFLOW_ID}"
    payload = {
        "data": {
            "target_url": "https://arisecares.com",
            "run_date": "2025-03-15"
        }
    }
    
    response = requests.post(url, json=payload)
    return response.json()

result = trigger_workflow()
print(result)
```

## Environment Variables

The following environment variables are used for configuration:

- `N8N_URL`: URL of the n8n instance (default: `http://localhost:5678`)
- `AG2_API_URL`: URL of the AG2 connector API (default: `http://localhost:5003`)

## Testing

A test script is provided to verify the workflow creation functionality:

```bash
python test_n8n_workflow_creation.py

```
