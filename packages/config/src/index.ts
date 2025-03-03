/**
 * Configuration module for Arise Cares Platform
 * 
 * This module provides a unified configuration system that can be used
 * across all components of the Arise Cares platform, including AG2 agents,
 * n8n workflows, and BrowserUse automation.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

/**
 * Configuration interface for Arise Cares platform
 */
export interface AriseCaresPlatformConfig {
  // AG2 Configuration
  ag2: {
    configList: string;
    temperature: number;
    modelProvider: string;
    modelName: string;
  };

  // n8n Configuration
  n8n: {
    baseUrl: string;
    apiKey: string;
    webhookBaseUrl: string;
  };

  // BrowserUse Configuration
  browseruse: {
    headless: boolean;
    screenshotDir: string;
    timeout: number;
    userAgent: string;
  };

  // API Keys
  apiKeys: {
    googlePageSpeed: string;
    googleAnalytics: string;
    semrush: string;
    ahrefs: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    googleMyBusiness: string;
  };

  // Caregiver Metrics Configuration
  caregiverMetrics: {
    minimumVisitCompliance: number;
    targetClientSatisfaction: number;
    skillProficiencyThreshold: number;
    trainingCompletionTarget: number;
    performanceEvaluationFrequency: number;
  };

  // Marketing Configuration
  marketing: {
    targetLocations: string[];
    ageRanges: string[];
    interests: string[];
    postFrequency: number;
    campaignBudget: number;
  };

  // Database Configuration
  database: {
    connectionString: string;
    poolSize: number;
    timeout: number;
  };
}

/**
 * Default configuration values
 */
const defaultConfig: AriseCaresPlatformConfig = {
  ag2: {
    configList: 'OAI_CONFIG_LIST',
    temperature: 0.1,
    modelProvider: 'openai',
    modelName: 'gpt-4'
  },
  n8n: {
    baseUrl: 'http://localhost:5678',
    apiKey: '',
    webhookBaseUrl: 'http://localhost:5000'
  },
  browseruse: {
    headless: true,
    screenshotDir: './screenshots',
    timeout: 30000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  apiKeys: {
    googlePageSpeed: process.env.GOOGLE_PAGESPEED_API_KEY || '',
    googleAnalytics: process.env.GOOGLE_ANALYTICS_API_KEY || '',
    semrush: process.env.SEMRUSH_API_KEY || '',
    ahrefs: process.env.AHREFS_API_KEY || '',
    facebook: process.env.FACEBOOK_API_KEY || '',
    twitter: process.env.TWITTER_API_KEY || '',
    linkedin: process.env.LINKEDIN_API_KEY || '',
    googleMyBusiness: process.env.GOOGLE_MY_BUSINESS_API_KEY || ''
  },
  caregiverMetrics: {
    minimumVisitCompliance: 85,
    targetClientSatisfaction: 90,
    skillProficiencyThreshold: 80,
    trainingCompletionTarget: 95,
    performanceEvaluationFrequency: 30 // days
  },
  marketing: {
    targetLocations: ['Minneapolis, MN', 'St. Paul, MN', 'Bloomington, MN'],
    ageRanges: ['45-54', '55-64', '65+'],
    interests: ['senior care', 'elder care', 'home health', 'caregiving'],
    postFrequency: 3, // per week
    campaignBudget: 1500 // dollars
  },
  database: {
    connectionString: process.env.DATABASE_URL || '',
    poolSize: 10,
    timeout: 30000
  }
};

/**
 * Load configuration from a file
 * @param filePath Path to configuration file (yaml or json)
 * @returns Loaded configuration
 */
function loadConfigFromFile(filePath: string): Partial<AriseCaresPlatformConfig> {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fileExt = path.extname(filePath).toLowerCase();
    
    if (fileExt === '.yaml' || fileExt === '.yml') {
      return yaml.load(fileContents) as Partial<AriseCaresPlatformConfig>;
    } else if (fileExt === '.json') {
      return JSON.parse(fileContents);
    } else {
      console.warn(`Unsupported file extension: ${fileExt}. Using JSON parser.`);
      return JSON.parse(fileContents);
    }
  } catch (error) {
    console.error(`Error loading config from ${filePath}:`, error);
    return {};
  }
}

/**
 * Get configuration for Arise Cares platform
 * @param configPath Optional path to configuration file
 * @returns Merged configuration
 */
export function getConfig(configPath?: string): AriseCaresPlatformConfig {
  // Start with default configuration
  let config = { ...defaultConfig };
  
  // Override with file configuration if provided
  if (configPath && fs.existsSync(configPath)) {
    const fileConfig = loadConfigFromFile(configPath);
    config = mergeConfigs(config, fileConfig);
  }
  
  // Override with environment variables
  config = overrideWithEnvVars(config);
  
  return config;
}

/**
 * Merge two configuration objects
 * @param baseConfig Base configuration
 * @param overrideConfig Configuration to override with
 * @returns Merged configuration
 */
function mergeConfigs(
  baseConfig: AriseCaresPlatformConfig, 
  overrideConfig: Partial<AriseCaresPlatformConfig>
): AriseCaresPlatformConfig {
  return {
    ...baseConfig,
    ...overrideConfig,
    ag2: {
      ...baseConfig.ag2,
      ...overrideConfig.ag2
    },
    n8n: {
      ...baseConfig.n8n,
      ...overrideConfig.n8n
    },
    browseruse: {
      ...baseConfig.browseruse,
      ...overrideConfig.browseruse
    },
    apiKeys: {
      ...baseConfig.apiKeys,
      ...overrideConfig.apiKeys
    },
    caregiverMetrics: {
      ...baseConfig.caregiverMetrics,
      ...overrideConfig.caregiverMetrics
    },
    marketing: {
      ...baseConfig.marketing,
      ...overrideConfig.marketing
    },
    database: {
      ...baseConfig.database,
      ...overrideConfig.database
    }
  };
}

/**
 * Override configuration with environment variables
 * @param config Configuration to override
 * @returns Overridden configuration
 */
function overrideWithEnvVars(config: AriseCaresPlatformConfig): AriseCaresPlatformConfig {
  // AG2 Configuration
  if (process.env.AG2_CONFIG_LIST) config.ag2.configList = process.env.AG2_CONFIG_LIST;
  if (process.env.AG2_TEMPERATURE) config.ag2.temperature = parseFloat(process.env.AG2_TEMPERATURE);
  if (process.env.AG2_MODEL_PROVIDER) config.ag2.modelProvider = process.env.AG2_MODEL_PROVIDER;
  if (process.env.AG2_MODEL_NAME) config.ag2.modelName = process.env.AG2_MODEL_NAME;
  
  // n8n Configuration
  if (process.env.N8N_BASE_URL) config.n8n.baseUrl = process.env.N8N_BASE_URL;
  if (process.env.N8N_API_KEY) config.n8n.apiKey = process.env.N8N_API_KEY;
  if (process.env.N8N_WEBHOOK_BASE_URL) config.n8n.webhookBaseUrl = process.env.N8N_WEBHOOK_BASE_URL;
  
  // BrowserUse Configuration
  if (process.env.BROWSERUSE_HEADLESS) config.browseruse.headless = process.env.BROWSERUSE_HEADLESS === 'true';
  if (process.env.BROWSERUSE_SCREENSHOT_DIR) config.browseruse.screenshotDir = process.env.BROWSERUSE_SCREENSHOT_DIR;
  if (process.env.BROWSERUSE_TIMEOUT) config.browseruse.timeout = parseInt(process.env.BROWSERUSE_TIMEOUT);
  if (process.env.BROWSERUSE_USER_AGENT) config.browseruse.userAgent = process.env.BROWSERUSE_USER_AGENT;
  
  return config;
}

export default getConfig;
