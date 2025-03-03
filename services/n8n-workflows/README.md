# n8n Workflows for Arise Cares Platform

This directory contains workflow definitions for n8n that are used in the Arise Cares Analytics Platform.

## Overview

n8n is used as the workflow automation engine for the platform. It connects various components including:

- AG2 agents for intelligent decision-making
- BrowserUse for web automation
- External APIs for data collection and integration
- Notification systems for alerts and reporting

## Directory Structure

```
n8n-workflows/
├── workflows/            # JSON workflow definitions
│   ├── seo-monitoring.json     # SEO monitoring workflow
│   └── ...               # Other workflow definitions
├── credentials/          # Credential configurations (gitignored)
└── README.md             # This file
```

## Workflow Descriptions

### SEO Monitoring

This workflow monitors SEO performance for Arise Cares websites. It:

1. Triggers on a schedule (daily)
2. Calls the SEO monitoring API endpoint
3. Processes the results
4. Sends notifications based on findings

## Usage

These workflows are automatically loaded when n8n is started via Docker. The workflows can be:

1. Imported directly into the n8n UI
2. Triggered via the n8n API
3. Scheduled to run automatically

## Integration with Other Components

The workflows integrate with other components through the n8n connector API, which provides endpoints for:

- AG2 agent operations
- BrowserUse automation tasks
- Data processing and analysis

## Development

To develop new workflows:

1. Create them in the n8n UI at http://localhost:5678
2. Export them as JSON
3. Save them in the `workflows` directory
4. Commit them to version control

## Security

Credentials and sensitive information should never be stored in the workflow JSON files. Instead:

1. Use environment variables
2. Configure credentials in the n8n UI
3. Reference credential IDs in the workflows

## Documentation

For more information on n8n:

- [n8n Documentation](https://docs.n8n.io/)
- [n8n API Reference](https://docs.n8n.io/api/)
