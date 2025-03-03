# AG2 and n8n Integration Examples

This directory contains examples of how to use the AG2 connector to automate n8n workflows for the Arise Cares Analytics Platform.

## Setup

Before running the examples, make sure you have the AG2 connector and n8n services running:

```bash
cd ../
chmod +x start_services.sh
./start_services.sh
```

This will start both the AG2 connector and n8n services using Docker Compose. The services will be available at:
- n8n: http://localhost:5678
- AG2 connector: http://localhost:5003

## Examples

### 1. Test n8n API

This example demonstrates how to interact directly with the n8n API:

```bash
python test_n8n_api.py
```

### 2. Caregiver Metrics Automation

This example demonstrates how to:
- Create a caregiver metrics workflow in n8n
- Trigger the workflow to collect and analyze caregiver performance data
- Process the results using AG2 agents
- Generate a summary report of caregiver metrics

**Usage:**
```bash
python automate_caregiver_metrics.py
```

## Configuration

The examples use the following configuration:

- n8n API URL: `http://localhost:5678`
- AG2 connector URL: `http://localhost:5003`
- n8n API key: Not required for local development with our Docker setup

## Adding New Examples

To add a new example:

1. Create a new Python file in this directory
2. Follow the pattern in the existing examples
3. Update this README to include your new example

## Best Practices

When creating examples:

1. Include clear documentation and comments
2. Handle errors gracefully
3. Log important information
4. Provide sample data for testing
5. Include a summary of the results
