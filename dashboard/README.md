# Arise Cares Analytics Dashboard

A modern dashboard UI for the Arise Cares Analytics Platform that integrates with n8n workflows for automation and data processing.

## Overview

This dashboard provides a user-friendly interface for non-technical stakeholders to access caregiver performance metrics, manage n8n workflows, and generate reports. It consists of a React frontend and a Flask API backend that connects to the existing n8n integration.

## Features

- **Executive Dashboard**: Overview of key performance indicators and metrics
- **Caregiver Metrics**: Detailed view of individual caregiver performance
- **Workflow Management**: Interface to view and trigger n8n workflows
- **Reports**: Generate and view reports on caregiver performance and compliance
- **Settings**: Configure dashboard settings and preferences

## Architecture

The dashboard is built with the following components:

- **Frontend**: React with Material UI for a modern, responsive interface
- **Backend**: Flask API that connects to the n8n integration
- **Integration**: Leverages the existing n8n workflows for data processing and automation

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd dashboard/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask API:
   ```
   python app.py
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd dashboard/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Environment Variables

The backend requires the following environment variables:

- `N8N_URL`: URL of the n8n instance (default: http://localhost:5678)
- `N8N_API_KEY`: API key for n8n authentication
- `AG2_CONNECTOR_URL`: URL of the AG2 connector (default: http://localhost:5003)

## Integration with n8n

The dashboard integrates with n8n through the following methods:

1. **Direct API Access**: Uses the n8n API to fetch workflows and trigger executions
2. **AG2 Connector**: Falls back to the AG2 connector for workflow triggering if direct access fails
3. **Workflow Management**: Provides an interface to view and manage n8n workflows

## Development

For local development, ensure that both the n8n instance and AG2 connector are running. The dashboard will connect to these services based on the configured environment variables.
