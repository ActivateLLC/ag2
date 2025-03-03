#!/usr/bin/env node

/**
 * Setup script for the Arise Cares monorepo
 * 
 * This script sets up the entire monorepo by:
 * 1. Installing dependencies for all packages
 * 2. Building shared packages
 * 3. Setting up n8n for workflow automation
 * 4. Creating configuration files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI escape sequences for colored output
const RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';

/**
 * Execute a command and log the output
 * @param {string} command - Command to execute
 * @param {string} cwd - Working directory
 */
function execute(command, cwd = process.cwd()) {
  console.log(`${BRIGHT}${BLUE}Executing:${RESET} ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    console.log(`${GREEN}✓ Command completed successfully${RESET}\n`);
  } catch (error) {
    console.error(`${RED}✗ Command failed with error:${RESET}`, error.message);
    process.exit(1);
  }
}

/**
 * Check if a command exists
 * @param {string} command - Command to check
 * @returns {boolean} - Whether the command exists
 */
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create a file with the given content
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to write
 */
function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`${GREEN}✓ Created file:${RESET} ${filePath}`);
}

// Main setup function
async function setupMonorepo() {
  const rootDir = path.resolve(__dirname, '..', '..');
  console.log(`${BRIGHT}${BLUE}Setting up Arise Cares monorepo...${RESET}\n`);
  
  // Check if pnpm is installed
  if (!commandExists('pnpm')) {
    console.log(`${YELLOW}pnpm is not installed. Installing...${RESET}`);
    execute('npm install -g pnpm');
  }
  
  // Step 1: Install dependencies
  console.log(`${BRIGHT}${BLUE}Step 1: Installing dependencies...${RESET}\n`);
  execute('pnpm install', rootDir);
  
  // Step 2: Create .env file if it doesn't exist
  console.log(`${BRIGHT}${BLUE}Step 2: Creating configuration files...${RESET}\n`);
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) {
    const envContent = `# Arise Cares Platform Configuration
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
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=
N8N_WEBHOOK_BASE_URL=http://localhost:5000

# BrowserUse Configuration
BROWSERUSE_HEADLESS=true
BROWSERUSE_SCREENSHOT_DIR=./screenshots
BROWSERUSE_TIMEOUT=30000
BROWSERUSE_USER_AGENT=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36

# Database Configuration
DATABASE_URL=
`;
    createFile(envPath, envContent);
  }
  
  // Step 3: Build shared packages
  console.log(`${BRIGHT}${BLUE}Step 3: Building shared packages...${RESET}\n`);
  execute('pnpm --filter "@arise-cares/*" run build', rootDir);
  
  // Step 4: Setup n8n
  console.log(`${BRIGHT}${BLUE}Step 4: Setting up n8n...${RESET}\n`);
  execute('bash integrations/setup-n8n.sh', rootDir);
  
  // Step 5: Create sample workflows
  console.log(`${BRIGHT}${BLUE}Step 5: Creating sample workflows...${RESET}\n`);
  const workflowsDir = path.join(rootDir, 'services', 'n8n-workflows', 'workflows');
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
  }
  
  // Create a sample workflow
  const sampleWorkflow = `{
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
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json[\"body\"][\"seo_score\"]}}",
              "operation": "smallerThan",
              "value2": 70
            }
          ]
        }
      },
      "name": "Low SEO Score?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        650,
        300
      ]
    },
    {
      "parameters": {
        "url": "http://localhost:5000/api/browseruse/update_content",
        "options": {
          "jsonQuery": {
            "url": "https://arisecares.com",
            "recommendations": "={{$json[\"body\"][\"recommendations\"]}}"
          }
        }
      },
      "name": "Update Content",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        850,
        200
      ]
    },
    {
      "parameters": {
        "toRecipients": ["marketing@arisecares.com"],
        "subject": "SEO Report: Action Required",
        "text": "={{\"SEO Score: \" + $json[\"body\"][\"seo_score\"] + \"\\n\\nRecommendations:\\n\" + $json[\"body\"][\"recommendations\"][0][\"title\"] + \"\\n\" + $json[\"body\"][\"recommendations\"][0][\"description\"]}}"
      },
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [
        1050,
        200
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
    },
    "SEO Monitoring": {
      "main": [
        [
          {
            "node": "Low SEO Score?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Low SEO Score?": {
      "main": [
        [
          {
            "node": "Update Content",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    },
    "Update Content": {
      "main": [
        [
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;
  
  createFile(path.join(workflowsDir, 'seo-monitoring.json'), sampleWorkflow);
  
  // Success message
  console.log(`${BRIGHT}${GREEN}✓ Arise Cares monorepo setup completed successfully!${RESET}\n`);
  console.log(`${BRIGHT}Next steps:${RESET}`);
  console.log(`1. Configure API keys in the ${BRIGHT}.env${RESET} file`);
  console.log(`2. Start n8n with ${BRIGHT}pnpm start:n8n${RESET}`);
  console.log(`3. Start the n8n connector with ${BRIGHT}pnpm connector:start${RESET}`);
  console.log(`4. Access n8n at ${BRIGHT}http://localhost:5678${RESET}`);
}

// Run the setup
setupMonorepo().catch(error => {
  console.error(`${RED}Setup failed:${RESET}`, error);
  process.exit(1);
});
