#!/bin/bash

# Setup script for n8n integration with Arise Cares caregiver metrics system
echo "Setting up n8n integration for Arise Cares system..."

# Create data directory for n8n
mkdir -p /Users/activate/Dev/ag2/integrations/n8n_data

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Docker is required but not installed. Please install Docker first."
    exit 1
fi

# Create Docker volume for n8n data
docker volume create arise_n8n_data

# Define environment variables file
cat > /Users/activate/Dev/ag2/integrations/n8n.env << EOL
# n8n Environment Variables
N8N_ENCRYPTION_KEY=arise-caregiver-metrics-system-key
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_HOST=localhost
N8N_AUTH_ENABLED=true
N8N_METRICS_ENABLED=true
N8N_DIAGNOSTICS_ENABLED=true
N8N_LOG_LEVEL=info
EOL

echo "Created environment configuration"

# Create docker-compose file for easy management
cat > /Users/activate/Dev/ag2/integrations/docker-compose.yml << EOL
version: '3'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    env_file:
      - n8n.env
    volumes:
      - arise_n8n_data:/home/node/.n8n
      - /Users/activate/Dev/ag2/services/n8n-workflows:/home/node/workflows
    environment:
      - NODE_ENV=production
      - N8N_PATH=/
      - WEBHOOK_URL=http://localhost:5678/
      - N8N_DIAGNOSTICS_ENABLED=true
      - N8N_METRICS_ENABLED=true
      - GENERIC_TIMEZONE=America/Los_Angeles

volumes:
  arise_n8n_data:
    external: true
EOL

echo "Created Docker Compose configuration"

# Create directory for n8n workflows
mkdir -p /Users/activate/Dev/ag2/services/n8n-workflows/workflows

# Create a sample workflow file
cat > /Users/activate/Dev/ag2/services/n8n-workflows/workflows/seo-monitoring.json << EOL
{
  "nodes": [
    {
      "parameters": {},
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "url": "http://localhost:5000/api/workflows/seo_monitoring",
        "options": {
          "fullResponse": true,
          "jsonQuery": {
            "url": "https://arisecares.com"
          }
        }
      },
      "name": "SEO Monitoring",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        450,
        300
      ]
    }
  ],
  "connections": {
    "Start": {
      "main": [
        [
          {
            "node": "SEO Monitoring",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
EOL

echo "Created sample workflow"

# Start n8n in Docker
echo "Starting n8n in Docker..."
cd /Users/activate/Dev/ag2/integrations
docker-compose up -d

echo "n8n is now running at http://localhost:5678"
echo "You can access the n8n dashboard to create and manage workflows"
echo "The API connector will be available at http://localhost:5000 once started"

# Create n8n API key for programmatic access
echo "To create an API key, visit http://localhost:5678/settings/users"
echo "Setup complete!"
