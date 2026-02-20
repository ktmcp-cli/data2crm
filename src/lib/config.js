/**
 * Configuration Management
 *
 * Handles API key storage and configuration using conf package
 */

import Conf from 'conf';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

const config = new Conf({
  projectName: 'data2crm-cli',
  defaults: {
    apiKey: process.env.DATA2CRM_API_KEY || '',
    baseUrl: process.env.DATA2CRM_BASE_URL || 'https://api.data2crm.com/v2',
  },
});

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export function getConfig(key) {
  return config.get(key);
}

/**
 * Set configuration value
 * @param {string} key - Configuration key
 * @param {*} value - Configuration value
 */
export function setConfig(key, value) {
  config.set(key, value);
}

/**
 * Get all configuration
 * @returns {Object} All configuration values
 */
export function getAllConfig() {
  return config.store;
}

/**
 * Delete configuration value
 * @param {string} key - Configuration key
 */
export function deleteConfig(key) {
  config.delete(key);
}

/**
 * Clear all configuration
 */
export function clearConfig() {
  config.clear();
}

/**
 * Get API key from config or environment
 * @returns {string} API key
 * @throws {Error} If API key is not configured
 */
export function getApiKey() {
  const apiKey = getConfig('apiKey') || process.env.DATA2CRM_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API key not configured. Set it with: data2crm config set apiKey <your-api-key>\n' +
      'Or set DATA2CRM_API_KEY environment variable.\n' +
      'Get your API key at: https://www.data2crm.com/'
    );
  }

  return apiKey;
}

/**
 * Get base URL from config or environment
 * @returns {string} Base URL
 */
export function getBaseUrl() {
  return getConfig('baseUrl') || process.env.DATA2CRM_BASE_URL || 'https://api.data2crm.com/v2';
}
