#!/bin/bash

# Start AG2 connector service
# This script starts the AG2 connector service using Docker Compose

echo "Starting AG2 connector service..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if n8n is running
echo "Checking if n8n is running at http://localhost:5678..."
if curl -s http://localhost:5678/healthz | grep -q "status.*ok"; then
  echo "n8n is running at http://localhost:5678"
else
  echo "Warning: n8n is not running at http://localhost:5678"
  echo "Please make sure n8n is running before using the AG2 connector."
  echo "The AG2 connector will still start, but workflows may not function correctly."
fi

# Start the service
echo "Starting AG2 connector with Docker Compose..."
docker-compose -f docker-compose.yml up -d

# Check if service started successfully
if [ $? -eq 0 ]; then
  echo "Service started successfully!"
  echo "Using existing n8n instance at: http://localhost:5678"
  echo "AG2 connector is available at: http://localhost:5003"
  echo ""
  echo "You can now create and manage n8n workflows using the AG2 connector."
  echo "To test the integration, run: python test_n8n_workflow_creation.py"
else
  echo "Failed to start service. Please check the logs for more information."
  echo "docker-compose -f docker-compose.yml logs"
fi
