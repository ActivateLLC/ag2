#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Arise Cares Monorepo Setup Script${NC}"
echo -e "${BLUE}=================================${NC}\n"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed. Please install git and try again.${NC}"
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js and try again.${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker and try again.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}\n"

# Step 1: Set up git for monorepo
echo -e "${BLUE}Step 1: Setting up Git for monorepo...${NC}"

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOL
# Node.js
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log
.pnpm-debug.log
.pnpm-store/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# TypeScript
*.tsbuildinfo
.tsc

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
venv/
.venv/
ENV/

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Docker
.docker/
docker-compose.override.yml

# Build artifacts
.DS_Store
.next/
out/
EOL
    echo -e "${GREEN}✓ Created .gitignore file${NC}"
else
    echo -e "${GREEN}✓ .gitignore already exists${NC}"
fi

# Step 2: Create directory structure
echo -e "\n${BLUE}Step 2: Creating directory structure...${NC}"

# Create necessary directories
mkdir -p packages/common/src
mkdir -p packages/config/src
mkdir -p packages/metrics-core/src
mkdir -p services/ag2-agents
mkdir -p services/n8n-workflows/workflows
mkdir -p services/browseruse-automation
mkdir -p integrations
mkdir -p scripts/setup
mkdir -p docker/development
mkdir -p docker/production
mkdir -p docs

echo -e "${GREEN}✓ Directory structure created${NC}"

# Step 3: Install dependencies
echo -e "\n${BLUE}Step 3: Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 4: Configure environment
echo -e "\n${BLUE}Step 4: Setting up environment...${NC}"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cat > .env << EOL
# Arise Cares Platform Configuration
# API Keys - Replace with your actual API keys
GOOGLE_PAGESPEED_API_KEY=
GOOGLE_ANALYTICS_API_KEY=
SEMRUSH_API_KEY=
AHREFS_API_KEY=
FACEBOOK_API_KEY=
TWITTER_API_KEY=
LINKEDIN_API_KEY=
GOOGLE_MY_BUSINESS_API_KEY=

# AG2 Configuration
AG2_CONFIG_LIST=OAI_CONFIG_LIST
AG2_TEMPERATURE=0.1
AG2_MODEL_PROVIDER=openai
AG2_MODEL_NAME=gpt-4

# n8n Configuration
N8N_URL=http://localhost:5678
N8N_API_KEY=
N8N_WEBHOOK_URL=http://localhost:5000

# BrowserUse Configuration
BROWSERUSE_HEADLESS=true
BROWSERUSE_SCREENSHOT_DIR=./screenshots
BROWSERUSE_TIMEOUT=30000
BROWSERUSE_USER_AGENT=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36

# Database Configuration
DATABASE_URL=
EOL
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

# Step 5: Set up Docker environment
echo -e "\n${BLUE}Step 5: Setting up Docker environment...${NC}"

# Create Docker volumes
docker volume create arise_n8n_data
docker volume create arise_postgres_data

echo -e "${GREEN}✓ Docker volumes created${NC}"

# Step 6: Make setup scripts executable
echo -e "\n${BLUE}Step 6: Making scripts executable...${NC}"
chmod +x integrations/setup-n8n.sh
chmod +x scripts/setup/setup-all.js
echo -e "${GREEN}✓ Scripts are now executable${NC}"

# Final message
echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}Arise Cares monorepo setup completed successfully!${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e "\nNext steps:"
echo -e "1. Configure your API keys in the ${BLUE}.env${NC} file"
echo -e "2. Start the services with: ${YELLOW}docker-compose -f docker/development/docker-compose.yml up -d${NC}"
echo -e "3. Visit n8n at: ${BLUE}http://localhost:5678${NC}"
echo -e "4. Access the API connector at: ${BLUE}http://localhost:5000${NC}\n"
